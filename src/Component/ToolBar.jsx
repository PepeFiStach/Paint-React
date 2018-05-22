import React from 'react';
import Konva from 'konva';
import {Stage, Layer, Rect} from 'react-konva'
import Eraser from './ToolBarComponent/Eraser.jsx';
import ColorPallete from './ToolBarComponent/ColorPallete.jsx';

export default class ToolBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            mode: '',
            color: '',
            draggable: true,
            click: false,
        }
    }

    changeMode = () => {
        if (!this.state.click) {
            this.setState({
                click: true,
                mode: 'eraser',
            })
        } else {
            this.setState({
                click: false,
                mode: 'brush',
            })
        }
        console.log(this.state.click);

        this.props.mode(this.state.mode);
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
                <Rect width={200} height={500} fill={'green'}/>
                <Eraser changeMode={this.changeMode}/>
                <ColorPallete changeColor={this.changeColor} returnDragX={this.returnDragX} returnDragY={this.returnDragY}/>
                <Rect width={10} height={10} fill={'yellow'} onMouseDown={this.dragToolBar.bind(this)} x={200}/>
            </Layer>
        )
    }
}