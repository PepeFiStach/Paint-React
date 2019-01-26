import './App.css';
import './Queries.css';
import React from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import Konva from 'konva';
import ToolBar from './Component/ToolBar';
import Shape from './Component/ToolBarComponent/Shape';
import Text from './Component/ToolBarComponent/Text';
import BezierCurve from './Component/ToolBarComponent/BezierCurve';
import Settings from './Component/Settings';
import Header from './Component/Header';
import Mouse from './Functionality/Mouse';
//import settings from './Image/icons/settings-var-flat/512x512.png';
import settingsImage from './Image/icons2/settings-outline/512x512.png';
import addImage from './Image/icons2/plus-circle-outline/512x512.png';
import trashImage from './Image/icons2/trash-var-outline/512x512.png';
import ArrowImage from './Image/icons2/location-arrow-outline/512x512.png';
import visibleImage from './Image/icons2/eye-outline/512x512bgw.png';
import visibleImageBlack from './Image/icons2/eye-outline/512x512bgb.png';

export default class AppTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'default',
      color: '#000',
      sizePencil : 5,
      sizeEraser : 5,
      sizeBezier: 5,
      shape: 'none',
      bezier: 'none',
      alpha : '100',
      text: 'off',
      brush: 'default',
      createBezierBtnClicked: false,
      filter : '',
      image: null,
      widthFrame: window.innerWidth / 2,
      heightFrame: window.innerHeight / 2,
      layerManagement: [],
      newFile: false,
      buttonTab: [],
    };

    this.defaultLayer = 0;
    this.border = 0;
  }
  
  componentDidMount() {
    document.oncontextmenu = new Function("return false;");
    this.getStage = this.stage.getStage();
    this.scaleBy = 1.1;
    this.preventCenter = false;
    this.saveAnchors = 0;
    this.tmpPointerPosition = {
      x: 0,
      y: 0,
    };
    this.anchorLocation = {
      start: 0,
      center: 0,
      end: 0,
    };
    this.saveFirstBezierPosition = undefined;
    this.saveLine = 0;
    this.saveBezier = 0;
    this.endPaintShape = false;

    this.navBar = document.querySelector('.nav-bar');
    this.footer = document.querySelector('footer');

    this.navBarHeight = parseInt(window.getComputedStyle(this.navBar).height, 10);
    this.footerHeight = parseInt(window.getComputedStyle(this.footer).height, 10);

    this.getStage.on('mousedown', (e) => {
      if (e.evt.button === 2) {
        this.getStage.draggable(true);
      }
    });

    this.getStage.on('mouseup', (e) => {
      this.getStage.draggable(false);
    });
    
    window.addEventListener('wheel', (e) => {
      this.Mouse.scroll(e, this.scaleBy, this.border);
    });
    
    this.getStage.on('mouseenter', () => {
      const el = document.querySelector('.mouseCircle');
      if (this.state.mode === 'pencil' || this.state.mode === 'eraser') {
        el.style.display = 'block';
      }
    });

    this.getStage.on('mouseleave', () => {
      const el = document.querySelector('.mouseCircle');
      el.style.display = 'none';
    });

    this.displayLayer();
    this.Shape = new Shape();
    this.Text = new Text();
    this.BezierCurve = new BezierCurve();
    this.Settings = new Settings();

  }

  componentDidUpdate() {
    this.Mouse = new Mouse(this.props, this.getStage, this.state, 
                          this.state.mode, this.state.color, 
                          this.state.sizePencil, this.state.brush,
                          this.state.sizeEraser, this.state.shape, this.state.alpha);
    console.log(this.getStage);
    console.log(this.state.mode);
    if (this.state.shape === 'rect' 
        || this.state.shape === 'star' 
        || this.state.shape === 'arrow'
        || this.state.shape === 'circle'
        || this.state.shape === 'ellipse'
        || this.state.text === 'on'
        || this.state.bezier === 'create-bezier') {
      this.addLayer(null);
      this.state.shape = 'none';
      this.state.bezier = 'none';
      this.state.text = 'off';
    }
    if (this.state.bezier === 'modify-bezier') {
      const { layerManagement } = this.state;
      const stageLayer = this.getStage.children;

      layerManagement.forEach(_layersManagement => {
        stageLayer.forEach((_stageLayers, i) => {
          if (_layersManagement.activeLayer === 'true') {
            if (_stageLayers._id === _layersManagement.key) {
              // this.saveAnchors = _stageLayers.find('Circle');
              // this.saveAnchors.forEach(anchor => {
              //   anchor.visible(true);
              // });
              this.saveAnchors = _stageLayers.find(node => {
                return node.id() === 'anchor';
              });
              this.saveAnchors.forEach(anchor => {
                anchor.visible(true);
              });
            }
          }
        });
      });
    }
    this.selectLayerManagementElColor();
    this.getStage.on('mousedown', (e) => {
      if (this.state.mode === 'bucket') {
        const { layerManagement } = this.state;
        const stageLayer = this.getStage.children;
        
        layerManagement.forEach(_layersManagement => {
          stageLayer.forEach((_stageLayers, i) => {
            if (_layersManagement.activeLayer === 'true') {
              if (_stageLayers._id === _layersManagement.key) {
                if (_stageLayers.children[0].id() === 'drawingPlace') {
                  // if(e.target === _stageLayers.children[0]) {
                    let canvas = _stageLayers.children[0].getImage();
                    let ctx = canvas.getContext('2d');
                    ctx.fillStyle = this.state.color;
                    ctx.fillRect(_stageLayers.children[0].x(), _stageLayers.children[0].y(), 
                                  _stageLayers.children[0].width(), _stageLayers.children[0].height());
                  // }
                }
                console.log(_stageLayers.children[0]);
                if (_stageLayers.children[0].id() === 'group') { // TODO: When you add Image you cant use bucket on Image because e.target !== _stageLayers.children[0].children[0] you must set to children[1]
                  if (_stageLayers.children[0].children[0].id() === 'imgPlace') {
                    // if (e.target === _stageLayers.children[0].children[1]) {
                      console.log(_stageLayers.children[0].children[1].getImage());
                      let canvas = _stageLayers.children[0].children[1].getImage();
                      let ctx = canvas.getContext('2d');
                      ctx.fillStyle = this.state.color;
                      ctx.fillRect(_stageLayers.children[0].children[1].x(), _stageLayers.children[0].children[1].y(),
                                    _stageLayers.width(), _stageLayers.height());
                    // }
                  }
                  if (_stageLayers.children[0].children[0].name() === 'shape') {
                    if (e.target === _stageLayers.children[0].children[0]) {
                      _stageLayers.children[0].children[0].fill(this.state.color);
                      _stageLayers.children[0].children[0].stroke(this.state.color);
                    }
                  }
                  if (_stageLayers.children[0].children[0].id() === 'text') {
                    if (e.target === _stageLayers.children[0].children[0]) {
                      _stageLayers.children[0].children[0].fill(this.state.color);
                    }
                  }
                }
              }
            }
          });
        });
        // console.log(e.target);
        // if (e.target.id() === 'drawingPlace') {
        //   let canvas = e.target.getImage();
        //   let ctx = canvas.getContext('2d');
        //   ctx.fillStyle = this.state.color;
        //   ctx.fillRect(e.target.x(), e.target.y(), e.target.width(), e.target.height());
        // }
        // if (e.target.name() === 'shape') {
        //   e.target.fill(this.state.color);
        //   e.target.stroke(this.state.color);
        // }
        this.getStage.draw();
      }
      if (this.state.mode === 'text') {
        const { layerManagement } = this.state;
        const stageLayer = this.getStage.children;

        layerManagement.forEach(_layersManagement => {
          stageLayer.forEach((_stageLayers, i) => {
            if (_layersManagement.activeLayer === 'true') {
              if (_stageLayers._id === _layersManagement.key) {
                let groupX = _stageLayers.children[0].x() * this.getStage.scaleX();
                let groupY = _stageLayers.children[0].y() * this.getStage.scaleY();

                let localPos = {
                  x: (((this.getStage.getPointerPosition().x
                    - this.getStage.x()
                    - groupX))
                    / this.getStage.scaleX()),

                  y: (((this.getStage.getPointerPosition().y
                    - this.getStage.y()
                    - groupY))
                    / this.getStage.scaleY())
                }
                //This for create Text
                _stageLayers.children[0].children[0].x(localPos.x);
                _stageLayers.children[0].children[0].y(localPos.y);
                _stageLayers.children[0].children[0].text('Some Text');
                // this.getStage.draw();
                _layersManagement.isOnIt = true;
                _stageLayers.attrs.isOnIt = true;
              }
            }
          });
        });
        this.offAllButtons();
      }
      else if (this.state.mode === 'shape' || this.state.mode === 'bezier') {
        this.endPaintShape = true;
        this.tmpPointerPosition = {
          x: this.getStage.getPointerPosition().x,
          y: this.getStage.getPointerPosition().y,
        }
        // this.tmpPointerPosition2 = {
        //   x: this.getStage.getPointerPosition().x,
        //   y: this.getStage.getPointerPosition().y,
        // }
      }
      // this.getStage.draw();     
    });
    this.getStage.on('mouseup', () => {
      if (this.state.mode === 'shape' || this.state.mode === 'bezier') {
        this.endPaintShape = false;
        let anchors;
        if (this.state.mode === 'bezier' && this.state.createBezierBtnClicked === true) {
          if (this.saveLine === 0) {
            // return;
          }
          console.log(this.saveLine);
          let line = this.saveLine;
          if (this.state.bezier !== 'modify-bezier') {
            let anchorss = this.getStage.find(node => {
              // return node.className === 'Circle' && node.id() === 'anchor'; 
              return node.id() === 'anchor'; 
            });
            anchorss.forEach(node => {
              node.visible(false);
              this.getStage.draw();
            });
            
            // ctx.clearRect(0, 0, this.saveLine.width, this.saveLine.height);
            // ctx.beginPath();
            // ctx.moveTo(this.anchorLocation.start.x, this.anchorLocation.start.y);
            // ctx.lineTo(this.anchorLocation.end.x, this.anchorLocation.end.y);
            // ctx.closePath();
            // ctx.stroke();
            
            // this.getStage.draw();
            if (this.anchorLocation.center.x < 0)
            this.anchorLocation.center.x = this.anchorLocation.center.x * (-1);
            
            if (this.anchorLocation.center.y < 0)
            this.anchorLocation.center.y = this.anchorLocation.center.y * (-1);
            
            this.BezierCurve.createAnchor(this.anchorLocation.start.x, this.anchorLocation.start.y, this.getStage);
            this.BezierCurve.createAnchor(this.anchorLocation.center.x, this.anchorLocation.center.y, this.getStage);
            this.BezierCurve.createAnchor(this.anchorLocation.center.x - 50, this.anchorLocation.center.y - 50, this.getStage);
            this.BezierCurve.createAnchor(this.anchorLocation.end.x, this.anchorLocation.end.y, this.getStage);
            anchors = this.getStage.find(node => {
              return node.id() === 'anchor' && node.visible();
            });
          } else {
            anchors = this.saveAnchors;
            // this.state.bezier = 'none';
            return;
          }

          // let anchors = this.getStage.find('Circle');
          this.line = this.getStage.find(node => {
            return node.className === 'Line';
          });
          line.tension(0);
          anchors.forEach(anchor => {
            anchor.on('dragmove', () => {
              // ctx.clearRect(0, 0, this.saveLine.width, this.saveLine.height);

              // ctx.beginPath();
              // ctx.moveTo(anchors[0].attrs.x, anchors[0].attrs.y);
              // ctx.bezierCurveTo(anchors[1].attrs.x, anchors[1].attrs.y,
              //                   anchors[2].attrs.x - 50, anchors[2].attrs.y - 50,
              //                   anchors[3].attrs.x, anchors[3].attrs.y);
              // ctx.stroke();
              line.points([anchors[0].attrs.x, anchors[0].attrs.y, anchors[1].attrs.x, anchors[1].attrs.y,
                anchors[2].attrs.x - 50, anchors[2].attrs.y - 50,
                anchors[3].attrs.x, anchors[3].attrs.y]);
              line.tension(0);
              line.bezier(true);

              anchor.parent.parent.draw();
              // this.getStage.draw();
            });
          });
          // let a = this.getStage.find(node => {
          //   return node.className === 'Circle' && node.visible(true);
          // });
          // this.saveBezier.setClip({
          //   x:  this.anchorLocation.start.x,
          //   y:  this.anchorLocation.start.y,
          //   width: Math.abs(this.anchorLocation.start.x - this.anchorLocation.end.x),
          //   height: Math.abs(this.anchorLocation.start.y - this.anchorLocation.end.y),
          // });
          // let tabX = [];
          // let tabY = [];
          // this.saveBezier.children.forEach(anchors => {
          //   if (anchors.id() === 'anchor') {
          //     tabX.push(anchors.x());
          //     tabY.push(anchors.y());
          //   }
          // });
          // console.table(tabX);
          // console.table(tabY);
          // let MaxX = Math.max.apply(Math, tabX);
          // let MaxY = Math.max.apply(Math, tabY);
          // console.log(MaxX);
          // console.log(MaxY);

          // let MinX = Math.min.apply(Math, tabX);
          // let MinY = Math.min.apply(Math, tabY);
          // console.log(MinX);
          // console.log(MinY);

          // this.saveBezier.clipFunc(function(ctx, e) {
          //   let tabX = [];
          //   let tabY = [];
          //   e.children.forEach(anchors => {
          //     if (anchors.id() === 'anchor') {
          //       tabX.push(anchors.x());
          //       tabY.push(anchors.y());
          //     }
          //   });
          //   let MaxX = Math.max.apply(Math, tabX);
          //   let MaxY = Math.max.apply(Math, tabY);

          //   let MinY = Math.min.apply(Math, tabY);
          //   let MinX = Math.min.apply(Math, tabX);
            // ctx.clearRect(0, 0, 800, 800);
            // console.log(e);
            // ctx.beginPath();
            // ctx.moveTo(e.children[1].attrs.x, e.children[1].attrs.y);
            // ctx.lineTo(e.children[4].attrs.x, e.children[4].attrs.y);
            // ctx.closePath();
            // ctx.stroke();

            // // ctx.clearRect(0, 0, 800, 800);
            // ctx.beginPath();
            // ctx.moveTo(e.children[1].attrs.x, e.children[1].attrs.y);
            // ctx.bezierCurveTo(e.children[2].attrs.x, e.children[2].attrs.y,
            //                   e.children[3].attrs.x - 50, e.children[3].attrs.y - 50,
            //                   e.children[4].attrs.x, e.children[4].attrs.y);
            // ctx.stroke();

            // ctx.clearRect(0, 0, 800, 800);
            // ctx.beginPath();
            // ctx.arc(e.children[1].attrs.x, e.children[1].attrs.y, e.children[1].attrs.radius, 0, Math.PI * 2, false);
            // ctx.arc(e.children[2].attrs.x, e.children[2].attrs.y, e.children[2].attrs.radius, 0, Math.PI * 2, false);
            // ctx.arc(e.children[3].attrs.x, e.children[3].attrs.y, e.children[3].attrs.radius, 0, Math.PI * 2, false);
            // ctx.arc(e.children[4].attrs.x, e.children[4].attrs.y, e.children[4].attrs.radius, 0, Math.PI * 2, false);
            // ctx.stroke();
            // ctx.closePath();
            // // ctx.fill('nonzero');
            
            // ctx.clearRect(0, 0, 800, 800);
            // ctx.rect(MinX - 20, MinY - 20, (Math.abs(MaxX - MinX) + 40), (Math.abs(MinY - MaxY) + 40));
          //});
          this.getStage.draw();
        }
        console.log(this.state.bezier);
        if (this.state.bezier !== 'modify-bezier') {
          this.offAllButtons();
        }
        this.saveFirstBezierPosition = undefined;
        this.state.createBezierBtnClicked = false;
      }
    });

    this.getStage.on('mousemove', (e) => {
      if (this.state.mode === 'shape' || this.state.mode === 'bezier') {
        if (this.state.bezier !== 'modify-bezier') {
          const { layerManagement } = this.state;
          const stageLayer = this.getStage.children;
          if (!this.endPaintShape)
            return;
          
          layerManagement.forEach(_layersManagement => {
            stageLayer.forEach(_stageLayers => {
              if (_layersManagement.activeLayer === 'true') {
                if (_stageLayers._id === _layersManagement.key) {
                    let groupX = _stageLayers.children[0].x() * this.getStage.scaleX();
                    let groupY = _stageLayers.children[0].y() * this.getStage.scaleY();

                    let localPos = {
                      x: (((this.getStage.getPointerPosition().x
                        - this.getStage.x()
                        - groupX))
                        / this.getStage.scaleX()),

                      y: (((this.getStage.getPointerPosition().y
                        - this.getStage.y()
                        - groupY))
                        / this.getStage.scaleY())
                    }

                    let localPos2 = {
                      x: (((this.tmpPointerPosition.x
                        - this.getStage.x()
                        - groupX))
                        / this.getStage.scaleX()),

                      y: (((this.tmpPointerPosition.y
                        - this.getStage.y()
                        - groupY))
                        / this.getStage.scaleY())
                    }
                    //This is for crate shape from mouse move
                    if (this.state.mode === 'bezier' && this.state.createBezierBtnClicked === true) {
                      if (_stageLayers.children[0].children === undefined) {
                        // return;
                      }
                      let line = _stageLayers.children[0].children[0];
                      console.log(_stageLayers.children[0].children[0]);
                      this.saveLine = line; // this.saveLine is saveLine
                      if (this.saveFirstBezierPosition === undefined)
                        this.saveFirstBezierPosition = localPos;

                      let centerX = (localPos.x - this.saveFirstBezierPosition.x) / 2;
                      let centerY = (localPos.y - this.saveFirstBezierPosition.y) / 2;
                      this.anchorLocation = {
                        start: this.saveFirstBezierPosition,
                        center: {
                          x: localPos.x - centerX,
                          y: localPos.y - centerY,
                        },
                        end: localPos,
                      }
                      // _stageLayers.children[0].children[0].x(localPos2.x);
                      // _stageLayers.children[0].children[0].y(localPos2.y);
                      //_stageLayers.children[0].children[0].width(localPos.x - localPos2.x);
                      //_stageLayers.children[0].children[0].height(localPos.y - localPos2.y);
                      _stageLayers.children[0].children[0].points([localPos.x, localPos.y, localPos2.x, localPos2.y]);
                      this.globalLocalPositinX = localPos.x - localPos2.x;
                      this.globalLocalPositinY = localPos.y - localPos2.y;
                      console.log(_stageLayers.children[0].children[0]);
                      
                      _layersManagement.isOnIt = true;
                      _stageLayers.attrs.isOnIt = true;
                      // this.getStage.draw();
                      _stageLayers.draw();
                    }
                    if (this.state.mode === 'shape') {
                      if (_stageLayers.children[0].nodeType === 'Group') {
                        _stageLayers.children[0].children[0].x(localPos2.x);
                        _stageLayers.children[0].children[0].y(localPos2.y);
                        // _stageLayers.children[0].children[0].width(localPos.x - localPos2.x);
                        // _stageLayers.children[0].children[0].height(localPos.y - localPos2.y);
                        _stageLayers.children[0].children[0].fill(this.state.color);
                        _stageLayers.children[0].children[0].stroke(this.state.color);

                        if (_stageLayers.children[0].children[0].className === 'Star') {
                          _stageLayers.children[0].children[0].setInnerRadius(Math.abs(localPos.x - localPos2.x));
                          _stageLayers.children[0].children[0].setOuterRadius(Math.abs(localPos.y - localPos2.y));
                        } else {
                          _stageLayers.children[0].children[0].width(localPos.x - localPos2.x);
                          _stageLayers.children[0].children[0].height(localPos.y - localPos2.y);
                        }

                        if (_stageLayers.children[0].children[0].className === 'Arrow')
                          _stageLayers.children[0].children[0].points([0, 0,
                            localPos.x - localPos2.x,
                            localPos.y - localPos2.y]);
                        if (_stageLayers.children[0].children[0].id() === 'circle')
                          if (_stageLayers.children[0].children[0].attrs.radius < 0)
                            _stageLayers.children[0].children[0].attrs.radius = 0;

                        if (_stageLayers.children[0].children[0].className === 'Ellipse') {
                          if (_stageLayers.children[0].children[0].attrs.radiusX < 0)
                            _stageLayers.children[0].children[0].attrs.radiusX = 0;
                          if (_stageLayers.children[0].children[0].attrs.radiusY < 0)
                            _stageLayers.children[0].children[0].attrs.radiusX = 0;
                        }
                        // this.getStage.draw();
                        _layersManagement.isOnIt = true;
                        _stageLayers.attrs.isOnIt = true;
                        _stageLayers.draw();
                      }
                    }
                  }
                }
              });
            });
          }
        }
    });
  }

  selectLayerManagementElColor = () => {
    const elLayerManagement = document.querySelectorAll(
                          '.layer-management ul li');

    const elInvisibleBtn = document.querySelectorAll('.invisible-btn');
    const elInvisibleImg = document.querySelectorAll('.invisible-btn-img');

    elLayerManagement.forEach(el => {
      if (el.attributes['name'].value === 'true')
        el.style.backgroundColor = '#888';
      else
        el.style.backgroundColor = '#666';
    });

    elInvisibleImg.forEach(el => {
      if (el.attributes['name'].value === 'true') {
        el.parentElement.style.backgroundColor = '#fff';
        el.src = visibleImage;
      }
      else {
        el.parentElement.style.backgroundColor = '#000';
        el.src = visibleImageBlack;
      }
    });

  }

  changeMode = (dataFromToolBar, buttonFromToolBar) => {
    this.setState({ mode: dataFromToolBar, buttonTab: buttonFromToolBar });
  }

  changeColor = (dataFromToolBar) => {
    this.setState({ color: dataFromToolBar });
  }

  changeText = (dataFromToolBar) => {
    this.setState({ text: dataFromToolBar });
  }

  changeSizePencil = (dataFromSettings) => {
    this.setState({ sizePencil: dataFromSettings });
  }

  changeAlpha = (dataFromSettings) => {
    this.setState({ alpha: dataFromSettings });
  }

  changeSizeEraser = (dataFromSettings) => {
    this.setState({ sizeEraser: dataFromSettings });
  }

  changeSizeBezier = (dataFromSettings) => {
    this.setState({ sizeBezier: dataFromSettings });
  }

  changeBrush = (dataFromSettings) => {
    this.setState({ brush: dataFromSettings });
  }

  changeFilter = (dataFromFilter) => {
    this.setState({ filter: dataFromFilter });
  }

  changeShape = (dataFromSettings) => {
    this.setState({ shape: dataFromSettings });
  }

  changeBezier = (dataFromSettings, isClicked) => {
    this.setState({ bezier: dataFromSettings, createBezierBtnClicked: isClicked });
  }

  popCanvasOptions = () => {
    const canvasOptions = document.querySelector('.canvas-options');
    const back = document.querySelector('.back');
    const navBar = document.querySelector('.nav-bar');
    const colorPicker = document.querySelector('#color-picker');

    if (canvasOptions.style.display === 'flex') {
      canvasOptions.style.display = 'none';
      back.style.display = 'none';
      navBar.style.zIndex = '1';
      colorPicker.style.zIndex = '9999';
    }
    else {
      canvasOptions.style.display = 'flex';
      back.style.display = 'block';
      navBar.style.zIndex = 'initial';
      colorPicker.style.zIndex = '1';
    }
  }

  newFile = () => {
    // HERE WILL BE CODE FROM INPUT TAG TO CREATE WIDTH AND HEIGHT CANVAS
    const canvasHeightOptions = document.querySelector('#canvas-height');
    const canvasWidthOptions = document.querySelector('#canvas-width');
    this.offAllButtons();
    let newFileTMP = false;

    // This 3 are here because when I create new file these values must be reset
    this.preventCenter = false;
    this.getStage.x(0);
    this.getStage.y(0);
    this.getStage.scaleX(1);
    this.getStage.scaleY(1);

    if (canvasHeightOptions.value >= 32 && canvasWidthOptions.value >= 32
      && !isNaN(canvasHeightOptions.value) && !isNaN(canvasWidthOptions.value)) {
      const { layerManagement } = this.state;
      const stageLayer = this.getStage.children;
      newFileTMP = true;

      stageLayer.forEach((_layer) => {
        this.getStage.removeChildren();
      });

      this.defaultLayer = new Konva.Layer({
        id : 'defaultLayer'
      });

      this.border = new Konva.Rect({
        id: 'border',
        x: 0,
        y: 0,
        stroke: 'black',
        strokeWidth: 1,
      });
      this.defaultLayer.add(this.border);
      this.getStage.add(this.defaultLayer);

      const layers_TMP = layerManagement;

      layers_TMP.forEach(_index => {
        layers_TMP.splice(_index, layers_TMP.length);
      });

      this.setState({
        layerManagement: layers_TMP,
        widthFrame: canvasWidthOptions.value,
        heightFrame: canvasHeightOptions.value,
        newFile: true,
      });

      this.addLayer(null, canvasWidthOptions.value, canvasHeightOptions.value, newFileTMP);
      this.popCanvasOptions();
      this.getStage.draw();
    } else {
      newFileTMP = false;
      this.offAllButtons();
      alert('WIDTH AND HEIGHT MUST BE A NUMBER AND BIGER THEN 32PX');
    }
  }

  addDrawingCanvas = (width, height, isImg) => {
    const { layerManagement} = this.state;
    const stageLayer = this.getStage.children;
    let tmpX = 0;
    let tmpY = 0;
    let tmpScaleX = 0;
    let tmpScaleY = 0;
    // It does not allow you to center drawing 
    // place when you add a new layer
    // let preventCenter = false;
    if (this.getStage.x() !== 0) {
      this.preventCenter = true;
      tmpX = this.getStage.x();
      tmpY = this.getStage.y();
      tmpScaleX = this.getStage.scaleX();
      tmpScaleY = this.getStage.scaleY();
    }

    layerManagement.forEach(_layersManagement => {
      stageLayer.forEach((_stageLayers, i) => {
        if (_stageLayers._id === _layersManagement.key) {
          // This prevent multiple shape in one layer
          // one layer have one drawing place, img place etc.
          if (i === stageLayer.length - 1) {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            // Center drawing place with height and width lower then stage width and hight
            this.getStage.x((this.getStage.width() - canvas.width) / 2);
            this.getStage.y((this.getStage.height() - canvas.height) / 2);
            this.saveScale = 1;
            // Center drawing place with any sizePencil
            // here i resize and scale stage u can resize layer but replace stage with l
            if (canvas.width >= this.getStage.width() ||
            canvas.height >= this.getStage.height()) {
              let breaker = 0;
              let i = 1;
              const padding = 100;

              while (this.getStage.x() <= padding ||
              this.getStage.y() <= padding) {
                this.getStage.scale({ x: i, y: i });
                this.getStage.x((this.getStage.width() - (canvas.width * i)) / 2);
                this.getStage.y((this.getStage.height() - (canvas.height * i)) / 2);
                i = i - 0.01;
                breaker++;
                this.saveScale = i;
                if (breaker === 100) {
                  return;
                }
              }
            }
            this.savePositionStage = {
              x: this.getStage.x(),
              y: this.getStage.y(),
            };
            this.border.width(canvas.width);
            this.border.height(canvas.height);
            this.border.strokeWidth(1 / this.saveScale);
            console.log(this.saveScale);

            // Add img to drawing place
            // drawingPlace = img
            let drawingPlace;
            if (this.state.mode !== 'shape' || this.state.shape === 'none') {
              if (isImg !== null) {
                const imgPlace = new Konva.Image({
                  image: isImg,
                  x: 0,
                  y: 0,
                  id: 'imgPlace',
                  width: isImg.width,
                  height: isImg.height,
                });
  
                drawingPlace = new Konva.Image({
                  image: canvas,
                  x: 0,
                  y: 0,
                  id: 'drawingPlace',
                  width: isImg.width,
                  height: isImg.height,
                });
  
                const group = new Konva.Group({
                  id: 'group',
                  width: isImg.width,
                  height: isImg.height,
                });
  
                group.add(imgPlace);
                group.add(drawingPlace);
                _stageLayers.add(group);
                
              } else {
                if (this.state.text === 'on') {
                  this.Text.createTextArea(canvas, _stageLayers, drawingPlace, this.getStage, this.state.mode);
                  return;
                }
                if (this.state.bezier === 'create-bezier') {
                  // this.Text.createTextArea(canvas, _stageLayers, drawingPlace, this.getStage);

                  this.BezierCurve.createBezier(canvas, _stageLayers, drawingPlace, this.getStage, this.state.sizeBezier, this.state.color);
                  return;
                }
                
                drawingPlace = new Konva.Image({
                  image: canvas,
                  x: 0,
                  y: 0,
                  id: 'drawingPlace'
                });
  
                _stageLayers.add(drawingPlace);
              }

              drawingPlace.on('mousedown', (event) => {
                this.Mouse.mouseDown(event);
              });

              drawingPlace.on('mouseup', () => {
                this.Mouse.mouseUp();
              });

              drawingPlace.on('mousemove', () => {
                this.Mouse.mouseMove(drawingPlace);
              });
            } else {
              if (this.state.shape === 'rect') {
                this.Shape.createRect(canvas, _stageLayers, drawingPlace, this.state.color);
                //_layersManagement.isOnIt = true;
              }
              else if (this.state.shape === 'star')
                this.Shape.createStar(canvas, _stageLayers, drawingPlace, this.state.color);
              else if (this.state.shape === 'arrow')
                this.Shape.createArrow(canvas, _stageLayers, drawingPlace, this.state.color);
              else if (this.state.shape === 'circle')
                this.Shape.createCircle(canvas, _stageLayers, drawingPlace, this.state.color);
              else if (this.state.shape === 'ellipse')
                this.Shape.createEllipse(canvas, _stageLayers, drawingPlace, this.state.color);
            }        
          }
        }
      })
    });
    if (this.preventCenter === true) {
      this.getStage.x(tmpX);
      this.getStage.y(tmpY);
      this.getStage.scaleX(tmpScaleX);
      this.getStage.scaleY(tmpScaleY);
    }
    this.getStage.draw();
  }

  offAllButtons = () => {
    if (this.state.mode !== 'bezier') {
      let anchors = this.getStage.find(node => {
        // return node.className === 'Circle' && node.id() === 'anchor';
        return node.id() === 'anchor';
      });
      // if (this.saveAnchors !== undefined) {
        //   this.saveAnchors.forEach(anchors => {
          //     anchors.visible(false);
          //   });
          // }
      anchors.forEach(node => {
        node.visible(false);
        console.log(node);
      });
    }

    this.hambureger = document.querySelector('#nav-icon1');
    this.nav = document.querySelector('#pop-up-navbar');
    this.nav.classList.remove('open');
    this.hambureger.classList.remove('open');

    this.state.bezier = 'none';
    const el = document.querySelectorAll('img');
    el.forEach(img => {
      if(img.id) {
        img.click();
      }
    });
    let falseLayer = this.getStage.find(node => {
      return node.attrs.isOnIt === false;
    });
    falseLayer.remove();
    this.state.mode = 'default';
  }

  addImage = () => {
    const el = document.getElementById('add-image');

    if (el.files && el.files[0]) {
      var FR = new FileReader();
      FR.onload = () => {
        var img = new window.Image();
        img.src = FR.result;
        img.onload = () => {
          this.state.mode = 'image';
          this.addLayer(img);
        };
      };

      FR.readAsDataURL(el.files[0]);
      el.value = '';
    };
    this.offAllButtons();
  }

  downloadImg(uri, name) {
    let link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  saveImg = () => {
    this.offAllButtons();
    this.offAllButtons();
    const { widthFrame, heightFrame, filterTab } = this.state;
    const stageLayer = this.getStage.children;
    
    let canvas = document.createElement('canvas');
    canvas.width = widthFrame;
    canvas.height = heightFrame;
    let ctx = canvas.getContext('2d');
    ctx.filter = this.state.filter; // add filters to canvas;
    let childrenCanvas = 0;
    stageLayer.forEach(_layers => {
      if (_layers.visible() === false || _layers.id() === 'defaultLayer') {
        return;
      }
      this.getStage.x(this.savePositionStage.x);
      this.getStage.y(this.savePositionStage.y);
      this.getStage.scaleX(this.saveScale);
      this.getStage.scaleY(this.saveScale);
      this.border.strokeWidth(1 / this.saveScale);

      _layers.children.forEach(_shape => {
        if (_shape.id() === 'group' || _shape.id() === 'bezierGroup') {
          _shape.children.forEach(_groupChildren => {
            console.log(_groupChildren);
            // this.getStage.x(this.savePositionStage.x);
            // this.getStage.y(this.savePositionStage.y);
            // this.getStage.scaleX(this.saveScale);
            // this.getStage.scaleY(this.saveScale);
            // this.border.strokeWidth(1 / this.saveScale);
            if (_groupChildren.id() === 'imgPlace') {
              ctx.drawImage(_groupChildren.getImage(), _shape.x(), _shape.y(), _groupChildren.attrs.width * _shape.scaleX(), _groupChildren.attrs.height * _shape.scaleY());
            } else if (_groupChildren.id() === 'drawingPlace'){
              childrenCanvas = _groupChildren.getImage();
              ctx.drawImage(childrenCanvas, _shape.x(), _shape.y(), _groupChildren.attrs.width * _shape.scaleX(), _groupChildren.attrs.height * _shape.scaleY());
            } else if (_groupChildren.name() === 'shape' || _groupChildren.id() === 'text'){
              // console.log(_shape.scaleX());
              // let x = (_groupChildren.x() * _shape.scaleX()) + _shape.x();
              // let y = (_groupChildren.y() * _shape.scaleY()) + _shape.y();
              // // let width = _groupChildren.attrs.width * _shape.scaleX();
              // // let height = _groupChildren.attrs.height * _shape.scaleY();
              // let width = _groupChildren.width() * _shape.scaleX();
              // let height = _groupChildren.height() * _shape.scaleY();
              // console.log(_groupChildren.x(), _shape.scaleX(), _shape.x());
              // console.log(y);
              // console.log(width);
              // console.log(height);
              // if (_groupChildren.id() === 'star') {
              //   x = x - (_groupChildren.getOuterRadius() * _shape.scaleX());
              //   y = y - (_groupChildren.getOuterRadius() * _shape.scaleY());
              // }
              // if (_groupChildren.id() === 'bezierLine') {
              //   // x = 0;
              //   // y = 0;
              //   let minTab = [];
              //   let min;
              //   let save;
                
              //   _groupChildren.points().forEach((point, index) => {
              //     if (_groupChildren.points().length === 4) {
              //       // if (index === 0) {
              //       //   // width = point;
              //       // }
              //       // if (index === 1) {
              //       //   // height = point;
              //       // }
              //       // if (index === 2) {
              //       //   x = point;
              //       // }
              //       // if (index === 3) {
              //       //   y = point;
              //       // }
                    
              //       // if (x > y && index === 3) {
              //       //   console.log('ASDAHSFGASF');
              //       //   width = width * (-1);
              //       // }
              //       // if (y > x && index === 3) {
              //       //   height = height * (-1);
              //       // }
              //       // // width = width - x;
              //       // // height = height - y;
              //       // width = _groupChildren.toCanvas().width / this.getStage.scaleX();
              //       // height = _groupChildren.toCanvas().height / this.getStage.scaleX();
              //     } else {
              //       // if (index === 0) {
              //       //   x = point;
              //       // }
              //       // if (index === 1) {
              //       //   y = point;
              //       // }
              //       // if (index === 6) {
              //       //   width = point;
              //       // }
              //       // if (index === 7) {
              //       //   height = point;
              //       // }
              //       // for (let index = 0; index < _groupChildren.points().length; index = index + 2) {
              //       //   // this.min = Math.min.apply(..._groupChildren.points()[index]);
              //       //   minTab.push(_groupChildren.points()[index]);
              //       // }
              //       // min = Math.min(...minTab);
              //       // x = min;
              //       // if (min === point) {
              //       //   save = index + 1;
              //       // }
              //       // if (save === index) {
              //       //   y = point;
              //       // }

              //       // // width = width - x;
              //       // // height = height - y;
              //       // width = _groupChildren.toCanvas().width / this.getStage.scaleX();
              //       // height = _groupChildren.toCanvas().height / this.getStage.scaleX();
              //     }

              //     // width = _groupChildren.attrs.width;
              //     // height = _groupChildren.attrs.height;

              //   });
              //   // line.points([anchors[0].attrs.x, anchors[0].attrs.y, anchors[1].attrs.x, anchors[1].attrs.y,
              //   // anchors[2].attrs.x - 50, anchors[2].attrs.y - 50,
              //   // anchors[3].attrs.x, anchors[3].attrs.y]);
              //                         // _stageLayers.children[0].children[0].x(localPos2.x);
              //         // _stageLayers.children[0].children[0].y(localPos2.y);
              //         // _stageLayers.children[0].children[0].width(localPos.x - localPos2.x);
              //         // _stageLayers.children[0].children[0].height(localPos.y - localPos2.y);
              //   // width = _groupChildren.attrs.width * _shape.scaleX();
              //   // height = _groupChildren.attrs.height * _shape.scaleY();
              //   // _stageLayers.children[0].children[0].points([localPos.x, localPos.y, localPos2.x, localPos2.y]);
              //   console.log(_groupChildren);
              //   console.log(this.getStage.scaleX());
              //   console.log(x);
              //   console.log(y);
              //   console.log(width);
              //   console.log(height);
              // }

              // if (_groupChildren.id() === 'circle') {
              //   x = x - (_groupChildren.radius() * _shape.scaleX());
              //   y = y - (_groupChildren.radius() * _shape.scaleY());
              //   console.log(_groupChildren);
              //   console.log(x);
              //   console.log(y);
              //   console.log(width);
              //   console.log(height);
              // } 
              // if (_groupChildren.id() === 'ellipse') {
              //   x = x - (_groupChildren.radiusX() * _shape.scaleX());
              //   y = y - (_groupChildren.radiusY() * _shape.scaleY());
              // }
              // if (_groupChildren.id() === 'arrow') {
              //   _groupChildren.points().forEach((point, index) => {
              //     if (index === 2) {
              //       if (point < 0) {
              //         width = width * (-1);
              //       }
              //     }
              //     if (index === 3) {
              //       if (point < 0) {
              //         height = height * (-1);
              //       }
              //     }
              //     console.log(x);
              //     console.log(y);
              //     console.log(width);
              //     console.log(height);
              //   });
              // }
              const canvasHeightOptions = document.querySelector('#canvas-height');
              const canvasWidthOptions = document.querySelector('#canvas-width');
              childrenCanvas = _shape.parent.toCanvas();
              console.log(_shape.parent.toCanvas());
              ctx.drawImage(childrenCanvas, this.getStage.x(), this.getStage.y(),
                 canvasWidthOptions.value, canvasHeightOptions.value,
                 0, 0,
                 canvasWidthOptions.value / this.getStage.scaleX(), canvasHeightOptions.value / this.getStage.scaleY());
              // childrenCanvas = _groupChildren.toCanvas();
              // ctx.drawImage(childrenCanvas, x, y, width, height);
            } 
            // else if (_groupChildren.id() === 'text') {
            //   let x = Math.abs((_groupChildren.x() * _shape.scaleX()) + _shape.x());
            //   let y = Math.abs((_groupChildren.y() * _shape.scaleY()) + _shape.y());
            //   let width = _groupChildren.width() * _shape.scaleX();
            //   let height = _groupChildren.height() * _shape.scaleY();

            //   childrenCanvas = _groupChildren.toCanvas();
            //   ctx.drawImage(childrenCanvas, x, y, width, height);
            // } 
            // else if (_groupChildren.id() === 'bezierImage') {
            //   // let x = Math.abs(_groupChildren.x() + _shape.x());
            //   // let y = Math.abs(_groupChildren.y() + _shape.y());
            //   childrenCanvas = _groupChildren.getImage();
            //   ctx.drawImage(childrenCanvas, _shape.x(), _shape.y(), _groupChildren.width(), _groupChildren.height());
            // }
          });
        } else {
          childrenCanvas = _shape.getImage();
          ctx.drawImage(childrenCanvas, 0, 0);
        }
      });
    });

    const saveGroupURL = canvas.toDataURL('image/png');
    this.downloadImg(saveGroupURL, 'img');
    this.setState({
      filterTab: filterTab,
    });
    this.offAllButtons();
  }

  addLayer = (isImg, width, height, newFileTMP) => {
    const { layerManagement, widthFrame, heightFrame, newFile } = this.state;
    const stageLayer = this.stage.getStage().children;

    if (newFileTMP === true || newFile === true) {
      // Here I change all layer on false
      stageLayer.forEach(_layers => {
        _layers.name('yes');
      });

      layerManagement.forEach(_layers => {
        _layers.activeLayer = 'false';
      });

      //This works when I add layer from layerManagement in application
      if (height === undefined) {
        width = widthFrame;
        height = heightFrame;
      }
      let layer;
      if (this.state.mode === 'shape' || this.state.mode === 'text' || this.state.mode === 'bezier') {
        layer = new Konva.Layer({
          id: 'newLayer',
          name: 'no',
          attrs: {
            isOnIt: false,
          },
          //Clip is for img to able move
          clip: {
            x: 0,
            y: 0,
            width: width,
            height: height,
          }
        });
      } else {
        layer = new Konva.Layer({
          id: 'newLayer',
          name: 'no',
          attrs: {
            isOnIt: true,
          },
          //Clip is for img to able move
          clip: {
            x: 0,
            y: 0,
            width: width,
            height: height,
          }
        });

      }

      this.defaultLayer.width(width);
      this.defaultLayer.height(height);

      this.getStage.add(layer);
      let layerTMP = layerManagement;

      // layerTMP.push({
      //   name: layer.nodeType,
      //   mode: this.state.mode,
      //   key: layer._id,
      //   isOnIt: true,
      //   activeLayer: 'true',
      //   isVisible: 'true',
      // });

      if (this.state.mode === 'shape' || this.state.mode === 'text' || this.state.mode === 'bezier') {
        layerTMP.push({
          name: layer.nodeType,
          mode: this.state.mode,
          key: layer._id,
          isOnIt: false,
          activeLayer: 'true',
          isVisible: 'true',
        });
      } else {
        layerTMP.push({
          name: layer.nodeType,
          mode: this.state.mode,
          key: layer._id,
          isOnIt: true,
          activeLayer: 'true',
          isVisible: 'true',
        });
      }

      this.addDrawingCanvas(width, height, isImg);
      this.setState({
        layerManagement: layerTMP,
      });
      // this.offAllButtons();
    } else {
      this.offAllButtons();
      alert('YOU MUST CREATE NEW FILE FIRST');
    }
  }

  clickLayer = (e) => {
    const { layerManagement, buttonTab } = this.state;
    const stageLayer = this.getStage.children;
    let layerTMP = layerManagement;
    console.log('Click Layer');

    stageLayer.forEach(_stageLayers => {
      _stageLayers.name('yes');
    });

    layerManagement.forEach(_layers => {
      _layers.activeLayer = 'false';
    });

    layerTMP.forEach(_layers => {
      if (e.target.id === _layers.key.toString()) {
        if (_layers.activeLayer === 'false') {
          _layers.activeLayer = 'true';
        }
        else 
          _layers.activeLayer = 'false';
      }
    });
    // WHEN I DELETE LAYER, CLICKED LAYER IS CORRECT
    stageLayer.forEach(_layers => {
      if (e.target.id === _layers._id.toString()) {
        if (_layers.name() === 'no') {
          _layers.name('yes');
          _layers.moveToTop();
        }
      }
    });

    this.setState({
      layerManagement: layerTMP,
    });
    this.offAllButtons();
  }

  setInvisible = (e) => {
    const { layerManagement } = this.state;
    const stageLayer = this.getStage.children;

    layerManagement.forEach(_layersManagement => {
      stageLayer.forEach((_layers, _index) => {
        if (e.target.id === _layers._id.toString() && e.target.id === _layersManagement.key.toString()) {
          if (_layers.visible() === false) {
            _layers.visible(true);
            console.log('IF VISIBLE');
          }
          else {
            _layers.visible(false);
            console.log('IF NOT VISIBLE');
          }
        }
      });
    });


      layerManagement.forEach((_layers, _index) => {
        if (e.target.id === _layers.key.toString()) {
          if (_layers.isVisible === 'true')
            _layers.isVisible = 'false';
          else
            _layers.isVisible = 'true';
        }
      });

    this.getStage.draw();
  }

  removeLayer = () => {
    const { layerManagement } = this.state;
    const stageLayer = this.getStage.children;
    let layerTMP = layerManagement;
    
    layerTMP.forEach((_layersManagement, _index) => {
      if (layerManagement.length === 1) {
        alert('You can not delete last layer');
        return;
      }
      if (_layersManagement.activeLayer === 'true') {
        stageLayer.forEach(_stageLayers => {
          if (_stageLayers._id === _layersManagement.key) {
            _stageLayers.getLayer().remove();
          }
        });

        layerTMP.splice(_index, 1);
      }
    });

    // Set true on last element 
    layerTMP.forEach((_layersManagement, _index) => {
      if (layerManagement.length - 1 === _index) {
        _layersManagement.activeLayer = 'true';
      }
    });
    
    this.setState({
      layerManagement: layerTMP,
    });
  }

  displayLayer = () => {
    const { layerManagement } = this.state;
    let layerTMP = layerManagement;
    const stageLayer = this.getStage.children;

    stageLayer.forEach(_layers => {
      if (_layers.id() === 'defaultLayer') {
        return;
      }

      layerTMP.push({
        name: _layers.nodeType,
        key: _layers._id,
        activeLayer: 'false',
      });
    });

    this.setState({
      layerManagement: layerTMP,
    });
  }

  moveLayerUpOrBottom = (buttonUpClick) => {
    const stageLayer = this.getStage.children;
    const { layerManagement } = this.state;
    let tmpLayerManagement = layerManagement;
    let preventMoveToTheBottom = false;
    Array.prototype.move = function (from, to) {
      this.splice(to, 0, this.splice(from, 1)[0]);
    }

    layerManagement.forEach((_layersManagement, _index) => {
      stageLayer.forEach(_stageLayers => {
        if (_stageLayers._id === _layersManagement.key) {
          if (_layersManagement.activeLayer === 'true') {
            if (buttonUpClick === true && _index >= 1) {
              tmpLayerManagement.move(_index, _index - 1);
              _stageLayers.moveDown();
            } else {
              if (preventMoveToTheBottom === false) {
                if (_index === 1) {
                  _stageLayers.visible(true);
                  _layersManagement.isVisible = 'true';
                }
                tmpLayerManagement.move(_index, _index + 1);
                _stageLayers.moveUp();
                preventMoveToTheBottom = true;
              }
            }
          }
        }
      });
    });
    
    // First layer must be always visible 
    layerManagement.forEach((_layersManagement, _index) => {
      stageLayer.forEach(_stageLayers => {
        if (_stageLayers.index === 0) {
          if (_stageLayers._id === _layersManagement.key) {
            _stageLayers.visible(true);
            _layersManagement.isVisible = 'true';
          }
        }
      });
    });

    this.setState({
      layerManagement: tmpLayerManagement,
    });
  }
  
  returnStage = () => {
    return this.getStage;
  }

  returnLayerManagement = () => {
    return this.state.layerManagement;
  }

  returnStateBezier = () => {
    return this.state.bezier;
  }

  render() {
    this.buttonUpClick = false;
    return (
      <div className='react-app'>
        <div className='mouseCircle'></div>
        <div className='back'></div>
          <Header clearDrawingPlace={this.clearDrawingPlace}
            addImage={this.addImage}
            clearAll={this.clearAll}
            saveImg={this.saveImg}
            add={this.newFile}
            popCanvasOptions={this.popCanvasOptions}
          />
          {/* <div id={'pop-up-navbar'}>
            <ul>
              <li>asd</li>
              <li>asd</li>
              <li>asd</li>
            </ul>
          </div> */}
          <main>
            <div className='layer-management' 
              onMouseMove={(event) => { this.Mouse.dragLayerManagement('.layer-management', event) }}>
              <div className={'layer-management-header'}>
                <img
                    src={settingsImage}
                    width={15}
                    height={15}
                ></img>
                <p>Layer Management</p>
              </div>
              <ul>
                {
                  this.state.layerManagement.map((_layers, index) => {
                    console.log(_layers);
                    if (_layers.isOnIt) {
                      return (
                        <div>
                          <li id={_layers.key}
                            key={_layers.key}
                            name={_layers.activeLayer}
                            onMouseDown={(e) => { this.offAllButtons(); this.clickLayer(e); }}
                          >
                            <div className={'invisible-btn'}
                              id={_layers.key}
                              name={_layers.isVisible}>
                              <img src={visibleImage}
                                id={_layers.key}
                                name={_layers.isVisible}
                                className={'invisible-btn-img'}
                                onMouseDown={(e) => { this.offAllButtons(); this.setInvisible(e); }}>
                              </img>
                            </div>
                            {/* {index} {_layers.name} {_layers.key} {_layers.mode} */}
                            {index + 1} {_layers.mode}
                          </li>
                        </div>
                      )
                    }
                  })
                }
              </ul>
              <div className={'options'}>
                <div className='move-options'>
                  <button className='layer-management-options-btn up-btn'
                    onMouseDown={() => { 
                      this.buttonUpClick = true;
                      this.moveLayerUpOrBottom(this.buttonUpClick);
                      this.offAllButtons();
                     }}>
                      <img
                        src={ArrowImage}
                        width={12}
                        height={12}
                      ></img>
                     </button>
                  <button className='layer-management-options-btn down-btn'
                    onMouseDown={() => {
                      this.buttonUpClick = false;
                      this.moveLayerUpOrBottom(this.buttonUpClick);
                      this.offAllButtons();
                     }}>
                      <img
                        src={ArrowImage}
                        width={12}
                        height={12}
                      ></img>
                     </button>
                </div>
                <button className='layer-management-options-btn add-btn'
                  onClick={() => { this.offAllButtons(); this.addLayer(null); }}>
                    <img
                      src={addImage}
                      width={18}
                      height={18}
                    ></img>
                </button>
                <button className='layer-management-options-btn remove-btn'
                  onClick={() => { this.offAllButtons(); this.removeLayer() }}>
                    <img
                      src={trashImage}
                      width={18}
                      height={18}
                    ></img>
                </button>
              </div>
            </div>
            <ToolBar mode={this.changeMode}
              color={this.changeColor}
              ref={node => { this.tob = node }}
              returnStage={this.returnStage}
              returnStateBezier={this.returnStateBezier}
              returnLayerManagement={this.returnLayerManagement}
              offAllButtons={this.offAllButtons}
              text={this.changeText}
            />
            <Settings changeSizePencil={this.changeSizePencil}
              changeSizeEraser={this.changeSizeEraser}
              changeAlpha={this.changeAlpha}
              changeSizeBezier={this.changeSizeBezier}
              mode={this.state.mode}
              color={this.state.color}
              changeColor={this.changeColor}
              changeFilter={this.changeFilter}
              changeBrush={this.changeBrush}
              changeShape={this.changeShape}
              changeBezier={this.changeBezier}
              returnStage={this.returnStage}
            />
            <Stage className={'drawing-place stage'}
              width={window.innerWidth}
              height={window.innerHeight - this.navBarHeight - this.footerHeight}
              onMouseMove={(e) => { this.Mouse.mouseCircle(e) }}
              ref={node => { this.stage = node }}
              fill={'red'}
            >
            </Stage>
          </main>

          <footer>
            <div className='footer-wrapper wrapper'>
              Praca Inżynierska - Michał Adamkowski &copy; Uniwersytet Kazmierza Wielkiego Bydgoszcz 2019
            </div>
          </footer>
      </div>
    );
  }
}