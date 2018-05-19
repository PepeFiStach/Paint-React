import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Stage, Layer, Text } from "react-konva";
import ColoredRect from './Component/DrawingPlace.jsx';

class App extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <ColoredRect />
        </Layer>
      </Stage>
    );
  }
}

export default App;
