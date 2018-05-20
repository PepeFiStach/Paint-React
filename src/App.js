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
      <ColoredRect />            
    );
  }
}

export default App;
