# Medical Center AI Backend

This folder contains the Node.js/Express backend and MongoDB schema for the Medical Center AI project.

## Collections

- centers
- clinics
- doctors
- services
- faqs

## Relationships

- clinic.centerId -> centers._id
- doctor.centerId -> centers._id
- doctor.clinicId -> clinics._id
- service.centerId -> centers._id
- service.clinicId -> clinics._id
- service.doctorId -> doctors._id
- faq.centerId -> centers._id

## Local setup

1. Install Node.js.
2. Copy .env.example to .env.
3. Put the MongoDB Atlas connection string in MONGODB_URI.
4. Run:
   npm install
   npm start

Health check:
GET /api/health

Read all dashboard data:
GET /api/data

Do not commit .env or MongoDB credentials to GitHub.
