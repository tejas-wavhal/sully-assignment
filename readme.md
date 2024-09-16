# Real-time Collaborative Document Editor

This is a real-time collaborative document editor that allows users to register, log in, create, and edit documents. Users can share documents with others by sharing the document link, enabling collaborative real-time editing.

## Features
- User Registration and Login
- Real-time collaborative editing of documents
- Shareable document links for collaboration
- Responsive design using Bootstrap
- Real-time updates via Socket.io

## Setup Instructions

### Prerequisites
Ensure you have the following installed:
- Node.js (v14 or higher)
- NPM (comes with Node.js)
- MongoDB (Ensure MongoDB is running locally or provide a cloud database connection)
- Backend server (built with Express and Socket.io)

### Backend Setup
1. Clone the backend repository (or set up the backend separately).
2. Install the required dependencies for the backend:
   ```bash
   cd backend
   npm install

2. Run the backend the backend:
   ```bash
   node server.js
   
### Frontend Setup
1. Install the required dependencies for the frontend:
   ```bash
   cd frontend
   npm install
   
2. Run the backend the frontend:
   ```bash
   npm run dev
   
   
## Application Flow
- When users first visit the application, they are prompted to register by clicking the "Don't have an account?" button.
Users will enter their name, email, and password to create an account.
    
- After registering, users can log in using their email and password.
Upon logging in, they are redirected to the document editing page.

- If a user doesn't have a document, one is created automatically when they navigate to the editor.
The user is assigned a document ID, and the document is saved in the database.

- Users can edit the document in real time.
Changes are automatically saved to the database with a small delay (debounced).
Users can see updates from others if they share the same document link.

- Users can share the document link by copying the URL and sending it to others.
When others access the shared link, they can collaborate and edit the same document in real time.