## ⚡ Getting Started

This project is a **fictional doctor appointment system**.
It allows users to create an account,book appointments with different doctors, and send feedback.

The application consists of both a **backend** and a **frontend**, working together to provide a full-stacj experience.

## ⚙️ Backend

The backend is responsible for authentification, data handling, and API endpoints. It is built using the technologies:

### 🛠️ Built with

[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Express.js](https://img.shields.io/badge/Express.js-Backend-000000?logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![JWT Auth](https://img.shields.io/badge/Auth-JWT-d63aff?logo=jsonwebtokens&logoColor=white)](https://jwt.io)
[![Redis](https://img.shields.io/badge/Redis-Database-DC382D?logo=redis&logoColor=white)](https://redis.io)
[![Upstash](https://img.shields.io/badge/Upstash-Serverless_Redis-6C4EFF?logo=upstash&logoColor=white)](https://upstash.com)
[![Cloudflare Turnstile](https://img.shields.io/badge/Cloudflare-Turnstile-F38020?logo=cloudflare&logoColor=white)](https://developers.cloudflare.com/turnstile/)

## 💻 Frontend

The frontend handles the user interface and user interactions(UI/UX).

### 🛠️ is built with

[![Vite](https://img.shields.io/badge/Vite-Build_Tool-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Utility--First-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

Additional libraries and component used in the frontend:

[![Flowbite React](https://img.shields.io/badge/Flowbite-React-38BDF8?logo=flowbite&logoColor=white)](https://flowbite-react.com)
[![Lucide React](https://img.shields.io/badge/Lucide-React-000000?logo=lucide&logoColor=white)](https://lucide.dev)
[![react-hot-toast](https://img.shields.io/badge/react--hot--toast-Notifications-FF6F61?logo=react&logoColor=white)](https://react-hot-toast.com)
[![Axios](https://img.shields.io/badge/Axios-HTTP_Client-5A29E4?logo=axios&logoColor=white)](https://axios-http.com)

---

## 🎨 Screenshots & Features

Below are some screenshots & gifs showcasing the main features of the application.

### Home page

![Home Page](/ProjectScreenshots/Homepage.gif)
The user is greeted with a beautiful, clean, and modern interface that makes navigation intuitive and pleasant.

### Appointment Page

![Appointment Page](/ProjectScreenshots/AppointmentPage.gif)
Users can view a clear and organized list of available doctors and their schedules.

![More Doctors](/ProjectScreenshots/More%20Doctors.gif)
If there are multiple doctors in the same specialty, you can see both doctors' schedules and appointments at the same time.

![Make An appointment](/ProjectScreenshots/Appointment%20maker.gif)
Booking an appointment is straightforward, with a clean layout guiding the user through each step.

![All Appointments](/ProjectScreenshots/AllAppointments.gif)
View all appointments and provide feedback.

### DoctorPage

![Upcoming appointments](/ProjectScreenshots/View%20appointments.png)
![Dashboard](/ProjectScreenshots/Dashboard.png)
Doctors can review appointments and mark them as completed once they are finished, all within a clean and user-friendly interface.

### LoginPage

![Login Page](/ProjectScreenshots/LoginPage.gif)
The login page features a clean and modern design, allowing users to quickly and securely access their accounts with ease.

## 🚀 Installation & Run

Follow these steps to set up and run the project locally.

### Prerequisites

You will need accounts and credentials for the following services:\

1. **MongoDB**

   - Create a MongoDB account (e.g., via [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
   - Get your connection URI.
   - Set it as the environment variable:
     ```bash
     MONGODB=your_mongodb_connection_string
     ```

2. **Redis**

   - Create a Redis account (e.g., via [Redis](https://redis.io/))
   - Get the Redis URL and password.
   - Set them as environment variables:
     ```bash
     REDIS_HOST=your_redis_url
     REDIS_PORT=your_redis_port
     REDIS_PASSWORD=your_redis_password
     ```

3. **Upstash**

   - Create a Redis account (e.g., via [Upstash](https://upstash.com/))
   - Get the Upstash URL and token.
   - Set them as environment variables:
     ```bash
     UPSTASH_REST_URL=your_upstash_url
     UPSTASH_REST_TOKEN=your_upstash_token
     ```

4. **JWT Token Secret**

   - Generate a secret string for JWT authentication.
   - Set it as:
     ```bash
     JWT_SECRET_KEY=your_jwt_secret
     ```

5. **Cloudflare Turnstile** (for CAPTCHA / bot protection)
   - Create a Turnstile account at [Cloudflare Turnstile](https://www.cloudflare.com/turnstile/)
   - Get your site key and secret key.
   - Set them as:
     ```bash
     TURNSTILE_SITE_KEY=your_turnstile_site_key # in frontend
     TURNSTILE_SECRET_KEY=your_turnstile_secret_key # in backend
     ```

### Clone the repository

```bash
git clone https://github.com/huncijr/Doctor-Appointment-Project.git

cd your-repository

cd Backend
npm install
npm run dev

The backend should now run on http://localhost:5001
.

cd Frontend
npm install
npm run dev
The frontend should now run on http://localhost:5173/
```
