import React from 'react';
//import move from '../../Image/move.jpg';
//import moveWhite from '../../Image/move-white.jpg';
import Mouse from '../../Functionality/Mouse';
import move from '../../Image/icons2/cursor-outline/512x512bgw.png';
import moveBlack from '../../Image/icons2/cursor-outline/512x512bgb.png';

export default class Move extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            image: null,
            stateClick: false,
            mode: 'move',
            name: 'move',
        };

        this.Mouse = new Mouse();
    }
    
    componentDidMount() {
        const image = new window.Image();
        image.src = move;
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
        image.src = move;
        this.state.mode = 'no-move';
        this.state.stateClick = false;
        image.onload = () => {
            this.setState({
                image: image,
                stateClick: false,
                mode: 'no-move',
            });
        };
    }

    mouseClick = () => {
        const {stateClick} = this.state;
        this.props.offAllButtons();
        const elMove = document.querySelector('.move-img');

        if (!stateClick) {
            const image = new window.Image();
            elMove.parentElement.style.backgroundColor = "#000";
            image.width = 32;
            image.height = 32;
            image.src = moveBlack;
            this.state.mode = 'move';
            elMove.id = 'move-id';
            this.state.stateClick = true;
            image.onload = () => {
                this.setState({
                    image: image,
                    stateClick: true,
                    mode: 'move',
                });
            };
        } else {
            const image = new window.Image();
            elMove.parentElement.style.backgroundColor = "#fff";
            image.width = 32;
            image.height = 32;
            image.src = move;
            this.state.mode = 'no-move';
            elMove.removeAttribute('id');
            this.state.stateClick = false;
            image.onload = () => {
                this.setState({
                    image: image,
                    stateClick: false,
                    mode: 'no-move',
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
            img = <div className={'move'}
                onMouseMove={() => { this.Mouse.dragLayerManagement('.move') }}
                onClick={this.mouseClick}>
                <img src={image.src}
                    width={image.width}
                    height={image.height}
                    className={'move-img'}

                />
                <div className='move-resize'
                    onMouseMove={() => {
                        this.Mouse.resizeElement('.move-resize', '.move')
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