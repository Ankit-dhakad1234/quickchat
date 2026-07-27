# Quick Chat — A chat app

This is a from-scratch rebuild matching the structure and code patterns used in the
"Build a Full Stack Chat App with MERN + Socket.IO" tutorial, so you can follow along
with the video and compare file-for-file.

## Structure

```
quickchat/
├── server/     Express + Socket.IO + MongoDB (Mongoose) + Cloudinary
│   ├── lib/            db.js, cloudinary.js, utils.js (generateToken)
│   ├── models/         User.js, Message.js
│   ├── middleware/      auth.js (protectRoute)
│   ├── controllers/     userController.js, messageController.js
│   ├── routes/           userRoutes.js, messageRoutes.js
│   └── server.js         entry point, socket.io setup, userSocketMap
└── client/     React (Vite) + Tailwind
    ├── src/assets/        assets.js + original SVG icons (logo, avatar, etc.)
    ├── src/context/       AuthContext.jsx, ChatContext.jsx
    ├── src/pages/         HomePage.jsx, LoginPage.jsx, ProfilePage.jsx
    ├── src/components/    Sidebar.jsx, ChatContainer.jsx, RightSidebar.jsx
    └── src/lib/utils.js   formatMessageTime
```

## How the pieces map to the video

| Video term | Actual file/name |
|---|---|
| "O Context" / "O Provider" / "O User" | `AuthContext.jsx` / `AuthProvider` / `authUser` |
| "Chat Context" | `ChatContext.jsx` |
| "Add icon" (on signup form arrow) | `arrow_icon.svg` |
| Cloud Ner / Cloud Nary | Cloudinary |

The video's speech-to-text transcript garbled "Auth" as "O" throughout — e.g. "o
context", "o user", "o provider" are all "Auth Context", "authUser", "AuthProvider".

## Key differences from a "generic" MERN chat app

- **No separate `Conversation` model.** Every `Message` document just stores
  `senderId` and `receiverId` directly — conversations are derived on the fly with
  an `$or` query, not pre-created.
- **Auth header is a plain `token` key**, not `Authorization: Bearer <token>`.
  Set via `axios.defaults.headers.common["token"]`.
- **Socket connects with the user ID in the query string** (`io(url, { query: {
  userId } })`), not a JWT — the server just trusts whatever `userId` shows up
  in the handshake query. (Fine for a tutorial project; in production you'd
  want to verify a real token in the socket handshake instead.)
- **Unseen messages are a plain object** (`{ [userId]: count }`), computed by
  counting unseen `Message` documents per sender — no `seenBy` array on each
  message.
- **Images go through Cloudinary as base64**, not multipart/Multer — the
  frontend converts the file to a base64 string client-side with
  `FileReader`, and sends that whole string as JSON in the request body
  (hence the `express.json({ limit: "4mb" })` on the server).

## Setup

### 1. MongoDB Atlas
Create a free cluster, a database user, and allow network access from
anywhere (0.0.0.0/0) for local development. Copy the connection string.

### 2. Cloudinary
Sign up at cloudinary.com, grab your Cloud Name, API Key, and API Secret from
the dashboard.

### 3. Backend

```bash
cd server
cp .env.example .env
# fill in MONGODB_URI, JWT_SECRET, CLOUDINARY_* values
npm install
npm run server
```

Runs on `http://localhost:5000`. Visit `/api/status` to confirm it's live.

### 4. Frontend

```bash
cd client
npm install
npm run dev
```

Runs on `http://localhost:5173`. The `.env` already points
`VITE_BACKEND_URL` at `http://localhost:5000`.

## Note on the icon assets

The video uses a specific downloadable icon/image pack linked in its
description. I couldn't fetch or reproduce that exact pack, so every icon
here (`logo.svg`, `avatar_icon.svg`, `send_button.svg`, etc.) is an original,
simple SVG I drew that serves the same role — swap them for the real pack's
files any time without touching component code, since everything is
referenced through `assets.js`.
