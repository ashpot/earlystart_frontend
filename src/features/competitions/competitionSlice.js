
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../config';
const token = localStorage.getItem('token');

export const fetchCompetitions = createAsyncThunk(
  'competitions/fetchCompetitions',
  async (_, { rejectWithValue }) => {
    
      try {
      const response = await axios.get(`${BASE_URL}/api/v1/rest-auth/competitions/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
      console.log('fetchCompetitions API response:', response.data); // Debug log
      //console.log('fetchTopCompetitions data:', response.data.topCompetitions); // Debug log
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return response.data || [];
    } catch (error) {
      console.error('fetchCompetitions error:', error.message); // Debug log
      return rejectWithValue(error.message);
    }
  }
);

const competitionSlice = createSlice({
  name: 'competitions',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompetitions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompetitions.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        console.log('fetchTopCompetitions fulfilled, state.data:', action.payload); // Debug log
      })
      .addCase(fetchCompetitions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch top competitions';
        console.log('fetchCompetitions rejected, error:', action.payload); // Debug log
      });
  },
});

export default competitionSlice.reducer;