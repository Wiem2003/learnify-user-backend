# API Testing Guide - YallaTn

## Setup

Base URL: `http://localhost:8081`

## 1. Authentication

### Register New User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "New Teacher",
  "email": "newteacher@example.com",
  "password": "password123",
  "role": "TEACHER"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@learnify.com",
  "password": "admin123"
}

Response:
{
  "message": "Login successful",
  "sessionId": "uuid-session-id",
  "user": {
    "id": 1,
    "name": "System Admin",
    "email": "admin@learnify.com",
    "role": "ADMIN",
    "createdAt": "2026-02-15T..."
  }
}
```

**Save the sessionId for subsequent requests!**

### Get Current User
```bash
GET /api/auth/current-user
Authorization: <your-session-id>
```

### Logout
```bash
POST /api/auth/logout
Authorization: <your-session-id>
```

## 2. Job Management (ADMIN only)

### Create Job
```bash
POST /api/jobs
Authorization: <admin-session-id>
Content-Type: application/json

{
  "titre": "Software Engineering Professor",
  "nbPlaces": 2,
  "description": "Looking for an experienced software engineering professor",
  "requirements": "PhD in Computer Science, 5+ years teaching experience",
  "deadline": "2026-03-15T23:59:59"
}
```

### Get All Jobs
```bash
GET /api/jobs
Authorization: <session-id>
```

### Get Open Jobs
```bash
GET /api/jobs/open
Authorization: <session-id>
```

### Update Job
```bash
PUT /api/jobs/1
Authorization: <admin-session-id>
Content-Type: application/json

{
  "titre": "Senior Software Engineering Professor",
  "nbPlaces": 3,
  "description": "Updated description",
  "requirements": "Updated requirements",
  "deadline": "2026-04-15T23:59:59",
  "status": "OPEN"
}
```

### Close Job
```bash
PUT /api/jobs/1/close
Authorization: <admin-session-id>
```

### Delete Job
```bash
DELETE /api/jobs/1
Authorization: <admin-session-id>
```

## 3. Applications (TEACHER)

### Submit Application (with file upload)

Using curl:
```bash
curl -X POST http://localhost:8081/api/applications \
  -H "Authorization: <teacher-session-id>" \
  -F 'application={"jobId":1,"motivation":"I am highly qualified for this position"}' \
  -F 'cv=@/path/to/cv.pdf' \
  -F 'certificat=@/path/to/certificate.pdf'
```

Using Postman:
1. Method: POST
2. URL: http://localhost:8081/api/applications
3. Headers: Authorization: <teacher-session-id>
4. Body: form-data
   - Key: application, Value: {"jobId":1,"motivation":"..."}
   - Key: cv, Type: File, Value: select file
   - Key: certificat, Type: File, Value: select file

### Get My Applications
```bash
GET /api/applications/my-applications
Authorization: <teacher-session-id>
```

### Get All Applications (ADMIN)
```bash
GET /api/applications
Authorization: <admin-session-id>
```

### Get Applications by Job
```bash
GET /api/applications/job/1
Authorization: <admin-session-id>
```

### Update Application Status (ADMIN)
```bash
PUT /api/applications/1/status
Authorization: <admin-session-id>
Content-Type: application/json

{
  "status": "ACCEPTED"
}
```

## 4. Meetings (ADMIN)

### Schedule Meeting
```bash
POST /api/meetings
Authorization: <admin-session-id>
Content-Type: application/json

{
  "applicationId": 1,
  "evaluatorId": 1,
  "meetingDate": "2026-02-20T14:00:00"
}
```

### Get All Meetings
```bash
GET /api/meetings
Authorization: <admin-session-id>
```

### Get My Meetings (as evaluator)
```bash
GET /api/meetings/my-meetings
Authorization: <session-id>
```

### Get Meeting by Application
```bash
GET /api/meetings/application/1
Authorization: <admin-session-id>
```

### Update Meeting
```bash
PUT /api/meetings/1
Authorization: <admin-session-id>
Content-Type: application/json

