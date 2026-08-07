
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../config';

export const fetchTopCategories = createAsyncThunk(
  'topCategories/fetchTopCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/rest-auth/add_course/`);
      console.log('fetchTopCategories API response:', response.data); // Debug log
      //console.log('fetchTopCategories data:', response.data.topCategories); // Debug log
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return response.data || [];
    } catch (error) {
      console.error('fetchTopCategories error:', error.message); // Debug log
      return rejectWithValue(error.message);
    }
  }
);

const topCategoriesSlice = createSlice({
  name: 'topCategories',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        console.log('fetchTopCategories fulfilled, state.data:', action.payload); // Debug log
      })
      .addCase(fetchTopCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch top categories';
        console.log('fetchTopCategories rejected, error:', action.payload); // Debug log
      });
  },
});

export default topCategoriesSlice.reducer;