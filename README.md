# 🚀 Taskify – Your Smart Task Management Companion

![MERN Stack](https://img.shields.io/badge/Stack-MERN-informational?style=flat-square&logo=mongodb&logoColor=white&color=4DB33D)
![Responsive](https://img.shields.io/badge/UI-Mobile%20Responsive-blueviolet?style=flat-square)

> A comprehensive, intuitive, and collaborative task management solution built using the MERN stack.

**Taskify** is designed to streamline your workflow, boost team productivity, and keep all your tasks organized. Whether you're handling personal tasks or leading a collaborative project, this app equips you with all the tools you need to stay on track.

---

## ✨ Features

### 🧑‍💻 User Dashboard  
Get a personalized overview of tasks, monitor progress, and gain valuable insights — all in one place.

### ✅ Intuitive Task Management  
Create, update, delete, and organize tasks with:
- Due dates  
- Priority levels  
- Descriptions  
- Checklists

### 🔁 Automated Status Updates  
Tasks automatically update their status based on checklist completion. No manual intervention needed!

### 🤝 Team Collaboration  
Assign tasks to multiple team members and track team-wide progress in real time.

### 🔥 Priority & Progress Tracking  
- Visual indicators for task completion  
- Categories: High, Medium, Low urgency  
- Never miss a critical task again

### 📥 Task Report Downloads  
Export task data in CSV/JSON format for:
- Analysis  
- Presentations  
- Record-keeping

### 📎 Attachment Support  
Easily link task-related files and documents within the task details.

### 📱 Mobile-Responsive UI  
Enjoy a seamless experience on desktop, tablet, or mobile devices.

### 🧭 Clean Navigation  
Sidebar with simple routing to dashboard, tasks, reports, and settings.

---

## 🛠️ Technologies Used

| Stack       | Technology                       |
|-------------|----------------------------------|
| **Frontend**| React.js, CSS/Bootstrap          |
| **Backend** | Node.js, Express.js              |
| **Database**| MongoDB with Mongoose            |
| **Auth**    | JWT for secure login/session     |
| **Extras**  | Multer (for file uploads), dotenv|

---

## 🚀 Getting Started

### ✅ Prerequisites

Make sure the following are installed:

- **Node.js** (LTS version)
- **MongoDB** (local or Atlas cloud)
- **Git**

---

### 📦 Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/your-username/task-manager.git
cd task-manager
```

#### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

#### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

### ⚙️ Configuration

#### Create a .env file inside the backend directory with the following:

```bash
PORT=8000
MONGO_URI=< your_mongodb_connection_string >
JWT_SECRET=< your_super_secret_key >
ADMIN_INVITE_TOKEN=4588944
```
Replace your_mongodb_connection_string with your MongoDB URI
Example: mongodb://localhost:27017/taskmanager or MongoDB Atlas URI

---

### ▶️ Running the Application

#### Start the Backend Server

```bash
cd backend
npm start
```

#### Start the Frontend Client

```bash
cd frontend
npm start
```

---

### 📖 Usage Guide

- 🔐 Register/Login: Create a new account or log in.
- 🧭 Dashboard: View assigned tasks, completion rate, and quick stats.
- ✍️ Task Management: Create new tasks, assign users, and update task status.
- 🤝 Collaboration: Invite and manage team members.
- 📊 Reports: Export your tasks and progress for reports.

---

### 🚀 Output
[Taskify.pdf](https://github.com/user-attachments/files/20648733/Taskify.pdf)
