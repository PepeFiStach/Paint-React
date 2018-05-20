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
        }
    }

    changeMode = () => {
        this.setState({
            mode: 'eraser',
        });

        this.props.callbackFromParent(this.state.mode);
    }

    changeColor = (dataFromColorPallete) => {
        this.setState({color: dataFromColorPallete});
        // console.log(this.state.color);
        this.props.color(this.state.color);
        
      }

    render() {
        return (
            <Layer>
                <Eraser changeMode={this.changeMode}/>
                <ColorPallete changeColor={this.changeColor}/>
            </Layer>
        )
    }
}