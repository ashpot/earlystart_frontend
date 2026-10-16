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
import EditCoursePage from "./pages/EditCoursePage";
import AddCategoryPage from './pages/AddCategoryPage';
import EditCategoryPage from "./pages/EditCategoryPage";
import AddLessonTestPage from './pages/AddLessonTestPage';
import EditLessonTestPage from "./pages/EditLessonTestPage";
import AddLessonPage from './pages/AddLessonPage';
import ManageLessonsPage from "./pages/ManageLessonsPage";
import EditLessonPage from "./pages/EditLessonPage";
import AddQuizPage from './pages/AddQuizPage';
import EditQuizPage from "./pages/EditQuizPage";
import ManageCompetitionsPage from "./pages/ManageCompetitionsPage";
import AddCompetitionPage from "./pages/AddCompetitionPage";
import EditCompetitionPage from "./pages/EditCompetitionPage";
import CompetitionParticipantsPage from "./pages/CompetitionParticipantsPage";
import SponsorsPage from "./pages/SponsorsPage";
import CompetitionSettingsPage from "./pages/CompetitionSettingsPage";
import AddSectionPage from './pages/AddSectionPage.jsx';
import EditSectionPage from "./pages/EditSectionPage";
import AddLiveClassPage from "./pages/AddLiveClassPage";
import ManageLiveClassesPage from "./pages/ManageLiveClassesPage";
import EditLiveClassPage from "./pages/EditLiveClassPage";
import LiveClassParticipantsPage from "./pages/LiveClassParticipantsPage";
import AddArticle from './pages/AddArticle';
import AddFaq from './pages/AddFaq'
import AddTicket from './pages/AddTicket';
import './css/styles.css'
import AddUserPage from "./pages/AddUserPage";
import EditUserPage from "./pages/EditUserPage";
import UsersPage from "./pages/UsersPage";
import UserDetailsPage from "./pages/UserDetailsPage";

import CourseListPage from './pages/CourseListPage';
import ManagePaymentPage from './pages/ManagePaymentPage';
import ManageCurriculumPage from './pages/ManageCurriculumPage';
import ManageSubscription from './pages/ManageSubscriptionPage';
import ManageQuizzesPage from './pages/ManageQuizzesPage';
import SearchResultsPage from './pages/SearchResultPage';
import ManageTicketPage from './pages/ManageTicketPage';
import ManageSectionPage from './pages/ManageSectionPage';
import ManageFaqPage from './pages/ManageFaqPage';
import ManageLessonTestsPage from './pages/ManageLessonTestsPage';
import ManageArticle from './pages/ManageArticles';
import ManageCategoryPage from './pages/ManageCategoriesPage';
import ManageCoursesPage from './pages/ManageCoursesPage';
import ManageQuestionsPage from "./pages/ManageQuestionsPage";
import AddQuestionPage from "./pages/AddQuestionPage";
import EditQuestionPage from "./pages/EditQuestionPage";
import BulkUploadQuestionsPage from "./pages/BulkUploadQuestionsPage";

import QuizAttemptsPage from "./pages/QuizAttemptsPage";
import QuizAttemptDetailsPage from "./pages/QuizAttemptDetailsPage";
import ManageNotificationsPage from "./pages/ManageNotificationsPage";
import SendNotificationPage from "./pages/SendNotificationPage";
import NotificationDetailsPage from "./pages/NotificationDetailsPage";
import AnalyticsOverviewPage from "./pages/AnalyticsOverviewPage";
import LessonAnalyticsPage from "./pages/LessonAnalyticsPage";
import LessonTestAnalyticsPage from "./pages/LessonTestAnalyticsPage";
import QuizAnalyticsPage from "./pages/QuizAnalyticsPage";
import QuizLeaderboardPage from "./pages/QuizLeaderboardPage";
import LearnerAnalyticsPage from "./pages/LearnerAnalyticsPage";
import LearnerDetailPage from "./pages/LearnerDetailPage";
import ParentAnalyticsPage from "./pages/ParentAnalyticsPage";
import ParentDetailPage from "./pages/ParentDetailPage";

