# 🚖 Uber-like Ride Hailing App

> A full-featured ride-hailing application similar to **Uber**, enabling passengers and drivers to connect, manage trips, share live locations, handle payments, and provide ratings.  
> Built with **Node.js, Express.js, MongoDB, and Socket.IO**, focusing on scalability, performance, and clean architecture.

---

## ✨ Features

- **Authentication & Authorization**  
  - Register / Login (Passenger – Driver – Admin)  
  - JWT with Refresh Token support  
- **Trip Management**  
  - Passengers can request rides  
  - Drivers can accept/decline requests  
  - Trip status updates (On the way – Completed – Cancelled)  
- **Real-time Updates**  
  - Live driver location sharing with Socket.IO  
  - ETA and distance calculation with GeoLocation  
- **Payment & Wallet**  
  - Support for cash and future integration with digital wallets/payment gateways  
- **Rating & Reviews**  
  - Driver and passenger ratings after each trip  
- **Admin Dashboard**  
  - Manage users and trips  
  - Analytics & Reports  

---

## 🛠 Tech Stack

- **Backend:** Node.js (Express.js)  
- **Database:** MongoDB (Mongoose ODM)  
- **Real-time:** Socket.IO  
- **Auth:** JWT + bcrypt + 0auth
- **Validation:** validator.js 
- **Deployment:** Docker + Nginx  
- **integraton:** Mapbox  
- **Testing:** Jest   

---

## 📂 Folder Structure

```bash
├── src
│   ├── config/         # App configurations (DB, JWT, Socket, Logger)
│   ├── modules/        # Feature modules (Auth, Trips, Users...)
│   │   ├── auth/
│   │   ├── trips/
│   │   └── users/
│   ├── middlewares/    # Middlewares (Auth, Error Handling)
│   ├── utils/          # Utility functions (Geo, Notifications, Payments...)
│   └── app.js          # Entry point
├── tests/              # Unit & Integration Tests
├── docs/               # Documentation & Architecture images
├── TawasulApi.postman_collection.json # Postman Collection
├── .env.example
├── package.json
└── README.md


# 1. Clone the repository
git clone https://github.com/username/uber-clone.git

# 2. Navigate
cd uber-clone

# 3. Install dependencies
npm install

# 4. Configure environment variables
cp .env.example .env

# 5. Start the app
npm run dev

