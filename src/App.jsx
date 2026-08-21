import React from 'react';
import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
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
          <Route path="/" element={<Index />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/payment/successful" element={<PaymentSuccessful />} />
          <Route path="/request-delete" element={<RequestDelete />} />
          <Route path="/auth/signin" element={<LoginPage />} />
          <Route path="/auth/logout" element={<LoginPage />} />
          <Route path="/admin/dashboard" element={<DashboardPage />}/>
          <Route path="admin/course/add" element={<AddCoursePage />} />
          <Route path="admin/lesson/add" element={<AddLessonPage /> } />
          <Route path="admin/category/add" element={<AddCategoryPage /> } />
          <Route path="admin/lesson-test/add" element={<AddLessonTestPage /> } /> 
          <Route path="admin/quiz/add" element={<AddQuizPage /> } />
          <Route path="admin/competition/add" element={<AddCompetition /> } />
          <Route path="admin/section/add" element={<AddSection /> } />
          <Route path="admin/tickets/add" element={<AddTicket /> } />
          <Route path="admin/articles/add" element={<AddArticle /> } />
          <Route path="admin/faqs/add/" element={<AddFaq /> } />

          <Route path="admin/instructors/add" element={<AddInstructor /> } />
          <Route path="admin/instructors" element={<ManageInstructorPage /> } />
          <Route path="admin/class/create" element={<AddLiveClass /> } />
          <Route path='admin/administrators/add' element={<AddAdmin />} />
          <Route path='admin/courses' element={<CourseListPage />} />
          <Route path='admin/categories' element={<ManageCategoryPage />} />
          <Route path='admin/payments' element={<ManagePaymentPage />} />
          <Route path='admin/curriculums' element={<ManageCurriculumPage />} />
          <Route path='admin/subscriptions' element={<ManageSubscription />} />
          <Route path='admin/students' element={<ManageStudentPage />} />
          <Route path='/admin/lessons' element={<ManageLesson />} />
          <Route path='/admin/live-classes' element={<ManageLiveClassPage />} />
          <Route path='/admin/lesson-tests' element={<ManageLessonTest />} />
          <Route path='/admin/quizes' element={<ManageQuizPage />} />
          <Route path='/admin/faqs' element={<ManageFaqPage />} />
          <Route path='admin/tickets' element={<ManageTicketPage/>} />
          <Route path='/admin/sections' element={<ManageSectionPage />} />
          <Route path='admin/competitions' element={<ManageCompetitionPage />} />
          <Route path='admin/articles' element={<ManageArticle />} />
          <Route path="/search-results" element={<SearchResultsPage />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App


