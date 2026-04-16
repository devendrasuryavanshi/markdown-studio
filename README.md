# Markdown Studio

Markdown Studio is a powerful, web-based markdown editor designed for developers and technical writers who require a high-fidelity preview and professional PDF export capabilities.

Live Demo: [https://markdown-studio.onrender.com/](https://markdown-studio.onrender.com/)

---

## Quick Navigation

| Section | Description |
| :--- | :--- |
| [Features](#features) | Core capabilities of the platform |
| [Technology Stack](#technology-stack) | Modern tools used to build this application |
| [Local Setup](#local-setup) | Instructions for running the project on your machine |
| [Architecture](#architecture) | Overview of the backend and frontend structure |

---

## Features

- **Real-time Rendering**: Instant preview of markdown content with support for GFM (GitHub Flavored Markdown).
- **Professional PDF Export**: Generate high-quality PDF documents with optimized typography and layouts.
- **Dynamic Themes**: Seamlessly switch between dark and light modes with a polished UI.
- **Smart Formatting**: Support for tables, code syntax highlighting, task lists, and blockquotes.
- **Responsiveness**: Fully responsive interface that works across devices.

---

## Technology Stack

### Frontend
- **React 19**: Core UI library for high-performance rendering.
- **Vite**: Modern build tool for fast development and optimized production bundles.
- **Motion**: Advanced animation library for smooth UI transitions.
- **Lucide React**: Premium icon set for consistent visual language.

### Backend
- **Express.js**: Lightweight server for handling API requests and server-side logic.
- **Puppeteer**: Automated browser environment for generating high-fidelity PDF exports.
- **Render.com**: Primary cloud environment for application deployment.

---

## Local Setup

Follow these steps to set up the development environment on your local machine.

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/devendrasuryavanshi/markdown-studio.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root directory and add your configuration (refer to `.env.example`).

4. Start Development Server:
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

---

## Architecture

The project follows a modular architecture:
- `/src`: Frontend React components and styles.
- `/api`: Express.js server routes and PDF generation logic.
- `/app`: Application entry point and layout configuration.

---

&copy; 2026 Markdown Studio. All rights reserved.
