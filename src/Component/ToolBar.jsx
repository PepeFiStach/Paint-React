import React from 'react';
import Konva from 'konva';
import {Stage, Layer, Rect} from 'react-konva'
import {Eraser} from './ToolBarComponent/eraser.jsx';

export default class ToolBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            mode: ''
        }
    }

    changeMode = () => {
        this.setState({
            mode: 'eraser',
        });

        this.props.callbackFromParent(this.state.mode);
    }

    render() {
        return (
            <Layer>
                <Eraser changeMode={this.changeMode}/>
            </Layer>
        )
    }
}