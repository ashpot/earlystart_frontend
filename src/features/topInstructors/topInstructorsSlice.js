// src/features/topInstructors/topInstructorsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchTopInstructors = createAsyncThunk('topInstructors/fetchTopInstructors',  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:5000/topInstructors');
      console.log('fetchTopInstructors API response:', response.data);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return response.data || []; 
    } catch (error) {
      console.log('fetchTopInstructors error:', error);
      return rejectWithValue(error.message);
    }
});

const topInstructorsSlice = createSlice({
  name: 'topInstructors',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopInstructors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopInstructors.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        console.log('fetchTopInstructors fulfilled, state.data:', action.payload);
      })
      .addCase(fetchTopInstructors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch categories';
        console.log('fetchTopInstructors rejected, error:', action.payload);
      });
  },
});

export default topInstructorsSlice.reducer;