# Quick Start Guide - YallaTn

## Prerequisites
- Java 17 or higher
- No need for Maven installation (project includes Maven Wrapper)

## Step 1: Run the Application

Open a terminal in the `yallaTn` directory and run:

### Windows
```bash
.\mvnw.cmd spring-boot:run
```

### Linux/Mac
```bash
./mvnw spring-boot:run
```

The application will start on `http://localhost:8081`

You should see output like:
```
✓ Default admin created: admin@learnify.com / admin123
✓ Default teacher created: teacher@learnify.com / teacher123
✓ Default student created: student@learnify.com / student123
```

## Step 2: Test the API

### Option 1: Use Postman
1. Import `YallaTn_Postman_Collection.json` into Postman
2. Use the "Login - Admin" request to get a session ID
3. The session ID will be automatically saved as a collection variable
4. Try other requests in the collection

### Option 2: Use curl

#### Login as Admin
```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@learnify.com\",\"password\":\"admin123\"}"
```

Save the `sessionId` from the response.

#### Create a Job
```bash
curl -X POST http://localhost:8081/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: YOUR_SESSION_ID" \
  -d "{\"titre\":\"Math Professor\",\"nbPlaces\":2,\"description\":\"Teaching mathematics\",\"requirements\":\"PhD in Math\",\"deadline\":\"2026-03-30T23:59:59\"}"
```

## Step 3: Access H2 Database Console (Optional)

Visit: `http://localhost:8081/h2-console`

- **JDBC URL:** `jdbc:h2:mem:yallatn_db`
- **Username:** `sa`
- **Password:** (leave empty)

## Default Accounts

| Role    | Email                  | Password    |
|---------|------------------------|-------------|
| ADMIN   | admin@learnify.com      | admin123    |
| TEACHER | teacher@learnify.com    | teacher123  |
| USER    | student@learnify.com    | student123  |

## Complete Workflow Example

### 1. Admin Creates Job
```bash
# Login as admin
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@learnify.com\",\"password\":\"admin123\"}"

# Create job (replace SESSION_ID)
curl -X POST http://localhost:8081/api/jobs \
  -H "Content-Type: application/json" \
  -H "Authorization: SESSION_ID" \
  -d "{\"titre\":\"Software Prof\",\"nbPlaces\":2,\"description\":\"Teaching\",\"requirements\":\"PhD\",\"deadline\":\"2026-03-30T23:59:59\"}"
```

### 2. Teacher Views and Applies to Job
```bash
# Login as teacher
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"teacher@learnify.com\",\"password\":\"teacher123\"}"

# View open jobs
curl http://localhost:8081/api/jobs/open \
  -H "Authorization: TEACHER_SESSION_ID"

# Apply to job (use Postman or multipart form for file upload)
```

### 3. Admin Reviews Applications
```bash
# View applications for job
curl http://localhost:8081/api/applications/job/1 \
  -H "Authorization: ADMIN_SESSION_ID"

# Accept application
curl -X PUT http://localhost:8081/api/applications/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: ADMIN_SESSION_ID" \
  -d "{\"status\":\"ACCEPTED\"}"
```

### 4. Admin Schedules Meeting
```bash
curl -X POST http://localhost:8081/api/meetings \
  -H "Content-Type: application/json" \
  -H "Authorization: ADMIN_SESSION_ID" \
  -d "{\"applicationId\":1,\"evaluatorId\":1,\"meetingDate\":\"2026-02-25T14:00:00\"}"
```

### 5. Student Rates Teacher
```bash
# Login as student
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"student@learnify.com\",\"password\":\"student123\"}"

# Rate teacher
curl -X POST http://localhost:8081/api/ratings \
  -H "Content-Type: application/json" \
  -H "Authorization: STUDENT_SESSION_ID" \
  -d "{\"teacherId\":2,\"note\":5,\"commentaire\":\"Great teacher\"}"

# View average rating
curl http://localhost:8081/api/ratings/teacher/2/average \
  -H "Authorization: STUDENT_SESSION_ID"
```

## API Documentation

See `API_TESTING.md` for complete API documentation with all endpoints and examples.

## Project Structure

```
yallaTn/
├── src/main/java/org/example/yallatn/
│   ├── annotation/          # @RequireRole for access control
│   ├── config/             # Security, CORS, Data initialization
│   ├── controller/         # REST API endpoints
│   ├── dto/               # Request/Response objects
│   ├── exception/         # Error handling
│   ├── interceptor/       # Authentication interceptor
│   ├── model/             # Database entities
│   ├── repository/        # Data access layer
│   └── service/           # Business logic
├── src/main/resources/
│   ├── application.properties
│   └── schema.sql
├── API_TESTING.md
├── README.md
└── YallaTn_Postman_Collection.json
```

## Features Implemented

✓ User authentication with BCrypt password hashing
✓ Session-based authorization (7-day expiry)
✓ Role-based access control (ADMIN, TEACHER, USER)
✓ Job management (CRUD operations)
✓ Teacher applications with file upload (CV, certificates)
✓ Meeting scheduling and evaluator assignment
✓ Student rating system for teachers
✓ Complete validation and error handling
✓ File upload support
✓ Auto-generated default users

## Troubleshooting

### Port Already in Use
If port 8081 is already in use, edit `src/main/resources/application.properties`:
```properties
server.port=8082
```

### Maven Wrapper Permissions (Linux/Mac)
```bash
chmod +x mvnw
```

### Database Issues
The application uses H2 in-memory database. Data is lost on restart. For persistence, configure SQL Server or MySQL in `application.properties`.

## Next Steps

1. Review the complete API documentation in `API_TESTING.md`
2. Import Postman collection for easy testing
3. Explore the H2 database console
4. Customize business logic in service classes
5. Add more endpoints as needed

## Support

For detailed information about:
- All API endpoints → See `API_TESTING.md`
- Architecture & features → See `README.md`
- Database schema → See `src/main/resources/schema.sql`
