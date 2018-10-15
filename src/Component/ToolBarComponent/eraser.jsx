import React from 'react';
import ruber from '../../Image/ruber.png';
import ruberWhite from '../../Image/ruber-white.png';
import Mouse from '../../Functionality/Mouse';

export default class Eraser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            image: null,
            stateClick: false,
            mode: 'eraser',
            name: 'eraser',
        };

        this.Mouse = new Mouse();
    }
    
    componentDidMount() {
        const image = new window.Image();
        image.src = ruber;
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
        image.src = ruber;
        this.state.mode = 'no-eraser';
        this.state.stateClick = false;
        image.onload = () => {
            this.setState({
                image: image,
                stateClick: false,
                mode: 'no-eraser',
            });
        };
    }

    mouseClick = () => {
        const { stateClick } = this.state;
        this.props.offAllButtons();
        const elMove = document.querySelector('.eraser-img');
        if (!stateClick) {
            const image = new window.Image();
            image.width = 32;
            image.height = 32;
            image.src = ruberWhite;
            this.state.mode = 'eraser';
            elMove.id = 'eraser-id';
            this.state.stateClick = true;
            image.onload = () => {
                this.setState({
                    image: image,
                    stateClick: true,
                    mode: 'eraser',
                });
            };
        } else {
            const image = new window.Image();
            image.width = 32;
            image.height = 32;
            image.src = ruber;
            this.state.mode = 'no-eraser';
            elMove.removeAttribute('id');
            this.state.stateClick = false;
            image.onload = () => {
                this.setState({
                    image: image,
                    stateClick: false,
                    mode: 'no-eraser',
                });
            };
        }
        
        this.props.changeMode(this.state.mode);
    }

    render() {
        const { image } = this.state;
        let img;

        if (image === null)
            img = <img />;
        else {
            img = <div className={'eraser'}
                    onMouseMove={() => { this.Mouse.dragLayerManagement('.eraser') }}
                    onClick={this.mouseClick}>
                        <img src={image.src}
                            width={image.width}
                            height={image.height}
                            className={'eraser-img'}
                        />
                        <div className='eraser-resize'
                            onMouseMove={() => { 
                                this.Mouse.resizeElement('.eraser-resize', '.eraser')
                            }}>
                        </div>
                </div>
        }
        
        return (
            <div>
                {img}
            </div>
        )
    }
} 