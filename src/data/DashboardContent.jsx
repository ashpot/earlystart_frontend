import React from 'react';
import { FaUsers, FaCopy, FaPenToSquare } from 'react-icons/fa6';
import { FaChalkboardTeacher } from 'react-icons/fa';

export const topCategories = [
	{ title: "Coding", courseCount: "100+ Courses" },
	{ title: "Artificial Intelligence", courseCount: "100+ Courses" },
	{ title: "Robotics", courseCount: "100+ Courses" },
	{ title: "Internet of Things (IoT)", courseCount: "100+ Courses" },
];
  
export const earningsData = [
	{ month: "Jan.", earnings: 70, earnings2: 40 },
	{ month: "Feb.", earnings: 50, earnings2: 20 },
	{ month: "Mar.", earnings: 80, earnings2: 50 },
	{ month: "Apr.", earnings: 50, earnings2: 30 },
	{ month: "May.", earnings: 45, earnings2: 30 },
	{ month: "Jun.", earnings: 70, earnings2: 35 },
	{ month: "Jul.", earnings: 60, earnings2: 50 },
	{ month: "Aug.", earnings: 40, earnings2: 20 },
	{ month: "Sep.", earnings: 80, earnings2: 70 },
	{ month: "Oct.", earnings: 50, earnings2: 50 },
	{ month: "Nov.", earnings: 70, earnings2: 65 },
	{ month: "Dec.", earnings: 70, earnings2: 40 },
];
  
export const activeLearningsData = [
	{ user: "Chukwu Uzor", course: "Python Pro...", status: 20 },
	{ user: "Charm Blessing", course: "Introduction to...", status: 70 },
	{ user: "Hassan Mabulu", course: "How to Gain...", status: 45 },
	{ user: "Omotayo Ade", course: "Parts of...", status: 86 },
	{ user: "Fummilayo A.", course: "Using Scra...", status: 30 },
	{ user: "Grace Akachi", course: "All Things Of...", status: 20 },
	{ user: "Chukwu Uzor", course: "Python Pro...", status: 20 },
	{ user: "Charm Blessing", course: "Introduction to...", status: 70 },
	{ user: "Hassan Mabulu", course: "How to Gain...", status: 45 },
];
  
export const statsData = [
	{ title: "YTD Earnings", value: "$598,312", icon: <FaCopy className='bg-tertiary text-5xl p-2 rounded-md' />, link: "/dashboard/earnings", linkColor: "text-[#E60FE2]" },
	{ title: "Total Students", value: "35,395", icon: <FaUsers className='bg-secondary text-5xl p-2 rounded-md'/>, link: "/dashboard/students", linkColor: "text-[#07C851]" },
	{ title: "Total Instructors", value: "573", icon: <FaChalkboardTeacher className='bg-secondaryDark text-5xl p-2 text-white rounded-md'/>, link: "/dashboard/instructors", linkColor: "text-[#E68C0F]" },
	{ title: "Total Courses", value: "2,389", icon: <FaPenToSquare className='bg-primary text-5xl p-2 rounded-md'/>, link: "/dashboard/courses", linkColor: "text-primary" },
];

export const topInstructorsData = [
	{ name: "John Ikeh", degree: "Msc", classes: 321, course: "Python" },
	{ name: "Israel Obinna", degree: "Msc", classes: 321, course: "Scratch" },
	{ name: "Chidinma Uyor", degree: "Msc", classes: 321, course: "IoT" },
	{ name: "Chidi Kalu", degree: "Msc", classes: 321, course: "IoT" },
	{ name: "Chidinma Odun", degree: "Msc", classes: 321, course: "IoT" },
];
  
export const newStudentsData = [
	{ name: "Chukwa Uzor", email: "chukweuzee@gmail.com", upgrading: "Yes", completed: 20 },
	{ name: "Chidi Uzor", email: "chukweuzee@gmail.com", upgrading: "No", completed: 0 },
	{ name: "Urenna Uko", email: "chukweuzee@gmail.com", upgrading: "Yes", completed: 18 },
	{ name: "Naomi Ojo", email: "chukweuzee@gmail.com", upgrading: "No", completed: 0 },
];
  
export const paymentsData = [
	{ name: "Chukwe Uzor", amount: "N25,000" },
	{ name: "Chris Kalu", amount: "N25,000" },
	{ name: "Ure Eme", amount: "N25,000" },
	{ name: "Rose Chidi", amount: "N25,000" },
];

export const coursesData = [
	{ course: "Introduction to Python Programming", category: "Coding", lessons: 23, dateAdded: "12th May, 2025", lastUpdated: "12th May, 2025", students: "3,612" },
	{ course: "Introduction to Python Programming", category: "Artificial Intelligence", lessons: 23, dateAdded: "12th May, 2025", lastUpdated: "12th May, 2025", students: "3,612" },
	{ course: "Introduction to Python Programming", category: "Internet of Things...", lessons: 23, dateAdded: "12th May, 2025", lastUpdated: "12th May, 2025", students: "3,612" },
	{ course: "Introduction to Python Programming", category: "Coding", lessons: 23, dateAdded: "12th May, 2025", lastUpdated: "12th May, 2025", students: "3,612" },
	{ course: "Introduction to Python Programming", category: "Robotics", lessons: 23, dateAdded: "12th May, 2025", lastUpdated: "12th May, 2025", students: "3,612" },
	{ course: "Introduction to Python Programming", category: "Robotics", lessons: 23, dateAdded: "12th May, 2025", lastUpdated: "12th May, 2025", students: "3,612" },
	{ course: "Introduction to Python Programming", category: "Coding", lessons: 23, dateAdded: "12th May, 2025", lastUpdated: "12th May, 2025", students: "3,612" },
	{ course: "Introduction to Python Programming", category: "Robotics", lessons: 23, dateAdded: "12th May, 2025", lastUpdated: "12th May, 2025", students: "3,612" },
  ];