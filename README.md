# MediCare - Hospital Management System

## Project Overview
MediCare is a secure web-based Hospital Management System built with Node.js, Express, MongoDB, and EJS. It supports three user roles: Admin, Doctor, and Patient, each with specific privileges and access controls.

## Features and Security Objectives

### Main Features
- User registration and login with role-based access
- Admin can manage doctors, patients and appointments
- Doctors can view assigned patients and update medical notes
- Patients can book appointments and view medical records

### Security Features
- bcrypt password hashing (salt rounds: 12)
- Session-based authentication with secure cookies
- Role-based access control (Admin/Doctor/Patient)
- Input validation with express-validator
- Rate limiting on login (max 5 attempts per 15 minutes)
- NoSQL injection prevention
- Secure HTTP headers with helmet.js
- Audit logging with winston
- Custom error pages (no stack traces exposed)
- HttpOnly and SameSite cookie flags

## Project Structure
```
medicare/
├── config/
│   ├── db.js              # MongoDB connection
│   └── logger.js          # Winston logger
├── controllers/
│   ├── authController.js
│   ├── patientController.js
│   ├── doctorController.js
│   └── appointmentController.js
├── middleware/
│   ├── authMiddleware.js   # isLoggedIn
│   ├── roleMiddleware.js   # isAdmin, isDoctor, isPatient
│   ├── rateLimiter.js      # Rate limiting
│   ├── validation.js       # Input validation
│   └── sanitize.js         # NoSQL injection prevention
├── models/
│   ├── User.js
│   ├── Patient.js
│   └── Appointment.js
├── routes/
│   ├── authRoutes.js
│   ├── patientRoutes.js
│   ├── doctorRoutes.js
│   └── appointmentRoutes.js
├── views/
│   ├── partials/
│   ├── auth/
│   ├── admin/
│   ├── doctor/
│   └── patient/
├── public/
├── logs/
├── .env.example
├── app.js
└── README.md
```

## Setup and Installation

### Prerequisites
- Node.js v18+
- MongoDB Atlas account

### Steps
1. Clone the repository
```bash
git clone https://github.com/joeyyprince/medicare.git
cd medicare
```

2. Install dependencies
```bash
npm install
```

3. Create .env file
```bash
cp .env.example .env
```

4. Add your MongoDB URI and session secret to .env
```
PORT=3000
MONGO_URI=your_mongodb_atlas_connection_string
SESSION_SECRET=your_secret_key
```

5. Run the application
```bash
node app.js
```

6. Visit http://localhost:3000

## Usage Guidelines
- Register as a Patient or Doctor
- Admin role must be set manually in MongoDB Atlas
- Patients can book appointments and view medical records
- Doctors can view assigned patients and update medical notes
- Admin can manage all users, patients and appointments

## Security Improvements
| Feature | Implementation |
|---|---|
| Password Hashing | bcrypt with 12 salt rounds |
| Authentication | Session-based with express-session |
| Authorisation | Role-based middleware |
| Input Validation | express-validator on all forms |
| Rate Limiting | 5 login attempts per 15 minutes |
| Injection Prevention | Custom NoSQL sanitization middleware |
| Security Headers | helmet.js |
| Logging | winston audit trail |
| Cookie Security | HttpOnly, SameSite strict flags |

## Testing Process

### Functional Tests
| Test | Expected Result | Status |
|---|---|---|
| Register with valid data | User created, redirected to dashboard | Pass |
| Register with existing email | Error message shown | Pass |
| Login with wrong password | Error message shown | Pass |
| Access dashboard without login | Redirected to login | Pass |
| Patient accessing admin page | Access denied page | Pass |
| Rate limit login (6 attempts) | Blocked for 15 minutes | Pass |

### Security Tests
| Test | Expected Result | Status |
|---|---|---|
| SQL/NoSQL injection on login | Input sanitized, blocked | Pass |
| Brute force login | Blocked after 5 attempts | Pass |
| Weak password registration | Validation error shown | Pass |
| Direct URL access to admin | Redirected/denied | Pass |

### SAST Testing
Run Semgrep for static analysis:
```bash
semgrep --config=auto .
```

## Contributions and References
- Express.js: https://expressjs.com
- Mongoose: https://mongoosejs.com
- bcryptjs: https://www.npmjs.com/package/bcryptjs
- helmet: https://helmetjs.github.io
- express-validator: https://express-validator.github.io
- winston: https://github.com/winstonjs/winston
