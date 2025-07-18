import React from "react";
import { FaVideo } from "react-icons/fa";
import { FaCode } from "react-icons/fa6";
import { PiGraduationCap } from "react-icons/pi";
import { TbWifiOff } from "react-icons/tb";
import { PiGameController } from "react-icons/pi";
import { DiCodeBadge } from "react-icons/di";
import { PiPaintBrush } from "react-icons/pi";
import { GiLightBulb } from "react-icons/gi";
import { FaUsers } from "react-icons/fa";
import { FaUserCircle } from "react-icons/fa";

export const aboutList = [
	{
		icon: <FaVideo size={65}/>,
		title: "Learn through play",
	},
	{
		icon: <GiLightBulb size={70}/>,
		title: "Explore lessons",
	},
	{
		icon: <FaUsers size={70}/>,
		title: "Get creative",
	},
	{
		icon: <FaUserCircle size={70}/>,
		title: "100% child-friendly",
	},
];

export const features = [
	{
		icon: <FaCode />,
		title: "Fun & Easy Coding Lessons",
		description: "Your child learns letters, numbers, colors, and more through engaging videos, games, and quizzes — turning screen time into smart time.",
	},
	{
		icon: <PiGraduationCap />,
		title: "Tech Skills for the Future",
		description: "We introduce young minds to technology concepts like robotics, app building, animation, and AI — turning curiosity into real-world skills.",
	},
	{
		icon: <TbWifiOff />,
		title: "Offline Learning Available",
		description: "Download lessons and projects to keep the learning going — anytime, anywhere, even without internet.",
	},
	{
		icon: <PiGameController />,
		title: "Gamified Learning Experience",
		description: "Every lesson feels like a game! With points, levels, and fun characters, learning tech becomes a thrilling adventure",
	},
	{
		icon: <DiCodeBadge />,
		title: "Project-Based Activities",
		description: "Kids don’t just watch — they create. From building simple games to tech-powered art, creativity meets technology in every course.",
	},
	{
		icon: <PiPaintBrush />,
		title: "Creative Sandbox Mode",
		description: "An open space where kids can experiment, build, and explore their own tech ideas using what they’ve learned.",
	},
]