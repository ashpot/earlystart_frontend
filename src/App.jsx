import React from 'react';
import {
  BrowserRouter,
  Route,
  Routes,
  Navigate,
  Outlet,
} from 'react-router-dom';
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Index from './pages/LandingPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import PaymentSuccessful from './pages/PaymentSuccessful';
import RequestDelete from './pages/RequestDelete';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import AddCoursePage from './pages/AddCoursePage';
import AddCategoryPage from './pages/AddCategoryPage';
import AddLessonTestPage from './pages/AddLessonTestPage';
import AddLessonPage from './pages/AddLessonPage';
import AddQuizPage from './pages/AddQuizPage';
import AddCompetition from './pages/AddCompetition';
import AddSection from './pages/AddSection';
import AddLiveClass from './pages/AddLiveClass';
import AddArticle from './pages/AddArticle';
import AddFaq from './pages/AddFaq'
import AddTicket from './pages/AddTicket';
import './css/styles.css'
import AddInstructor from './pages/AddInstructor';
import ManageInstructorPage from './pages/ManageInstructorPage'
import AddAdmin from './pages/AddAdmin';
import CourseListPage from './pages/CourseListPage';
import ManagePaymentPage from './pages/ManagePaymentPage';
import ManageCurriculumPage from './pages/ManageCurriculumPage';
import ManageSubscription from './pages/ManageSubscriptionPage';
import ManageStudentPage from './pages/ManageStudentPage';
import ManageQuizPage from './pages/ManageQuizPage';
import SearchResultsPage from './pages/SearchResultPage';
import ManageTicketPage from './pages/ManageTicketPage';
import ManageSectionPage from './pages/ManageSectionPage';
import ManageLiveClassPage from './pages/ManageLiveClassPage';
import ManageLesson from './pages/ManageLesson';
import ManageFaqPage from './pages/ManageFaqPage';
import ManageLessonTest from './pages/ManageLessonTestsPage';
import ManageCompetitionPage from './pages/ManageCompetitionPage';
import ManageArticle from './pages/ManageArticles';
import ManageCategoryPage from './pages/ManageCategoriesPage';
     


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public website pages */}
        <Route path="/" element={<Index />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/payment/successful" element={<PaymentSuccessful />} />
        <Route path="/request-delete" element={<RequestDelete />} />

        {/* Authentication */}
        <Route path="/login" element={<LoginPage />} />

        {/* Preserve the old login URL */}
        <Route
          path="/auth/signin"
          element={<Navigate to="/login" replace />}
        />
        <Route
          path="/auth/logout"
          element={<Navigate to="/login" replace />}
        />

        {/* All admin pages require authentication */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Outlet />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<DashboardPage />} />

          {/* Users */}
          <Route path="students" element={<ManageStudentPage />} />
          <Route path="instructors" element={<ManageInstructorPage />} />
          <Route path="instructors/add" element={<AddInstructor />} />
          <Route path="administrators/add" element={<AddAdmin />} />

          {/* Courses and curriculum */}
          <Route path="courses" element={<CourseListPage />} />
          <Route path="course/add" element={<AddCoursePage />} />
          <Route path="categories" element={<ManageCategoryPage />} />
          <Route path="category/add" element={<AddCategoryPage />} />
          <Route path="curriculums" element={<ManageCurriculumPage />} />
          <Route path="sections" element={<ManageSectionPage />} />
          <Route path="section/add" element={<AddSection />} />
          <Route path="lessons" element={<ManageLesson />} />
          <Route path="lesson/add" element={<AddLessonPage />} />
          <Route path="lesson-tests" element={<ManageLessonTest />} />
          <Route path="lesson-test/add" element={<AddLessonTestPage />} />

          {/* Quizzes */}
          <Route path="quizes" element={<ManageQuizPage />} />
          <Route path="quiz/add" element={<AddQuizPage />} />

          {/* Live classes */}
          <Route path="live-classes" element={<ManageLiveClassPage />} />
          <Route path="class/create" element={<AddLiveClass />} />

          {/* Competitions */}
          <Route path="competitions" element={<ManageCompetitionPage />} />
          <Route path="competition/add" element={<AddCompetition />} />

          {/* Finance */}
          <Route path="payments" element={<ManagePaymentPage />} />
          <Route path="subscriptions" element={<ManageSubscription />} />

          {/* Support and content */}
          <Route path="tickets" element={<ManageTicketPage />} />
          <Route path="tickets/add" element={<AddTicket />} />
          <Route path="faqs" element={<ManageFaqPage />} />
          <Route path="faqs/add" element={<AddFaq />} />
          <Route path="articles" element={<ManageArticle />} />
          <Route path="articles/add" element={<AddArticle />} />

          {/* Search */}
          <Route path="search-results" element={<SearchResultsPage />} />
        </Route>

        {/* Unknown URLs */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

