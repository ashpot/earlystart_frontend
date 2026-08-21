
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../config';
const token = localStorage.getItem('token');

export const fetchLiveClasses = createAsyncThunk(
  'liveclasses/fetchLiveClasses',
  async (_, { rejectWithValue }) => {
    
      try {
      const response = await axios.get(`${BASE_URL}/api/v1/rest-auth/live-classes/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
      console.log('fetchLiveClasses API response:', response.data); // Debug log
      //console.log('fetchTopLiveClasses data:', response.data.topLiveClasses); // Debug log
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return response.data || [];
    } catch (error) {
      console.error('fetchLiveClasses error:', error.message); // Debug log
      return rejectWithValue(error.message);
    }
  }
);

const liveclassSlice = createSlice({
  name: 'liveclasses',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLiveClasses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLiveClasses.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        console.log('fetchTopLiveClasses fulfilled, state.data:', action.payload); // Debug log
      })
      .addCase(fetchLiveClasses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch top liveclasses';
        console.log('fetchLiveClasses rejected, error:', action.payload); // Debug log
      });
  },
});

export default liveclassSlice.reducer;