import NotFoundPage from "./pages/NotFoundPage";


     


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
          
          <Route
            path="users"
            element={
              <ProtectedRoute>
                <UsersPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="users/:id"
            element={
              <ProtectedRoute>
                <UserDetailsPage />
              </ProtectedRoute>
            }
          />

          
          <Route
            path="add-user"
            element={
              <ProtectedRoute>
                <AddUserPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="users/edit/:id"
            element={
              <ProtectedRoute>
                <EditUserPage />
              </ProtectedRoute>
            }
          />

          {/* Courses and curriculum */}
          <Route
            path="/admin/courses"
            element={
              <ProtectedRoute>
                <ManageCoursesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/course/edit/:id"
            element={
              <ProtectedRoute>
                <EditCoursePage />
              </ProtectedRoute>
            }
          />
          <Route path="course/add" element={<AddCoursePage />} />
          <Route path="categories" element={<ManageCategoryPage />} />
          <Route path="category/add" element={<ProtectedRoute><AddCategoryPage /> </ProtectedRoute>} />
          <Route
            path="category/edit/:id"
            element={
              <ProtectedRoute>
                <EditCategoryPage />
              </ProtectedRoute>
            }
          />
          <Route path="curriculums" element={<ManageCurriculumPage />} />
          
          <Route
            path="section/add"
            element={
              <ProtectedRoute>
                <AddSectionPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="sections"
            element={
              <ProtectedRoute>
                <ManageSectionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="section/edit/:id"
            element={
              <ProtectedRoute>
                <EditSectionPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="lessons"
            element={
              <ProtectedRoute>
                <ManageLessonsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="lesson/add"
            element={
              <ProtectedRoute>
                <AddLessonPage />
              </ProtectedRoute>
            }
          />

        <Route
          path="lesson/edit/:id"
          element={
            <ProtectedRoute>
              <EditLessonPage />
            </ProtectedRoute>
          }
        />

                  
        <Route
          path="lesson-tests"
          element={
            <ProtectedRoute>
              <ManageLessonTestsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="lesson-test/add"
          element={
            <ProtectedRoute>
              <AddLessonTestPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="lesson-test/edit/:id"
          element={
            <ProtectedRoute>
              <EditLessonTestPage />
            </ProtectedRoute>
          }
        />

          {/* Quizzes */}
          
          <Route
            path="quizzes"
            element={
              <ProtectedRoute>
                <ManageQuizzesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="quiz/add"
            element={
              <ProtectedRoute>
                <AddQuizPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="quiz/edit/:id"
            element={
              <ProtectedRoute>
                <EditQuizPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="questions"
            element={
              <ProtectedRoute>
                <ManageQuestionsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="question/add"
            element={
              <ProtectedRoute>
                <AddQuestionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="question/edit/:id"
            element={
              <ProtectedRoute>
                <EditQuestionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="questions/bulk-upload"
            element={
              <ProtectedRoute>
                <BulkUploadQuestionsPage />
              </ProtectedRoute>
            }
          />


          <Route
            path="quiz-attempts"
            element={
              <ProtectedRoute>
                <QuizAttemptsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="quiz-attempts/:id"
            element={
              <ProtectedRoute>
                <QuizAttemptDetailsPage />
              </ProtectedRoute>
            }
          />



          {/* Live classes */}
          <Route
            path="live-classes"
            element={
              <ProtectedRoute>
                <ManageLiveClassesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="live-classes/add"
            element={
              <ProtectedRoute>
                <AddLiveClassPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="live-classes/edit/:id"
            element={
              <ProtectedRoute>
                <EditLiveClassPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/live-classes/:id/participants"
            element={
              <ProtectedRoute>
                <LiveClassParticipantsPage />
              </ProtectedRoute>
            }
          />

          {/* Competitions */}
          <Route
            path="competitions"
            element={
              <ProtectedRoute>
                <ManageCompetitionsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="competitions/add"
            element={
              <ProtectedRoute>
                <AddCompetitionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="competitions/edit/:id"
            element={
              <ProtectedRoute>
                <EditCompetitionPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="competitions/:id/participants"
            element={
              <ProtectedRoute>
                <CompetitionParticipantsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="competitions/:id/settings"
            element={
              <ProtectedRoute>
                <CompetitionSettingsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="sponsors"
            element={
              <ProtectedRoute>
                <SponsorsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="notifications"
            element={
              <ProtectedRoute>
                <ManageNotificationsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="notifications/:id"
            element={
              <ProtectedRoute>
                <NotificationDetailsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="send-notification"
            element={
              <ProtectedRoute>
                <SendNotificationPage />
              </ProtectedRoute>
            }
          />

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

          <Route
            path="analytics"
            element={
              <ProtectedRoute>
                <AnalyticsOverviewPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="analytics/lessons"
            element={
              <ProtectedRoute>
                <LessonAnalyticsPage />
              </ProtectedRoute>
            }
          />

          <Route
          path="analytics/tests"
          element={
            <ProtectedRoute>
              <LessonTestAnalyticsPage />
            </ProtectedRoute>
          }
        />

        <Route
            path="analytics/quizzes"
            element={
              <ProtectedRoute>
                <QuizAnalyticsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="analytics/quizzes/:id/leaderboard"
            element={
              <ProtectedRoute>
                <QuizLeaderboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="analytics/learners"
            element={
              <ProtectedRoute>
                <LearnerAnalyticsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="analytics/learners/:id"
            element={
              <ProtectedRoute>
                <LearnerDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="analytics/parents"
            element={
              <ProtectedRoute>
                <ParentAnalyticsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="analytics/parents/:id"
            element={
              <ProtectedRoute>
                <ParentDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Search */}
          <Route path="search-results" element={<SearchResultsPage />} />
        </Route>

        {/* Unknown URLs */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

