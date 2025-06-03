## 2. Apidevto (Node/Express Backend)

### Table of Contents

1. [Project Overview](#project-overview-api)
2. [Tech Stack](#tech-stack-api)
3. [Features](#features-api)
4. [Getting Started](#getting-started-api)
5. [Environment Variables](#environment-variables-api)
6. [API Reference](#api-reference)
7. [Socket.IO Events](#socketio-events)
8. [Folder Structure](#folder-structure-api)
9. [Available Scripts](#available-scripts-api)
10. [License](#license-api)

### Project Overview <a name="project-overview-api"></a>

**Apidevto** is the REST & WebSocket API that powers the Front‑Devto UI.  Built with **Express 5** and **MongoDB**, it implements secure authentication, rich post handling, and real‑time updates.

### Tech Stack <a name="tech-stack-api"></a>

* **Runtime:** Node.js 20+
* **Framework:** Express 5 + express‑async‑errors
* **Database:** MongoDB 6 (Mongoose ODM)
* **Auth:** JWT, bcrypt, cookie‑parser
* **File Uploads:** `multer` + Cloudinary SDK
* **Realtime:** Socket.IO 4
* **Testing:** Vitest / Supertest
* **Lint/Format:** ESLint + Prettier
* **Docs:** Swagger (OpenAPI 3) (endpoint `/api-docs`)

### Features <a name="features-api"></a>

* **User accounts** – register, login, refresh, user profile CRUD
* **Posts** – create, read, update, delete; markdown body; slug generation; cover images
* **Reactions** – one‑per‑user‑per‑emoji, stored as `{ user, emoji }` array in `Post.reactions`
* **Comments** – nested, editable
* **Tags** – extracted & cached trending tags
* **Search** – MongoDB text‑index on title + tags + body
* **Notifications** – real‑time via Socket.IO
* **Rate‑limiting** & basic security middlewares (helmet, cors, xss‑clean)

### Getting Started <a name="getting-started-api"></a>

```bash
# 1. Clone & install
$ git clone https://github.com/ElderL99/Apidevto.git && cd Apidevto
$ pnpm install   # or npm/yarn

# 2. Configure env
$ cp .env.example .env   # fill variables below

# 3. Seed optional sample data
$ pnpm seed   # creates sample users & posts (script in package.json)

# 4. Run in dev mode
$ pnpm dev   # nodemon + ts-node (if TypeScript)
```

#### Environment Variables <a name="environment-variables-api"></a>

| Variable                | Description                        | Example                           |
| ----------------------- | ---------------------------------- | --------------------------------- |
| `PORT`                  | Server port                        | `5000`                            |
| `MONGODB_URI`           | MongoDB connection string          | `mongodb://localhost:27017/devto` |
| `JWT_SECRET`            | Secret key for signing tokens      | `superSecret42`                   |
| `JWT_EXPIRES_IN`        | Token lifetime                     | `7d`                              |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account                 | `devto-clone`                     |
| `CLOUDINARY_API_KEY`    | Cloudinary key                     | `123456`                          |
| `CLOUDINARY_API_SECRET` | Cloudinary secret                  | `abcXYZ`                          |
| `CLIENT_ORIGIN`         | Frontend origin for CORS + cookies | `http://localhost:3000`           |

*(Confirm exact names in `config/` directory)*

### API Reference <a name="api-reference"></a>

> **Base URL:** `/api`

#### Auth

| Method | Path             | Body                            | Notes                        |
| ------ | ---------------- | ------------------------------- | ---------------------------- |
| `POST` | `/auth/register` | `{ username, email, password }` | Creates new user             |
| `POST` | `/auth/login`    | `{ email, password }`           | Returns JWT + refresh cookie |
| `GET`  | `/auth/me`       | -                               | Get current user             |

#### Posts

| Method   | Path                 | Notes                          |
| -------- | -------------------- | ------------------------------ |
| `GET`    | `/posts`             | Pagination via `?page=&limit=` |
| `POST`   | `/posts`             | Auth required (Bearer)         |
| `GET`    | `/posts/:slug`       | Single post                    |
| `PUT`    | `/posts/:id`         | Owner only                     |
| `DELETE` | `/posts/:id`         | Owner only                     |
| `POST`   | `/posts/:id/react`   | `{ emoji }`                    |
| `POST`   | `/posts/:id/comment` | `{ body }`                     |

#### Tags & Search

| Method | Path                 | Notes                 |
| ------ | -------------------- | --------------------- |
| `GET`  | `/posts/tags`        | Trending tags         |
| `GET`  | `/posts/by-tag/:tag` | Posts filtered by tag |
| `GET`  | `/search`            | `?q=javascript`       |

*(Document the rest of the routes: profiles, bookmarks, etc.)*

### Socket.IO Events <a name="socketio-events"></a>

| Event             | Payload                    | From → To          | Purpose                     |
| ----------------- | -------------------------- | ------------------ | --------------------------- |
| `post:created`    | `PostDTO`                  | Server → All       | Push new post into timeline |
| `post:reacted`    | `{ postId, emoji, count }` | Server → All       | Update reaction counters    |
| `comment:created` | `CommentDTO`               | Server → Post‑room | Live comment list           |

*(See `src/socket/index.js` for full list)*

### Folder Structure <a name="folder-structure-api"></a>

```
src/
 ├─ controllers/   # Route handlers
 ├─ routes/        # Express routers (auth, posts, tags, users)
 ├─ models/        # Mongoose schemas
 ├─ middlewares/   # auth, errorHandler, rateLimiter, upload
 ├─ socket/        # Socket.IO server setup
 ├─ utils/         # helper functions (slugify, asyncWrapper…)
 ├─ config/        # env & third‑party configs
 ├─ tests/         # Vitest test suites
 └─ server.js      # Entry point
```

### Available Scripts <a name="available-scripts-api"></a>

| Script   | Purpose                               |
| -------- | ------------------------------------- |
| `dev`    | Run with Nodemon + hot reload         |
| `start`  | Run compiled JS (or `node server.js`) |
| `seed`   | Seed sample database data             |
| `test`   | Run unit/integration tests            |
| `lint`   | ESLint                                |
| `format` | Prettier write                        |

### License <a name="license-api"></a>

Distributed under the **MIT License** — see [`LICENSE`](LICENSE) for details.

---

> **Tip** ✏️  Replace every **placeholder** (`TODO:`) with real values from your codebase—endpoint list, screenshots, env variables, etc.  Feel free to ask for refinements or extra sections!
