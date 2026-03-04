# API Endpoints Reference - YallaTn

Quick reference for all available endpoints with required roles and parameters.

## 🔐 Authentication Header

All protected endpoints require:
```
Authorization: <session-id>
```

---

## 📍 AUTHENTICATION ENDPOINTS

### POST /api/auth/register
**Access:** Public  
**Description:** Register new user  
**Body:**
```json
{
  "name": "string",
  "email": "string (email format)",
  "password": "string",
  "role": "USER|TEACHER|ADMIN" (optional, defaults to USER)
}
```

### POST /api/auth/login
**Access:** Public  
**Description:** Login and receive session ID  
**Body:**
```json
{
  "email": "string",
  "password": "string"
}
```
**Response:**
```json
{
  "message": "Login successful",
  "sessionId": "uuid",
  "user": { UserDTO }
}
```

### POST /api/auth/logout
**Access:** Authenticated  
**Description:** Invalidate current session  

### GET /api/auth/current-user
**Access:** Authenticated  
**Description:** Get current logged-in user information  

---

## 👥 USER ENDPOINTS

### GET /api/users
**Roles:** ADMIN  
**Description:** Get all users  

### GET /api/users/teachers
**Roles:** USER, ADMIN  
**Description:** Get all teachers  

### GET /api/users/{id}
**Roles:** USER, TEACHER, ADMIN  
**Description:** Get user by ID  
**Path Params:** id (Long)

