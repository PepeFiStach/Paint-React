import React, { Component } from 'react';
import logo from './Image/logo.svg';
import './App.css';
import { Stage, Layer, Text, Rect } from "react-konva";
import ColoredRect from './Component/DrawingPlace.jsx';
import ToolBar from './Component/ToolBar.jsx';

class App extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className='app-wrapper wrapper'>
        
        <div className='app-body'>
          <div className='app-body-wrapper wrapper'>
            <ColoredRect />   
          </div>
        </div>

        <div className='footer'>
          <div className='footer-wrapper wrapper'>
            Soon there will be a footer here !
          </div>
        </div>

      </div>
    );
  }
}

export default App;
