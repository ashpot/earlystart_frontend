// // src/features/topCategories/topCategoriesSlice.js
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// export const fetchTopCategories = createAsyncThunk('topCategories/fetchTopCategories', async () => {
//   const response = await axios.get('http://localhost:3000/topCategories'); // Replace with your API
//   return response.data; // Expecting [{ title, courseCount }, ...]
// });

// const topCategoriesSlice = createSlice({
//   name: 'topCategories',
//   initialState: {
//     data: [], // Changed to array
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchTopCategories.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchTopCategories.fulfilled, (state, action) => {
//         state.loading = false;
//         state.data = action.payload;
//       })
//       .addCase(fetchTopCategories.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message;
//       });
//   },
// });

// export default topCategoriesSlice.reducer;

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import axios from 'axios';

// export const fetchTopCategories = createAsyncThunk(
//   'topCategories/fetchTopCategories',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axios.get('http://localhost:3000/topCategories');
//       return response.data.categories || []; // Extract categories, default to []
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// const topCategoriesSlice = createSlice({
//   name: 'topCategories',
//   initialState: {
//     data: [],
//     loading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchTopCategories.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchTopCategories.fulfilled, (state, action) => {
//         state.loading = false;
//         state.data = action.payload;
//       })
//       .addCase(fetchTopCategories.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload || 'Failed to fetch categories';
//       });
//   },
// });

// export default topCategoriesSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchTopCategories = createAsyncThunk(
  'topCategories/fetchTopCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:5000/topCategories'); // Fetch from root
      console.log('fetchTopCategories API response:', response.data); // Debug log
      //console.log('fetchTopCategories data:', response.data.topCategories); // Debug log
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return response.data || [];
    } catch (error) {
      console.error('fetchTopCategories error:', error.message); // Debug log
      return rejectWithValue(error.message);
    }
  }
);

const topCategoriesSlice = createSlice({
  name: 'topCategories',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        console.log('fetchTopCategories fulfilled, state.data:', action.payload); // Debug log
      })
      .addCase(fetchTopCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch top categories';
        console.log('fetchTopCategories rejected, error:', action.payload); // Debug log
      });
  },
});

export default topCategoriesSlice.reducer;