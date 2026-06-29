# 💬 Real-Time Chat Application

A full-stack real-time chat application built with the **MERN stack**, **Socket.io**, and **Tailwind CSS**. Features instant bi-directional messaging, online status tracking, image sharing, and secure JWT authentication.

🔗 **Live Demo:** [chat-app-pi-three-44.vercel.app](https://chat-app-pi-three-44.vercel.app)

---

## ✨ Features

- 🔐 **Secure Authentication** — JWT-based login and signup with protected routes
- ⚡ **Real-Time Messaging** — Instant bi-directional messaging powered by Socket.io
- 🟢 **Online Status** — Live online/offline indicator for all users
- 🖼️ **Image Sharing** — Send images in chat via Cloudinary integration
- 🔔 **Unread Message Badge** — See unread message count per conversation
- 👤 **Edit Profile** — Update profile picture and display name
- 📱 **Responsive UI** — Clean dark-themed interface built with Tailwind CSS

---

## 🛠️ Tech Stack

**Frontend**
- React.js
- Tailwind CSS
- Socket.io Client
- React Context API (state management)
- Axios

**Backend**
- Node.js + Express.js
- MongoDB + Mongoose
- Socket.io
- JWT (JSON Web Tokens)
- Cloudinary (image uploads)

**Deployment**
- Frontend → Vercel
- Backend → Render

---

## 📁 Folder Structure

```
Chat-App/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── context/        # AuthContext, ChatContext
│   │   ├── pages/          # Login, Signup, Home
│   │   └── assets/
│   └── package.json
└── server/                 # Node.js backend
    ├── controllers/        # userController, messageController
    ├── models/             # User, Message schemas
    ├── routes/             # Auth and message routes
    ├── lib/                # db.js, socket.js, cloudinary.js
    ├── middleware/         # JWT auth middleware
    └── server.js
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js
- MongoDB Atlas account
- Cloudinary account

### Backend

```bash
cd server
npm install
```

Create `server/.env`:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173
PORT=5000
```

```bash
npm run dev
```

### Frontend

```bash
cd client
npm install
```

Create `client/.env`:
```env
VITE_BACKEND_URL=http://localhost:5000
```

```bash
npm run dev
```

---

## 🚀 Deployment

| Service | Platform | URL |
|---------|----------|-----|
| Frontend | Vercel | [chat-app-pi-three-44.vercel.app](https://chat-app-pi-three-44.vercel.app) |
| Backend | Render | Auto-deployed from GitHub |

---

## 📸 Architecture

- **MVC pattern** on the backend with separate controllers for users and messages
- **Socket.io** server initialized in a separate module to avoid circular dependencies
- **React Context** for global auth and chat state management
- **Cloudinary** for reliable media storage and delivery
