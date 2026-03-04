# YallaTn - Job Application Management System

A Spring Boot REST API for managing job applications with role-based access control.

## Features

### Authentication & Authorization
- User registration and login with BCrypt password hashing
- Session-based authentication with auto-expiry
- Role-based access control (ADMIN, TEACHER, USER/Student)
- Secure endpoints with role validation

### User Management
- Three user roles: ADMIN, TEACHER, USER (student)
- Admin can manage all users
- Students can view and rate teachers

### Job Management
- ADMIN can create, update, and close job postings
- Jobs have title, places available, description, requirements, and deadline
- Status tracking (OPEN/CLOSED)

### Application System
- TEACHERS can apply to jobs
- File upload support for CVs and certificates
- Application status tracking (PENDING/ACCEPTED/REJECTED)
- ADMIN can review and update application statuses

### Meeting Scheduling
- ADMIN can schedule meetings for applications
- Assign evaluators (ADMIN or TEACHER) to meetings
- Evaluators can view their assigned meetings

### Rating System
- STUDENTS can rate TEACHERS (1-5 stars)
- Add comments with ratings
- View average ratings for teachers

## Technology Stack

- **Java 17**
- **Spring Boot 4.0.2**
- **Spring Data JPA**
- **Spring Security**
- **H2 Database** (in-memory for development)
- **BCrypt** for password hashing
- **Lombok** for boilerplate reduction
- **Bean Validation** for input validation

## Getting Started

### Prerequisites
- Java 17 or higher
- Maven 3.6+

### Installation

1. Navigate to the project directory:
```bash
cd yallaTn
```

2. Build the project:
```bash
mvn clean install
```

3. Run the application:
```bash
mvn spring-boot:run
```

The application will start on `http://localhost:8082` (MySQL). Ensure MySQL is running and the `learnivo` database exists or will be created.

### Default Users

The application creates three default users on startup:

| Role    | Email                  | Password    |
|---------|------------------------|-------------|
| ADMIN   | admin@learnify.com      | admin123    |
| TEACHER | teacher@learnify.com    | teacher123  |
| USER    | student@learnify.com    | student123  |

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get session ID
- `POST /api/auth/logout` - Logout (requires Authorization header)
- `GET /api/auth/current-user` - Get current user info (requires Authorization header)

### Users
- `GET /api/users` - Get all users (ADMIN only)
- `GET /api/users/teachers` - Get all teachers (USER, ADMIN)
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user (ADMIN only)
- `DELETE /api/users/{id}` - Delete user (ADMIN only)

### Jobs
- `POST /api/jobs` - Create job (ADMIN only)
- `GET /api/jobs` - Get all jobs (ADMIN, TEACHER)
- `GET /api/jobs/open` - Get open jobs (ADMIN, TEACHER)
- `GET /api/jobs/{id}` - Get job by ID
- `PUT /api/jobs/{id}` - Update job (ADMIN only)
- `PUT /api/jobs/{id}/close` - Close job (ADMIN only)
- `DELETE /api/jobs/{id}` - Delete job (ADMIN only)

### Applications
- `POST /api/applications` - Create application with file upload (TEACHER only)
- `GET /api/applications` - Get all applications (ADMIN only)
- `GET /api/applications/job/{jobId}` - Get applications by job (ADMIN only)
- `GET /api/applications/my-applications` - Get my applications (TEACHER only)
- `GET /api/applications/{id}` - Get application by ID
- `PUT /api/applications/{id}/status` - Update application status (ADMIN only)
- `DELETE /api/applications/{id}` - Delete application

### Meetings
- `POST /api/meetings` - Schedule meeting (ADMIN only)
- `GET /api/meetings` - Get all meetings (ADMIN only)
- `GET /api/meetings/my-meetings` - Get my meetings (ADMIN, TEACHER)
- `GET /api/meetings/{id}` - Get meeting by ID
- `GET /api/meetings/application/{applicationId}` - Get meeting by application
- `PUT /api/meetings/{id}` - Update meeting (ADMIN only)
- `DELETE /api/meetings/{id}` - Delete meeting (ADMIN only)

