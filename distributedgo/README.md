# DistributedGo

DistributedGo is an interactive educational platform designed for software architects and engineers to master distributed systems. It features curated learning tracks for Kafka, Advanced Go, and Redis, combining theoretical deep-dives with hands-on labs and simulations.

## Features

- **Specialized Learning Tracks:**
  - **Kafka Architecture:** Learn about KRaft consensus, storage mechanics, and zero-copy optimization.
  - **Go Expert:** Master the Go Runtime, G-M-P scheduler, and advanced concurrency patterns.
  - **Redis Distributed:** Understand distributed caching, replication, and clustering.
- **Interactive Dashboard:**
  - Track your progress daily.
  - Switch seamlessly between different learning tracks.
- **Progress Syncing:**
  - Automatically saves your progress to LocalStorage.
  - Syncs progress across devices via **Firebase Authentication** (Google Sign-In).
- **Virtual Machine Simulation:**
  - Includes a simulated Cloud VM connection interface for lab exercises.
- **Rich Content:**
  - Syntax-highlighted code blocks (using PrismJS).
  - Clean, focused reading experience.

## Tech Stack

- **Frontend:** [React](https://react.dev/) (v19) with [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** CSS3 with CSS Variables for theming.
- **Authentication & Database:** [Firebase Auth](https://firebase.google.com/docs/auth) & [Cloud Firestore](https://firebase.google.com/docs/firestore)
- **Syntax Highlighting:** [PrismJS](https://prismjs.com/)

## Project Structure

```
src/
├── components/      # UI Components (Sidebar, Content, UserProfile, VMConnect)
├── context/         # React Context (AuthContext for user state & progress)
├── data/            # Course content and curriculum definitions (courses.ts)
├── lib/             # Third-party service configurations (firebase.ts)
├── styles/          # Additional stylesheets
├── App.tsx          # Main layout and application logic
└── main.tsx         # Entry point
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/yourusername/distributedgo.git
    cd distributedgo
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Configuration (Firebase)

To enable authentication and cloud syncing, you need to configure Firebase.

1.  Create a project in the [Firebase Console](https://console.firebase.google.com/).
2.  Enable **Authentication** (Google Sign-In provider).
3.  Enable **Cloud Firestore**.
4.  Create a `.env` file in the root directory (or rename `.env.example` if available) and add your Firebase credentials:

    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    ```

    *Note: The application includes a fallback configuration for development/demo purposes if these variables are not provided, but authentication may fail.*

### Running the Application

Start the development server:

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

### Building for Production

To create a production-ready build:

```bash
npm run build
```

This will generate static files in the `dist/` directory.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.