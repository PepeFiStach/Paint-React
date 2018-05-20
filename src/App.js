import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Stage, Layer, Text } from "react-konva";
import ColoredRect from './Component/DrawingPlace.jsx';
import ToolBar from './Component/ToolBar.jsx';

class App extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div className='app-wrapper wrapper'>

        <div className='header'>
          <div className='header-wrapper wrapper'>

          </div>
        </div>

        <div className='app-body'>
          <div className='app-body-wrapper wrapper'>
            <ColoredRect />            
          </div>
        </div>

        <div className='footer'>
          <div className='footer-wrapper wrapper'>

          </div>
        </div>
        
      </div>
    );
  }
}

export default App;
