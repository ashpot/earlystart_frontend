// src/features/activeLearnings/activeLearningsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchActiveLearnings = createAsyncThunk(
  'activeLearnings/fetchActiveLearnings',  
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:5000/activeLearnings');
      console.log('fetchActiveLearnings API response:', response.data)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return response.data || []; 
    } catch (error) {
      console.log('fetchActiveLearnings error:', error)
      return rejectWithValue(error.message);
    }
});

const activeLearningsSlice = createSlice({
  name: 'activeLearnings',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveLearnings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveLearnings.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        console.log('fetch fullfilled, state.data:', action.payload);
      })
      .addCase(fetchActiveLearnings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch categories';
        console.log('fetch rejected, error:', action.payload);
      });
  },
});

export default activeLearningsSlice.reducer;