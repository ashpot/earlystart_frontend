
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../config';
const token = localStorage.getItem('token');

export const fetchCurriculums = createAsyncThunk(
  'curriculums/fetchCurriculums',
  async (_, { rejectWithValue }) => {
    
      try {
      const response = await axios.get(`${BASE_URL}/api/v1/rest-auth/admin/curriculums/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
      console.log('fetchCurriculums API response:', response.data); // Debug log
      //console.log('fetchTopCurriculums data:', response.data.topCurriculums); // Debug log
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return response.data || [];
    } catch (error) {
      console.error('fetchCurriculums error:', error.message); // Debug log
      return rejectWithValue(error.message);
    }
  }
);

const curriculumSlice = createSlice({
  name: 'curriculums',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurriculums.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurriculums.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        console.log('fetchTopCurriculums fulfilled, state.data:', action.payload); // Debug log
      })
      .addCase(fetchCurriculums.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch top curriculums';
        console.log('fetchCurriculums rejected, error:', action.payload); // Debug log
      });
  },
});

export default curriculumSlice.reducer;