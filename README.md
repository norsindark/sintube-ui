# Sintube UI

A modern YouTube-inspired frontend built with React and TypeScript, designed to integrate with a Spring Boot-based HLS streaming backend.

This project focuses on clean UI architecture, scalable state management, and seamless API integration for a video streaming platform.

---

## 🚀 Features

* Authentication UI (Login / Register / Logout)
* Video browsing (Home, categories, search)
* Video detail page (player, comments, related videos)
* User profile page
* Responsive layout (desktop + mobile)
* Dark / Light mode (via theme system)
* Mock data support (for UI development without backend)

---

## 🛠️ Tech Stack

* React + TypeScript
* Vite
* TailwindCSS (v4)
* Zustand (state management)
* React Hook Form + Zod (form validation)
* Axios (API client)
* Radix UI (accessible components)

---

## 📦 Project Structure

```
src/
  components/     # Reusable UI components
  features/       # Feature-based modules (auth, video, profile)
  services/       # API services
  store/          # Zustand stores
  lib/            # Utilities (api client, helpers)
  pages/          # Route pages
```

---

## ⚙️ Setup

### 1. Install dependencies

```bash
npm install
```

---

### 2. Environment variables

Create a `.env` file in the root:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

---

### 3. Run development server

```bash
npm run dev
```

App will run at:

```
http://localhost:5173
```

---

## 🧪 Development Notes

* Mock data is used by default for UI development
* Replace mock services with real API calls in `services/`
* Axios instance supports token-based authentication via interceptors

---

## 🐳 Docker (optional)

Build:

```bash
docker build -t sintube-ui .
```

Run:

```bash
docker run -p 3000:3000 sintube-ui
```

---

## 🎯 Goals

* Practice modern React architecture
* Integrate frontend with a real streaming backend
* Build a production-like UI system

---

## 📌 Status

🚧 In development — actively improving features and API integration

---

## 👤 Author

Side project by SinD
