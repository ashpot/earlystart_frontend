import React from 'react';
import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import Index from './pages/LandingPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RequestDelete from './pages/RequestDelete';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import AddCoursePage from './pages/AddCoursePage';
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
import ManageCompetitionPage from './pages/ManageCompetitionPage';
import ManageArticle from './pages/ManageArticles';

function App() {

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/request-delete" element={<RequestDelete />} />
          <Route path="/auth/signin" element={<LoginPage />} />
          <Route path="/auth/logout" element={<LoginPage />} />
          <Route path="/admin/dashboard" element={<DashboardPage />}/>
          <Route path="admin/courses/add" element={<AddCoursePage />} />
          <Route path="admin/lessons/add" element={<AddLessonPage /> } />
          <Route path="admin/quizes/add" element={<AddQuizPage /> } />
          <Route path="admin/competitions/add" element={<AddCompetition /> } />
          <Route path="admin/sections/add" element={<AddSection /> } />
          <Route path="admin/tickets/add" element={<AddTicket /> } />
          <Route path="admin/articles/add" element={<AddArticle /> } />
          <Route path="admin/faqs/add/" element={<AddFaq /> } />
          <Route path="admin/instructors/add" element={<AddInstructor /> } />
          <Route path="admin/live-classes/add" element={<AddLiveClass /> } />
          <Route path='admin/admins/add' element={<AddAdmin />} />
          <Route path='admin/courses' element={<CourseListPage />} />
          <Route path='admin/payments' element={<ManagePaymentPage />} />
          <Route path='admin/curriculums' element={<ManageCurriculumPage />} />
          <Route path='admin/esubscriptions' element={<ManageSubscription />} />
          <Route path='admin/students' element={<ManageStudentPage />} />
          <Route path='/admin/lessons' element={<ManageLesson />} />
          <Route path='/admin/live-classes' element={<ManageLiveClassPage />} />
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


// src/App.js
// import React from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext';
// import ProtectedRoute from './components/ProtectedRoute';
// import Index from './pages/LandingPage';
// import LoginPage from './pages/LoginPage';
// import DashboardPage from './pages/DashboardPage';
// import AddCoursePage from './pages/AddCoursePage';
// import AddLessonPage from './pages/AddLessonPage';
// import AddQuizPage from './pages/AddQuizPage';
// import AddCompetition from './pages/AddCompetition';
// import AddSection from './pages/AddSection';
// import AddLiveClass from './pages/AddLiveClass';
// import AddArticle from './pages/AddArticle';
// import AddFaq from './pages/AddFaq';
// import AddTicket from './pages/AddTicket';
// import AddInstructor from './pages/AddInstructor';
// import AddAdmin from './pages/AddAdmin';
// import CourseListPage from './pages/CourseListPage';
// import ManagePaymentPage from './pages/ManagePaymentPage';
// import ManageCurriculumPage from './pages/ManageCurriculumPage';
// import ManageSubscription from './pages/ManageSubscription';
// import ManageStudentPage from './pages/ManageStudentPage';
// import LessonList from './components/admin/addLesson/LessonList';
// import LiveClassList from './components/admin/addLiveClass/LiveClassList';
// import AdminList from './components/admin/addAdmin/AdminList';
// import FaqList from './components/admin/addFAQ/FaqList';
// import ManageTicket from './components/admin/ticketDetails/ManageTicket';
// import SectionList from './components/admin/addSection/SectionList';
// import ManageQuizPage from './pages/ManageQuizPage';
// import SearchResultsPage from './pages/SearchResultPage';
// import './css/styles.css';

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           <Route path="/" element={<Index />} />
//           <Route path="/login" element={<LoginPage />} />
//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute>
//                 <DashboardPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="admin/addCourse"
//             element={
//               <ProtectedRoute>
//                 <AddCoursePage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="admin/addLesson"
//             element={
//               <ProtectedRoute>
//                 <AddLessonPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="admin/addQuiz"
//             element={
//               <ProtectedRoute>
//                 <AddQuizPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="admin/addCompetition"
//             element={
//               <ProtectedRoute>
//                 <AddCompetition />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="admin/addSection"
//             element={
//               <ProtectedRoute>
//                 <AddSection />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="admin/addTicket"
//             element={
//               <ProtectedRoute>
//                 <AddTicket />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="admin/addArticle"
//             element={
//               <ProtectedRoute>
//                 <AddArticle />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="admin/addFaq"
//             element={
//               <ProtectedRoute>
//                 <AddFaq />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="admin/addInstructor"
//             element={
//               <ProtectedRoute>
//                 <AddInstructor />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="admin/addLiveClass"
//             element={
//               <ProtectedRoute>
//                 <AddLiveClass />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="admin/addAdmin"
//             element={
//               <ProtectedRoute>
//                 <AddAdmin />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="admin/courselist"
//             element={
//               <ProtectedRoute>
//                 <CourseListPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="admin/managepayment"
//             element={
//               <ProtectedRoute>
//                 <ManagePaymentPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="admin/managecurriculum"
//             element={
//               <ProtectedRoute>
//                 <ManageCurriculumPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="admin/managesubscriptions"
//             element={
//               <ProtectedRoute>
//                 <ManageSubscription />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="admin/managestudents"
//             element={
//               <ProtectedRoute>
//                 <ManageStudentPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/admin/managelesson"
//             element={
//               <ProtectedRoute>
//                 <LessonList />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/admin/manageliveclass"
//             element={
//               <ProtectedRoute>
//                 <LiveClassList />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/admin/managequiz"
//             element={
//               <ProtectedRoute>
//                 <ManageQuizPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/admin/manageadministrator"
//             element={
//               <ProtectedRoute>
//                 <AdminList />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/admin/managefaq"
//             element={
//               <ProtectedRoute>
//                 <FaqList />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/admin/manageticket"
//             element={
//               <ProtectedRoute>
//                 <ManageTicket />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/admin/managesection"
//             element={
//               <ProtectedRoute>
//                 <SectionList />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/admin/course"
//             element={
//               <ProtectedRoute>
//                 <CourseListPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/search-results"
//             element={
//               <ProtectedRoute>
//                 <SearchResultsPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route path="*" element={<Navigate to="/" />} />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;