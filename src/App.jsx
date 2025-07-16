import React from 'react';
import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import Index from './pages/LandingPage';
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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />}/>
          <Route path="dashboard/addCourse" element={<AddCoursePage />} />
          <Route path="dashboard/addLesson" element={<AddLessonPage /> } />
          <Route path="dashboard/addQuiz" element={<AddQuizPage /> } />
          <Route path="dashboard/addCompetition" element={<AddCompetition /> } />
          <Route path="dashboard/addSection" element={<AddSection /> } />
          <Route path="dashboard/addTicket" element={<AddTicket /> } />
          <Route path="dashboard/addArticle" element={<AddArticle /> } />
          <Route path="dashboard/addFaq" element={<AddFaq /> } />
          <Route path="dashboard/addInstructor" element={<AddInstructor /> } />
          <Route path="dashboard/addLiveClass" element={<AddLiveClass /> } />
          <Route path='dashboard/addAdmin' element={<AddAdmin />} />
          <Route path='dashboard/courselist' element={<CourseListPage />} />
          <Route path='dashboard/managepayment' element={<ManagePaymentPage />} />
          <Route path='dashboard/managecurriculum' element={<ManageCurriculumPage />} />
          <Route path='dashboard/managesubscriptions' element={<ManageSubscription />} />
          <Route path='dashboard/managestudents' element={<ManageStudentPage />} />
          <Route path='/dashboard/managelessons' element={<ManageLesson />} />
          <Route path='/dashboard/manageliveclass' element={<ManageLiveClassPage />} />
          <Route path='/dashboard/managequiz' element={<ManageQuizPage />} />
          <Route path='/dashboard/managefaq' element={<ManageFaqPage />} />
          <Route path='dashboard/manageticket' element={<ManageTicketPage/>} />
          <Route path='/dashboard/managesection' element={<ManageSectionPage />} />
          <Route path='dashboard/managecompetitions' element={<ManageCompetitionPage />} />
          <Route path='dashboard/managearticles' element={<ManageArticle />} />
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
// import LessonList from './components/dashboard/addLesson/LessonList';
// import LiveClassList from './components/dashboard/addLiveClass/LiveClassList';
// import AdminList from './components/dashboard/addAdmin/AdminList';
// import FaqList from './components/dashboard/addFAQ/FaqList';
// import ManageTicket from './components/dashboard/ticketDetails/ManageTicket';
// import SectionList from './components/dashboard/addSection/SectionList';
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
//             path="dashboard/addCourse"
//             element={
//               <ProtectedRoute>
//                 <AddCoursePage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="dashboard/addLesson"
//             element={
//               <ProtectedRoute>
//                 <AddLessonPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="dashboard/addQuiz"
//             element={
//               <ProtectedRoute>
//                 <AddQuizPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="dashboard/addCompetition"
//             element={
//               <ProtectedRoute>
//                 <AddCompetition />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="dashboard/addSection"
//             element={
//               <ProtectedRoute>
//                 <AddSection />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="dashboard/addTicket"
//             element={
//               <ProtectedRoute>
//                 <AddTicket />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="dashboard/addArticle"
//             element={
//               <ProtectedRoute>
//                 <AddArticle />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="dashboard/addFaq"
//             element={
//               <ProtectedRoute>
//                 <AddFaq />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="dashboard/addInstructor"
//             element={
//               <ProtectedRoute>
//                 <AddInstructor />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="dashboard/addLiveClass"
//             element={
//               <ProtectedRoute>
//                 <AddLiveClass />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="dashboard/addAdmin"
//             element={
//               <ProtectedRoute>
//                 <AddAdmin />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="dashboard/courselist"
//             element={
//               <ProtectedRoute>
//                 <CourseListPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="dashboard/managepayment"
//             element={
//               <ProtectedRoute>
//                 <ManagePaymentPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="dashboard/managecurriculum"
//             element={
//               <ProtectedRoute>
//                 <ManageCurriculumPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="dashboard/managesubscriptions"
//             element={
//               <ProtectedRoute>
//                 <ManageSubscription />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="dashboard/managestudents"
//             element={
//               <ProtectedRoute>
//                 <ManageStudentPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/dashboard/managelesson"
//             element={
//               <ProtectedRoute>
//                 <LessonList />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/dashboard/manageliveclass"
//             element={
//               <ProtectedRoute>
//                 <LiveClassList />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/dashboard/managequiz"
//             element={
//               <ProtectedRoute>
//                 <ManageQuizPage />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/dashboard/manageadministrator"
//             element={
//               <ProtectedRoute>
//                 <AdminList />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/dashboard/managefaq"
//             element={
//               <ProtectedRoute>
//                 <FaqList />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/dashboard/manageticket"
//             element={
//               <ProtectedRoute>
//                 <ManageTicket />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/dashboard/managesection"
//             element={
//               <ProtectedRoute>
//                 <SectionList />
//               </ProtectedRoute>
//             }
//           />
//           <Route
//             path="/dashboard/course"
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