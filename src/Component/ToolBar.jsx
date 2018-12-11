import React from 'react';
import Eraser from './ToolBarComponent/Eraser';
import Pencil from './ToolBarComponent/Pencil';
import Move from './ToolBarComponent/Move';
import Filter from './ToolBarComponent/Filter';
import Resize from './ToolBarComponent/Resize';
import Shape from './ToolBarComponent/Shape';
import Text from './ToolBarComponent/Text';
import Bucket from './ToolBarComponent/Bucket';
import BezierCurve from './ToolBarComponent/BezierCurve';
import ColorPallete from './ToolBarComponent/ColorPallete';
import ColorPicker from './ToolBarComponent/ColorPicker';

export default class ToolBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: 'default',
            color: '#df4b26',
            draggable: true,
            buttonTab: [],
        }
    }

    componentDidMount() {
        this.lastIndex = 0;
        this.currentIndex = 0;

        // this.lastIndex2 = 0;
        // this.currentIndex2 = 0;

        this.state.buttonTab.push(this.eraser);
        this.state.buttonTab.push(this.move);
        this.state.buttonTab.push(this.pencil);
        this.state.buttonTab.push(this.filter);
        this.state.buttonTab.push(this.resize);
        this.state.buttonTab.push(this.shape);
        this.state.buttonTab.push(this.text);
        this.state.buttonTab.push(this.bucket);
        this.state.buttonTab.push(this.bezier);
    }

    componentDidUpdate() {
        this.preventMultipleFor2 = true;
        this.preventMultipleFor3 = true;
        this.preventMultipleFor4 = true;
        this.preventMultipleFor5 = true;
    }

    changeMode = (stateMode, bezierMode) => {
        const stageLayer = this.props.returnStage().children;
        const layers = this.props.returnLayerManagement();
        let stateBezier = this.props.returnStateBezier();

        this.state.buttonTab.forEach(button => {
            if (button.state.mode === stateMode)
                return;
        });

        layers.forEach((layerFromManagement) => {
            stageLayer.forEach(layerFromStage => {
                if (layerFromManagement.activeLayer === 'true') {
                    if (layerFromManagement.key === layerFromStage._id) {
                        layerFromStage.children.forEach(ch => {
                            console.log(ch);
                            if (ch.id() === 'group' || ch.id() === 'bezierGroup') {
                                if (stateMode === 'move') {
                                    if (this.preventMultipleFor2) {
                                        ch.draggable(true);
                                        this.currentIndex = layerFromStage.index;
                                        stageLayer.forEach(_l => {
                                            this.lastIndex = _l.index;
                                        });
                                        layerFromStage.moveToTop();
                                        this.preventMultipleFor2 = false;
                                    }
                                }
                                if (stateMode === 'bezier') {
                                    if (this.preventMultipleFor4) {
                                        if (ch.id() === 'bezierGroup') {
                                            this.currentIndex = layerFromStage.index;
                                            stageLayer.forEach(_l => {
                                                this.lastIndex = _l.index;
                                            });
                                            layerFromStage.moveToTop();
                                            this.preventMultipleFor4 = false;
                                        }
                                    }
                                }
                                if (stateMode === 'no-move') {
                                    ch.draggable(false);
                                    if (this.preventMultipleFor3) {
                                        for (let i = 0; i < this.lastIndex - this.currentIndex; i++) {
                                            layerFromStage.moveDown();
                                        }
                                        this.preventMultipleFor3 = false;
                                        this.lastIndex = 0;
                                        this.currentIndex = 0;
                                    }
                                }
                                if (stateMode === 'no-bezier') {
                                    if (ch.id() === 'bezierGroup') {
                                        if (this.preventMultipleFor5) {
                                            for (let i = 0; i < this.lastIndex - this.currentIndex; i++) {
                                                layerFromStage.moveDown();
                                            }
                                            this.preventMultipleFor5 = false;
                                            this.lastIndex = 0;
                                            this.currentIndex = 0;
                                        }
                                    }
                                }
                            }
                        });
                    }
                }
            });
        });

        this.setState({
            mode: stateMode,
        });

        this.props.mode(stateMode, this.state.buttonTab);
    }

    changeColor = (dataFromColorPallete) => {
        this.setState({color: dataFromColorPallete});
        this.props.color(dataFromColorPallete);
    }

    changeText = (dataFromText) => {
        this.props.text(dataFromText);
    }

    returnColor = () => {
        return this.state.color;
    }

    render() {
        return (
            <div>
                <Eraser changeMode={this.changeMode} ref={node => {this.eraser = node}}
                    offAllButtons={() => {this.props.offAllButtons()}}/>
                <Pencil changeMode={this.changeMode} ref={node => { this.pencil = node }}
                    offAllButtons={() => { this.props.offAllButtons() }}/>
                <Move changeMode={this.changeMode} ref={node => { this.move = node }}
                    offAllButtons={() => { this.props.offAllButtons() }}/>
                <Filter changeMode={this.changeMode} ref={node => { this.filter = node }}
                    offAllButtons={() => { this.props.offAllButtons() }}/>
                <Resize changeMode={this.changeMode} ref={node => { this.resize = node }}
                    returnStage={this.props.returnStage}
                    returnLayerManagement={this.props.returnLayerManagement}
                    offAllButtons={() => { this.props.offAllButtons() }}/>
                <Shape changeMode={this.changeMode} ref={node => {this.shape = node}}
                    offAllButtons={() => { this.props.offAllButtons() }}/>
                <Text changeMode={this.changeMode} ref={node => {this.text = node}}
                    offAllButtons={() => { this.props.offAllButtons() }}
                    changeText={this.changeText}/>
                <Bucket changeMode={this.changeMode} ref={node => {this.bucket = node}}
                    offAllButtons={() => { this.props.offAllButtons() }}
                    changeText={this.changeText}/>
                <BezierCurve changeMode={this.changeMode} ref={node => {this.bezier = node}}
                    offAllButtons={() => { this.props.offAllButtons() }}
                    changeText={this.changeText}/>
                <ColorPicker changeColor={this.changeColor}/>
            </div>
                //<ColorPallete changeColor={this.changeColor}/> 
        )
    }
}