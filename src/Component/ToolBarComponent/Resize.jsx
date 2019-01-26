import React from 'react';
import Konva from 'konva';
import resize from '../../Image/icons2/popout-outline/512x512bgw.png';
import resizeBlack from '../../Image/icons2/popout-outline/512x512bgb.png'
import Mouse from '../../Functionality/Mouse';

export default class Resize extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            image: null,
            stateClick: false,
            mode: 'resize',
            name: 'resize',
        };

        this.Mouse = new Mouse();
    }

    componentDidUpdate() {
        this.preventMultipleFor2 = true;
        this.preventMultipleFor3 = true;
    }

    componentDidMount() {
        this.lastIndex = 0;
        this.currentIndex = 0;

        const image = new window.Image();
        image.src = resize;
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
        image.src = resize;
        this.state.mode = 'no-resize';
        this.state.stateClick = false;
        image.onload = () => {
            this.setState({
                image: image,
                stateClick: false,
                mode: 'no-resize',
            });
        };
    }

    mouseClick = () => {
        const { stateClick } = this.state;
        this.props.offAllButtons();
        const elMove = document.querySelector('.resize-img');
        if (!stateClick) {
            const image = new window.Image();
            elMove.parentElement.style.backgroundColor = "#000";
            image.width = 32;
            image.height = 32;
            image.src = resizeBlack;
            this.state.mode = 'resize';
            elMove.id = 'resize-id';
            this.state.stateClick = true;
            image.onload = () => {
                this.setState({
                    image: image,
                    stateClick: true,
                    mode: 'resize',
                });
            };
        } else {
            const image = new window.Image();
            elMove.parentElement.style.backgroundColor = "#fff";
            image.width = 32;
            image.height = 32;
            image.src = resize;
            this.state.mode = 'no-resize';
            elMove.removeAttribute('id');
            this.state.stateClick = false;
            image.onload = () => {
                this.setState({
                    image: image,
                    stateClick: false,
                    mode: 'no-resize',
                });
            };
        }
        this.props.changeMode(this.state.mode);
        this.addResize();
    }
    
    addResize = () => {
        const layerManagement = this.props.returnLayerManagement();
        const stageLayer = this.props.returnStage().children;
        const elMove = document.querySelector('.resize-img');

        layerManagement.forEach((layerFromManagement) => {
            stageLayer.forEach(layerFromStage => {
                if (layerFromManagement.activeLayer === 'true') {
                    if (layerFromManagement.key === layerFromStage._id) {
                        const transformer = new Konva.Transformer({
                            id: 'transformer',
                            rotateEnabled: false, // For now rotate are disabled
                        });
                        layerFromStage.children.forEach(ch => {
                            if (ch.id() === 'group') {
                                if (this.state.mode === 'resize') {
                                    if (ch.children[0].className === 'Rect' 
                                        || ch.children[0].className === 'Star'
                                        || ch.children[0].className === 'Arrow'
                                        || ch.children[0].className === 'Circle' 
                                        || ch.children[0].className === 'Ellipse'
                                        || ch.children[0].className === 'Text') {
                                            transformer.rotateEnabled(true);
                                        }

                                    if (this.preventMultipleFor2) {
                                        this.currentIndex = layerFromStage.index;
                                        stageLayer.forEach(_l => {
                                            this.lastIndex = _l.index;
                                        });
                                        layerFromStage.moveToTop();
    
    
                                        let parent = ch.parent;
                                        transformer.attachTo(ch);
                                        parent.add(transformer);
                                        let l = this.props.returnStage().find('Transformer');
                                        l[0].anchorSize(10 + this.props.returnStage().scaleX());
                                        
                                        elMove.click();
                                        elMove.click();
                                        this.props.returnStage().draw();
                                        this.preventMultipleFor2 = false;

                                    }
                                }
                                else if (this.state.mode === 'no-resize') {
                                    if (this.preventMultipleFor3) {
                                        let layer = ch.parent;
                                        let children = ch.parent.children[0];
                                        layer.removeChildren();
                                        layer.add(children);
                                        this.props.returnStage().draw();

                                        for (let i = 0; i < this.lastIndex - this.currentIndex; i++) {
                                            layerFromStage.moveDown();
                                        }
                                        this.preventMultipleFor3 = false;
                                    }
                                }
                            }
                        });
                    }
                }
            });
        });
    }

    render() {
        const { image } = this.state;
        let img;

        if (image === null)
            img = <img
                ref={node => { this.resize = node }}
                className={'resize'}
            />;
        else
            img = <div className={'resize'}
                onMouseMove={() => { this.Mouse.dragLayerManagement('.resize') }}
                onClick={this.mouseClick}>
                <img src={image.src}
                    width={image.width}
                    height={image.height}
                    className={'resize-img'}
                />
                <div className='resize-resize'
                    onMouseMove={() => {
                        this.Mouse.resizeElement('.resize-resize', '.resize')
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