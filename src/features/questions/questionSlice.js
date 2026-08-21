
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../config';
const token = localStorage.getItem('token');

export const fetchQuestions = createAsyncThunk(
  'questions/fetchQuestions',
  async (_, { rejectWithValue }) => {
    
      try {
      const response = await axios.get(`${BASE_URL}/api/v1/rest-auth/questions/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
      console.log('fetchQuestions API response:', response.data); // Debug log
      //console.log('fetchTopQuestions data:', response.data.topQuestions); // Debug log
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return response.data || [];
    } catch (error) {
      console.error('fetchQuestions error:', error.message); // Debug log
      return rejectWithValue(error.message);
    }
  }
);

const questionSlice = createSlice({
  name: 'questions',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        console.log('fetchTopQuestions fulfilled, state.data:', action.payload); // Debug log
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch top questions';
        console.log('fetchQuestions rejected, error:', action.payload); // Debug log
      });
  },
});

export default questionSlice.reducer;