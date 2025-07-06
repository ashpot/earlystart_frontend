// src/features/earnings/earningsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchEarnings = createAsyncThunk('earnings/fetchEarnings', 
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:5000/earnings');
      console.log('fetchEarnings API response:', response.data);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return response.data || []; 
    } catch (error) {
      console.error('fetchEarnings error:', error);
      return rejectWithValue(error.message);
    }
  }
);

const earningsSlice = createSlice({
  name: 'earnings',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEarnings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEarnings.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        console.log('fetchEarnings fulfilled, state.data:', action.payload);
      })
      .addCase(fetchEarnings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch categories';
        console.log('fetchEarnings rejected, error:', action.payload);
      });
  },
});

export default earningsSlice.reducer;