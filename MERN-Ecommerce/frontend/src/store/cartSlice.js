import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import SummaryApi from "../common/index";


const fetchApi = async ({ url, method = "GET", body }) => {
  console.log("fetchApi called with:", { url, method, body });

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

 
  if (body && !["GET", "DELETE"].includes(method.toUpperCase())) {
    options.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(url, options);
    const data = await res.json();
    console.log("fetchApi response:", data);
    return data;
  } catch (error) {
    console.error("fetchApi error:", error);
    throw error;
  }
};



export const fetchCart = createAsyncThunk(
  "cart/fetch",
  async (userId, { rejectWithValue }) => {
    try {
      const { url } = SummaryApi.get_cart(userId);
      const data = await fetchApi({ url, method: "GET" });
      return data.cart.items || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    const body = { userId, productId, quantity };
    console.log(" dispatching addToCart with", body);

    try {
      const url = SummaryApi.add_to_cart.url;
      const data = await fetchApi({ url, method: "POST", body });
      return data.cart.items || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ userId, productId }, { rejectWithValue }) => {
    try {
      const { url, method } = SummaryApi.remove_from_cart(userId, productId); // <-- fix here

      const response = await fetchApi({
        url,
        method, 
      });

      return response.cart.items;
    } catch (error) {
      console.error("removeFromCart error:", error);
      return rejectWithValue(error.message);
    }
  }
);
export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ userId, productId, quantity }, { rejectWithValue }) => {
    console.log("updateQuantity thunk fired with:", {
      userId,
      productId,
      quantity,
    });
    try {
      const response = await fetchApi({
        url: SummaryApi.update_cart_item.url,
        method: SummaryApi.update_cart_item.method,
        body: { userId, productId, quantity },
      });

      console.log("updateQuantity Response:", response);
      return response.cart.items;
    } catch (error) {
      console.error("updateQuantity Error:", error);
      return rejectWithValue(error.message);
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async ({ userId }, { rejectWithValue }) => {
    try {
      const { url, method } = SummaryApi.clear_cart;
      const response = await fetchApi({
        url,
        method,
        body: { userId },
      });

      console.log("clearCart response:", response);
      return response.cart.items;
    } catch (error) {
      console.error("clearCart error:", error);
      return rejectWithValue(error.message);
    }
  }
);


const calculateTotal = (items) => {
  return items.reduce((total, item) => {
    const price = item.productId?.price || 0;
    const quantity = item.quantity || 0;
    return total + price * quantity;
  }, 0);
};


const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    totalPrice: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => { 
      state.items = [];
      state.totalPrice = 0;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.totalPrice = calculateTotal(action.payload);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.totalPrice = calculateTotal(action.payload);
      })

      
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.totalPrice = calculateTotal(action.payload);
      })

      
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.items = action.payload;
        state.totalPrice = calculateTotal(action.payload);
      })

      
      .addCase(clearCart.fulfilled, (state, action) => {
        state.items = [];
        state.totalPrice = 0;
      });
  },
});

export default cartSlice.reducer;
