import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Helper to get headers
const getHeaders = () => {
  const token = localStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/wishlist/`, {
        method: 'GET',
        headers: getHeaders(),
      });
      
      if (!response.ok) throw new Error('Failed to fetch wishlist');
      
      const data = await response.json();
      return data.products || []; 
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (product, { rejectWithValue, getState }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/wishlist/add/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ product_id: product.id }),
      });
      
      const data = await response.json();

      if (!response.ok) throw new Error('Failed to add to wishlist');
      
      if (response.status === 200 && data.message === 'Product already in wishlist') {
         const state = getState();
         return state.wishlist.items;
      }
      
      return data.products || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/wishlist/remove/${productId}/`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      
      if (!response.ok) throw new Error('Failed to remove from wishlist');
      
      return productId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleWishlist = createAsyncThunk(
  'wishlist/toggleWishlist',
  async (product, { dispatch, getState, rejectWithValue }) => {
    const state = getState();
    const existingItem = state.wishlist.items.find((item) => item.id === product.id);
    
    try {
      if (existingItem) {
        await dispatch(removeFromWishlist(product.id)).unwrap();
      } else {
        await dispatch(addToWishlist(product)).unwrap();
      }
      return product.id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  items: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlist(state) {
      state.items = [];
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Wishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Add to Wishlist
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      // Remove from Wishlist
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
