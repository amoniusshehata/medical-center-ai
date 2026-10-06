# Medical Center AI Assistant — MVP

A web-based prototype for an **AI receptionist / medical-center assistant** designed for a medical center with multiple clinics.

The goal of this MVP is to validate the idea and the user experience before connecting the system to real messaging channels such as **WhatsApp Business** and **Facebook Messenger**.

> **Project status:** MVP / Prototype  
> **Current deployment:** Static web application  
> **Current storage:** Browser `localStorage`  
> **Messaging integrations:** Not connected yet  
> **Real patient data:** Not supported / should not be entered

---

## 1. Project Idea

The medical center has more than six clinics and needs an AI assistant that can answer patients' common questions and guide them to the appropriate clinic or service.

The assistant is intended to work as a **digital receptionist**, handling administrative and informational conversations such as:

- What clinics are available?
- Which doctors work in a specific clinic?
- When is a doctor available?
- What services does the center provide?
- What is the price of a service?
- What are the answers to common questions?
- How can the patient continue to the booking process?
- When should the conversation be transferred to a human employee?

The first version is intentionally simple so the center can test the workflow before investing in backend infrastructure and messaging integrations.

---

## 2. MVP Goals

1. **Manage medical-center information** from one dashboard.
2. **Organize clinics, doctors, schedules, services, prices, and FAQs.**
3. **Test an AI-style conversation** using the information entered into the dashboard.
4. **Demonstrate the future patient experience** before WhatsApp/Messenger integration.
5. Provide a foundation for the next version with a backend, database, RAG, booking, and messaging APIs.

---

## 3. Dashboard Sections

### 3.1 Dashboard

Main navigation:

- لوحة التحكم
- بيانات المركز
- العيادات
- الأطباء والمواعيد
- الخدمات والأسعار
- الأسئلة الشائعة
- تجربة الـAI

### 3.2 Center Information

The center profile contains the information that the future AI assistant will use when answering patients:

- Medical center name
- Address
- Phone number
- Working hours
- General information

The information is editable from the dashboard.

### 3.3 Clinics

The system supports multiple clinics.

Each clinic can contain:

- Clinic name
- Description
- Doctors associated with the clinic
- Available schedules

The MVP includes demo data for multiple clinics so the multi-clinic workflow can be tested.

### 3.4 Doctors and Schedules

Doctor information includes:

- Doctor name
- Specialty
- Clinic
- Available schedule

The AI can use this information for questions such as:

- "مين دكتور الجلدية؟"
- "مواعيد الدكتور إمتى؟"
- "هل الدكتور موجود يوم السبت؟"

The current MVP uses manually entered schedule data.

### 3.5 Services and Prices

Each service can contain:

- Service name
- Description
- Price

Examples:

- "كشف الجلدية بكام؟"
- "هل عندكم أشعة؟"
- "إيه الخدمات الموجودة؟"

### 3.6 FAQ / Knowledge Base

Each FAQ contains:

- Question
- Answer

The AI test chat can use these answers when responding to matching questions.

This section is also the starting point for the future **RAG knowledge base**.

---

## 4. AI Test Chat

The MVP contains a test chat interface that demonstrates how the future assistant can interact with users.

The current version is **not a production LLM integration**. It uses the information stored in the application to simulate the assistant's behavior.

The test chat can demonstrate:

- Clinic information
- Doctor information
- Doctor schedules
- Services
- Prices
- FAQs
- Basic fallback responses

### Future AI behavior

In the production version, the assistant should:

1. Understand the user's Arabic message.
2. Identify the user's intent.
3. Retrieve the correct center information.
4. Answer using trusted center data.
5. Ask for missing information when necessary.
6. Continue toward booking when appropriate.
7. Transfer the conversation to a human when the request cannot be safely or correctly handled.

---

## 5. Data Storage in the MVP

The current application is a frontend-only prototype.

Data is stored in the browser using:

`localStorage`

Storage key:

`medicalAI`

