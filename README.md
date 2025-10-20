Meezy Clone - Fullstack Shopping App

A vibrant, fullstack shopping web application inspired by Meesho, built with React + Vite + Tailwind CSS on the frontend and Node.js / Express on the backend.

Try it locally, explore products, manage cart, and checkout!

🌟 Features

✅ User authentication: Register, Login, Logout (JWT-based)

✅ Browse products with details and vibrant UI

✅ Add to Cart or Buy Now functionality

✅ Checkout with address & payment selection (COD / simulated Card)

✅ Cart persistence with localStorage

✅ Seller demo dashboard to create listings

✅ Fully responsive, colorful, and modern UI

🛠 Tech Stack
Frontend	Backend
React 18	Node.js >=16
Vite	Express.js
React Router DOM	lowdb (JSON DB)
Tailwind CSS	JWT Authentication
LocalStorage	CORS
📁 Project Structure
meesho_clone_fullstack/
│
├─ backend/
│  ├─ index.js          # Backend server
│  ├─ package.json
│  └─ db.json           # Demo JSON DB
│
├─ frontend/
│  ├─ src/
│  │   └─ main.jsx      # SPA frontend
│  ├─ package.json
│  ├─ vite.config.js
│  └─ tailwind.config.js
│
└─ README.md

⚡ Screenshots

Replace these with your app screenshots






🚀 Setup Instructions
1. Clone the repository
git clone https://github.com/venkatesh20000/shopping.git
cd shopping

2. Backend Setup
cd backend
npm install
npm run dev


Runs on http://localhost:4000

Endpoints:

POST /api/register → Register new user

POST /api/login → Login

GET /api/products → List products

GET /api/products/:id → Product details

POST /api/orders → Place an order

3. Frontend Setup
cd ../frontend
npm install
npm run dev


Runs on http://localhost:5173 (Vite default)

Automatically connects to backend API

🛒 How to Use

Register a new account or login with demo credentials

Browse products via Products page

Click a product for details, specs, and pricing

Buy Now or Add to Cart

Visit Cart to continue shopping or proceed to checkout

Fill address and select payment

Place the order and view confirmation

📝 Notes

Backend uses lowdb JSON file (no real database required)

Cart persists in localStorage

Payments are simulated; no real transactions

Ensure Node.js >= 16 is installed

Tailwind CSS provides vibrant mixed colors

🌐 Deployment

You can deploy using:

Vercel or Netlify for frontend

Render / Railway / Heroku for backend
