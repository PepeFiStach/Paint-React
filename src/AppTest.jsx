import './App.css';
import React, { Component } from 'react';
import { Stage, Layer, Image, Rect, Group, Transformer, Text } from 'react-konva';
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
      isMouseOnCanvas: false,
      LAYERS: [],
      s: false,
    };
  }
  
  componentDidMount() {
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth / 2;
    canvas.height = window.innerHeight / 2;
    const context = canvas.getContext('2d');
    this.setState({canvas, context});

    this.image = new Konva.Image({
      image: canvas,
      x: window.innerWidth / 4,
      y: window.innerHeight / 4,
      stroke: 'black',
      id: 'can'
    });
    
    for (let i = 0; i < 5; i++) {
      console.error('TEST VERSION' + i);
    }
    // this.updateText();
    this.displayLayer();
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
      isMouseOnCanvas: false,
    });
  }

  clickOnFirstLayer = (e) => {
    const { LAYERS, canvas, s, context } = this.state;
    const stageLayer = this.stage.getStage().children;
    // const image = new Konva.Image({
    //   image: canvas,
    //   x: window.innerWidth / 4,
    //   y: window.innerHeight / 4,
    //   stroke: 'black',
    //   id: 'can'
    // });

    LAYERS.forEach((layer, index) => {
      if (layer.activeLayer === 'true') {
        stageLayer.forEach((l, i) => {
          if(l._id === layer.key) {  
            const p = l.children;
            p.forEach(ss => {
              console.log(ss);
              if(ss.id() === 'can') {
                return;
              }
            });
            l.add(this.image);
            console.log(l);
            // if (s === false) {
            //   console.log('s');
            //   l.add(image);
            //   this.setState({
            //     s: true,
            //   })
            // }              
            // console.log(l);
            // console.log(e.target);
            this.image.on('mousedown', () => {
              this.mouseDown();
            })
            this.image.on('mouseup', () => {
              this.mouseUp();
            })
            this.image.on('mousemove', () => {
              this.mouseMove();
            })
          }
        })
      }
    });
    this.stage.getStage().draw();
  }

  mouseDown() {
    this.setState({
      isDrawing: true,
      isMouseOnCanvas: true,
    });
    
    const stage = this.image.parent.parent;
    // const stage = this.image.parent.parent.parent;
    this.lastPointerPosition = stage.getPointerPosition();
  }

  preventMouseOverCanvas = (e) => {
    const {test} = this.state;
    if (e.target.className === undefined) {
      this.setState({
        isDrawing: false,
      });
    }
  }

  mouseMove() {
    const { LAYERS } = this.state;
    LAYERS.forEach((l, index) => {
      if (l.activeLayer === 'true') {
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
          x: this.lastPointerPosition.x - this.image.x() - (this.image.parent.x()),
          y: this.lastPointerPosition.y - this.image.y() - (this.image.parent.y()),
        }

        context.moveTo(localPos.x, localPos.y);
        const stage = this.image.parent.parent;
        // const stage = this.image.parent.parent.parent;
        let pos = stage.getPointerPosition();

        localPos = {
          x: pos.x - this.image.x() - (this.image.parent.x()),
          y: pos.y - this.image.y() - (this.image.parent.y()),
        }

        context.lineTo(localPos.x, localPos.y);
        context.closePath();
        context.stroke();
        this.lastPointerPosition = pos;
        // this.image.getLayer().draw(); 
        this.stage.getStage().draw();
      }
    });
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

  addResize = () => {
    // const stage = this.transformer.getStage();
    // const rectangle = stage.findOne(".rectange-name");
    // this.transformer.attachTo(rectangle);
    // this.transformer.getLayer().batchDraw();


    // const stage = this.image.parent.parent.parent;
    // console.log(stage);
    
    // this.transformer.attachTo(this.group);
    // this.transformer.getLayer().batchDraw();
  }

  updateText = () => {
    var lines = [
      'x: ' + this.group.x(),
      'y: ' + this.group.y(),
      'rotation: ' + this.group.rotation(),
      'width: ' + this.group.width(),
      'height: ' + this.group.height(),
      'scaleX: ' + this.group.scaleX(),
      'scaleY: ' + this.group.scaleY(),
      'widthCanvas: ' + this.image.width(),
      'heightCanvas: ' + this.image.height(),
    ];
    this.text.text(lines.join('\n'))
    this.text.getLayer().batchDraw();
  }

  addLayer = () => {
      let layer = new Konva.Layer();
      this.stage.getStage().add(layer);
      const { LAYERS } = this.state;
      let layerTMP = LAYERS;
      layerTMP.push({
          name: layer.nodeType,
          key: layer._id,
          activeLayer: 'false',
      });

      this.setState({
          LAYERS: layerTMP,
      });
  }

  clickLayer = (e) => {
    const { LAYERS } = this.state;
    let layerTMP = LAYERS;

    layerTMP.forEach((l, i) => {
      if (e.target.id === l.key.toString()) {
        if (l.activeLayer === 'false')
          l.activeLayer = 'true';
        else 
          l.activeLayer = 'false';
      }
    });

    this.setState({
      LAYERS: layerTMP,
    });
  }

  removeLayer = (e) => {
    const { LAYERS } = this.state;
    let layerTMP = LAYERS;
    const stageLayer = this.stage.getStage().children;

    layerTMP.forEach((l, i) => {
      if (l.activeLayer === 'true') {
        stageLayer.forEach((layer, index) => {
          if(layer._id === l.key) {
            layer.getLayer().remove();
          }
        });

        layerTMP.splice(i, 1);
      }
    });
    
    this.setState({
      LAYERS: layerTMP,
    });
  }

  displayLayer = () => {
      const { LAYERS } = this.state;
      let layerTMP = LAYERS;
      const stageLayer = this.stage.getStage().children;
      stageLayer.forEach((layer, index) => {
        // console.log(layer._id);
        if (layer.id() === 'tool-bar') {
          return;
        }

          layerTMP.push({
              name: layer.nodeType,
              key: layer._id,
              activeLayer: 'false',
          });
      });

      this.setState({
          LAYERS: layerTMP,
      });
  }

  render() {
    const {canvas, image} = this.state;
    return (
      <div className='app-wrapper wrapper'>
        
        <Header clearDrawingPlace={this.clearDrawingPlace}
          addImage={this.addImage}
          clearAll={this.clearAll}
          saveImg={this.saveImg}
          clickOnFirstLayer={this.clickOnFirstLayer}
        />

        <div>
            <ul>
                {
                    this.state.LAYERS.map(layer => {
                        return (
                            <div>
                                <li key={layer.key}>{layer.name}{layer.key}{layer.activeLayer}</li>
                                <button id={layer.key} onMouseDown={this.clickLayer}>c</button>
                            </div>
                        )
                    })
                }
            </ul>
            <button onMouseDown={this.addLayer}>add</button>
            <button onMouseDown={this.removeLayer}>remove</button>
        </div>

        <div className='app-body'>
          <Stage width={window.innerWidth} height={window.innerHeight} onMouseMove={this.preventMouseOverCanvas}
            ref={node => { this.stage = node }}>
            <Layer 
              onMouseDown={this.clickOnFirstLayer}
              >
              {/* <Rect width={50} height={50} fill={'black'}
                            onMouseDown={this.clickOnFirstLayer}
              ></Rect> */}
              {/* <Text x={100} y={100} ref={node => { this.text = node }}/>
              <Rect width={20} height={20} fill={'pink'} x={300} onMouseDown={this.addResize}/>
              <Transformer ref={node => {this.transformer = node}} />
              <Group ref={node => {this.group = node}} 
                draggable={this.state.draggable} 
                onDragMove={this.updateText}
                onTransform={this.updateText}
              > */}

                {/* <Rect width={this.state.widthFrame + 15}
                  height={this.state.heightFrame + 15}
                  x={(window.innerWidth / 4) - 8}
                  y={(window.innerHeight / 4) - 8}
                  strokeWidth={15} // for 10 is 11, 11, 5, 5 ; for 15 is 15, 15, 8, 8
                  stroke={'black'}
                  onMouseDown={this.draggDrawCanvas}
                  onMouseUp={() => { this.setState({ draggable: false }) }}>
                </Rect>

                <Image ref={node => { this.imagee = node }}
                  image={image}
                  // fill={'white'}   
                  x={window.innerWidth / 4}
                  y={window.innerHeight / 4}
                  // draggable={true}
                /> */}

                {/* <Image ref={node => { this.image = node }}
                  // image={canvas}
                  stroke={'yellow'}
                  x={window.innerWidth / 4}
                  y={window.innerHeight / 4}
                  width={window.innerWidth / 2}
                  height={window.innerHeight / 2}
                  id={'start'}
                  // onMouseDown={this.mouseDown.bind(this)}
                  // onMouseUp={this.mouseUp.bind(this)}
                  // onMouseMove={this.mouseMove.bind(this)}
                /> */}

              {/* </Group> */}
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