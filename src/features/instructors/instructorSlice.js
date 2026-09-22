// src/features/Instructors/InstructorsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../config';
const token = localStorage.getItem('token');

export const fetchInstructors = createAsyncThunk('Instructors/fetchInstructors',  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/rest-auth/admin/instructors/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
      console.log('fetchInstructors API response:', response.data);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return response.data || []; 
    } catch (error) {
      console.log('fetchInstructors error:', error);
      return rejectWithValue(error.message);
    }
});

const InstructorsSlice = createSlice({
  name: 'Instructors',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInstructors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstructors.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        console.log('fetchInstructors fulfilled, state.data:', action.payload);
      })
      .addCase(fetchInstructors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch categories';
        console.log('fetchInstructors rejected, error:', action.payload);
      });
  },
});

export default InstructorsSlice.reducer;