### Ratings
- `POST /api/ratings` - Create rating (USER only)
- `GET /api/ratings` - Get all ratings (ADMIN only)
- `GET /api/ratings/teacher/{teacherId}` - Get ratings for teacher
- `GET /api/ratings/teacher/{teacherId}/average` - Get average rating
- `GET /api/ratings/my-ratings` - Get my ratings (USER only)
- `GET /api/ratings/{id}` - Get rating by ID
- `PUT /api/ratings/{id}` - Update rating (USER only)
- `DELETE /api/ratings/{id}` - Delete rating (USER, ADMIN)

## Authentication Flow

1. **Register or Login**
   ```bash
   POST /api/auth/login
   {
     "email": "admin@learnify.com",
     "password": "admin123"
   }
   ```

2. **Receive Session ID**
   ```json
   {
     "message": "Login successful",
     "sessionId": "uuid-here",
     "user": {
       "id": 1,
       "name": "System Admin",
       "email": "admin@learnify.com",
       "role": "ADMIN"
     }
   }
   ```

3. **Use Session ID in Headers**
   ```
   Authorization: <sessionId>
   ```

## File Upload

For application submissions, use `multipart/form-data`:

```bash
POST /api/applications
Content-Type: multipart/form-data

application: {"jobId": 1, "motivation": "I am qualified..."}
cv: <file>
certificat: <file>
```

## Database

The application uses **MySQL** (database `learnivo`). Configure in `application.properties`:

- URL: `jdbc:mysql://localhost:3306/learnivo?createDatabaseIfNotExist=true&...`
- Default user: `root`, password: (empty)

### If you see "Tablespace exists" or "Table doesn't exist"

MySQL can leave orphaned tablespace files so Hibernate cannot create tables. Fix it in one of these ways:

1. **From the app (recommended):** Set in `application.properties`:
   ```properties
   learnivo.reset-db-on-startup=true
   ```
   Start the application once. It will drop and recreate the `learnivo` database, then create tables and seed users. Set the property back to `false` (or remove it) so the next run does not wipe data.

2. **Using dev profile:** Run with `-Dspring.profiles.active=dev` once. The dev profile sets `learnivo.reset-db-on-startup=true`. Then run without the profile to keep data.

3. **Manually in MySQL:** Run:
   ```sql
   DROP DATABASE IF EXISTS learnivo;
   CREATE DATABASE learnivo CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
   Then restart the application.

## Business Flow

1. **ADMIN** creates a Job posting
2. **TEACHERS** apply to the Job with CV and certificates
3. **ADMIN** reviews applications and updates status (ACCEPTED/REJECTED)
4. **ADMIN** schedules Meetings for selected applications
5. **ADMIN** assigns evaluators (ADMIN or TEACHER) to conduct meetings
6. **STUDENTS** can view and rate TEACHERS

## Role Permissions

| Feature                | ADMIN | TEACHER | USER (Student) |
|------------------------|-------|---------|----------------|
| Manage Jobs            | ✓     | ✗       | ✗              |
| Apply to Jobs          | ✗     | ✓       | ✗              |
| View Applications      | ✓     | Own     | ✗              |
| Schedule Meetings      | ✓     | ✗       | ✗              |
| Assign Evaluators      | ✓     | ✗       | ✗              |
| View Meetings          | All   | Own     | ✗              |
| Rate Teachers          | ✗     | ✗       | ✓              |
| View Teachers          | ✓     | ✗       | ✓              |

## Error Handling

The API returns consistent error responses:

```json
{
  "message": "Error description",
  "error": "Error type",
  "status": 400
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid/expired session)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Development

### Project Structure
```
yallaTn/
├── src/main/java/org/example/yallatn/
│   ├── annotation/       # Custom annotations (@RequireRole)
│   ├── config/          # Configuration classes
│   ├── controller/      # REST controllers
│   ├── dto/            # Data Transfer Objects
│   ├── exception/      # Exception handlers
│   ├── interceptor/    # HTTP interceptors
│   ├── model/          # JPA entities
│   ├── repository/     # Data repositories
│   └── service/        # Business logic
├── src/main/resources/
│   ├── application.properties
│   └── schema.sql
└── pom.xml
```

### Adding New Features

1. Create entity in `model/`
2. Create repository in `repository/`
3. Create service in `service/`
4. Create controller in `controller/`
5. Add role-based access with `@RequireRole`

## License

This project is created for educational purposes.
