import './App.css';
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

export default class AppTest extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: 'default',
            color: '#000',
            sizePencil: 5,
            sizeEraser: 5,
            shape: 'none',
            bezier: 'none',
            text: 'off',
            brush: 'default',
            filter: '',
            image: null,
            widthFrame: window.innerWidth / 2,
            heightFrame: window.innerHeight / 2,
            layerManagement: [],
            newFile: false,
            buttonTab: [],
        };

        this.defaultLayer;
        this.border;
    }

    componentDidMount() {
        document.oncontextmenu = new Function("return false;");
        this.getStage = this.stage.getStage();
        this.scaleBy = 1.1;
        this.preventCenter = false;
        this.tmpPointerPosition = {
            x: 0,
            y: 0,
        };
        this.anchorLocation = {
            start: 0,
            center: 0,
            end: 0,
        };
        this.saveFirstBezierPosition;
        this.saveCanvas;
        this.endPaintShape = false;

        this.getStage.on('mousedown', (e) => {
            if (e.evt.button === 2) {
                this.getStage.draggable(true);
            }
        });

        this.getStage.on('mouseup', (e) => {
            this.getStage.draggable(false);
        });

        window.addEventListener('wheel', (e) => {
            this.Mouse.scroll(e, this.scaleBy);
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
            this.state.sizeEraser, this.state.shape);
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
        // if (this.state.bezier === 'modify-bezier') {
        //   const { layerManagement } = this.state;
        //   const stageLayer = this.getStage.children;

        //   layerManagement.forEach(_layersManagement => {
        //     stageLayer.forEach((_stageLayers, i) => {
        //       if (_layersManagement.activeLayer === 'true') {
        //         if (_stageLayers._id === _layersManagement.key) {
        //           let anchors = _stageLayers.find('Circle');
        //           anchors.forEach(anchor => {
        //             anchor.visible(true);
        //           });
        //         }
        //       }
        //     });
        //   });
        // }
        console.log(this.state.bezier);
        this.selectLayerManagementElColor();
        this.getStage.on('mousedown', (e) => {
            if (this.state.mode === 'bucket') {
                e.target.fill(this.state.color);
                e.target.stroke(this.state.color);
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
                let ctx;
                let anchors;
                if (this.state.mode === 'bezier') {
                    if (this.state.bezier !== 'modify-bezier') {
                        let anchorss = this.getStage.find(node => {
                            return node.className === 'Circle' && node.id() === 'anchor';
                        });
                        // console.log(anchorss);
                        anchorss.forEach(node => {
                            node.visible(false);
                            this.getStage.draw();
                        });

                        ctx = this.saveCanvas.getContext('2d');
                        ctx.clearRect(0, 0, this.saveCanvas.width, this.saveCanvas.height);
                        ctx.beginPath();
                        ctx.moveTo(this.anchorLocation.start.x, this.anchorLocation.start.y);
                        ctx.lineTo(this.anchorLocation.end.x, this.anchorLocation.end.y);
                        ctx.closePath();
                        ctx.stroke();

                        // this.getStage.draw();
                        if (this.anchorLocation.center.x < 0)
                            this.anchorLocation.center.x = this.anchorLocation.center.x * (-1);

                        if (this.anchorLocation.center.y < 0)
                            this.anchorLocation.center.y = this.anchorLocation.center.y * (-1);

                        this.BezierCurve.createAnchor(this.anchorLocation.start.x, this.anchorLocation.start.y, this.getStage);
                        this.BezierCurve.createAnchor(this.anchorLocation.center.x, this.anchorLocation.center.y, this.getStage);
                        this.BezierCurve.createAnchor(this.anchorLocation.center.x - 50, this.anchorLocation.center.y - 50, this.getStage);
                        this.BezierCurve.createAnchor(this.anchorLocation.end.x, this.anchorLocation.end.y, this.getStage);
                        console.log(this.anchorLocation);

                        anchors = this.getStage.find(node => {
                            return node.className === 'Circle' && node.visible();
                        });

                    } else {
                        const { layerManagement } = this.state;
                        const stageLayer = this.getStage.children;

                        layerManagement.forEach(_layersManagement => {
                            stageLayer.forEach((_stageLayers, i) => {
                                if (_layersManagement.activeLayer === 'true') {
                                    if (_stageLayers._id === _layersManagement.key) {
                                        anchors = _stageLayers.find('Circle');
                                        anchors.forEach(anchor => {
                                            anchor.visible(true);
                                        });
                                    }
                                }
                            });
                        });
                        ctx = this.saveCanvas.getContext('2d');
                    }

                    // let anchors = this.getStage.find('Circle');

                    console.log(anchors);
                    anchors.forEach(anchor => {
                        anchor.on('dragmove', () => {
                            // console.log(ctx);
                            ctx.clearRect(0, 0, this.saveCanvas.width, this.saveCanvas.height);

                            ctx.beginPath();
                            ctx.moveTo(anchors[0].attrs.x, anchors[0].attrs.y);
                            ctx.bezierCurveTo(anchors[1].attrs.x, anchors[1].attrs.y,
                                anchors[2].attrs.x - 50, anchors[2].attrs.y - 50,
                                anchors[3].attrs.x, anchors[3].attrs.y);
                            ctx.stroke();

                            this.getStage.draw();
                        });
                    });
                    // let a = this.getStage.find(node => {
                    //   return node.className === 'Circle' && node.visible(true);
                    // });
                }
                this.offAllButtons();
                this.saveFirstBezierPosition = undefined;
            }
        });

        this.getStage.on('mousemove', (e) => {
            // console.log(e.target);
            if (this.state.mode === 'shape' || this.state.mode === 'bezier') {
                const { layerManagement } = this.state;
                const stageLayer = this.getStage.children;
                if (!this.endPaintShape)
                    return;

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
                                if (this.state.mode === 'bezier') {
                                    let img = _stageLayers.children[0].children[0].getImage();
                                    this.saveCanvas = img;
                                    let ctx = img.getContext('2d');
                                    ctx.beginPath();
                                    localPos = {
                                        x: (((this.tmpPointerPosition.x
                                            - this.getStage.x()
                                            - groupX))
                                            / this.getStage.scaleX()),

                                        y: (((this.tmpPointerPosition.y
                                            - this.getStage.y()
                                            - groupY))
                                            / this.getStage.scaleY())
                                    }
                                    if (this.saveFirstBezierPosition === undefined)
                                        this.saveFirstBezierPosition = localPos;

                                    ctx.moveTo(localPos.x, localPos.y);
                                    // ctx.moveTo(this.saveFirstBezierPosition.x, this.saveFirstBezierPosition.y);
                                    // ctx.bezierCurveTo(localPos.x, localPos.y + 30, localPos.x + 50, localPos.y + 50, localPos.x + 100, localPos.y + 100);


                                    let pos = this.getStage.getPointerPosition();

                                    localPos = {
                                        x: (((pos.x
                                            - this.getStage.x()
                                            - groupX))
                                            / this.getStage.scaleX()),

                                        y: (((pos.y
                                            - this.getStage.y()
                                            - groupY))
                                            / this.getStage.scaleY())
                                    }
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

                                    ctx.lineTo(localPos.x, localPos.y);
                                    ctx.closePath();
                                    ctx.stroke();
                                    this.tmpPointerPosition = pos;
                                    this.getStage.draw();
                                }
                                if (this.state.mode === 'shape') {
                                    if (_stageLayers.children[0].nodeType === 'Group') {
                                        _stageLayers.children[0].children[0].x(localPos2.x);
                                        _stageLayers.children[0].children[0].y(localPos2.y);
                                        _stageLayers.children[0].children[0].width(localPos.x - localPos2.x);
                                        _stageLayers.children[0].children[0].height(localPos.y - localPos2.y);
                                        _stageLayers.children[0].children[0].fill(this.state.color);
                                        _stageLayers.children[0].children[0].stroke(this.state.color);
                                        if (_stageLayers.children[0].children[0].className === 'Arrow')
                                            _stageLayers.children[0].children[0].points([0, 0,
                                                localPos.x - localPos2.x,
                                                localPos.y - localPos2.y]);
                                        if (_stageLayers.children[0].children[0].className === 'Circle')
                                            if (_stageLayers.children[0].children[0].attrs.radius < 0)
                                                _stageLayers.children[0].children[0].attrs.radius = 0;

                                        if (_stageLayers.children[0].children[0].className === 'Ellipse') {
                                            if (_stageLayers.children[0].children[0].attrs.radiusX < 0)
                                                _stageLayers.children[0].children[0].attrs.radiusX = 0;
                                            if (_stageLayers.children[0].children[0].attrs.radiusY < 0)
                                                _stageLayers.children[0].children[0].attrs.radiusX = 0;
                                        }
                                        console.log('sssshaaaapee');
                                        this.getStage.draw();
                                    }
                                }
                            }
                        }
                    });
                });
            }
        });
    }

    selectLayerManagementElColor = () => {
        const elLayerManagement = document.querySelectorAll(
            '.layer-management ul li');

        const elInvisibleBtn = document.querySelectorAll('.invisible-btn');

        elLayerManagement.forEach(el => {
            if (el.attributes['name'].value === 'true')
                el.style.backgroundColor = '#888';
            else
                el.style.backgroundColor = '#666';
        });

        elInvisibleBtn.forEach(el => {
            if (el.attributes['name'].value === 'true')
                el.style.backgroundColor = '#333';
            else
                el.style.backgroundColor = '#fff';
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

    changeSizeEraser = (dataFromSettings) => {
        this.setState({ sizeEraser: dataFromSettings });
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

    changeBezier = (dataFromSettings) => {
        this.setState({ bezier: dataFromSettings });
    }

    popCanvasOptions = () => {
        const canvasOptions = document.querySelector('.canvas-options');
        const back = document.querySelector('.back');
        const navBar = document.querySelector('.nav-bar');

        if (canvasOptions.style.display === 'flex') {
            canvasOptions.style.display = 'none';
            back.style.display = 'none';
            navBar.style.zIndex = '1';
        }
        else {
            canvasOptions.style.display = 'flex';
            back.style.display = 'block';
            navBar.style.zIndex = 'initial';
        }
    }

    newFile = () => {
        // HERE WILL BE CODE FROM INPUT TAG TO CREATE WIDTH AND HEIGHT CANVAS
        const canvasHeightOptions = document.querySelector('#canvas-height');
        const canvasWidthOptions = document.querySelector('#canvas-width');
        let newFileTMP = false;

        // This 3 are here because when I create new file these values must be reset
        this.preventCenter = false;
        this.getStage.x(0);
        this.getStage.y(0);

        if (canvasHeightOptions.value >= 32 && canvasWidthOptions.value >= 32
            && !isNaN(canvasHeightOptions.value) && !isNaN(canvasWidthOptions.value)) {
            const { layerManagement } = this.state;
            const stageLayer = this.getStage.children;
            newFileTMP = true;

            stageLayer.forEach((_layer) => {
                this.getStage.removeChildren();
            });

            this.defaultLayer = new Konva.Layer({
                id: 'defaultLayer'
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
            alert('WIDTH AND HEIGHT MUST BE A NUMBER AND BIGER THEN 32PX');
        }
    }

    addDrawingCanvas = (width, height, isImg) => {
        const { layerManagement } = this.state;
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

                                if (breaker === 100) {
                                    return;
                                }
                            }
                        }
                        this.border.width(canvas.width);
                        this.border.height(canvas.height);

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
                                    this.Text.createTextArea(canvas, _stageLayers, drawingPlace, this.getStage);
                                    return;
                                }
                                if (this.state.bezier === 'create-bezier') {
                                    // this.Text.createTextArea(canvas, _stageLayers, drawingPlace, this.getStage);
                                    this.BezierCurve.createBezier(canvas, _stageLayers, drawingPlace, this.getStage);
                                    console.log('oiqwpojqr');
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

                            drawingPlace.on('mousedown', (e) => {
                                this.Mouse.mouseDown();
                            });

                            drawingPlace.on('mouseup', () => {
                                this.Mouse.mouseUp();
                            });

                            drawingPlace.on('mousemove', () => {
                                this.Mouse.mouseMove(drawingPlace);
                            });
                        } else {
                            if (this.state.shape === 'rect')
                                this.Shape.createRect(canvas, _stageLayers, drawingPlace, this.state.color);
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
                return node.className === 'Circle' && node.id() === 'anchor';
            });
            console.log(anchors);
            anchors.forEach(node => {
                node.visible(false);
            });
        }
        const el = document.querySelectorAll('img');
        el.forEach(img => {
            if (img.id) {
                img.click();
            }
        });
        console.log(this.state.mode);
    }

    addImage = () => {
        const el = document.getElementById('add-image');

        if (el.files && el.files[0]) {
            var FR = new FileReader();
            FR.onload = () => {
                var img = new window.Image();
                img.src = FR.result;
                img.onload = () => {
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
        const { widthFrame, heightFrame, filterTab } = this.state;
        const stageLayer = this.getStage.children;

        let canvas = document.createElement('canvas');
        canvas.width = widthFrame;
        canvas.height = heightFrame;
        let ctx = canvas.getContext('2d');
        ctx.filter = this.state.filter; // add filters to canvas;
        let childrenCanvas;
        stageLayer.forEach(_layers => {
            if (_layers.visible() === false) {
                return;
            }

            _layers.children.forEach(_shape => {
                if (_shape.id() === 'group') {
                    _shape.children.forEach(_groupChildren => {
                        if (_groupChildren.id() === 'imgPlace') {
                            ctx.drawImage(_groupChildren.getImage(), _shape.x(), _shape.y());
                        } else {
                            childrenCanvas = _groupChildren.getImage();
                            ctx.drawImage(childrenCanvas, _shape.x(), _shape.y());
                        }
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

            let layer = new Konva.Layer({
                id: 'newLayer',
                name: 'no',
                //Clip is for img to able move
                clip: {
                    x: 0,
                    y: 0,
                    width: width,
                    height: height,
                }
            });

            this.defaultLayer.width(width);
            this.defaultLayer.height(height);

            this.getStage.add(layer);
            let layerTMP = layerManagement;

            layerTMP.push({
                name: layer.nodeType,
                key: layer._id,
                activeLayer: 'true',
                isVisible: 'true',
            });

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
    }

    setInvisible = (e) => {
        const { layerManagement } = this.state;
        const stageLayer = this.getStage.children;

        layerManagement.forEach(_layersManagement => {
            stageLayer.forEach((_layers, _index) => {
                if (e.target.id === _layers._id.toString() && e.target.id === _layersManagement.key.toString()) {
                    if (_index >= 1) {
                        if (_layers.visible() === false)
                            _layers.visible(true);
                        else
                            _layers.visible(false);
                    } else {
                        alert('You can not turn off last layer');
                    }
                }
            });
        });


        layerManagement.forEach((_layers, _index) => {
            if (e.target.id === _layers.key.toString()) {
                if (_index >= 1) {
                    if (_layers.isVisible === 'true')
                        _layers.isVisible = 'false';
                    else
                        _layers.isVisible = 'true';
                }
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

                <main>
                    <div className='layer-management'
                        onMouseMove={() => { this.Mouse.dragLayerManagement('.layer-management') }}>
                        <ul>
                            {
                                this.state.layerManagement.map((_layers, index) => {
                                    return (
                                        <div>
                                            <li id={_layers.key}
                                                key={_layers.key}
                                                name={_layers.activeLayer}
                                                onMouseDown={(e) => { this.offAllButtons(); this.clickLayer(e); }}
                                            >
                                                <div className={'invisible-btn'}
                                                    id={_layers.key}
                                                    name={_layers.isVisible}
                                                    onMouseDown={(e) => { this.offAllButtons(); this.setInvisible(e); }}>
                                                    o
                          </div>
                                                {index} {_layers.name} {_layers.key}
                                            </li>
                                        </div>
                                    )
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
                                    }}>/\</button>
                                <button className='layer-management-options-btn down-btn'
                                    onMouseDown={() => {
                                        this.buttonUpClick = false;
                                        this.moveLayerUpOrBottom(this.buttonUpClick);
                                        this.offAllButtons();
                                    }}>\/</button>
                            </div>
                            <button className='layer-management-options-btn add-btn'
                                onClick={() => { this.offAllButtons(); this.addLayer(null); }}>add</button>
                            <button className='layer-management-options-btn remove-btn'
                                onClick={() => { this.offAllButtons(); this.removeLayer() }}>remove</button>
                        </div>
                    </div>
                    <ToolBar mode={this.changeMode}
                        color={this.changeColor}
                        ref={node => { this.tob = node }}
                        returnStage={this.returnStage}
                        returnLayerManagement={this.returnLayerManagement}
                        offAllButtons={this.offAllButtons}
                        text={this.changeText}
                    />
                    <Settings changeSizePencil={this.changeSizePencil}
                        changeSizeEraser={this.changeSizeEraser}
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
                        height={window.innerHeight - 100 - 13}
                        onMouseMove={(e) => { this.Mouse.mouseCircle(e) }}
                        ref={node => { this.stage = node }}
                        fill={'red'}
                    >
                    </Stage>
                </main>

                <footer>
                    <div className='footer-wrapper wrapper'>
                        Soon there will be a footer here !
            </div>
                </footer>
            </div>
        );
    }
}