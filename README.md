# CSC/ECE 517 Fall 2024 - E2461: UI for Courses Management

## Overview
This project focuses on enhancing the UI for managing courses within Expertiza, an open-source learning management system built on Ruby on Rails. The Courses Management UI has been redesigned using React and TypeScript to offer a more user-friendly and responsive interface for administrators.

## Contents
1. [About](#about)
2. [Design Goals](#design-goals)
3. [Design Patterns](#design-patterns)
4. [Files Modified](#files-modified)
5. [Reimplementation Details](#reimplementation-details)
6. [Test Plan](#test-plan)
7. [Team](#team)

## About
The project reimplements the Courses Management Page in React and TypeScript, designed for admin access. It enables admins to view, add, edit, delete, duplicate courses, and manage TAs, presenting information in a paginated table with options for quick actions.

Key features include:
- **Responsive Design**: Consistent UI across devices.
- **Enhanced Functionality**: Streamlined course and TA management.
- **Performance Optimization**: Faster load times and smoother interactions.

## Design Goals
This project aims to:
- **Optimize Usability**: Simplify course navigation and management.
- **Ensure Responsiveness**: Maintain functionality across device types.
- **Enhance Performance**: Refactor code to improve efficiency.
- **Implement Role-Based Access**: Restrict specific actions to admins.

## Design Patterns
1. **Single Responsibility Principle (SRP)**: Each method handles a specific task, improving maintainability.
2. **Separation of Concerns (SoC)**: Cleanly separates data handling and UI logic.
3. **Observer Pattern**: Used for handling UI updates with `useEffect`.
4. **Template Method Pattern**: Reusable templates for modals and alerts.

## Files Modified
- `Course.tsx`: Displays course listings with actions.
- `CourseColumns.tsx`: Defines table columns and configurations.
- `CourseCopy.tsx`: Handles course duplication modal.
- `CourseDelete.tsx`: Manages course deletion with confirmation.
- `CourseEditor.tsx`: Modal for adding/editing courses.
- `CourseUtil.tsx`: Utility functions for course data handling.

## Reimplementation Details
Several methods were refactored for enhanced readability and modularity:
- **`handleInstitutionChange`**: Modularized alert and navigation logic.
- **`showModal`**: Reusable modal display utility.
- **`copyHandler`**: Optimized for interface segregation by focusing on `courseId`.
- **`handleDeleteSuccess`**: Consolidates delete success logic for flexibility.

## Test Plan
Tests cover UI components, data handling, and user interactions to ensure all functionalities, including modals, buttons, and filters, work as expected across devices.

## Team
- **Members**: Suraj Raghu Kumar, Harshvardhan Patil, Yuktasree Muppala
