import React from 'react';
import Konva from 'konva';
import {Stage, Layer, Rect} from 'react-konva'
import {Eraser} from './ToolBarComponent/Eraser.jsx';
import ColorPallete from './ToolBarComponent/ColorPallete.jsx';

export default class ToolBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            mode: '',
            color: '',
            draggable: false,
        }
    }

    changeMode = () => {
        this.setState({
            mode: 'eraser',
        });

        this.props.mode(this.state.mode);

        console.log('eraser');
    }

    changeColor = (dataFromColorPallete) => {
        this.setState({color: dataFromColorPallete});
        this.props.color(this.state.color);
    }

    dragToolBar() {
        const {draggable} = this.state;

        if (!draggable) {
            this.setState({
                draggable: true,
            });
        } else {
            this.setState({
                draggable: false,
            })
        }
    }

    returnDragX = () => {
        let tmp = this.refs.layer.x();
        return tmp;
    }

    returnDragY = () => {
        let tmp = this.refs.layer.y();
        return tmp;
    }

    render() {
        return (
            <Layer draggable={this.state.draggable} ref={'layer'}>
                <Eraser changeMode={this.changeMode}/>
                <ColorPallete changeColor={this.changeColor} returnDragX={this.returnDragX} returnDragY={this.returnDragY}/>
                <Rect width={10} height={10} fill={'yellow'} onClick={this.dragToolBar.bind(this)} x={250}/>
            </Layer>
        )
    }
}