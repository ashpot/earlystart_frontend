
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../config';
const token = localStorage.getItem('token');

export const fetchSections = createAsyncThunk(
  'sections/fetchSections',
  async (_, { rejectWithValue }) => {
    
      try {
      const response = await axios.get(`${BASE_URL}/api/v1/rest-auth/sections/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
      console.log('fetchSections API response:', response.data); // Debug log
      //console.log('fetchTopSections data:', response.data.topSections); // Debug log
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return response.data || [];
    } catch (error) {
      console.error('fetchSections error:', error.message); // Debug log
      return rejectWithValue(error.message);
    }
  }
);

const sectionSlice = createSlice({
  name: 'sections',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSections.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        console.log('fetchTopSections fulfilled, state.data:', action.payload); // Debug log
      })
      .addCase(fetchSections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch top sections';
        console.log('fetchSections rejected, error:', action.payload); // Debug log
      });
  },
});

export default sectionSlice.reducer;