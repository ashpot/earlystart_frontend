// src/features/administrators/administratorsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../config';
const token = localStorage.getItem('token');

export const fetchAdministrators = createAsyncThunk('administrators/fetchAdministrators',  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/rest-auth/admin/administrators/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
      console.log('fetchAdministrators API response:', response.data);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return response.data || []; 
    } catch (error) {
      console.log('fetchAdministrators error:', error);
      return rejectWithValue(error.message);
    }
});

const administratorsSlice = createSlice({
  name: 'administrators',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdministrators.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdministrators.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        console.log('fetchAdministrators fulfilled, state.data:', action.payload);
      })
      .addCase(fetchAdministrators.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch categories';
        console.log('fetchAdministrators rejected, error:', action.payload);
      });
  },
});

export default administratorsSlice.reducer;