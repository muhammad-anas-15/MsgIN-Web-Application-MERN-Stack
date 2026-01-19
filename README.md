# 💬 MsgIN - Real-Time Chat Application

> *Connect. Chat. Create memories.*

[**🚀 View Live Demo**](https://msgin-client.vercel.app)

---

## 📖 Table of Contents

* [About the Project](#-about-the-project)
* [Key Features](#-key-features)
* [Tech Stack](#-tech-stack)
* [Getting Started](#-getting-started)
* [API Reference](#-api-reference)
* [Contributing](#-contributing)
* [Contact](#-contact)
* [Project Structure](#-project-structure)

---

## 📄 About the Project

**MsgIN** is a modern **real-time messaging application** built with the **MERN Stack**. It delivers a smooth and instant chat experience with features such as real-time messaging, online user presence, secure authentication, and media sharing.

Designed with a **mobile-first approach** using **Tailwind CSS**, MsgIN ensures a clean, responsive, and intuitive UI across all devices.

---

## ✨ Key Features

* **⚡ Real-Time Messaging** – Instant communication powered by **Socket.io**
* **🟢 Online Presence** – View real-time online/offline user status
* **🔐 Secure Authentication** – JWT-based login/signup with HTTP-only cookies
* **📷 Media Sharing** – Send and receive images using **Cloudinary**
* **🎨 Modern UI/UX** – Responsive interface built with React & Tailwind CSS
* **🛡️ Global State Management** – Efficient state handling using **Zustand**

---

## 🛠 Tech Stack

| Layer              | Technologies                               |
| ------------------ | ------------------------------------------ |
| **Frontend**       | React.js, Vite, Tailwind CSS, Lucide React |
| **Backend**        | Node.js, Express.js, Socket.io             |
| **Database**       | MongoDB, Mongoose                          |
| **Authentication** | JWT, BCrypt.js                             |
| **Media Storage**  | Cloudinary                                 |
| **Deployment**     | Vercel                                     |

---

## 🚀 Getting Started

Follow the steps below to run **MsgIN** locally on your machine.

### Prerequisites

* Node.js (v18 or higher)
* MongoDB Atlas account
* Cloudinary account

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/muhammad-anas-15/MsgIN.git
cd MsgIN
```

#### 2. Install Backend Dependencies

```bash
cd server
npm install
```

#### 3. Install Frontend Dependencies

```bash
cd ../client
npm install
```

#### 4. Run the Project (Two Terminals)

**Terminal 1 – Backend**

```bash
cd server
npm run dev
```

**Terminal 2 – Frontend**

```bash
cd client
npm run dev
```

#### 5. Access the Application

Open your browser and navigate to:

```
http://localhost:5173
```

---

## 📡 API Reference

### Authentication

| Method | Endpoint           | Description             |
| ------ | ------------------ | ----------------------- |
| POST   | `/api/auth/signup` | Register a new user     |
| POST   | `/api/auth/login`  | Login user & set cookie |
| POST   | `/api/auth/logout` | Logout user             |
| GET    | `/api/auth/check`  | Verify user session     |

### Messages

| Method | Endpoint                 | Description                 |
| ------ | ------------------------ | --------------------------- |
| GET    | `/api/messages/users`    | Get sidebar users           |
| GET    | `/api/messages/:id`      | Get chat with specific user |
| POST   | `/api/messages/send/:id` | Send text or image message  |

---

## 🤝 Contributing

Contributions are welcome and appreciated.

1. Fork the project
2. Create your feature branch

   ```bash
   git checkout -b feature/NewFeature
   ```
3. Commit your changes

   ```bash
   git commit -m "Add NewFeature"
   ```
4. Push to the branch

   ```bash
   git push origin feature/NewFeature
   ```
5. Open a Pull Request

---

## 📬 Contact

**Muhammad Anas**

* GitHub: https://github.com/muhammad-anas-15
* Email: muhammadannas.2356@gmail.com

---

## 📂 Project Structure

This project follows a **Monorepo** structure containing both client and server.

```bash
MsgIN/
├── client/                  # React Frontend
│   ├── src/
│   │   ├── components/      # ChatContainer, Sidebar, RightSidebar
│   │   ├── lib/             # Utilities (Axios, helpers)
│   │   ├── pages/           # Home, Login, Profile
│   │   ├── store/           # Zustand State Management
│   │   └── App.jsx          # Main App Component
│   ├── .env                 # Frontend Environment Variables
│   └── vite.config.js       # Vite Configuration
│
├── server/                  # Node.js Backend
│   ├── controllers/         # Auth & Message Controllers
│   ├── lib/                 # DB, Cloudinary, Socket Setup
│   ├── middleware/          # Auth Middleware
│   ├── models/              # Mongoose Schemas
│   ├── routes/              # API Routes
│   ├── server.js            # Server Entry Point
│   └── .env                 # Backend Environment Variables
└── README.md                # Project Documentation
```
