// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import statsReducer from '../features/stats/statsSlice';
import coursesReducer from '../features/courses/coursesSlice';
import categoriesReducer from '../features/categories/categorySlice';
import lessonsReducer from '../features/lessons/lessonSlice';
import studentReducer from '../features/students/studentSlice';
import earningsReducer from '../features/earnings/earningsSlice';
import topCategoriesReducer from '../features/topCategories/topCategoriesSlice';
import activeLearningsReducer from '../features/activeLearnings/activeLearningsSlice';
import topInstructorsReducer from '../features/topInstructors/topInstructorsSlice';
import instructorsReducer from '../features/instructors/instructorSlice';
import administratorsReducer from '../features/administrators/administratorsSlice';
import newStudentsReducer from '../features/newStudents/newStudentsSlice';
import paymentsReducer from '../features/payments/paymentsSlice';
import competitionsReducer from '../features/competitions/competitionSlice';
import curriculumsReducer from '../features/curriculums/curriculumSlice';
import liveClassesReducer from '../features/liveClasses/liveClassSlice';
import questionsReducer from '../features/questions/questionSlice';
import quizzesReducer from '../features/quiz/quizSlice';
import sectionsReducer from '../features/sections/sectionSlice';
import lessonTestReducer from '../features/lessonTests/lessonTestSlice';

const store = configureStore({
  reducer: {
    stats: statsReducer,
    categories: categoriesReducer,
    courses: coursesReducer,
    lessons:lessonsReducer,
    students:studentReducer,
    earnings: earningsReducer,
    topCategories: topCategoriesReducer,
    activeLearnings: activeLearningsReducer,
    topInstructors: topInstructorsReducer,
    instructors: instructorsReducer,
    administrators: administratorsReducer,
    newStudents: newStudentsReducer,
    payments: paymentsReducer, 
    competitions: competitionsReducer,
    curriculums: curriculumsReducer,
    liveClasses: liveClassesReducer,
    questions: questionsReducer,
    quizzes: quizzesReducer,
    sections: sectionsReducer,
    lessonTests: lessonTestReducer,
  },
});

export default store;