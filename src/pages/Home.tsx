import React from 'react';
import Spline from '@splinetool/react-spline';
import Footer from '../components/Footer';
import "../styles/App.css";

// CONSTANTS
const SPLINE_SCENE = `https://prod.spline.design/lwFGUGO5nCfnnDQU/scene.splinecode`;

const Home = () => {

return (
    <div className="App">
      <div className="header left">
        <h1>DARKMOON🌑ABOUT</h1>
      </div>
      <div className="form-container">
					<Spline scene={SPLINE_SCENE}/>
				</div>
          <div className="projects-container">
            <div className="projects-card bg-blur">
              <button className="poly-wallet" onClick={() => window.open("/play/","_self")}><h3>PLAY</h3></button>
              <h4>Free to play during the Alpha!</h4>
            </div>
            <div className="projects-card bg-blur">
              <button className="poly-wallet" onClick={() => window.open("/","_self")}><h3>MARKET</h3></button><h4>Proceeds will fund opensourced software we used in our repo.</h4> 
            </div>
            <div className="projects-card bg-blur">
              <button className="mint-button" disabled><h3>MINT</h3></button><p>A contract will be developed to fund those projects directly from minting.</p>
            </div>
            </div>
            <Footer />
        </div>
    );
};

export default Home