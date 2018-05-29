import './App.css';
import React, { Component } from 'react';
import { Stage, Layer, Image, Rect, Group } from 'react-konva';
import Konva from 'konva';
import ToolBar from './Component/ToolBar.jsx';
import Header from './Component/Header.jsx';
import ruber from './Image/ruber-white.png';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'brush',
      isDrawing: false,
      color: '#df4b26',
      image: null,  
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

  clearAll = () => {
    const {canvas, image} = this.state;
    canvas.width = window.innerWidth / 2;
    canvas.height = window.innerHeight / 2;
    this.clearDrawingPlace();
    this.imagee.getLayer().clear();
    this.setState({
      image: null,
    })
  }

  clearDrawingPlace = () => {
    const {canvas, context} = this.state;
    const navBarIteam = document.querySelector('.nav-bar-list-iteam');
    context.clearRect(0, 0, canvas.width, canvas.height);
    this.image.getLayer().draw();
  }

  addImage = (e) => {
    const {canvas, image} = this.state;
    const el = document.getElementById('test');
    this.clearDrawingPlace();

    /* INFO: BECAUSE I MUST UPDATE WIDTH AND HEIGHT CANVAS 
             WITHOUT THIS I MUST CLICK AND THEN SIZE CHANGE */
    const newCanvas = document.createElement('canvas');
    const newContext = newCanvas.getContext('2d');
    
    if (el.files && el.files[0]) {
      var FR = new FileReader();
      FR.onload = (e) => {
        var img = new window.Image();
        img.width = canvas.width;
        img.height = canvas.height;
        img.src = e.target.result;
        img.onload = () => {
          newCanvas.width = img.width;
          newCanvas.height = img.height;
          this.setState({
            image: img,
            canvas: newCanvas,
            context: newContext,
          });
        };
      };
      FR.readAsDataURL(el.files[0]);
    };
  }

  downloadImg (uri, name) {
    let link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  saveImg = () => {
    let group = new Konva.Group();
    group.add(this.imagee);
    group.add(this.image);
    this.layer.add(group);
    const stageURL = group.toDataURL('image/jpeg');
    this.downloadImg(stageURL, 'img');
    group.remove();
    this.layer.add(this.image);
    this.layerr.add(this.imagee);
  }

  render() {
    const {canvas, image} = this.state;
    return (
      <div className='app-wrapper wrapper'>
      
      <Header clearDrawingPlace={this.clearDrawingPlace}
          addImage={this.addImage}
          clearAll={this.clearAll}
          saveImg={this.saveImg}/>

        <div className='app-body'>
          <Stage width={window.innerWidth} height={window.innerHeight}>

            <Layer ref={node => {this.layerr = node}}>
              <Image ref={node => {this.imagee = node}}
                  image={image}
                  fill={'white'}   
                  x={window.innerWidth / 4}
                  y={window.innerHeight / 4}
                />
            </Layer>

            <Layer ref={node => {this.layer = node}}>
              <Image ref={node => {this.image = node}}
                image={canvas}
                stroke={'blue'}
                // fill={'white'}                
                x={window.innerWidth / 4}
                y={window.innerHeight / 4}
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