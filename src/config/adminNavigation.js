
// src/config/adminNavigation.js

import { FaHome, FaUser, FaVideo, FaAward, FaShoppingCart, FaQuestionCircle } from "react-icons/fa";
import {
  FaPenToSquare,
  FaChartLine,
} from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";

export const adminNavigation = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: FaHome,
    end: true,
  },
  {
    label: "Users",
    icon: FaUser,
    children: [
      {
        label: "Add User",
        path: "/admin/add-user",
      },
      {
        label: "Users",
        path: "/admin/users",
      },
      
      
    ],
  },
  {
    label: "Courses",
    icon: FaPenToSquare,
    children: [
      {
        label: "Add Category",
        path: "/admin/category/add",
      },
      {
        label: "Manage Categories",
        path: "/admin/categories",
      },
      {
        label: "Add Course",
        path: "/admin/course/add",
      },
      {
        label: "Manage Courses",
        path: "/admin/courses",
      },
      {
        label: "Add Section",
        path: "/admin/section/add",
      },
      {
        label: "Manage Sections",
        path: "/admin/sections",
      },
      {
        label: "Add Lesson",
        path: "/admin/lesson/add",
      },
      {
        label: "Manage Lessons",
        path: "/admin/lessons",
      },
      {
        label: "Add Lesson Test",
        path: "/admin/lesson-test/add",
      },
      {
        label: "Manage Lesson Tests",
        path: "/admin/lesson-tests",
      },
      {
        label: "Manage Curriculums",
        path: "/admin/curriculums",
      },
    ],
  },
  {
    label: "Quizzes",
    icon: FaQuestionCircle,
    children: [
      {
        label: "Add Quiz",
        path: "/admin/quiz/add",
      },
      {
        label: "Manage Quizzes",
        path: "/admin/quizzes",
      },
      {
        label: "Add Quiz Question",
        path: "/admin/question/add",
      },
      {
        label: "Manage Quiz Questions",
        path: "/admin/questions",
      },
      {
        label: "Quiz Attempts",
        path: "/admin/quiz-attempts",
      },
    ],
  },
  {
    label: "Live Classes",
    icon: FaVideo,
    children: [
      {
        label: "Create Class",
        path: "/admin/class/create",
      },
      {
        label: "Manage Classes",
        path: "/admin/live-classes",
      },
    ],
  },
  {
    label: "Competitions",
    icon: FaAward,
    children: [
      {
        label: "Add Competition",
        path: "/admin/competition/add",
      },
      {
        label: "Manage Competitions",
        path: "/admin/competitions",
      },
    ],
  },
  {
    label: "Finance",
    icon: FaShoppingCart,
    children: [
      {
        label: "Manage Subscriptions",
        path: "/admin/subscriptions",
      },
      {
        label: "Manage Payments",
        path: "/admin/payments",
      },
    ],
  },
  {
    label: "Support & Content",
    icon: IoMdSettings,
    children: [
      {
        label: "Tickets",
        path: "/admin/tickets",
      },
      {
        label: "Add Ticket",
        path: "/admin/tickets/add",
      },
      {
        label: "FAQs",
        path: "/admin/faqs",
      },
      {
        label: "Add FAQ",
        path: "/admin/faqs/add",
      },
      {
        label: "Articles",
        path: "/admin/articles",
      },
      {
        label: "Add Article",
        path: "/admin/articles/add",
      },
    ],
  },
];

export const collapsedNavigation = adminNavigation.map(
  ({ label, path, icon, children, end }) => ({
    label,
    path: path || children?.[0]?.path,
    icon,
    end,
  })
);
