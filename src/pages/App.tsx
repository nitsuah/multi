import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorBoundary from "../components/ErrorBoundary";
import { ThemeProvider } from "../contexts/ThemeContext";

// Lazy load pages for better performance
const Home = lazy(() => import("./Home"));
const Lobby = lazy(() => import("./Lobby"));
const Solo = lazy(() => import("./Solo"));

const NotFound = () => (
  <div style={{ textAlign: "center", marginTop: "2rem" }}>
    <h2>404 - Page Not Found</h2>
    <p>The page you are looking for does not exist.</p>
  </div>
);

const App = () => {
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <Router
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/play" element={<Lobby />} />
              <Route path="/solo" element={<Solo />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Router>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default App;
