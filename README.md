# VICE - Feature Prioritization Platform

VICE is a next-generation platform for creating, managing, and prioritizing features for digital experiences. The application helps product teams prioritize features using the VICE scoring methodology, which evaluates features based on their **V**alue, **I**mpact, **C**onfidence, and **E**ase of implementation.

## Overview

VICE uses an ELO rating system to rank and compare features across multiple dimensions. Through a series of pairwise comparisons, the platform generates scores that help teams make data-driven decisions about what features to implement first.

## Key Features

- **Feature Hub**: Define and manage your project features with an intuitive interface
- **Pairwise Comparisons**: Compare features across multiple dimensions:
  - **Impact**: Which feature would have a greater impact?
  - **Ease**: Which feature would be easier to implement?
  - **Confidence**: Which feature are you more confident about?
- **Leaderboard**: View prioritized features with calculated VICE scores
- **Progress Tracking**: Monitor your project's prioritization process through detailed analytics

## Technology Stack

- [Next.js 15](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [TailwindCSS](https://tailwindcss.com/) - Styling and UI
- [React 19](https://react.dev/) - UI library
- Client-side storage for persistent data

## Project Structure

The code is organized by domain and page instead of layers:

```
app
├── page.tsx                    # Main landing page
├── (main)/                     # Main application routes
│   ├── add-features/           # Feature creation page
│   ├── choose/                 # Pairwise comparison page
│   ├── leaderboard/            # Results and prioritization page
│   └── utils/                  # Shared utilities
│       ├── elo.ts              # ELO rating implementation
│       └── feature-storage.ts  # Local storage management
├── components/                 # Shared React components
└── lib/                        # Common utilities and configurations
```

## File Conventions

Each action, component, and test has its own file and suffix:
- `.action.ts`: Server actions
- `.functional.ts`: Functional tests
- `.integration.ts`: Integration tests

## Getting Started

1. Install dependencies:
```bash
npm install
# or yarn install
```

2. Run the development server:
```bash
npm run dev
# or
yarn dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

## Usage Flow

1. **Define Features**: Start by adding your features in the Feature Hub
2. **Compare Features**: Work through a series of pairwise comparisons across different dimensions
3. **View Results**: Access the leaderboard to see your prioritized features with calculated VICE scores
4. **Make Decisions**: Use the prioritized list to inform your product roadmap and development plans

## Development

- **Development Mode**: `npm run dev`
- **Build for Production**: `npm run build`
- **Production Start**: `npm run start`
- **Linting**: `npm run lint`
