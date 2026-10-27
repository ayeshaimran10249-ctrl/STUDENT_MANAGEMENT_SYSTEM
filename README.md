# 🎓 Student Management System

A full-stack web application designed to help training institutes manage students, courses, and student records through a simple and responsive dashboard.

## ✨ Features

- 📊 **Dashboard** — View total students, courses, active students, and recent enrollments.
- 👨‍🎓 **Student Management** — Add, view, edit, delete, and manage student records.
- 📚 **Course Management** — Create, update, view, and delete courses.
- 🔍 **Search & Filter** — Search students by name and filter records by course.
- ✅ **Form Validation** — Validate required fields before submitting data.
- 🔗 **REST API** — Connect the frontend with the backend using API endpoints.
- 🗄️ **Database Integration** — Store student and course records in MongoDB.
- 📱 **Responsive Design** — Use the application on desktop and mobile screens.

## 🛠️ Technologies Used

### Frontend
- React
- TypeScript
- Vite
- React Router
- Tailwind CSS
- Lucide React

### Backend
- Node.js
- Express.js
- REST API

### Database
- MongoDB
- Mongoose

### Tools
- Git and GitHub
- VS Code
- Vercel (frontend deployment)

## 📁 Project Structure

```text
student-management-system/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── .gitignore
│   └── server.js
│
├── .gitignore
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/student-management-system.git
cd student-management-system
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

Start the backend:

```bash
node server.js
```

The API will run at `http://localhost:5000`.

### 3. Set up the frontend

Open a separate terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed in your terminal to use the application.

## 🔌 API Endpoints

### Students

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/students` | Get all students |
| GET | `/api/students/:id` | Get a student by ID |
| POST | `/api/students` | Add a student |
| PUT | `/api/students/:id` | Update a student |
| DELETE | `/api/students/:id` | Delete a student |

### Courses

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/courses` | Get all courses |
| POST | `/api/courses` | Add a course |
| PUT | `/api/courses/:id` | Update a course |
| DELETE | `/api/courses/:id` | Delete a course |

## 🔐 Environment Variables

Keep your database credentials and secret configuration in `.env` files. Do not commit these files to GitHub.

## 🚀 Deployment

The frontend can be deployed on Vercel. The backend must also be hosted on a server that supports Node.js, and the frontend API URL must point to the deployed backend.

**Live Demo:** COMING SOON

## 👩‍💻 Author

**Ayesha Imran**

Student | Frontend Developer Learner

GitHub: https://github.com/ayeshaimran10249-ctrl

---

*Developed as a full-stack student management project for managing students and courses efficiently.*
