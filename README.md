# Personal CRM

This is a self-hosted **CRM (Customer Relationship Management)** tool built using **React (Vite)** and **PocketBase**. It's tailored for personal use, not enterprise, and designed to help you organize relationships, interactions, and activity across accounts, subaccounts, and contacts.

---

## ✨ Features

- **Modular CRM Structure**  
  Accounts, subaccounts, contacts (internal/external), organizations, and more.
- **Clean, Responsive UI**  
  Built with **Flowbite React + TailwindCSS**, designed for dark mode by default.
- **Fast & Self-Hosted**  
  Powered by **PocketBase** – lightweight, portable, and serverless-friendly.
- **Real-Time Query Management**  
  Uses **TanStack Query (React Query)** for caching and reactive UI updates.
- **TypeScript-First**  
  Fully typed frontend for reliability and maintainability.
- **Customizable Entities**  
  Built for flexibility: adapt it to your own data structure as needed.

---

## 📁 Tech Stack

| Tech              | Description                        |
|-------------------|------------------------------------|
| **React + Vite**  | Frontend framework & dev tooling   |
| **PocketBase**    | Backend database & auth (SQLite)   |
| **Flowbite React**| UI components styled with Tailwind |
| **React Query**   | Data fetching & cache management   |
| **React Router**  | SPA routing                        |
| **TypeScript**    | Type safety & DX                   |

---

## 💂 Project Structure

```
crm/
├── backend/               # PocketBase backend
│   ├── pocketbase         # Executable
│   └── pb_data/           # Database files
├── frontend/              # React + Vite frontend
│   ├── src/
│   │   ├── api/           # All API hooks (PocketBase queries)
│   │   ├── components/    # UI components
│   │   ├── pages/         # Route-based pages
│   │   ├── types/         # Type definitions (if applicable)
│   │   └── utils/         # Utilities
│   └── public/
├── .github/               # (Optional) GitHub Actions / Dependabot
└── README.md
```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repo
```bash
git clone https://github.com/YOUR_USERNAME/crm.git
cd crm
```

### 2️⃣ Run the Backend (PocketBase)
```bash
cd backend
./pocketbase serve --http=localhost:8090
```

### 3️⃣ Run the Frontend (Vite Dev Server)
```bash
cd frontend
npm install
npm run dev
```

### 4️⃣ Access in Browser
- **Frontend:** http://localhost:5173  
- **Backend API / Admin Panel:** http://localhost:8090

---

## 🔪 Development Notes

- PocketBase is used **headlessly** in-app, but can be accessed via the admin panel for schema/record management.
- Data fetches are cached with **React Query**.
- Addresses, Contacts, and Organizations are relationally linked using PocketBase’s native relations.

### Dependency Notes

- **24 Mar 2025:** ⚠️ Using Tailwind CSS v4 with flowbite-react@0.10.2 and eslint-plugin-tailwindcss@3.18.0 — peer dep conflicts ignored for now since app runs fine. Will monitor for updates or breakages.


---

## 📌 Future Goals (Optional)

- [ ] Add a Kanban view for Accounts by status  
- [ ] Mobile PWA packaging  
- [ ] Daily/Weekly Digest of CRM activity  
- [ ] Role-based filtering or user tagging

---

## 📜 License

MIT – do what you want, just don’t resell it as-is.

