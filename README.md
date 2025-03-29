# Personal CRM

A self-hosted CRM (Customer Relationship Management) system built with React, TypeScript, and PocketBase. Designed for personal or small business use with a focus on modularity, separation of concerns, and a clean, responsive UI.

## ✨ Features

- **Hierarchical Data Structure**
  - Organizations → Accounts → Subaccounts with proper relationship management
  - Internal/External contacts with context-aware filtering
  - Location tracking with address management

- **Audit Management & Visualization**
  - Track audit cycles with a visual floor matrix showing visited/skipped areas
  - Support for building floor tracking with customizable audit schedules
  - Schedule tracking with status indicators for pending/completed audits

- **Modern React Stack**
  - Built with React 18, TypeScript, and Vite for lightning-fast development
  - TanStack Query (React Query) for data fetching and state management
  - Clean, responsive UI with Flowbite + TailwindCSS
  - React Router v7 for navigation

- **Self-Hosted & Privacy-Focused**
  - PocketBase backend (SQLite) for simple, portable deployment
  - Can run entirely on a local network without internet connectivity
  - Easy backup and migration
  
## 🧰 Tech Stack

| Technology | Purpose |
|------------|---------|
| **Frontend** | |
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tooling |
| TanStack Query | Data management |
| React Router | Navigation |
| Flowbite React | UI components |
| TailwindCSS | Styling |
| ApexCharts | Data visualization |
| **Backend** | |
| PocketBase | Database & Auth |
| SQLite | Underlying storage |
| **Testing** | |
| Vitest | Unit testing |
| Testing Library | Component testing |

## 📁 Project Structure

```
crm/
├── src/
│   ├── api/              # API hooks (PocketBase queries)
│   │   ├── pocketbase.ts # PocketBase client singleton
│   │   ├── useAccounts.ts
│   │   ├── useAuditStatus.ts
│   │   ├── useAuth.ts
│   │   └── ...
│   ├── components/       # Reusable UI components
│   │   ├── shared/       # Cross-cutting components
│   │   ├── organizations/
│   │   ├── accounts/
│   │   ├── audits/       # Audit visualization components
│   │   └── ...
│   ├── pages/            # Route-based page components
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   ├── AccountDetail.tsx
│   │   └── ...
│   ├── utils/            # Utility functions
│   │   └── buildFloorMatrix.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── RoutesConfig.tsx
├── .env                  # Environment configuration
├── tests/                # Test files
└── public/
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/crm.git
   cd crm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   
   Create a `.env` file in the root directory:
   ```
   VITE_POCKETBASE_URL="http://127.0.0.1:8090"
   ```

4. **Start PocketBase**
   ```bash
   # In a separate terminal
   cd crm/backend
   ./pocketbase serve
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - PocketBase admin: http://localhost:8090/_/

## 📊 Key Features

### Audit Floor Matrix Visualization

The application includes a specialized visualization component that displays which floors have been visited during audits. This helps track coverage patterns over time:

- Green cells indicate visited floors
- Yellow cells indicate skipped floors
- Blue cells indicate excluded floors (configured in account settings)

### Hierarchical Organization Structure

- **Organizations**: Top-level entities that can contain multiple accounts
- **Accounts**: Specific client engagements or separate business units
- **Subaccounts**: Subdivisions of accounts for more granular tracking
- **Contacts**: Both internal (coworkers) and external (client contacts)

## 📋 Testing

Run tests with Vitest:

```bash
npm run test          # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # Generate coverage report
```

## 🔒 Authentication

The application uses PocketBase's built-in authentication, with forms for login/signup and protected routes that require authentication.

## 💻 Development Notes

- Uses React 18's concurrent features
- TanStack Query for data fetching, caching, and state management
- Modular approach with separate hooks for different entity types

## 📄 License

MIT