# ClockIn - ALP Final Project - Kelompok 2 (FrontEnd)

[![HTML](https://img.shields.io/badge/HTML-%23E34F26.svg?logo=html5&logoColor=white)](#)
[![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC.svg?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000)](#)

This repository contains the frontend part of the Challenge Based Learning (CBL) project for our ALP Final Project.

> [!NOTE]
> This project is still under active development. Some features (may) still be not available by the time this project has been completely finished.

## 📖 Project Overview

**ClockIn** is a web-based time management application developed using modern web technologies with Tailwind CSS for styling. The project was created as part of the **ALP (Applied Learning Project)** with the Challenge Based Learning (CBL) approach. It is designed to help users organize tasks, track progress, maintain productivity streaks, and categorize their activities based on urgency and importance.

## 🎯 Project Purpose

### Why We Built ClockIn
In today's fast-paced world, people struggle with:
- **Time Management**: Difficulty organizing daily tasks and schedules effectively
- **Productivity Tracking**: Not knowing how productive they actually are
- **Motivation**: Losing steam when working on long-term goals
- **Prioritization**: Trouble deciding which tasks are most important

### Our Solution
ClockIn addresses these challenges by providing:
- **🗓️ Smart Scheduling**: Interactive calendar system that makes planning intuitive
- **🔥 Gamified Experience**: Streak counters and achievement badges that make productivity fun
- **📊 Visual Progress**: Charts and analytics that show your productivity journey
- **⚡ Priority Management**: Color-coded system using gems to indicate task urgency
- **🌙 User-Friendly Design**: Modern interface with dark mode for comfortable use anytime

### Academic Goals
As an ALP (Applied Learning Project), ClockIn serves to:
- Apply **Challenge Based Learning (CBL)** methodology to solve real-world problems
- Demonstrate proficiency in modern web development technologies
- Practice collaborative software development in a team environment
- Bridge the gap between academic learning and industry practices

## 🎯 Key Frontend Roles

The frontend serves as the primary interface for users and handles multiple critical functions:

- **🔐 Authentication & User Management**: Secure JWT-based login system with user registration, session management, route protection, and comprehensive profile management including avatar customization and account settings.

- **📅 Task & Schedule Management**: Interactive calendar interface with drag-and-drop functionality, full CRUD operations for tasks and events, smart categorization with color-coded labels, and visual priority indicators using gem-based UI elements.

- **📊 Progress Tracking & Gamification**: Real-time productivity streak counters with visual fire icons, achievement badge system for milestone recognition, and interactive analytics dashboard with charts showing productivity trends and statistics.

- **🎨 Modern User Experience & Integration**: Responsive mobile-first design using Tailwind CSS with complete dark mode support, smooth animations and transitions, RESTful API communication with comprehensive error handling, and real-time notifications for reminders and status updates.


## 🔗 Visit Backend Repository 
You can find the backend repository for this project here: 
[**Backend-ALP-Kelompok2**](https://github.com/1nnocentia/timemanagement-clockin-backend)

## 👥 Team Members
- **Innocentia Handani**
- **Arsya Aulia Amira**
- **Patrick Shiawase Aruji**
- **Rasya Febrian Dema**
- **Abel El Zachary**


> [!IMPORTANT]
> As part of an academic project, the development of approaches in this repository may vary as we learn and adapt. While we strive to implement industry-standard practices, we recognize that consistency will continue to evolve as the team gains insight and experience.

## 🚀 Setup Instructions

### What You Need First (Prerequisites)
Before you start, make sure you have these installed on your computer:

- **A Web Browser**: Any modern browser like Chrome, Firefox, Safari, or Edge
- **A Code Editor**: We recommend [Visual Studio Code](https://code.visualstudio.com/) (it's free!)
- **Node.js**: Download from [nodejs.org](https://nodejs.org/) - this also installs npm automatically
- **Git**: Download from [git-scm.com](https://git-scm.com/) to clone the project

### Step-by-Step Installation Guide

**Step 1: Get the Code**
```bash
# Open your terminal/command prompt and type:
git clone https://github.com/1nnocentia/timeproductivityweb.git
```
*This downloads all the project files to your computer*

**Step 2: Navigate to the Project**
```bash
# Go into the project folder
cd timeproductivityweb
```
*This moves you into the project directory*

**Step 3: Install Required Packages**
```bash
# Install all the tools the project needs
npm install
```
*This might take a few minutes - it's downloading helpful tools*

**Step 4: Build the Styles**
```bash
# Create the CSS file that makes everything look pretty
npm run build-css
```
*This creates the styling file from Tailwind CSS*

**Step 5: Set Up the Connection to Backend**
- Open the project in your code editor
- Look for JavaScript files in the `public` folder
- Find where it says `BASE_URL` and change it to your backend server address
- If you don't have a backend yet, use: `http://localhost:3000/api`

**Step 6: Open the App**
- **Easy way**: Right-click on `public/index.html` and open with your browser
- **Better way**: Install "Live Server" extension in VS Code, then right-click `index.html` and select "Open with Live Server"

### 🎉 You're Done!
The app should now open in your browser. If you see the ClockIn homepage, congratulations! 🎊

## ⚠️ Common Problems & How to Fix Them

*Don't worry if something goes wrong! Here are the most common issues and simple solutions:*

### 🔧 "I can't log in" or "Login doesn't work"
**What's happening**: Your login token might be old or the backend server isn't running
**How to fix it**: 
1. Press F12 in your browser → go to "Application" tab → "Local Storage" → clear everything
2. Try logging in again
3. Make sure your backend server is running (ask your teammate who set it up!)

### 🔧 "The page says 'CORS error' or won't load data"
**What's happening**: Your browser is blocking requests for security reasons
**How to fix it**:
1. Don't open the HTML file directly (avoid file:// in the address bar)
2. Use Live Server in VS Code instead
3. Make sure your backend allows requests from your frontend

### 🔧 "Dark mode keeps switching back to light mode"
**What's happening**: The app can't remember your theme choice
**How to fix it**:
1. Make sure `dark.js` file is in your project
2. Check if your browser allows the site to store data (look for a shield icon in address bar)
3. Try refreshing the page

### 🔧 "The calendar is empty or looks broken"
**What's happening**: The calendar can't get data or JavaScript files aren't loading properly
**How to fix it**:
1. Check if your backend is running and accessible
2. Open browser developer tools (F12) and look for red error messages
3. Make sure all JavaScript files are linked correctly in your HTML

### 🔧 "The design looks ugly/broken"
**What's happening**: The CSS styles aren't loading properly
**How to fix it**:
1. Run `npm run build-css` in your terminal again
2. Check if `build/tailwind.css` file exists in your project
3. Make sure the CSS file is linked in your HTML files

### 🆘 Still Having Problems?
1. **Check the browser console**: Press F12 → "Console" tab → look for red error messages
2. **Ask your team**: Your teammates might have faced the same issue
3. **Start fresh**: Delete the project folder and follow the setup steps again