Therefore:

- Data persists after refreshing the page in the same browser.
- No backend server is required for the MVP.
- Data is local to the browser.
- Data is not shared between users or devices.
- There is no central medical-center database yet.

### Important

Because the MVP uses browser storage, it is **not suitable for production** and must not be used to store real patient information.

---

## 6. Demo Data

The project includes initial demo data for testing:

- Medical-center information
- Multiple clinics
- Doctors
- Doctor schedules
- Services
- Prices
- FAQs

The demo data can be edited or deleted from the dashboard.

---

## 7. Project Structure

```text
medical-center-ai/
│
├── index.html
├── style.css
├── app.js
├── README.md
└── .gitignore
```

### index.html

Contains the dashboard structure and main interface sections.

### style.css

Contains the responsive Arabic RTL dashboard design.

### app.js

Contains the main application logic:

- Demo data
- Local storage
- Center information management
- Clinic management
- Doctor management
- Schedule management
- Service management
- FAQ management
- Add / edit / delete operations
- Test AI chat
- Basic response logic

### README.md

Project documentation, architecture notes, limitations, and roadmap.

### .gitignore

Prevents unnecessary local files from being committed.

---

## 8. Technologies

The current MVP intentionally uses a simple technology stack:

- **HTML5**
- **CSS3**
- **JavaScript**
- **localStorage**
- **GitHub**
- **GitHub Pages**

No backend framework or database is required for the current prototype.

---

## 9. Running the Project Locally

### Option 1 — Open directly

Open:

`index.html`

in a modern browser.

### Option 2 — Local development server

Use a local development server such as **VS Code Live Server** during development.

---

## 10. GitHub Pages

The project is designed to work as a static GitHub Pages website.

Repository:

**amoniusshehata/medical-center-ai**

Enable Pages from:

`Settings → Pages`

Select:

- Source: **Deploy from a branch**
- Branch: **main**
- Folder: **/ (root)**

Expected Pages address:

`https://amoniusshehata.github.io/medical-center-ai/`

GitHub Pages only hosts the frontend. It does **not** turn `localStorage` into a shared database.

---

## 11. Current User Flow

```text
Medical Center Admin
        │
        ▼
Dashboard
        │
        ├── Center Information
        ├── Clinics
        ├── Doctors & Schedules
        ├── Services & Prices
        └── FAQs
                │
                ▼
           Saved Data
                │
                ▼
          Test AI Chat
                │
                ▼
       Simulated AI Response
```

---

## 12. Planned Production Architecture

```text
                 ┌──────────────────┐
                 │ WhatsApp Business│
                 └────────┬─────────┘
                          │
                 ┌────────▼─────────┐
                 │ Facebook         │
                 │ Messenger        │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │ Backend / API    │
                 └────────┬─────────┘
                          │
              ┌───────────┼───────────┐
              ▼           ▼           ▼
          AI Layer      Database     Booking
              │
              ▼
             RAG
              │
              ▼
       Medical Center
       Documents/Data
```

---

## 13. Planned Backend

The production backend will be responsible for:

- Authentication
- User management
- Medical-center management
- Database access
- AI requests
- RAG retrieval
- Appointment workflows
- Messaging integrations
- Conversation history
- Human handoff
- Security and permissions

API keys and private credentials must remain on the backend and never be exposed in the frontend.

---

## 14. Database

A production database should replace browser `localStorage`.

### Medical Center

- id
- name
- address
- phone
- working hours
- general information

### Clinic

- id
- center_id
- name
- description

### Doctor

- id
- center_id
- clinic_id
- name
- specialty

### Schedule

- id
- doctor_id
- day
- start_time
- end_time

### Service

- id
- center_id
- name
- description
- price

### FAQ

- id
- center_id
- question
- answer

### Conversation

- id
- center_id
- channel
- user identifier
- status
- created_at

### Appointment

- id
- center_id
- clinic_id
- doctor_id
- appointment date
- appointment time
- status

