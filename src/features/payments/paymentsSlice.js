// src/features/payments/paymentsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchPayments = createAsyncThunk(
  'payments/fetchPayments',  
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:5000/payments');
      console.log('fetchPayments API response:', response.data);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return response.data || []; 
    } catch (error) {
      console.error('fetchPayments error:', error);
      return rejectWithValue(error.message);
    }
});

const paymentsSlice = createSlice({
  name: 'payments',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPayments.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        console.log('fetchPayments fulfilled, state.data:', action.payload);
      })
      .addCase(fetchPayments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch categories';
        console.log('fetchPayments rejected, error:', action.payload);
      });
  },
});

export default paymentsSlice.reducer;