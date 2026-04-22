import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log("ENV URL:", import.meta.env.VITE_API_BASE_URL);

const getHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

// Async Thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return null;

      const response = await fetch(`${API_BASE_URL}/api/cart/`, {
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch cart');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (product, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem('accessToken');
    const qtyToAdd = product.quantity || 1;
    
    if (!token) {
      dispatch(cartSlice.actions.addToCartLocal(product));
      return null;
    }

    try {
      // If it's a composite ID (e.g. "prod123_Large"), extract product_id and variant_size
      let product_id = product.id;
      let variant_size = null;
      if (typeof product_id === 'string' && product_id.includes('_')) {
        [product_id, variant_size] = product_id.split('_');
      }

      const response = await fetch(`${API_BASE_URL}/api/cart/add/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ 
          product_id: product_id, 
          quantity: qtyToAdd,
          variant_size: variant_size
        }),
      });
      if (!response.ok) throw new Error('Failed to add to cart');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (id, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      dispatch(cartSlice.actions.removeFromCartLocal(id));
      return null;
    }

    try {
      // If it's a composite ID (e.g. "prod123_Large"), extract product_id and variant_size
      let product_id = id;
      let variant_size = null;
      if (typeof product_id === 'string' && product_id.includes('_')) {
        [product_id, variant_size] = product_id.split('_');
      }

      // We use POST instead of DELETE if we need to send variant_size in body, 
      // or we can use query params with DELETE. 
      // My backend remove_from_cart now supports both DELETE (query params) and POST (body).
      const response = await fetch(`${API_BASE_URL}/api/cart/remove/${product_id}/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ variant_size: variant_size })
      });
      if (!response.ok) throw new Error('Failed to remove from cart');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { dispatch, rejectWithValue }) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      dispatch(cartSlice.actions.clearCartLocal());
      return null;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/cart/clear/`, {
        method: 'POST',
        headers: getHeaders(),
      });
      if (!response.ok) throw new Error('Failed to clear cart');
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
  appliedCoupon: null,
  discountAmount: 0,
  discountedTotal: 0,
  status: 'idle',
  error: null,
};

const recalculateDiscount = (state) => {
  if (!state.appliedCoupon) {
    state.discountAmount = 0;
    state.discountedTotal = state.totalAmount;
    return;
  }

  const coupon = state.appliedCoupon;
  let discount = 0;
  if (coupon.discount_type === 'percentage') {
    discount = (state.totalAmount * coupon.value) / 100;
  } else if (coupon.discount_type === 'fixed') {
    discount = coupon.value;
  }

  // Ensure discount doesn't exceed total
  state.discountAmount = Math.min(discount, state.totalAmount);
  state.discountedTotal = Math.max(0, state.totalAmount - state.discountAmount);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCartLocal(state, action) {
      const newItem = action.payload;
      const qty = newItem.quantity || 1;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      state.totalQuantity += qty;
      state.totalAmount += newItem.price * qty;
      if (!existingItem) {
        state.items.push({
          id: newItem.id,
          title: newItem.title || newItem.name,
          price: newItem.price,
          quantity: qty,
          totalPrice: newItem.price * qty,
          image: newItem.image || (newItem.images && newItem.images[0]) || '',
        });
      } else {
        existingItem.quantity += qty;
        existingItem.totalPrice += newItem.price * qty;
        // Update image if new one provided
        if (newItem.image) {
          existingItem.image = newItem.image;
        }
      }
      recalculateDiscount(state);
    },
    removeFromCartLocal(state, action) {
      const id = action.payload;
      const existingItem = state.items.find((item) => item.id === id);
      if (existingItem) {
        state.totalQuantity--;
        state.totalAmount -= existingItem.price;
        if (existingItem.quantity === 1) {
          state.items = state.items.filter((item) => item.id !== id);
        } else {
          existingItem.quantity--;
          existingItem.totalPrice -= existingItem.price;
        }
      }
      recalculateDiscount(state);
    },
    clearCartLocal(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      state.appliedCoupon = null;
      state.discountAmount = 0;
      state.discountedTotal = 0;
    },
    applyCoupon(state, action) {
      state.appliedCoupon = action.payload;
      recalculateDiscount(state);
    },
    removeCoupon(state) {
      state.appliedCoupon = null;
      state.discountAmount = 0;
      state.discountedTotal = state.totalAmount;
    }
  },
  extraReducers: (builder) => {
    // Helper to get image preference
    const getProductImage = (product) => {
      const storedImage = localStorage.getItem(`cart_image_${product.id}`);
      if (storedImage) return storedImage;
      return product.images && product.images.length > 0 ? product.images[0] : '';
    };

    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        if (action.payload) {
          state.items = action.payload.items.map(item => ({
            id: item.variant_size ? `${item.product.id}_${item.variant_size}` : item.product.id,
            title: item.variant_size ? `${item.product.name} (${item.variant_size})` : item.product.name,
            price: item.total_price / item.quantity,
            quantity: item.quantity,
            totalPrice: item.total_price,
            image: getProductImage(item.product),
          }));
          state.totalQuantity = action.payload.total_quantity;
          state.totalAmount = action.payload.total_amount;
          recalculateDiscount(state);
        }
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        if (action.payload) {
          state.items = action.payload.items.map(item => ({
            id: item.variant_size ? `${item.product.id}_${item.variant_size}` : item.product.id,
            title: item.variant_size ? `${item.product.name} (${item.variant_size})` : item.product.name,
            price: item.total_price / item.quantity,
            quantity: item.quantity,
            totalPrice: item.total_price,
            image: getProductImage(item.product),
          }));
          state.totalQuantity = action.payload.total_quantity;
          state.totalAmount = action.payload.total_amount;
          recalculateDiscount(state);
        }
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        if (action.payload) {
          state.items = action.payload.items.map(item => ({
            id: item.variant_size ? `${item.product.id}_${item.variant_size}` : item.product.id,
            title: item.variant_size ? `${item.product.name} (${item.variant_size})` : item.product.name,
            price: item.total_price / item.quantity,
            quantity: item.quantity,
            totalPrice: item.total_price,
            image: getProductImage(item.product),
          }));
          state.totalQuantity = action.payload.total_quantity;
          state.totalAmount = action.payload.total_amount;
          recalculateDiscount(state);
        }
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        // If backend returns cleared cart (empty), or just message
        // My backend returns message. So I should clear local state manually.
        // Wait, backend clear_cart returns { message: 'Cart cleared' }
        // So action.payload won't have items.
        state.items = [];
        state.totalQuantity = 0;
        state.totalAmount = 0;
      });
  },
});

export const { addToCartLocal, removeFromCartLocal, clearCartLocal, applyCoupon, removeCoupon } = cartSlice.actions;
export default cartSlice.reducer;
