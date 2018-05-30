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
      widthFrame: window.innerWidth / 2,
      heightFrame: window.innerHeight / 2,
      test: false,
    };
  }

  componentDidMount() {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth / 2;
    canvas.height = window.innerHeight / 2;
    const context = canvas.getContext('2d');
    this.setState({canvas, context});

    for (let i = 0; i < 20; i++) {
      console.error('TEST VERSION' + i);
    }
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
      test: false,
    });
    console.log(this.state.test);
  }

  mouseDown() {
    this.setState({
      isDrawing: true,
      test: true,
    });

    console.log('down');

    const stage = this.image.parent.parent.parent;
    this.lastPointerPosition = stage.getPointerPosition();
  }

  test = (e) => {
    const {test} = this.state;
    if (e.target.className === undefined) {
      this.setState({
        isDrawing: false,
      });
    }
    // if (test === true) {
    //   this.setState({
    //     isDrawing: true,
    //   });
    // } else {
    //   this.setState({
    //     isDrawing: false,
    //   })
    // }
  }

  mouseMove(e) {
    const {context, isDrawing, mode} = this.state;
    if (!isDrawing) {
      return;
    }

    console.log(e.target.className);

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
      widthFrame: window.innerWidth / 2,
      heightFrame: window.innerHeight / 2,
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
        img.src = FR.result;
        img.onload = () => {
          newCanvas.width = img.width;
          newCanvas.height = img.height;
          this.setState({
            image: img,
            canvas: newCanvas,
            context: newContext,
            widthFrame: img.width,
            heightFrame: img.height,
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
          <Stage width={window.innerWidth} height={window.innerHeight} onMouseMove={this.test}>

            <Layer>
              <Group ref={node => {this.group = node}} draggable={this.state.draggable}>

                <Rect width={this.state.widthFrame + 15} 
                  height={this.state.heightFrame + 15} 
                  x={(window.innerWidth / 4) - 8}
                  y={(window.innerHeight / 4) - 8}
                  strokeWidth={15} // for 10 is 11, 11, 5, 5 ; for 15 is 15, 15, 8, 8
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
                  // stroke={'yellow'}
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