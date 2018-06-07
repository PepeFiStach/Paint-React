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
            layers: [],
            newFile: false,
        };
    }

    componentDidMount() {
        for (let i = 0; i < 5; i++) {
            console.error('TEST 2222222 VERSION' + i);
        }
        this.scaleBy = 1.01;   
        window.addEventListener('wheel', (e) => {
            this.scroll(e);
        });     

        // this.updateText();
        this.displayLayer();
    }

    changeMode = (dataFromToolBar) => {
        this.setState({ mode: dataFromToolBar });
    }

    changeColor = (dataFromToolBar) => {
        this.setState({ color: dataFromToolBar });
    }

    popCanvasOptions = () => {
        const canvasOptions = document.querySelector('.canvas-options');
        if (canvasOptions.style.display === 'block') {
            canvasOptions.style.display = 'none';
        } else {
            canvasOptions.style.display = 'block';
        }
    }

    newFile = () => {
        // HERE WILL BE CODE FROM INPUT TAG TO CREATE WIDTH AND HEIGHT CANVAS
        const canvasHeightOptions = document.querySelector('#canvas-height');
        const canvasWidthOptions = document.querySelector('#canvas-width');
        let newFileTMP = false;

        if (canvasHeightOptions.value >= 32 && canvasWidthOptions.value >= 32
            && !isNaN(canvasHeightOptions.value) && !isNaN(canvasWidthOptions.value)) {
            const { layers, widthFrame, heightFrame, newFile } = this.state;

            const stageLayer = this.stage.getStage().children;
            let tmp = [];
            newFileTMP = true;

            // IF THE TOOL-BAR WAS IN THE SAME STAGE THEN UNCOMMENT THIS LINE
            stageLayer.forEach((layer, index) => {
                // if (layer.id() === 'newLayer') {
                //     return;
                // }
                
                // tmp.push(layer);
                this.stage.getStage().removeChildren();
                // tmp.forEach((saveLayer, index) => {
                //     this.stage.getStage().add(saveLayer);
                // });
            });

            const layers_TMP = layers;
            layers_TMP.forEach((layer, index) => {
                layers_TMP.splice(index, layers_TMP.length);
            })

            this.setState({
                layers: layers_TMP,
                widthFrame: canvasWidthOptions.value,
                heightFrame: canvasHeightOptions.value,
                newFile: true,
            });

            this.addLayer(canvasWidthOptions.value, canvasHeightOptions.value, newFileTMP);
            this.popCanvasOptions();
            this.stage.getStage().draw();
        } else {
            newFileTMP = false;
            alert('WIDTH AND HEIGHT MUST BE A NUMBER AND BIGER THEN 32PX');
        }
    }

    addDrawingCanvas = (width, height) => {
        const { layers } = this.state;
        const stageLayer = this.stage.getStage().children;
        console.log(width, height);

        layers.forEach((layer, index) => {
            stageLayer.forEach((l, i) => {
                if (l._id === layer.key) {
                    const lChildren = l.children;
                    lChildren.forEach(lc => {
                        if (lc.id() === 'drawingPlace') {
                            return;
                        }
                    });

                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const context = canvas.getContext('2d');
                    this.setState({ canvas, context });
                    const img = new Konva.Image({
                        image: canvas,
                        x: 0,
                        y: 0,
                        stroke: 'black',
                        id: 'drawingPlace'
                    });

                    l.add(img);

                    img.on('mousedown', (e) => {
                        this.mouseDown(img);
                    });
                    img.on('mouseup', () => {
                        this.mouseUp(img);
                    });
                    img.on('mousemove', () => {
                        this.mouseMove(img, canvas, context);
                    });
                }
            })
        });
        this.stage.getStage().draw();
    }

    mouseUp(img) {
        this.setState({
            isDrawing: false,
            isMouseOnCanvas: false,
        });
    }

    mouseDown(img) {
        this.setState({
            isDrawing: true,
            isMouseOnCanvas: true,
        });

        const stage = img.parent.parent;
        this.lastPointerPosition = stage.getPointerPosition();
    }

    preventMouseOverCanvas = (e) => {
        const { test } = this.state;
        if (e.target.className === undefined) {
            this.setState({
                isDrawing: false,
            });
        }
    }

    mouseMove(img, canvas, context) {
        const { layers } = this.state;
        const stageLayer = this.stage.getStage().children;

        layers.forEach((l, index) => {
            if (l.activeLayer === 'true') {
                const { isDrawing, mode } = this.state;
                const stage = this.stage.getStage();
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
                // img = shape, img.parent = layer
                let localPos = {
                    x: (this.lastPointerPosition.x 
                        - img.x() 
                        - img.parent.x() 
                        - stage.x()) 
                        / stage.scaleX(),

                    y: (this.lastPointerPosition.y 
                        - img.y() 
                        - img.parent.y() 
                        - stage.y()) 
                        / stage.scaleY(),
                }

                context.moveTo(localPos.x, localPos.y);
                let pos = stage.getPointerPosition();

                localPos = {
                    x: (pos.x 
                        - img.x() 
                        - img.parent.x() 
                        - stage.x()) 
                        / stage.scaleX(),

                    y: (pos.y 
                        - img.y() 
                        - img.parent.y() 
                        - stage.y()) 
                        / stage.scaleY(),
                }

                context.lineTo(localPos.x, localPos.y);
                context.closePath();
                context.stroke();
                this.lastPointerPosition = pos;
                this.stage.getStage().draw();
            }
        });
    }

    clearAll = () => {
        const { canvas, image } = this.state;
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
        const { canvas, context } = this.state;
        const navBarIteam = document.querySelector('.nav-bar-list-iteam');
        context.clearRect(0, 0, canvas.width, canvas.height);
        this.image.getLayer().draw();
    }

    addImage = (e) => {
        const { canvas, image } = this.state;
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

    downloadImg(uri, name) {
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

    addLayer = (width, height, newFileTMP) => {
        const { newFile } = this.state;
        if (newFileTMP === true || newFile === true) {
            let layer = new Konva.Layer({
                id: 'newLayer',
                name: 'no',
            });
            this.stage.getStage().add(layer);
            const { layers, widthFrame, heightFrame } = this.state;
    
            if (height === undefined) {
                width = widthFrame;
                height = heightFrame;
            }
            let layerTMP = layers;
            layerTMP.push({
                name: layer.nodeType,
                key: layer._id,
                activeLayer: 'false',
            });
            this.addDrawingCanvas(width, height);
            this.setState({
                layers: layerTMP,
            });
        } else {
            alert('YOU MUST CREATE NEW FILE FIRST');
        }
    }

    clickLayer = (e) => {
        const { layers } = this.state;
        const stageLayer = this.stage.getStage().children;
        let layerTMP = layers;

        layerTMP.forEach((l, i) => {
            if (e.target.id === l.key.toString()) {
                if (l.activeLayer === 'false') {
                    l.activeLayer = 'true';
                }
                else {
                    l.activeLayer = 'false';
                }
            }
        });
        // WHEN I DELETE LAYER, CLICKED LAYER IS CORRECT
        stageLayer.forEach(layer => {
            if (e.target.id === layer._id.toString()) {
                if (layer.name() === 'no') {
                    layer.name('yes');
                    layer.moveToTop();
                }
            }
        });

        this.setState({
            layers: layerTMP,
        });
    }

    removeLayer = (e) => {
        const { layers } = this.state;
        const stageLayer = this.stage.getStage().children;
        let layerTMP = layers;

        layerTMP.forEach((l, i) => {
            if (l.activeLayer === 'true') {
                console.log('remove');
                stageLayer.forEach((layer, index) => {
                    if (layer._id === l.key) {
                        console.log(layer);
                        layer.getLayer().remove();
                    }
                });

                layerTMP.splice(i, 1);
            }
        });

        this.setState({
            layers: layerTMP,
        });
    }

    displayLayer = () => {
        const { layers } = this.state;
        let layerTMP = layers;
        const stageLayer = this.stage.getStage().children;
        stageLayer.forEach((layer, index) => {
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
            layers: layerTMP,
        });
    }

    scroll = (e) => {
        const stage = this.stage.getStage();
        var oldScale = stage.scaleX();
        // console.log(e.target);

        if (stage.x() == undefined) {
            console.log('ss');
        }
        var mousePointTo = {
            x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
            y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
        };

        var newScale = e.deltaY < 0 ? oldScale * this.scaleBy : oldScale / this.scaleBy;
        stage.scale({ x: newScale, y: newScale });

        var newPos = {
            x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
            y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale
        };
        stage.position(newPos);
        stage.draw();
    }

    targetEvent = (e) => {
        console.log(e.target);
    }

    render() {
        const { canvas, image } = this.state;
        return (
            <div className='app-wrapper wrapper'>

                <Header clearDrawingPlace={this.clearDrawingPlace}
                    addImage={this.addImage}
                    clearAll={this.clearAll}
                    saveImg={this.saveImg}
                    add={this.newFile}
                    popCanvasOptions={this.popCanvasOptions}
                />

                <div className='layer-management'>
                    <ul>
                        {
                            this.state.layers.map(layer => {
                                return (
                                    <div>
                                        <li key={layer.key}>
                                            {layer.name}{layer.key}{layer.activeLayer}
                                        </li>

                                        <button id={layer.key}
                                            onMouseDown={this.clickLayer}
                                        >
                                            o
                                        </button>
                                    </div>
                                )
                            })
                        }
                    </ul>
                    <button onMouseDown={this.addLayer}>add</button>
                    <button onMouseDown={this.removeLayer}>remove</button>
                </div>

                <div className='app-body'>

                    <Stage className='tool-bar stage'
                        width={window.innerWidth}
                        height={window.innerHeight}
                    >

                        <ToolBar mode={this.changeMode}
                            color={this.changeColor}
                            ref={node => { this.tob = node }}
                        />

                    </Stage>

                    <Stage className={'drawing-place stage'}
                        width={window.innerWidth * 0.7}
                        height={window.innerHeight}
                        onMouseMove={this.preventMouseOverCanvas}
                        ref={node => { this.stage = node }}
                        // onMouseDown={this.targetEvent}
                    >

                    </Stage>

                    <Stage width={window.innerWidth}
                        height={window.innerHeight}
                        className={'options stage'}
                    >

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