# DARKMOON.DEV

[![CI](https://github.com/Nitsuah-Labs/multi/actions/workflows/ci.yml/badge.svg)](https://github.com/Nitsuah-Labs/multi/actions)
[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/sites/your-site/deploys)

> Real-time multiplayer 3D environment built with React Three Fiber, Socket.io, and Vite

**Live Demo:** [darkmoon.dev](https://darkmoon.dev)

## ✨ Features

- 🎮 **Multiplayer 3D Scenes** — Real-time player synchronization with React Three Fiber
- 🔌 **WebSocket Communication** — Low-latency networking via Socket.io
- ⚡ **Modern Tooling** — Vite for lightning-fast builds and HMR
- 📱 **Responsive Design** — Works across desktop and mobile devices
- 🧪 **Full Test Suite** — Vitest + Testing Library with coverage reporting
- 🚀 **CI/CD Pipeline** — GitHub Actions with automated linting and testing
- 🎨 **Code Quality** — ESLint, Prettier, TypeScript strict mode, pre-commit hooks

## 🚀 Quick Start

### Docs

Check for `.md` files in docs/ directory for detailed documentation on architecture, components, and deployment.

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone git@github.com:Nitsuah-Labs/multi.git
cd multi

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:4444`.

## 📜 Available Scripts

| Script                 | Description                                              |
| ---------------------- | -------------------------------------------------------- |
| `npm run dev`          | Start development server with hot reload                 |
| `npm run build`        | Build for production                                     |
| `npm start`            | Start production server                                  |
| `npm run lint`         | Lint code with ESLint (auto-fix enabled)                 |
| `npm run format`       | Format code with Prettier                                |
| `npm run format:check` | Check code formatting                                    |
| `npm run typecheck`    | Run TypeScript type checking                             |
| `npm test`             | Run test suite with Vitest                               |
| `npm run ci`           | Run all CI checks locally (typecheck, lint, test, build) |

### Manual CI Check

Before pushing, you can run the full CI pipeline locally:

```bash
# PowerShell (Windows)
.\scripts\ci-check.ps1

# Bash (Linux/Mac)
./scripts/ci-check.sh
```

## 📁 Project Structure

```bash
multi/
├── .github/              # GitHub Actions CI/CD workflows
├── .husky/               # Git hooks for pre-commit validation
├── config/               # Configuration files (ESLint, Prettier, Vitest)
├── logs/                 # Build reports and logs (gitignored)
├── scripts/              # Developer utility scripts
├── src/
│   ├── __tests__/        # Test files
│   ├── assets/           # Static assets
│   ├── components/       # Reusable React components
│   │   ├── characterControls.ts
│   │   ├── Footer.jsx
│   │   └── utils.ts
│   ├── pages/            # Main application pages
│   │   ├── App.tsx       # Root component with routing
│   │   ├── Home.tsx      # Landing page
│   │   ├── Lobby.tsx     # Multiplayer lobby with 3D scene
│   │   └── Solo.tsx      # Single-player mode
│   ├── styles/           # CSS stylesheets
│   └── index.tsx         # Application entry point
├── develop.js            # Development server with Vite
├── server.js             # Production server with Socket.io
├── netlify.toml          # Netlify deployment configuration
├── tsconfig.json         # TypeScript configuration
└── vite.config.js        # Vite build configuration
```

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Generate coverage report:

```bash
npm test -- --coverage
```

## 🚢 Deployment

### Netlify

This project is configured for Netlify deployment:

1. Connect your GitHub repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist`

The `netlify.toml` file includes SPA routing configuration.

### Manual Deployment

```bash
# Build the project
npm run build

# Start production server
npm start
```

## 🛠️ Development

### Pre-commit Hooks

This project uses Husky and lint-staged to enforce code quality:

- Prettier formatting
- ESLint checks
- TypeScript type checking

Hooks run automatically on commit. To bypass (not recommended):

```bash
git commit --no-verify
```

### Code Style

- **TypeScript**: Strict mode enabled
- **React**: Functional components with hooks
- **Formatting**: Prettier with 4-space indentation
- **Linting**: ESLint with React, TypeScript, and a11y rules

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:

- All tests pass (`npm test`)
- Code is linted (`npm run lint`)
- Types are valid (`npm run typecheck`)

## 📝 License

MIT © 2025 Nitsuah Labs

---

**Original boilerplate:** [R3F.Multiplayer](https://github.com/juniorxsound/R3F.Multiplayer) by [@juniorxsound](https://github.com/juniorxsound)
