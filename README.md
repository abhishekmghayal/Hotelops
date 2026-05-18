# 🏨 HotelOps

HotelOps is a smart hotel operations management system that replaces WhatsApp messages and handwritten checklists with a real-time digital platform.

It helps manage:
- Housekeeping tasks
- Maintenance tickets
- Front desk operations
- Room status tracking
- Real-time updates

---

## 🚀 Tech Stack

Frontend:
- React.js
- Tailwind CSS

Backend:
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Socket.io

---

## 📁 Project Structure

hotelops/
 ├── frontend/
 └── backend/
     ├── models/
     ├── routes/
     ├── controllers/
     ├── middleware/
     ├── config/
     ├── seed/
     └── server.js

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

git clone https://github.com/your-username/hotelops.git  
cd hotelops  

---

### 2️⃣ Setup Backend

cd backend  

Install dependencies:

npm install  

Create `.env` file inside backend:

PORT=5000  
MONGO_URI=your_mongodb_connection_string  
JWT_SECRET=your_secret_key  

Run backend:

npm run dev  

Backend runs on:
http://localhost:5000  

---

### 3️⃣ Setup Frontend

Open new terminal:

cd frontend  

Install dependencies:

npm install  

Run frontend:

npm start  

Frontend runs on:
http://localhost:3000  

---

## 🌱 4️⃣ Seed Data (IMPORTANT)

You already have a seed file.

Run this to insert demo data:

cd backend  

node seed/importData.js  

This will:
- Delete old data  
- Create users (manager, frontdesk, housekeeping, maintenance)  
- Create 20 rooms  
- Create cleaning tasks  
- Create maintenance tickets  

---

## 🔑 Demo Login Credentials

Manager:
email: manager@hotelops.com  
password: password123  

Front Desk:
email: frontdesk@hotelops.com  
password: password123  

Housekeeping:
email: housekeeping@hotelops.com  
password: password123  

Maintenance:
email: maintenance@hotelops.com  
password: password123  

---

## 🔄 Project Workflow

1. Login to system  
2. Front desk marks room as Dirty  
3. Cleaning task is automatically created  
4. Housekeeping completes the task  
5. Room becomes Ready  
6. Maintenance issues handled similarly  
7. Dashboard updates in real-time  

---

## ⚡ Features

- Role-based login system  
- Room status management  
- Task assignment and tracking  
- Housekeeping checklist  
- Maintenance ticket system  
- Real-time updates using Socket.io  
- Notifications system  

---

## ⚠️ Important Notes

- MongoDB must be running (Atlas or local)  
- Backend should run before frontend  
- Do not modify frontend UI  
- Backend handles all business logic  

---

## ✅ Done

Your HotelOps project is now fully functional 🚀