The exact schema should be adjusted after documenting the medical center's real workflow.

---

## 15. RAG Knowledge Base

A future version should support a RAG pipeline.

The medical center could provide approved documents such as:

- Clinic information
- Service descriptions
- Prices
- Doctor schedules
- Center policies
- Preparation instructions
- Frequently asked questions
- Administrative procedures
- Other approved informational documents

Pipeline:

```text
Documents
   ↓
Text Extraction
   ↓
Cleaning
   ↓
Chunking
   ↓
Embeddings
   ↓
Vector Database
   ↓
User Question
   ↓
Retrieval
   ↓
Relevant Context
   ↓
LLM
   ↓
Answer
```

The assistant should answer from approved center information rather than inventing information.

---

## 16. WhatsApp Integration

A later phase will connect the assistant to **WhatsApp Business**.

Expected flow:

```text
Patient
   ↓
WhatsApp
   ↓
WhatsApp Business API
   ↓
Backend Webhook
   ↓
AI / RAG
   ↓
Response
   ↓
WhatsApp
   ↓
Patient
```

The backend should process incoming messages, identify the center and conversation, generate the response, and return it to WhatsApp.

---

## 17. Facebook Messenger Integration

Expected architecture:

```text
Patient
   ↓
Messenger
   ↓
Meta API / Webhook
   ↓
Backend
   ↓
AI / RAG
   ↓
Response
   ↓
Messenger
```

WhatsApp and Messenger should eventually use the same backend and AI logic.

---

## 18. Appointment / Booking System

The MVP does not perform real appointments.

A production version should integrate with the center's actual booking process.

Possible flow:

```text
Patient
   ↓
Select Clinic
   ↓
Select Doctor
   ↓
Check Available Slots
   ↓
Select Date / Time
   ↓
Create Appointment
   ↓
Send Confirmation
```

Future capabilities:

- Doctor availability
- Available time slots
- Appointment creation
- Appointment confirmation
- Cancellation
- Rescheduling
- Integration with the center's existing booking system, if available

---

## 19. Human Handoff

The assistant should not attempt to handle every situation.

Human handoff should be available for:

- Questions the AI cannot answer
- Complaints
- Sensitive cases
- Complex administrative issues
- Booking problems
- Explicit requests to speak with an employee
- Situations requiring human judgment

```text
Patient
   ↓
AI Assistant
   ↓
Cannot safely/accurately handle request
   ↓
Human Handoff
   ↓
Medical Center Employee
```

---

## 20. Medical Safety

This project is intended primarily for **administrative and informational assistance**.

The assistant should not:

- Diagnose diseases
- Prescribe medication
- Change medication doses
- Replace a physician
- Make emergency medical decisions
- Give definitive medical diagnoses
- Handle emergencies as a substitute for emergency services

For medical questions outside the approved scope, the assistant should respond safely and direct the user to an appropriate qualified healthcare professional when necessary.

---

## 21. Privacy and Security

Before production deployment, the system must include appropriate security controls:

- Authentication
- Role-based access
- Secure API keys
- HTTPS
- Database security
- Input validation
- Access control
- Audit logs
- Secure conversation storage
- Data retention policies
- Protection of personal information
- Appropriate handling of healthcare-related data

The production implementation should be reviewed against applicable Egyptian legal, regulatory, contractual, and healthcare-data requirements.

---

## 22. Multi-Center Support

The current MVP represents one medical center.

The planned architecture can support multiple centers.

Each center should have isolated:

- Clinics
- Doctors
- Schedules
- Services
- Prices
- FAQs
- Documents
- Conversations
- Appointments
- AI configuration

This enables the same platform to serve multiple medical centers in the future.

---

## 23. AI Configuration — Future

The admin dashboard can eventually configure:

- Assistant name
- Welcome message
- Center tone of voice
- Supported languages
- Response rules
- Working hours
- Human handoff rules
- Approved knowledge sources
- Booking behavior
- Fallback message

