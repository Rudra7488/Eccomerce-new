import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

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
    if (!token) {
        dispatch(cartSlice.actions.addToCartLocal(product));
        return null;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/cart/add/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ product_id: product.id, quantity: 1 }),
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
      const response = await fetch(`${API_BASE_URL}/api/cart/remove/${id}/`, {
        method: 'DELETE',
        headers: getHeaders(),
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
  status: 'idle',
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCartLocal(state, action) {
      const newItem = action.payload;
      const existingItem = state.items.find((item) => item.id === newItem.id);
      state.totalQuantity++;
      state.totalAmount += newItem.price;
      if (!existingItem) {
        state.items.push({
          id: newItem.id,
          title: newItem.title || newItem.name,
          price: newItem.price,
          quantity: 1,
          totalPrice: newItem.price,
          image: newItem.image || (newItem.images && newItem.images[0]) || '',
        });
      } else {
        existingItem.quantity++;
        existingItem.totalPrice += newItem.price;
        // Update image if new one provided
        if (newItem.image) {
          existingItem.image = newItem.image;
        }
      }
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
    },
    clearCartLocal(state) {
      state.items = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
    },
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
                id: item.product.id,
                title: item.product.name,
                price: item.product.price,
                quantity: item.quantity,
                totalPrice: item.total_price,
                image: getProductImage(item.product),
            }));
            state.totalQuantity = action.payload.total_quantity;
            state.totalAmount = action.payload.total_amount;
        }
      })
      .addCase(addToCart.fulfilled, (state, action) => {
         if (action.payload) {
            state.items = action.payload.items.map(item => ({
                id: item.product.id,
                title: item.product.name,
                price: item.product.price,
                quantity: item.quantity,
                totalPrice: item.total_price,
                image: getProductImage(item.product),
            }));
            state.totalQuantity = action.payload.total_quantity;
            state.totalAmount = action.payload.total_amount;
         }
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
          if (action.payload) {
            state.items = action.payload.items.map(item => ({
                id: item.product.id,
                title: item.product.name,
                price: item.product.price,
                quantity: item.quantity,
                totalPrice: item.total_price,
                image: getProductImage(item.product),
            }));
            state.totalQuantity = action.payload.total_quantity;
            state.totalAmount = action.payload.total_amount;
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

export const { addToCartLocal, removeFromCartLocal, clearCartLocal } = cartSlice.actions;
export default cartSlice.reducer;
