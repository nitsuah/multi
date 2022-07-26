import React from 'react';
import Spline from '@splinetool/react-spline';
import Footer from '../components/Footer';
import "../styles/App.css";

// CONSTANTS
const SPLINE_SCENE = `https://prod.spline.design/lwFGUGO5nCfnnDQU/scene.splinecode`;

const Home = () => {

  const renderHome = () => (
        <div className="container">
          <div className="projects-container">
            <div className="projects-card bg-blur">
              <button className="poly-wallet" onClick={() => window.open("/play","_self")}><h3>PLAY</h3></button>
              <div>
                <h4>Free to play Mutliplayer!</h4></div>
              </div>
            <div className="projects-card bg-blur">
              <button className="poly-wallet" onClick={() => window.open("/solo","_self")}><h3>PLAY</h3></button>
              <div>
                <h4>Free to play SOLO!</h4></div>
              </div>
            <div className="projects-card bg-blur">
              <button className="poly-wallet" onClick={() => window.open("https://darkmoon.dev","_")}><h3>MARKET</h3></button>
              <div>
              <h4>Proceeds will go to opensource software we source.</h4>
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
    		<div className="App">
        <div className="container">
        <div className="header">
            <h2>PLAY🌑DARKMOON</h2>
          </div>
            <Spline scene={SPLINE_SCENE} />
          <div className="middle-row">
            {renderHome()}
          </div>
          <div className="footer-container">
					  <Footer />
				  </div>
        </div>
      </div>
    );
};

export default Home