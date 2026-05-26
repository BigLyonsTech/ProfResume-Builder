# 📄 Resume Builder

A professional full-stack Resume Builder — **Spring Boot** backend + **React** frontend.

## 🚀 Quick Start

### 1. Start the Backend
```bash
cd backend
./mvnw spring-boot:run
```
Runs on → **http://localhost:8080**
H2 Console → **http://localhost:8080/h2-console** (JDBC URL: `jdbc:h2:mem:resumedb`, user: `sa`, password: blank)

### 2. Start the Frontend
```bash
cd frontend
npm install
npm run dev
```
Opens → **http://localhost:3000**

---

## 📁 Project Structure
```
resume-builder/
├── backend/                          ← Spring Boot (Maven)
│   ├── pom.xml
│   └── src/main/java/com/resumebuilder/
│       ├── ResumeBuilderApplication.java
│       ├── config/        CorsConfig.java
│       ├── model/         Resume, PersonalInfo, Education, Experience, Skill, Signature + enums
│       ├── repository/    6 JPA repositories
│       ├── service/       7 service classes
│       ├── controller/    6 REST controllers
│       └── exception/     4 exception classes + GlobalExceptionHandler
│
└── frontend/                         ← React + Vite
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx
        └── App.jsx
```

---

## 🛠️ Tech Stack
| Layer      | Technology                        |
|------------|-----------------------------------|
| Backend    | Spring Boot 3.2, Spring Data JPA  |
| Database   | H2 (in-memory)                    |
| Validation | Bean Validation (Jakarta)         |
| PDF        | iText 7                           |
| Frontend   | React 18, Vite 5                  |
| Fonts      | Cormorant Garamond + Outfit       |

---

## 📋 API Endpoints
```
POST/GET/PUT/DELETE  /api/resumes
POST/GET/PUT/DELETE  /api/resumes/{id}/personal-info
POST/GET/PUT/DELETE  /api/resumes/{id}/educations
POST/GET/PUT/DELETE  /api/resumes/{id}/experiences
POST/GET/PUT/DELETE  /api/resumes/{id}/skills
POST/GET/PUT/DELETE  /api/resumes/{id}/signature
GET                  /api/resumes/{id}/pdf
```
