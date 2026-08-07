
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../config';

const token = localStorage.getItem('token');


export const fetchStudents = createAsyncThunk(
  'students/fetchStudents', 
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/v1/rest-auth/students/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
      console.log('fetchStudents API response:', response.data);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return response.data || []; 
    } catch (error) {
      console.log('fetchStudents error:', error);
      return rejectWithValue(error.message);
    }
});



const studentsSlice = createSlice({
  name: 'students',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        console.log('fetchStudents fulfilled, state.data:', action.payload)
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch categories';
        console.log('fetchStudents rejected, error:', action.payload)
      });
  },
});

export default studentsSlice.reducer;