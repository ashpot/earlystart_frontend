// src/features/newStudents/newStudentsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../config';

export const fetchNewStudents = createAsyncThunk(
  'newStudents/fetchNewStudents',  
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/rest-auth/add_course/`);
      console.log('fetchNewStudents API response:', response.data);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return response.data || []; 
    } catch (error) {
      console.error('fetchNewStudents error:', error);
      return rejectWithValue(error.message);
    }
});

const newStudentsSlice = createSlice({
  name: 'newStudents',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        console.log('fetchNewStudents fullfilled,  state.data:', action.payload);
      })
      .addCase(fetchNewStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch categories';
        console.error('fetchNewStudents rejected, error:', action.payload);
      });
  },
});

export default newStudentsSlice.reducer;