{
  "meetingDate": "2026-02-21T15:00:00",
  "evaluatorId": 2,
  "notes": "Candidate showed excellent technical skills"
}
```

### Delete Meeting
```bash
DELETE /api/meetings/1
Authorization: <admin-session-id>
```

## 5. Ratings (STUDENT/USER)

### Create Rating
```bash
POST /api/ratings
Authorization: <student-session-id>
Content-Type: application/json

{
  "teacherId": 2,
  "note": 5,
  "commentaire": "Excellent teacher, very knowledgeable"
}
```

### Get Ratings for Teacher
```bash
GET /api/ratings/teacher/2
Authorization: <session-id>
```

### Get Average Rating
```bash
GET /api/ratings/teacher/2/average
Authorization: <session-id>

Response:
{
  "average": 4.5
}
```

### Get My Ratings (as student)
```bash
GET /api/ratings/my-ratings
Authorization: <student-session-id>
```

### Update Rating
```bash
PUT /api/ratings/1
Authorization: <student-session-id>
Content-Type: application/json

{
  "note": 4,
  "commentaire": "Updated comment"
}
```

### Delete Rating
```bash
DELETE /api/ratings/1
Authorization: <student-session-id>
```

## 6. User Management

### Get All Users (ADMIN)
```bash
GET /api/users
Authorization: <admin-session-id>
```

### Get All Teachers
```bash
GET /api/users/teachers
Authorization: <session-id>
```

### Get User by ID
```bash
GET /api/users/1
Authorization: <session-id>
```

### Update User (ADMIN)
```bash
PUT /api/users/2
Authorization: <admin-session-id>
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "updated@example.com",
  "password": "newpassword"
}
```

### Delete User (ADMIN)
```bash
DELETE /api/users/2
Authorization: <admin-session-id>
```

## Complete Test Workflow

### 1. Admin Creates Job
```bash
# Login as admin
POST /api/auth/login
{
  "email": "admin@learnify.com",
  "password": "admin123"
}

# Create job
POST /api/jobs
Authorization: <admin-session-id>
{
  "titre": "Mathematics Professor",
  "nbPlaces": 2,
  "description": "Teaching advanced mathematics",
  "requirements": "PhD in Mathematics",
  "deadline": "2026-03-30T23:59:59"
}
```

### 2. Teacher Applies to Job
```bash
# Login as teacher
POST /api/auth/login
{
  "email": "teacher@learnify.com",
  "password": "teacher123"
}

# Apply to job
POST /api/applications
Authorization: <teacher-session-id>
(with multipart form data including cv and certificat files)
```

### 3. Admin Reviews Application
```bash
# View applications for the job
GET /api/applications/job/1
Authorization: <admin-session-id>

# Accept application
PUT /api/applications/1/status
Authorization: <admin-session-id>
{
  "status": "ACCEPTED"
}
```

### 4. Admin Schedules Meeting
```bash
POST /api/meetings
Authorization: <admin-session-id>
{
  "applicationId": 1,
  "evaluatorId": 1,
  "meetingDate": "2026-02-25T10:00:00"
}
```

### 5. Student Rates Teacher
```bash
# Login as student
POST /api/auth/login
{
  "email": "student@learnify.com",
  "password": "student123"
}

# Rate teacher
POST /api/ratings
Authorization: <student-session-id>
{
  "teacherId": 2,
  "note": 5,
  "commentaire": "Great teaching style"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation failed",
  "errors": {
    "email": "Invalid email format",
    "password": "Password is required"
  },
  "status": 400
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid or expired session"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "message": "Job not found with id: 123",
  "error": "Runtime Error",
  "status": 400
}
```

## Tips

1. Always save the sessionId after login
2. Include sessionId in Authorization header for protected endpoints
3. Sessions expire after 7 days
4. Use multipart/form-data for file uploads
5. Dates must be in ISO 8601 format: `2026-02-15T14:30:00`
6. Role values: USER, TEACHER, ADMIN (case-sensitive)
7. Status values are enum types (case-sensitive)
