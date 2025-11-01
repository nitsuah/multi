import React from "react";
import { useNavigate } from "react-router-dom";
// import Spline from '@splinetool/react-spline';
import Footer from "../components/Footer";
// import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBoundary from "../components/ErrorBoundary";
import "../styles/App.css";
import "../styles/Home.css";

// CONSTANTS - Spline temporarily disabled to debug React bundling issue
// const SPLINE_SCENE = `https://prod.spline.design/lwFGUGO5nCfnnDQU/scene.splinecode`;

const Home = () => {
  const navigate = useNavigate();

  const renderHome = () => (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <h1 className="hero-title">PLAY 🌑 DARKMOON</h1>
        <p className="hero-subtitle">
          An immersive 3D multiplayer tag experience in the browser
        </p>
        <button className="cta-play-button" onClick={() => navigate("/solo")}>
          <span className="cta-icon">🎮</span>
          <span>START PLAYING</span>
        </button>
        <div className="hero-badges">
          <span className="badge">Free to Play</span>
          <span className="badge">Browser-Based</span>
          <span className="badge">No Install</span>
        </div>
      </div>

      {/* Game Modes Grid */}
      <div className="game-modes-grid">
        <div
          className="mode-card mode-card-solo"
          onClick={() => navigate("/solo")}
          onKeyDown={(e) => e.key === "Enter" && navigate("/solo")}
          role="button"
          tabIndex={0}
        >
          <div className="mode-icon">🎯</div>
          <h3>Solo Practice</h3>
          <p>Hone your skills against AI opponents</p>
          <div className="mode-status status-live">● LIVE NOW</div>
        </div>

        <div className="mode-card mode-card-disabled">
          <div className="mode-icon">👥</div>
          <h3>Multiplayer Tag</h3>
          <p>Compete with players worldwide</p>
          <div className="mode-status status-coming-soon">⏳ Coming Soon</div>
        </div>

        <div className="mode-card mode-card-disabled">
          <div className="mode-icon">🏆</div>
          <h3>Tournament</h3>
          <p>Ranked competitive matches</p>
          <div className="mode-status status-coming-soon">⏳ Coming Soon</div>
        </div>
      </div>

      {/* Features Showcase */}
      <div className="features-section">
        <h2 className="section-title">Game Features</h2>
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">🎮</div>
            <h4>Smooth Controls</h4>
            <p>WASD movement with camera rotation & jumping</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🤖</div>
            <h4>Smart AI</h4>
            <p>Bots that chase and challenge you</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🌍</div>
            <h4>Dynamic Terrain</h4>
            <p>Procedurally generated landscapes</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">💬</div>
            <h4>Live Chat</h4>
            <p>Communicate with other players</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📱</div>
            <h4>Mobile Ready</h4>
            <p>Play on any device with touch controls</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🎨</div>
            <h4>Theme Support</h4>
            <p>Dark and light mode themes</p>
          </div>
        </div>
      </div>

      {/* Upcoming Features */}
      <div className="roadmap-section">
        <h2 className="section-title">🚀 Coming Soon</h2>
        <div className="roadmap-grid">
          <div className="roadmap-item">
            <div className="roadmap-number">01</div>
            <h4>Collectible Hunt Mode</h4>
            <p>Race to collect items scattered across the map</p>
          </div>
          <div className="roadmap-item">
            <div className="roadmap-number">02</div>
            <h4>Race Mode</h4>
            <p>Checkpoint-based racing with lap times</p>
          </div>
          <div className="roadmap-item">
            <div className="roadmap-number">03</div>
            <h4>Emotes & Actions</h4>
            <p>Express yourself with quick emotes</p>
          </div>
          <div className="roadmap-item">
            <div className="roadmap-number">04</div>
            <h4>Custom Avatars</h4>
            <p>Personalize your character appearance</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary>
      <div className="App">
        {/* Background Moon */}
        <div
          className="moon-background"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "150px",
            opacity: 0.15,
            userSelect: "none",
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          🌑
        </div>

        {renderHome()}

        <div
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            padding: "2rem 0",
          }}
        >
          <Footer />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Home;
