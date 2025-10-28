import React from 'react';
import { useNavigate } from 'react-router-dom';
// import Spline from '@splinetool/react-spline';
import Footer from '../components/Footer';
// import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBoundary from '../components/ErrorBoundary';
import "../styles/App.css";

// CONSTANTS - Spline temporarily disabled to debug React bundling issue
// const SPLINE_SCENE = `https://prod.spline.design/lwFGUGO5nCfnnDQU/scene.splinecode`;


const Home = () => {
  const navigate = useNavigate();

  const renderHome = () => (
    <div className="container">
      <div className="projects-container">
        <div className="projects-card bg-blur">
          <button className="poly-wallet" onClick={() => navigate('/play')}><h3>PLAY</h3></button>
          <div>
            <h4>Free to play Multiplayer!</h4>
          </div>
        </div>
        <div className="projects-card bg-blur">
          <button className="poly-wallet" onClick={() => navigate('/solo')}><h3>PLAY</h3></button>
          <div>
            <h4>Free to play SOLO!</h4>
          </div>
        </div>
        <div className="projects-card bg-blur">
          <button className="neutral-wallet"><h3>MARKET</h3></button>
          <div>
            <h4>Proceeds will go to open source software we source.</h4>
          </div>
        </div>
        <div className="projects-card bg-blur">
          <button className="neutral-wallet"><h3>MINT</h3></button>
          <div>
            <p>The Mint contract will fund projects directly.</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary>
      <div className="App">
        <div className="container">
          <div className="header">
            <h2>PLAY🌑DARKMOON</h2>
          </div>
          {/* Spline temporarily disabled - causing React duplicate module issues */}
          {/* <Suspense fallback={<LoadingSpinner />}>
            <Spline scene={SPLINE_SCENE} />
          </Suspense> */}
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: '120px',
            opacity: 0.3,
            userSelect: 'none',
            pointerEvents: 'none'
          }}>
            🌑
          </div>
          <div className="middle-row">
            {renderHome()}
          </div>
          <div className="footer-container">
            <Footer />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Home