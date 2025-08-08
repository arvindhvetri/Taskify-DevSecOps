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

## WorkFlow
<img width="1920" height="1080" alt="Workflow1" src="https://github.com/user-attachments/assets/6efc10b3-e9ee-421b-82b8-adcde84407d0" />


---

## 🛠️ Technologies Used

| Stack                  | Technology                                       |
| ---------------------- | ------------------------------------------------ |
| **Frontend**           | React.js ⚛️, CSS 🎨 / Bootstrap 🎀               |
| **Backend**            | Node.js 🌐, Express.js 🚀                        |
| **Database**           | MongoDB 🍃                        |
| **Auth**               | JWT 🔐 for secure login/session                  |
| **Extras**             | Multer 📦 (file uploads), dotenv 🛠️ (env vars)  |
| **Security & Quality** | OWASP 🛡️, SonarQube 📊, Trivy 🔍                |
| **CI/CD & DevOps**     | Jenkins 🤖, Docker 🐳, Docker Compose ⚙️, AWS ☁️ |


---

## 🚀 Getting Started

### 🔍 SonarQube Setup
Run SonarQube
```bash
docker run -itd --name sonarqube-server -p 9000:9000 sonarqube:lts-community
```
Visit: `http://<agent-ip>:9000`
- Username: admin
- Password: admin
- Change password & generate token

### Jenkins Integration:
Plugins:
- SonarQube Scanner
- Sonar Quality Gates
- OWASP Dependency-Check
- Docker
Go to Jenkins -> Manage Jenkins -> System:
- Add SonarQube server
  - Name: Sonar
  - URL: `http://<agent-ip>:9000`
  - Auth Token: add secret text using generated token
Go to Jenkins -> Tools:
- SonarQube Scanner: Name: Sonar, Version: latest
- Dependency-Check: Name: Depcheck, enable auto-install

### 🔐 Trivy Setup (Security Scanning)
```bash
sudo apt-get install wget apt-transport-https gnupg lsb-release
wget -qO - https://aquasecurity.github.io/trivy-repo/deb/public.key | gpg --dearmor | sudo tee /usr/share/keyrings/trivy.gpg > /dev/null
echo "deb [signed-by=/usr/share/keyrings/trivy.gpg] https://aquasecurity.github.io/trivy-repo/deb $(lsb_release -sc) main" | sudo tee -a /etc/apt/sources.list.d/trivy.list
sudo apt-get update
sudo apt-get install trivy
```
### 🧪 Pipeline Configuration
- Pipeline Description: CI/CD DevSecOps for Taskify
- GitHub Project: `<Your-Repo-Link>`
- Enable Throttle Builds
- Advanced: Display name: Taskify Docker CICD

✅ Now you're all set to run your full DevSecOps CI/CD pipeline for Taskify!

---

### 📖 Usage Guide

- 🔐 Register/Login: Create a new account or log in.
- 🧭 Dashboard: View assigned tasks, completion rate, and quick stats.
- ✍️ Task Management: Create new tasks, assign users, and update task status.
- 🤝 Collaboration: Invite and manage team members.
- 📊 Reports: Export your tasks and progress for reports.

