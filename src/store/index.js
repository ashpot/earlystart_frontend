// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import statsReducer from '../features/stats/statsSlice';
import coursesReducer from '../features/courses/coursesSlice';
import earningsReducer from '../features/earnings/earningsSlice';
import topCategoriesReducer from '../features/topCategories/topCategoriesSlice';
import activeLearningsReducer from '../features/activeLearnings/activeLearningsSlice';
import topInstructorsReducer from '../features/topInstructors/topInstructorsSlice';
import newStudentsReducer from '../features/newStudents/newStudentsSlice';
import paymentsReducer from '../features/payments/paymentsSlice';

const store = configureStore({
  reducer: {
    stats: statsReducer,
    courses: coursesReducer,
    earnings: earningsReducer,
    topCategories: topCategoriesReducer,
    activeLearnings: activeLearningsReducer,
    topInstructors: topInstructorsReducer,
    newStudents: newStudentsReducer,
    payments: paymentsReducer, 
  },
});

export default store;