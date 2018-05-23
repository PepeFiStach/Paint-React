import React, { Component } from 'react';
import logo from './Image/logo.svg';
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
            <div className='nav-bar'>
              <ul className='nav-bar-list list'>
                <li className='nav-bar-list-iteam'>
                <a>OPEN</a>
                </li>

                <li className='nav-bar-list-iteam'>
                <a>CLEAR</a>
                </li>

                <li className='nav-bar-list-iteam'>
                <a>SAVE</a>
                </li>
              </ul>
            </div>
          </div>
        </div>

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
