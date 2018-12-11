import React from 'react';
import Konva from 'konva';
//import bezier from '../../Image/move.jpg';
//import bezierWhite from '../../Image/move-white.jpg';
import bezier from '../../Image/icons2/bezier-curve/512x512bgw.png';
import bezierBlack from '../../Image/icons2/bezier-curve/512x512bgb.png'
import Mouse from '../../Functionality/Mouse';

export default class BezierCurve extends React.Component {
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

    modifyBezier = () => {
        
    }

    createBezier = (canvas, _stageLayers, drawingPlace, stage, bezierSize, color) => {
        let ctx = canvas.getContext('2d');

        ctx.lineWidth = bezierSize;
        console.log(bezierSize);
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = color;

        let img = new Konva.Image({
            image: canvas,
            id: 'bezierImage',
            width: canvas.width,
            height: canvas.height,
            x: 0,
            y: 0,
            visible: true,
        });

        let group = new Konva.Group({
            // width: canvas.width,
            // height: canvas.height,
            id: 'bezierGroup',
        });

        group.add(img);
        _stageLayers.add(group);
        stage.draw();
    }

    createAnchor = (x, y, stage) => {
        let anchor = new Konva.Circle({
            x: x,
            y: y,
            radius: 20,
            stroke: '#666',
            fill: '#ddd',
            strokeWidth: 2,
            draggable: true,
            id: 'anchor'
        });
        let bezierGroup = stage.find('#bezierGroup');
        console.log(bezierGroup);
        if (bezierGroup.length === 0) {
            // return;
        }
        bezierGroup[0].add(anchor);
        stage.draw();

        // anchor.on('dragend', () => {

        // })
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
                ref={node => { this.pencil = node }}
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