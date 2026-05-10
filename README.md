# Traveloop - Personalized Travel Planning 🌍✈️

Traveloop is a modern web application designed to help you plan, manage, and budget your travel adventures with ease.

## ✨ Features
- **Precision Budget Planner**: Track expenses and get AI-powered activity suggestions.
- **Smart Itineraries**: Manage multiple stops, activities, and notes for every trip.
- **Explore Mode**: One-click planning for the world's most popular destinations.
- **Security**: Full user authentication and private trip storage.
- **Real-time Dashboard**: Track upcoming trips and metrics at a glance.

## 🚀 How to Run Locally

If you've just cloned this repository, follow these steps to get started:

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.

### 2. Install Dependencies
Open your terminal in the project folder and run:
```bash
npm install
```

### 3. Start the Server
Run the following command to start the backend and serve the application:
```bash
npm start
```
The application will be running at **http://localhost:3000**.

### 4. Setup
- The first time you run the server, it will automatically create a local SQLite database (`server/db/traveloop.db`).
- You can then go to the browser, register for a new account, and start planning!

## 🛠 Tech Stack
- **Frontend**: Vanilla JS, CSS (Custom Design System), HTML5.
- **Backend**: Node.js, Express.
- **Database**: SQLite.
- **Icons**: Phosphor Icons.
- **Fonts**: Outfit (Google Fonts).

---
*Created with ❤️ for travelers.*

## 📁 Project Structure

travelapp/
│
├── backend/                         # Backend server and APIs
│   │
│   ├── server.js                    # Main Express server
│   │
│   ├── config/                      # Configurations
│   │   ├── db.js                    # SQLite database connection
│   │   ├── cloud.js                 # Cloud image storage config
│   │   └── auth.js                  # JWT/auth config
│   │
│   ├── db/                          # Database files
│   │   ├── traveloop.db             # SQLite database
│   │   └── schema.sql               # Database schema
│   │
│   ├── routes/                      # API routes
│   │   ├── authRoutes.js
│   │   ├── tripRoutes.js
│   │   ├── cityRoutes.js
│   │   ├── activityRoutes.js
│   │   ├── budgetRoutes.js
│   │   ├── packingRoutes.js
│   │   ├── notesRoutes.js
│   │   ├── userRoutes.js
│   │   └── shareRoutes.js
│   │
│   ├── controllers/                 # Route logic/controllers
│   │   ├── authController.js
│   │   ├── tripController.js
│   │   ├── cityController.js
│   │   ├── activityController.js
│   │   ├── budgetController.js
│   │   ├── packingController.js
│   │   ├── notesController.js
│   │   └── userController.js
│   │
│   ├── middleware/                  # Middleware functions
│   │   ├── authMiddleware.js
│   │   ├── uploadMiddleware.js
│   │   └── errorMiddleware.js
│   │
│   ├── models/                      # Database models/queries
│   │   ├── userModel.js
│   │   ├── tripModel.js
│   │   ├── activityModel.js
│   │   └── budgetModel.js
│   │
│   ├── uploads/                     # Temporary upload handling only
│   │
│   └── utils/                       # Helper functions
│       ├── budgetCalculator.js
│       ├── validators.js
│       └── dateHelpers.js
│
├── frontend/                        # Frontend application
│   │
│   ├── index.html                   # Main landing page
│   │
│   ├── pages/                       # Additional pages
│   │   ├── login.html
│   │   ├── signup.html
│   │   ├── dashboard.html
│   │   ├── create-trip.html
│   │   ├── my-trips.html
│   │   ├── itinerary.html
│   │   ├── budget.html
│   │   ├── packing.html
│   │   ├── profile.html
│   │   └── notes.html
│   │
│   ├── css/                         # Stylesheets
│   │   ├── style.css
│   │   ├── auth.css
│   │   ├── dashboard.css
│   │   ├── itinerary.css
│   │   ├── responsive.css
│   │   └── animations.css
│   │
│   ├── js/                          # JavaScript files
│   │   ├── app.js
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   ├── itinerary.js
│   │   ├── budget.js
│   │   ├── packing.js
│   │   ├── profile.js
│   │   ├── notes.js
│   │   └── api.js
│   │
│   ├── assets/                      # Static assets
│   │   ├── icons/
│   │   ├── logos/
│   │   ├── illustrations/
│   │   └── videos/
│   │
│   └── components/                  # Reusable UI components
│       ├── navbar.html
│       ├── sidebar.html
│       ├── footer.html
│       └── modals.html
│
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── node_modules/
