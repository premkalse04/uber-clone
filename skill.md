# 🚀 Project Skills – Uber Clone (Full-Stack Ride-Hailing App)

## 🛠️ Tech Stack

* **Frontend:** React.js (Vite), React Router v6, GSAP (GreenSock), Axios, RemixIcon, Tailwind CSS
* **Backend:** Node.js, Express.js, Socket.IO
* **Database:** MongoDB (Mongoose ODM) with GeoJSON & 2dsphere geospatial indexing
* **Authentication:** JSON Web Tokens (JWT), bcrypt password hashing
* **Maps & Geocoding:** OpenStreetMap Nominatim API, OpenStreetMap Overpass API, Leaflet.js / Google Maps JS API
* **Containerization & Deployment:** Docker, Docker Compose, Nginx (reverse proxy)
* **Dev Tools:** Nodemon, dotenv, express-validator

---

## 🌐 Frontend Skills

* Built a responsive, multi-role SPA using **React.js** with **React Router v6** for client-side routing
* Implemented **protected routes** (`UserProtectWrapper`, `CaptainProtectWrapper`) for role-based access control
* Integrated **Socket.IO client** via React Context (`SocketContext`) for real-time bidirectional communication
* Managed global auth state (user & captain) using the **React Context API** (`UserContext`, `CaptainContext`)
* Developed smooth **slide-up booking panels** with **GSAP animations** (`useGSAP`) for a native-app-like UX
* Integrated **Geolocation API** (`getCurrentPosition`, `watchPosition`) for live user location tracking
* Built debounced **place autocomplete** using OpenStreetMap Nominatim with `useCallback` and `useRef`
* Fetched **nearby airports and train stations** using the OpenStreetMap Overpass API
* Displayed **interactive maps** with real-time captain location updates and route visualization
* Consumed **RESTful APIs** using Axios with JWT Bearer token authorization headers
* Implemented **Haversine distance formula** on the frontend for client-side distance calculations

---

## ⚙️ Backend Skills

* Designed and built a **RESTful API** with Express.js following the **MVC architecture** (models, controllers, routes, services)
* Implemented **JWT-based authentication** with `jsonwebtoken` and **secure password hashing** with `bcrypt`
* Built a **token blacklist mechanism** (`BlacklistToken` model with TTL index) for secure user logout
* Developed a **real-time socket layer** using `socket.io` with **private room-based messaging** (`user_<id>`, `captain_<id>`)
* Implemented an **asynchronous sequential ride dispatch engine** (`dispatch.service.js`) that finds the nearest available captain and handles rejection/retry cascades
* Integrated **Geocoding** on the backend via Nominatim API (axios calls) to convert addresses to coordinates
* Used **MongoDB geospatial queries** (`$near`, `$nearSphere`) to find drivers within a radius
* Validated all incoming requests using **express-validator**
* Handled **race conditions** in ride acceptance (e.g., when two captains try to accept the same ride simultaneously)
* Managed **captain disconnect events** gracefully — re-dispatching rides or notifying users in real time
* Implemented **OTP-based ride start verification** to authenticate ride commencement
* Configured **CORS** and **cookie-parser** middleware for cross-origin and session support

---

## 🗄️ Database

* **MongoDB** (NoSQL) via **Mongoose ODM**
* Designed schemas for `User`, `Captain`, `Ride`, and `BlacklistToken` models
* Applied **2dsphere geospatial index** on captain `location` field (GeoJSON `Point` type) for proximity-based driver search
* Used **TTL indexes** on `BlacklistToken` for automatic token expiry cleanup
* Stored captain location as both legacy flat fields (`ltd`, `lng`) and GeoJSON format for backwards compatibility
* Used Mongoose **instance methods** (`generateAuthToken`, `comparePassword`) and **static methods** (`hashPassword`)
* Implemented **Mongoose population** (`populate`) for relational data linking between rides, users, and captains

---

## 📍 Key Features

* **Dual-role system** — separate flows for Riders and Captains with independent auth and dashboards
* **Real-time ride matching** — socket-based dispatch system that sequentially finds the nearest available captain
* **Live location tracking** — captain's GPS coordinates broadcast to rider in real time during active rides
* **Dynamic fare calculation** — distance-based pricing across three vehicle types (Car, Motorcycle, Auto)
* **Place autocomplete** — debounced address search using OpenStreetMap Nominatim API
* **Nearby POI discovery** — airports and train stations surfaced via Overpass API
* **Interactive map** — live map with user marker, destination marker, and real-time captain movement
* **OTP-based ride start** — one-time password verification before a ride begins
* **Ride lifecycle management** — full state machine: `searching → accepted → ongoing → completed / cancelled`
* **Captain rejection & re-dispatch** — automatic fallback to the next nearest captain on rejection or disconnect
* **Secure logout** — JWT blacklisting to invalidate tokens server-side
* **Docker-based deployment** — containerized frontend, backend, and MongoDB with Nginx as reverse proxy

---

## 🧠 Concepts Used

* RESTful API design (HTTP methods, status codes, resource-based routing)
* Real-time bidirectional communication (WebSockets via Socket.IO)
* JWT-based stateless authentication with token blacklisting
* Geospatial indexing and proximity queries (MongoDB `$near`, 2dsphere)
* GeoJSON standard for location data
* MVC & Service-layer architecture (separation of concerns)
* Asynchronous programming (async/await, non-blocking dispatch)
* Race condition handling with atomic MongoDB operations
* React Context API for global state management
* Protected route patterns for role-based access control (RBAC)
* Debouncing for performance-optimized API calls
* Haversine formula for great-circle distance calculation
* Containerization with Docker & multi-service orchestration via Docker Compose
* Reverse proxy configuration with Nginx

---

## 🎯 My Contribution

* Designed and developed the **complete full-stack architecture** from scratch — frontend, backend, and database
* Built the **real-time socket layer** handling driver dispatch, location streaming, ride acceptance, and disconnect recovery
* Implemented the **sequential dispatch engine** with automatic captain rejection and re-dispatch logic
* Developed **JWT authentication** for both Rider and Captain roles with secure bcrypt hashing and token blacklisting
* Integrated **OpenStreetMap APIs** (Nominatim + Overpass) for zero-cost geocoding, autocomplete, and nearby POI search
* Built the **interactive map interface** with live location updates, route display, and suggestion markers
* Designed all **MongoDB schemas** with geospatial indexes and relational population for performant data access
* Implemented **GSAP-powered UI animations** for booking panels, delivering a native-app-quality experience
* Containerized the entire application with **Docker Compose** and configured **Nginx** as a production reverse proxy
* Implemented the **complete ride lifecycle** — from booking and driver matching to OTP verification and ride completion
