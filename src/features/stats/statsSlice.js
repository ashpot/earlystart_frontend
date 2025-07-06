import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchStats = createAsyncThunk(
  'stats/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:5000/stats'); // Fetch from root
      console.log('fetchStats API response:', response.data); // Debug log
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return response.data || {};
    } catch (error) {
      console.error('fetchStats error:', error.message); // Debug log
      return rejectWithValue(error.message);
    }
  }
);

const statsSlice = createSlice({
  name: 'stats',
  initialState: {
    data: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        console.log('fetchStats fulfilled, state.data:', action.payload); // Debug log
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch stats';
        console.log('fetchStats rejected, error:', action.payload); // Debug log
      });
  },
});

export default statsSlice.reducer;