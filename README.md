# 🚔 Crime Record Management System

A full-stack web application for managing and maintaining crime records digitally. The system helps law enforcement agencies store, update, and retrieve criminal records efficiently through a user-friendly interface.

## 📌 Features

- 🔐 Secure user authentication and login
- 👮 Add, update, and delete criminal records
- 🔍 Search and filter crime records
- 📋 View detailed information about criminals and cases
- 📊 Dashboard for crime data management
- 🌐 RESTful API integration between frontend and backend
- 📱 Responsive user interface

## 🛠️ Tech Stack

### Frontend
- React.js
- JSX
- HTML5
- CSS3
- JavaScript
- Axios (for API calls)

### Backend
- Spring Boot
- Spring Web
- Spring Data JPA
- Hibernate
- Maven

### Database
- MySQL

### Version Control
- Git
- GitHub

## 📂 Project Structure

```text
crimerecordsystem/
├── Backened/      # Spring Boot Backend
│   ├── src/
│   ├── pom.xml
│   └── ...
│
├── Frontened/     # React Frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
└── README.md
```

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone git@github.com:sumit-1299/crimerecordsystem.git
cd crimerecordsystem
```

### 2️⃣ Backend Setup (Spring Boot)

```bash
cd Backened
mvn clean install
mvn spring-boot:run
```

The backend server will start at:

```
http://localhost:8080
```

### 3️⃣ Frontend Setup (React)

Open a new terminal:

```bash
cd Frontened
npm install
npm start
```

The frontend application will start at:

```
http://localhost:3000
```

## 🔗 API Integration

The React frontend communicates with the Spring Boot backend using REST APIs. Make sure the backend server is running before starting the frontend.

Example API Endpoint:

```
GET    /api/crimes
POST   /api/crimes
PUT    /api/crimes/{id}
DELETE /api/crimes/{id}
```

## 💾 Database Configuration

Configure your MySQL database credentials in:

```
Backened/src/main/resources/application.properties
```

Example:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/crime_record_db
spring.datasource.username=root
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

## 🚀 Future Enhancements

- Role-based access control (Admin/Officer)
- Case status tracking
- Crime statistics and analytics dashboard
- PDF report generation
- Image/document upload for evidence
- Email notifications
- JWT authentication and authorization

## 🤝 Contributing

Contributions are welcome! Feel free to fork the repository and submit a pull request for improvements or bug fixes.

## 📄 License

This project is developed for educational and learning purposes.

## 👨‍💻 Author

**Sumit Chaurasia**

- GitHub: https://github.com/sumit-1299

---

⭐ If you found this project useful, consider giving it a star on GitHub!
