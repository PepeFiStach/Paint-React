import './App.css';
import React, { Component } from 'react';
import { Stage, Layer, Image, Rect, Group } from 'react-konva';
import Konva from 'konva';
import ToolBar from './Component/ToolBar.jsx';
import Header from './Component/Header.jsx';
import ruber from './Image/ruber-white.png';

export default class AppTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'brush',
      isDrawing: false,
      color: '#df4b26',
      image: null,
      draggable: false,  
    };
  }

  componentDidMount() {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth / 2;
    canvas.height = window.innerHeight / 2;
    const context = canvas.getContext('2d');
    this.setState({canvas, context});
    alert('TEST VERSION');
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

    const stage = this.image.parent.parent.parent;
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
      x: this.lastPointerPosition.x - this.image.x() - this.image.parent.x(),
      y: this.lastPointerPosition.y - this.image.y() - this.image.parent.y(),
    }

    context.moveTo(localPos.x, localPos.y);
    const stage = this.image.parent.parent.parent;
    let pos = stage.getPointerPosition();

    localPos = {
      x: pos.x - this.image.x() - this.image.parent.x(),
      y: pos.y - this.image.y() - this.image.parent.y(),
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
    });
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
      FR.onload = () => {
        var img = new window.Image();
        // img.width = canvas.width;
        // img.height = canvas.height;
        img.src = FR.result;
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
      el.value = '';
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
    const stageURL = this.group.toDataURL('image/png');
    this.downloadImg(stageURL, 'img');
  }

  draggDrawCanvas = (e) => {
    console.log(this.image.parent.x());
    if (e.target.className === 'Rect') {
      this.setState({
        draggable: true,
      });
    } else {
      this.setState({
        draggable: false,
      });
    }
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

            <Layer>
              <Group ref={node => {this.group = node}} draggable={this.state.draggable}>

                <Rect width={window.innerWidth / 2} 
                  height={window.innerHeight / 2} 
                  x={window.innerWidth / 4}
                  y={window.innerHeight / 4}
                  strokeWidth={20}
                  stroke={'black'}
                  onMouseDown={this.draggDrawCanvas}
                  onMouseUp={() => {this.setState({draggable: false})}}>
                </Rect>

                <Image ref={node => {this.imagee = node}}
                  image={image}
                  // fill={'white'}   
                  x={window.innerWidth / 4}
                  y={window.innerHeight / 4}
                />

                <Image ref={node => {this.image = node}}
                  image={canvas}
                  // stroke={'blue'}
                  x={window.innerWidth / 4}
                  y={window.innerHeight / 4}
                  onMouseDown={this.mouseDown.bind(this)}
                  onMouseUp={this.mouseUp.bind(this)} 
                  onMouseMove={this.mouseMove.bind(this)}
                />

              </Group>
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