import React from 'react';
import Konva from 'konva';
//import shape from '../../Image/pencil.jpg';
//import shapeWhite from '../../Image/pencil-white.png';
import shape from '../../Image/icons2/stop-outline/512x512bgw.png';
import shapeBlack from '../../Image/icons2/stop-outline/512x512bgb.png';
import Mouse from '../../Functionality/Mouse';

export default class Shape extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            image: null,
            stateClick: false,
            mode: 'shape',
            name: 'shape',
        };

        this.Mouse = new Mouse();
    }

    componentDidMount() {
        this.shapeDrawingPlace = 0;
        const image = new window.Image();
        image.src = shape;
        image.width = 32;
        image.height = 32;
        image.onload = () => {
            this.setState({
                image: image,
            });
        };
    }

    off = () => {
        const image = new window.Image();
        image.width = 32;
        image.height = 32;
        image.src = shape;
        this.state.mode = 'no-shape';
        this.state.stateClick = false;
        image.onload = () => {
            this.setState({
                image: image,
                stateClick: false,
                mode: 'no-shape',
            });
        };
    }

    createRect = (canvas, _stageLayers, drawingPlace, color) => {
        this.shapeDrawingPlace = drawingPlace;
        const shape = new Konva.Rect({
            id: 'rect',
            fill: color,
            name: 'shape',
        });

        const group = new Konva.Group({
            id: 'group',
        });

        group.add(shape);
        _stageLayers.add(group);
    }

    createStar = (canvas, _stageLayers, drawingPlace, color) => {
        const shape = new Konva.Star({
            // x: -9999,
            // y: -9999,
            // numPoints: 5,
            // innerRadius: canvas.width / 4,
            // outerRadius: canvas.width / 4,
            x: -9999,
            y: -9999,
            numPoints: 5,
            innerRadius: canvas.width / 4,
            outerRadius: canvas.width / 2,
            id: 'star',
            fill: color,
            name: 'shape',
        });
        const group = new Konva.Group({
            id: 'group',
        });

        group.add(shape);
        _stageLayers.add(group);
    }

    createArrow = (canvas, _stageLayers, drawingPlace, color) => {
        const shape = new Konva.Arrow({
            pointerLength: 20,
            pointerWidth: 20,
            id: 'arrow',
            fill: color,
            stroke: color,
            strokeWidth: 4,
            name: 'shape',
        });

        const group = new Konva.Group({
            id: 'group',
        });

        group.add(shape);
        _stageLayers.add(group);
    }

    createCircle = (canvas, _stageLayers, drawingPlace, color) => {
        const shape = new Konva.Circle({
            x: -9999,
            y: -9999,
            radius: 70,
            id: 'circle',
            fill: color,
            stroke: color,
            strokeWidth: 4,
            name: 'shape',
        });

        const group = new Konva.Group({
            id: 'group',
        });

        group.add(shape);
        _stageLayers.add(group);
    }

    createEllipse = (canvas, _stageLayers, drawingPlace, color) => {
        const shape = new Konva.Ellipse({
            x: -9999,
            y: -9999,
            radius: {
                x: 100,
                y: 50,
            },
            id: 'ellipse',
            fill: color,
            stroke: color,
            strokeWidth: 4,
            name: 'shape',
        });

        const group = new Konva.Group({
            id: 'group',
        });

        group.add(shape);
        _stageLayers.add(group);
    }

    retutnShapeDrawingPlace = () => {
        return this.shapeDrawingPlace;
    }

    mouseClick = () => {
        const { stateClick } = this.state;
        this.props.offAllButtons();
        const elMove = document.querySelector('.shape-img');
        if (!stateClick) {
            const image = new window.Image();
            elMove.parentElement.style.backgroundColor = "#000";
            image.width = 32;
            image.height = 32;
            image.src = shapeBlack;
            this.state.mode = 'shape';
            elMove.id = 'shape-id';
            this.state.stateClick = true;
            image.onload = () => {
                this.setState({
                    image: image,
                    stateClick: true,
                    mode: 'shape',
                });
            };
        } else {
            const image = new window.Image();
            elMove.parentElement.style.backgroundColor = "#fff";
            image.width = 32;
            image.height = 32;
            image.src = shape;
            this.state.mode = 'no-shape';
            elMove.removeAttribute('id');
            this.state.stateClick = false;
            image.onload = () => {
                this.setState({
                    image: image,
                    stateClick: false,
                    mode: 'no-shape',
                });
            };
        }

        this.props.changeMode(this.state.mode);
    }

    render() {
        const { image } = this.state;
        let img;

        if (image === null)
            img = <img
                ref={node => { this.shape = node }}
                className={'shape'}
            />;
        else
            img = <div className={'shape'}
                onMouseMove={() => { this.Mouse.dragLayerManagement('.shape') }}
                onClick={this.mouseClick}>
                <img src={image.src}
                    width={image.width}
                    height={image.height}
                    className={'shape-img'}
                />
                <div className='shape-resize'
                    onMouseMove={() => {
                        this.Mouse.resizeElement('.shape-resize', '.shape')
                    }}>
                </div>
            </div>

        return (
            <div>
                {img}
            </div>
        )
    }
}