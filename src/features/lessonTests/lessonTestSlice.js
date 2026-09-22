// src/features/Lessons/LessonsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../config';
const token = localStorage.getItem('token');

export const fetchLessonTests = createAsyncThunk('LessonTests/fetchLessonTests',  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/rest-auth/admin/lesson-tests/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
      console.log('fetchLessonTests API response:', response.data);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return response.data || []; 
    } catch (error) {
      console.log('fetchLessonTests error:', error);
      return rejectWithValue(error.message);
    }
});

const LessonTestSlice = createSlice({
  name: 'LessonTests',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLessonTests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLessonTests.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        console.log('fetchLessonTests fulfilled, state.data:', action.payload);
      })
      .addCase(fetchLessonTests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch categories';
        console.log('fetchLessonTests rejected, error:', action.payload);
      });
  },
});

export default LessonTestSlice.reducer;