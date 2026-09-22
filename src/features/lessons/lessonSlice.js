// src/features/Lessons/LessonsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../config';
const token = localStorage.getItem('token');

export const fetchLessons = createAsyncThunk('Lessons/fetchLessons',  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/rest-auth/admin/lessons/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
      console.log('fetchLessons API response:', response.data);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return response.data || []; 
    } catch (error) {
      console.log('fetchLessons error:', error);
      return rejectWithValue(error.message);
    }
});

const LessonsSlice = createSlice({
  name: 'Lessons',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLessons.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLessons.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        console.log('fetchLessons fulfilled, state.data:', action.payload);
      })
      .addCase(fetchLessons.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch categories';
        console.log('fetchLessons rejected, error:', action.payload);
      });
  },
});

export default LessonsSlice.reducer;