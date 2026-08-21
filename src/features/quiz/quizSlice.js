
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../config';
const token = localStorage.getItem('token');

export const fetchQuizzes = createAsyncThunk(
  'quizzes/fetchQuizzes',
  async (_, { rejectWithValue }) => {
    
      try {
      const response = await axios.get(`${BASE_URL}/api/v1/rest-auth/quizzes/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
      console.log('fetchQuizzes API response:', response.data); // Debug log
      //console.log('fetchTopQuizzes data:', response.data.topQuizzes); // Debug log
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return response.data || [];
    } catch (error) {
      console.error('fetchQuizzes error:', error.message); // Debug log
      return rejectWithValue(error.message);
    }
  }
);

const quizSlice = createSlice({
  name: 'quizzes',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        console.log('fetchTopQuizzes fulfilled, state.data:', action.payload); // Debug log
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch top quizzes';
        console.log('fetchQuizzes rejected, error:', action.payload); // Debug log
      });
  },
});

export default quizSlice.reducer;