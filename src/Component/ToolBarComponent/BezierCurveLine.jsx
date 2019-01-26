import React from 'react';
import Konva from 'konva';
//import bezier from '../../Image/pencil.jpg';
//import bezierWhite from '../../Image/pencil-white.png';
import bezier from '../../Image/icons2/stop-outline/512x512bgw.png';
import bezierBlack from '../../Image/icons2/stop-outline/512x512bgb.png';
import Mouse from '../../Functionality/Mouse';

export default class BezierCurveLine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            image: null,
            stateClick: false,
            mode: 'bezier',
            name: 'bezier',
        };

        this.Mouse = new Mouse();
    }

    componentDidMount() {
        this.bezierDrawingPlace = 0;
        const image = new window.Image();
        image.src = bezier;
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
        image.src = bezier;
        this.state.mode = 'no-bezier';
        this.state.stateClick = false;
        image.onload = () => {
            this.setState({
                image: image,
                stateClick: false,
                mode: 'no-bezier',
            });
        };
    }

    createBezier = (canvas, _stageLayers, drawingPlace, color) => {
        this.bezierDrawingPlace = drawingPlace;
        const bezier = new Konva.Line({
            id: 'bezierLine',

            points: [5, 70, 140, 23, 250, 60, 300, 20],
            stroke: 'red',
            strokeWidth: 15,
            lineCap: 'round',
            lineJoin: 'round',
            tension : 1
        });

        const group = new Konva.Group({
            id: 'group',
        });

        group.add(bezier);
        _stageLayers.add(group);
    }

    createCircle = (canvas, _stageLayers, drawingPlace, color) => {
        const bezier = new Konva.Circle({
            x: -9999,
            y: -9999,
            radius: 70,
            id: 'circle',
            fill: color,
            stroke: color,
            strokeWidth: 4,
            name: 'bezier',
        });

        const group = new Konva.Group({
            id: 'group',
        });

        group.add(bezier);
        _stageLayers.add(group);
    }

    retutnbezierDrawingPlace = () => {
        return this.bezierDrawingPlace;
    }

    mouseClick = () => {
        const { stateClick } = this.state;
        this.props.offAllButtons();
        const elMove = document.querySelector('.bezier-img');
        if (!stateClick) {
            const image = new window.Image();
            elMove.parentElement.style.backgroundColor = "#000";
            image.width = 32;
            image.height = 32;
            image.src = bezierBlack;
            this.state.mode = 'bezier';
            elMove.id = 'bezier-id';
            this.state.stateClick = true;
            image.onload = () => {
                this.setState({
                    image: image,
                    stateClick: true,
                    mode: 'bezier',
                });
            };
        } else {
            const image = new window.Image();
            elMove.parentElement.style.backgroundColor = "#fff";
            image.width = 32;
            image.height = 32;
            image.src = bezier;
            this.state.mode = 'no-bezier';
            elMove.removeAttribute('id');
            this.state.stateClick = false;
            image.onload = () => {
                this.setState({
                    image: image,
                    stateClick: false,
                    mode: 'no-bezier',
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
                ref={node => { this.bezier = node }}
                className={'bezier'}
            />;
        else
            img = <div className={'bezier'}
                onMouseMove={() => { this.Mouse.dragLayerManagement('.bezier') }}
                onClick={this.mouseClick}>
                <img src={image.src}
                    width={image.width}
                    height={image.height}
                    className={'bezier-img'}
                />
                <div className='bezier-resize'
                    onMouseMove={() => {
                        this.Mouse.resizeElement('.bezier-resize', '.bezier')
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