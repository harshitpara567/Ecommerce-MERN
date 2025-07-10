import { createSlice, createSelector, createAsyncThunk } from '@reduxjs/toolkit';
import SummaryApi from '../common/index'; 


export const fetchUserDetails = createAsyncThunk(
  'user/fetchUserDetails',
  async (userId, { rejectWithValue }) => {
    try {
      const { url, method } = SummaryApi.current_user(userId);
      const response = await fetchApi({ url, method }); 
      if (response.success) {
        return response.data;
      } else {
        return rejectWithValue(response.message);
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  userDetails: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      state.userDetails = action.payload;
    },
    clearUserDetails: (state) => {
      state.userDetails = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserDetails.fulfilled, (state, action) => {
      state.userDetails = action.payload;
    });
  },
});

export const { setUserDetails, clearUserDetails } = userSlice.actions;
export default userSlice.reducer;

const selectUserDetails = (state) => state.user.userDetails;
export const memoizedUserSelector = createSelector([selectUserDetails], (userDetails) => userDetails);


const fetchApi = async ({ url, method = "GET", body }) => {
 
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
   
    return data;
  } catch (error) {
    console.error("fetchApi error:", error);
    throw error;
  }
};