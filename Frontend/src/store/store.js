import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import languageReducer from './slices/languageSlice';
import wishlistReducer from './slices/wishlistSlice';
import userReducer from './slices/userSlice';

// Helper to load state from localStorage
const loadState = (key) => {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    console.warn(`Could not load ${key} from localStorage`, e);
    return undefined;
  }
};

// Helper to save state to localStorage
const saveState = (key, state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(key, serializedState);
  } catch (e) {
    console.warn(`Could not save ${key} to localStorage`, e);
  }
};

const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      return {
        currentUser: parsedUser,
        isAuthenticated: true,
        role: parsedUser.role
      };
    }
  } catch (e) {
    console.warn('Could not load user from localStorage', e);
  }
  return undefined;
};

const store = configureStore({
  reducer: {
    cart: cartReducer,
    language: languageReducer,
    wishlist: wishlistReducer,
    user: userReducer,
  },
  preloadedState: {
    cart: loadState('cartState'),
    wishlist: loadState('wishlistState'),
    user: getUserFromStorage(),
  }
});

// Subscribe to store changes and save to localStorage
store.subscribe(() => {
  saveState('cartState', store.getState().cart);
  saveState('wishlistState', store.getState().wishlist);
});

export default store;
