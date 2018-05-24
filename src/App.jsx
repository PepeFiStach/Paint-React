import './App.css';
import React, { Component } from 'react';
import { Stage, Layer, Image, Rect } from 'react-konva';
import Konva from 'konva';
import ToolBar from './Component/ToolBar.jsx';
import Header from './Component/Header.jsx';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'brush',
      isDrawing: false,
      color: '#df4b26'
    };
  }

  componentDidMount() {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth / 2;
    canvas.height = window.innerHeight / 2;
    const context = canvas.getContext('2d');

    
    this.setState({canvas, context});
  }

  changeMode = (dataFromToolBar) => {
    this.setState({mode: dataFromToolBar});
  }

  changeColor = (dataFromToolBar) => {
    this.setState({color: dataFromToolBar});
  }

  mouseUp() {
    this.setState({
      isDrawing: false,
    });
  }

  mouseDown() {
    this.setState({
      isDrawing: true,
    });

    const stage = this.image.parent.parent;
    this.lastPointerPosition = stage.getPointerPosition();
  }

  mouseMove() {
    const {context, isDrawing, mode} = this.state;
    if (!isDrawing) {
      return;
    }

    if (mode === 'brush') {
      context.globalCompositeOperation = 'source-over';
    }

    if (mode === 'eraser') {
      context.globalCompositeOperation = 'destination-out';
    }

    context.strokeStyle = this.state.color;
    context.lineJoin = "round";
    context.lineWidth = 5;
    context.beginPath();

    let localPos = {
      x: this.lastPointerPosition.x - this.image.x(),
      y: this.lastPointerPosition.y - this.image.y(),
    }

    context.moveTo(localPos.x, localPos.y);
    const stage = this.image.parent.parent;
    let pos = stage.getPointerPosition();

    localPos = {
      x: pos.x - this.image.x(),
      y: pos.y - this.image.y(),
    }

    context.lineTo(localPos.x, localPos.y);
    context.closePath();
    context.stroke();
    this.lastPointerPosition = pos;
    this.image.getLayer().draw();
  }

  clearDrawingPlace = () => {
    const {canvas, context} = this.state;
    const navBarIteam = document.querySelector('.nav-bar-list-iteam');
    context.clearRect(0, 0, canvas.width, canvas.height);
    this.image.getLayer().draw();
  }

  render() {
    const {canvas} = this.state;
    return (
      <div className='app-wrapper wrapper'>
      
        <Header clearDrawingPlace={this.clearDrawingPlace}/>

        <div className='app-body'>
          <Stage width={window.innerWidth} height={window.innerHeight}>
            <Layer>
              <Image ref={node => {this.image = node}}
                image={canvas}
                stroke={'blue'}
                x={window.innerWidth / 4}
                y={window.innerHeight / 4}
                fill={'black'}
                onMouseDown={this.mouseDown.bind(this)}
                onMouseUp={this.mouseUp.bind(this)} 
                onMouseMove={this.mouseMove.bind(this)}
              />
            </Layer>
                <ToolBar mode={this.changeMode} 
                  color={this.changeColor}
                />
          </Stage>
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