# Swiss-Army App

This is a modular, self-hosted application built using **React (Vite) + PocketBase**. It is designed to be a multi-functional personal management tool, with different modules ("apps") that serve various purposes, such as a **CRM, mood tracker, and gas mileage tracker**.

---

## 🚀 Features

- **📁 Modular Design** – Each feature (CRM, Mood Tracker, Gas Tracker) is an independent module.
- **🖥️ Frontend** – Built with **React + Vite**, styled using **Flowbite (Tailwind-based UI components)**.
- **📦 Backend** – Uses **PocketBase** for lightweight, self-hosted database & authentication.
- **⚡ Fast & Scalable** – Monorepo structure for easy expansion.
- **🔄 Automatic Dependency Updates** – Uses **Dependabot** for keeping dependencies up-to-date.
- **🌙 Dark Mode Support** – Adaptive UI with theme toggle.

---

## 📂 Project Structure

```
CRM/
├── backend/         # PocketBase backend (database & API)
│   ├── pb_data/     # Database storage
│   ├── pb_migrations/ # Database migrations
│   └── pocketbase   # PocketBase executable
├── frontend/        # React + Vite frontend
│   ├── src/
│   │   ├── apps/    # Modular apps (CRM, Mood Tracker, Gas Tracker)
│   │   ├── shared/
│   │   │   ├── ui/  # UI components (Cards, Header, etc.)
│   │   │   ├── ux/  # UX components (Loader, Toasts, etc.)
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── .github/         # GitHub workflows & Dependabot
│   ├── dependabot.yml # Automated dependency updates
└── README.md        # This file
```

---

## 🛠️ Setup & Installation

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/Maksed-Kunsiquat/CRM.git
cd CRM
```

### **2️⃣ Backend (PocketBase)**
```sh
cd backend
./pocketbase serve --http=localhost:8090
```

### **3️⃣ Frontend (React + Vite)**
```sh
cd frontend
npm install
npm run dev
```

### **4️⃣ Open in Browser**
```
Frontend:  http://localhost:5173
Backend (API):  http://localhost:8090
```

---

## 🔄 Updating Dependencies

This repo uses **Dependabot** to keep dependencies updated.

- To **manually update npm dependencies:**
  ```sh
  cd frontend
  npm outdated
  npm update
  ```
- To **manually update PocketBase (backend):**
  ```sh
  cd backend
  curl -fsSL https://pocketbase.io/releases/latest/pocketbase-linux-amd64 > pocketbase
  chmod +x pocketbase
  ```

---

## 🛠️ Technologies Used

| Tech | Purpose |
|------|---------|
| **React + Vite** | Frontend Framework |
| **PocketBase** | Backend Database & Auth |
| **Flowbite (Tailwind)** | UI Components |
| **React Query** | State Management |
| **TypeScript** | Typed Frontend Development |
| **React Router** | Frontend Routing |
| **Dependabot** | Automatic Dependency Updates |

---

## 📌 Future Plans
- ✅ **Improve UI animations & transitions**
- ✅ **Add "Recent Interactions" to CRM Dashboard**
- ✅ **Expand "Upcoming Events" with calendar integration**
- ✅ **Add more modules (Tasks, Finance Tracker, etc.)**

---

## 🤝 Contributing
Feel free to open issues, create pull requests, or suggest features!

---

## 📜 License
This project is licensed under **MIT License**.