The center should control the information the AI is allowed to use.

---

## 24. Current Limitations

The current MVP intentionally has these limitations:

- No real backend
- No real database
- No user authentication
- No multi-user collaboration
- No real WhatsApp integration
- No Facebook Messenger integration
- No real appointment booking
- No real RAG pipeline
- No production LLM integration
- No conversation history database
- No human-agent dashboard
- No real patient-data support
- Browser-based local storage only

These limitations are expected at the prototype stage.

---

## 25. Roadmap

### Phase 1 — MVP ✅

- [x] Dashboard
- [x] Center information
- [x] Clinics
- [x] Doctors
- [x] Schedules
- [x] Services
- [x] Prices
- [x] FAQs
- [x] Test AI chat
- [x] Arabic RTL interface
- [x] Responsive UI
- [x] Local persistence
- [x] GitHub repository

### Phase 2 — Backend

- [ ] Backend API
- [ ] Database
- [ ] Authentication
- [ ] Admin accounts
- [ ] Multi-center architecture
- [ ] Secure API configuration

### Phase 3 — Real AI

- [ ] LLM integration
- [ ] Intent detection
- [ ] Structured tool/function calling
- [ ] Better Arabic conversation handling
- [ ] Guardrails
- [ ] Fallback logic

### Phase 4 — RAG

- [ ] PDF/document upload
- [ ] Document processing
- [ ] Chunking
- [ ] Embeddings
- [ ] Vector database
- [ ] Retrieval
- [ ] Source-grounded answers

### Phase 5 — Booking

- [ ] Doctor availability
- [ ] Available time slots
- [ ] Appointment creation
- [ ] Appointment confirmation
- [ ] Cancellation/rescheduling
- [ ] Integration with the center's existing system if available

### Phase 6 — Messaging

- [ ] WhatsApp Business API
- [ ] WhatsApp webhook
- [ ] Facebook Messenger
- [ ] Messenger webhook
- [ ] Shared conversation engine

### Phase 7 — Operations

- [ ] Conversation dashboard
- [ ] Human handoff
- [ ] Agent accounts
- [ ] Conversation status
- [ ] Analytics
- [ ] Audit logs
- [ ] Monitoring
- [ ] Error handling

### Phase 8 — Production Hardening

- [ ] Security review
- [ ] Privacy review
- [ ] Medical-safety review
- [ ] Load testing
- [ ] Backup strategy
- [ ] Monitoring and alerts
- [ ] Production deployment

---

## 26. Recommended Development Strategy

Develop incrementally:

```text
MVP
 ↓
Backend + Database
 ↓
Authentication
 ↓
Real AI
 ↓
RAG
 ↓
Booking
 ↓
WhatsApp
 ↓
Messenger
 ↓
Human Handoff
 ↓
Security / Monitoring
 ↓
Production
```

This reduces development risk and makes it possible to demonstrate progress to the medical center after every major phase.

---

## 27. Important Product Principle

The assistant should be treated as a **medical-center receptionist assistant**, not as an autonomous doctor.

Its primary value is reducing repetitive administrative work and helping patients quickly find reliable information about the center.

The system should always prefer:

**accurate center data → clarification → human handoff**

over:

**guessing an answer.**

---

## 28. License / Usage

This repository is currently a project prototype for development and demonstration purposes.

Before commercial deployment, define the appropriate license, ownership, data-processing terms, and client-specific agreements.

---

## 29. Status

**Current status:** MVP completed and uploaded to GitHub.

The current version is suitable for:

- Demonstrating the concept
- Showing the client the dashboard
- Testing the information-management workflow
- Testing the basic AI chat experience
- Collecting client requirements
- Preparing the production architecture

It is **not yet a production medical AI system**.

---

## 30. Repository

GitHub repository:

`amoniusshehata/medical-center-ai`

The next major technical milestone is moving the project from a static frontend prototype to a **backend + database + real AI/RAG architecture**, followed by WhatsApp and Messenger integration.
