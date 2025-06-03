# Dev.to Clone — README Files

> **Repository links**
> Frontend ▶︎ [`Front-Devto`](https://github.com/ElderL99/Front-Devto) • Backend ▶︎ [`Apidevto`](https://github.com/ElderL99/Apidevto)

---

## 📦 `Front-Devto` —— Next.js Frontend

![Next.js](https://img.shields.io/badge/Next.js-14-000?logo=nextdotjs\&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind%20CSS-^3-38bdf8?logo=tailwindcss\&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

### ✨ Demo / Screenshots

| Desktop                     | Mobile                      |
| --------------------------- | --------------------------- |
| *(replace with screenshot)* | *(replace with screenshot)* |

### 📖 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Key Features](#key-features)
4. [Quick Start](#quick-start)
5. [Environment Variables](#environment-variables)
6. [Scripts](#scripts)
7. [Folder Structure](#folder-structure)
8. [Contributing](#contributing)
9. [License](#license)

### 🗒️ Project Overview

A pixel-perfect **DEV Community** clone built with **Next.js (App Router)**, **React 18**, and **Tailwind CSS**.  It consumes the REST & WebSocket API provided by the companion **Apidevto** server.

### 🛠️ Tech Stack

* **Framework / Runtime:** Next.js 14 · React 18
* **Styling:** Tailwind CSS, Headless UI, Hero Icons
* **Data & State:** Axios + React Context, SWR (optional)
* **Auth:** JWT in `HttpOnly` cookies
* **Realtime:** `socket.io-client`
* **Markdown:** `markdown-it`, `rehype-highlight`
* **Tooling:** ESLint · Prettier · Husky + lint-staged · Vitest

### 🏹 Key Features

| -   | Feature           | Notes                                   |
| --- | ----------------- | --------------------------------------- |
| 🔑  | **Auth**          | Register • Login • Refresh • Logout     |
| 📝  | **Posts**         | CRUD, cover image upload, markdown body |
| ❤️  | **Reactions**     | Unique per-user-per-emoji               |
| 💬  | **Comments**      | Threaded, edit/delete own comments      |
| 🔍  | **Search**        | Debounced full-text search              |
| 🏷️ | **Tags**          | Trending list, filter by tag            |
| 🔔  | **Notifications** | Live via WebSockets                     |
| 📱  | **Responsive**    | Custom mobile nav & sidebar             |

### 🚀 Quick Start

```bash
# 1 · Clone the repo
$ git clone https://github.com/ElderL99/Front-Devto.git && cd Front-Devto

# 2 · Install deps
$ pnpm install   # or yarn/npm

# 3 · Config env
$ cp .env.example .env.local   # fill the variables

# 4 · Run dev server
$ pnpm dev   # http://localhost:3000
```

#### 🌎 Environment Variables

| Name                                   | Description      | Example                     |
| -------------------------------------- | ---------------- | --------------------------- |
| `NEXT_PUBLIC_API_BASE_URL`             | REST API base    | `http://localhost:5000/api` |
| `NEXT_PUBLIC_SOCKET_URL`               | WS endpoint      | `http://localhost:5000`     |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`    | Cloudinary cloud | `devto-clone`               |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Unsigned preset  | `devto_unsigned`            |

### 🗂️ Scripts

| Command      | Purpose                 |
| ------------ | ----------------------- |
| `pnpm dev`   | Start dev server        |
| `pnpm build` | Build production bundle |
| `pnpm start` | Serve built app         |
| `pnpm lint`  | ESLint                  |
| `pnpm test`  | Unit tests              |

### 🌳 Folder Structure (short)

```
/app              # App Router routes & layouts
/components       # Reusable UI components
/context          # React contexts (auth, theme…)
/hooks            # Custom hooks
/lib              # API client, socket.io, helpers
/public           # Static assets
/styles           # Tailwind base & utilities
```

### 🤝 Contributing

1. Fork → `git checkout -b feat/awesome`
2. Commit using **Conventional Commits** (`git cz`)
3. Push & open a PR

### 📄 License

Released under the **MIT License**.

---

## 🛠️ `Apidevto` —— Node/Express Backend

![Node.js](https://img.shields.io/badge/Node.js-20+-brightgreen?logo=node.js\&logoColor=white)
![Express](https://img.shields.io/badge/Express-5-000)
![MongoDB](https://img.shields.io/badge/MongoDB-6-47a248?logo=mongodb\&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

### 📖 Table of Contents

1. [Project Overview](#backend-project-overview)
2. [Tech Stack](#backend-tech-stack)
3. [Features](#backend-features)
4. [Getting Started](#backend-getting-started)
5. \[Environment Variables]\(#bac