### PUT /api/users/{id}
**Roles:** ADMIN  
**Description:** Update user  
**Path Params:** id (Long)  
**Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string" (optional)
}
```

### DELETE /api/users/{id}
**Roles:** ADMIN  
**Description:** Delete user  
**Path Params:** id (Long)

---

## 💼 JOB ENDPOINTS

### POST /api/jobs
**Roles:** ADMIN  
**Description:** Create new job posting  
**Body:**
```json
{
  "titre": "string",
  "nbPlaces": integer (min: 1),
  "description": "string",
  "requirements": "string",
  "deadline": "datetime (ISO 8601)"
}
```

### GET /api/jobs
**Roles:** ADMIN, TEACHER  
**Description:** Get all jobs  

### GET /api/jobs/open
**Roles:** ADMIN, TEACHER  
**Description:** Get all open jobs sorted by deadline  

### GET /api/jobs/{id}
**Roles:** ADMIN, TEACHER  
**Description:** Get job by ID  
**Path Params:** id (Long)

### PUT /api/jobs/{id}
**Roles:** ADMIN  
**Description:** Update job  
**Path Params:** id (Long)  
**Body:**
```json
{
  "titre": "string",
  "nbPlaces": integer,
  "description": "string",
  "requirements": "string",
  "deadline": "datetime",
  "status": "OPEN|CLOSED"
}
```

### PUT /api/jobs/{id}/close
**Roles:** ADMIN  
**Description:** Close job (set status to CLOSED)  
**Path Params:** id (Long)

### DELETE /api/jobs/{id}
**Roles:** ADMIN  
**Description:** Delete job  
**Path Params:** id (Long)

---

## 📝 APPLICATION ENDPOINTS

### POST /api/applications
**Roles:** TEACHER  
**Description:** Submit job application with file uploads  
**Content-Type:** multipart/form-data  
**Form Data:**
- `application`: JSON string `{"jobId": number, "motivation": "string"}`
- `cv`: File (optional)
- `certificat`: File (optional)

### GET /api/applications
**Roles:** ADMIN  
**Description:** Get all applications  

### GET /api/applications/job/{jobId}
**Roles:** ADMIN  
**Description:** Get all applications for specific job  
**Path Params:** jobId (Long)

### GET /api/applications/my-applications
**Roles:** TEACHER  
**Description:** Get current teacher's applications  

### GET /api/applications/{id}
**Roles:** ADMIN, TEACHER  
**Description:** Get application by ID  
**Path Params:** id (Long)

### PUT /api/applications/{id}/status
**Roles:** ADMIN  
**Description:** Update application status  
**Path Params:** id (Long)  
**Body:**
```json
{
  "status": "PENDING|ACCEPTED|REJECTED"
}
```

### DELETE /api/applications/{id}
**Roles:** ADMIN, TEACHER  
**Description:** Delete application  
**Path Params:** id (Long)

---

## 🤝 MEETING ENDPOINTS

### POST /api/meetings
**Roles:** ADMIN  
**Description:** Schedule meeting for application  
**Body:**
```json
{
  "applicationId": number,
  "evaluatorId": number,
  "meetingDate": "datetime (ISO 8601)"
}
```

### GET /api/meetings
**Roles:** ADMIN  
**Description:** Get all meetings  

### GET /api/meetings/my-meetings
**Roles:** ADMIN, TEACHER  
**Description:** Get meetings where current user is evaluator  

### GET /api/meetings/{id}
**Roles:** ADMIN, TEACHER  
**Description:** Get meeting by ID  
**Path Params:** id (Long)

### GET /api/meetings/application/{applicationId}
**Roles:** ADMIN  
**Description:** Get meeting by application ID  
**Path Params:** applicationId (Long)

### PUT /api/meetings/{id}
**Roles:** ADMIN  
**Description:** Update meeting  
**Path Params:** id (Long)  
**Body:**
```json
{
  "meetingDate": "datetime" (optional),
  "evaluatorId": number (optional),
  "notes": "string" (optional)
}
```

### DELETE /api/meetings/{id}
**Roles:** ADMIN  
**Description:** Delete meeting  
**Path Params:** id (Long)

---

## ⭐ RATING ENDPOINTS

### POST /api/ratings
**Roles:** USER  
**Description:** Rate a teacher  
**Body:**
```json
{
  "teacherId": number,
  "note": integer (1-5),
  "commentaire": "string" (optional)
}
```

### GET /api/ratings
**Roles:** ADMIN  
**Description:** Get all ratings  

### GET /api/ratings/teacher/{teacherId}
**Roles:** USER, ADMIN  
**Description:** Get all ratings for specific teacher  
**Path Params:** teacherId (Long)

### GET /api/ratings/teacher/{teacherId}/average
**Roles:** USER, ADMIN  
**Description:** Get average rating for teacher  
**Path Params:** teacherId (Long)  
**Response:**
```json
{
  "average": 4.5
}
```

### GET /api/ratings/my-ratings
**Roles:** USER  
**Description:** Get ratings created by current student  

### GET /api/ratings/{id}
**Roles:** USER, ADMIN  
**Description:** Get rating by ID  
**Path Params:** id (Long)

### PUT /api/ratings/{id}
**Roles:** USER  
**Description:** Update rating  
**Path Params:** id (Long)  
**Body:**
```json
{
  "note": integer (1-5) (optional),
  "commentaire": "string" (optional)
}
```

### DELETE /api/ratings/{id}
**Roles:** USER, ADMIN  
**Description:** Delete rating  
**Path Params:** id (Long)

---

## 📊 RESPONSE FORMATS

### Success Response
**Status:** 200 OK or 201 Created  
**Body:** Requested data or confirmation message

### Error Response
**Status:** 4xx or 5xx  
**Body:**
```json
{
  "message": "Error description",
  "error": "Error type",
  "status": 400
}
```

### Validation Error Response
**Status:** 400 Bad Request  
**Body:**
```json
{
  "message": "Validation failed",
  "errors": {
    "fieldName": "Error message",
    "anotherField": "Another error"
  },
  "status": 400
}
```

---

## 🎯 ENDPOINT COUNT BY CATEGORY

- **Authentication:** 4 endpoints
- **Users:** 5 endpoints
- **Jobs:** 7 endpoints
- **Applications:** 7 endpoints
- **Meetings:** 7 endpoints
- **Ratings:** 8 endpoints

**Total:** 38 endpoints

---

## 🔑 ROLE PERMISSIONS MATRIX

| Endpoint Category | ADMIN | TEACHER | USER |
|------------------|-------|---------|------|
| Auth             | ✓     | ✓       | ✓    |
| Users (view all) | ✓     | ✗       | ✗    |
| Users (teachers) | ✓     | ✗       | ✓    |
| Jobs (manage)    | ✓     | ✗       | ✗    |
| Jobs (view)      | ✓     | ✓       | ✗    |
| Apply to Jobs    | ✗     | ✓       | ✗    |
| Applications     | All   | Own     | ✗    |
| Meetings         | All   | Own     | ✗    |
| Ratings          | View  | ✗       | CRUD |

---

## 📅 DATE FORMAT

All date/time fields use ISO 8601 format:
```
2026-02-15T14:30:00
```

---

## 📦 FILE UPLOAD

For endpoints that accept files (multipart/form-data):
- Max file size: 10MB
- Accepted for CVs and certificates
- Files stored in `uploads/` directory
- Automatic unique naming with UUID

---

## 🔒 SECURITY NOTES

1. All endpoints except `/api/auth/login` and `/api/auth/register` require authentication
2. Session ID must be included in `Authorization` header
3. Sessions expire after 7 days
4. Passwords are hashed with BCrypt (never stored in plaintext)
5. Role validation happens automatically via interceptor

---

**Base URL:** http://localhost:8081  
**API Prefix:** /api
