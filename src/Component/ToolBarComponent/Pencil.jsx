import React from 'react';
//import pencil from '../../Image/pencil.jpg';
//import pencilWhite from '../../Image/pencil-white.png';
import pencil from '../../Image/icons2/edit-outline/512x512bgw.png';
import pencilBlack from '../../Image/icons2/edit-outline/512x512bgb.png';
import Mouse from '../../Functionality/Mouse';

export default class Pencil extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            image: null,
            stateClick: false,
            mode: 'pencil',
            name: 'pencil',
        };

        this.Mouse = new Mouse();
    }

    componentDidMount() {
        const image = new window.Image();
        image.src = pencil;
        image.width = 32;
        image.height = 32;
        this.p = document.querySelector('.pencil-img');
        console.log(this.p);
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
        image.src = pencil;
        this.state.mode = 'no-pencil';
        this.state.stateClick = false;
        image.onload = () => {
            this.setState({
                image: image,
                stateClick: false,
                mode: 'no-pencil',
            });
        };
    }

    mouseClick = () => {
        const { stateClick } = this.state;
        this.props.offAllButtons();
        const elMove = document.querySelector('.pencil-img');
        if (!stateClick) {
            const image = new window.Image();
            elMove.parentNode.style.backgroundColor = '#000';
            image.width = 32;
            image.height = 32;
            image.src = pencilBlack;
            this.state.mode = 'pencil';
            elMove.id = 'pencil-id';
            this.state.stateClick = true;
            image.onload = () => {
                this.setState({
                    image: image,
                    stateClick: true,
                    mode: 'pencil',
                });
            };
        } else {
            const image = new window.Image();
            elMove.parentNode.style.backgroundColor = '#fff';
            image.width = 32;
            image.height = 32;
            image.src = pencil;
            this.state.mode = 'no-pencil';
            elMove.removeAttribute('id');
            this.state.stateClick = false;
            image.onload = () => {
                this.setState({
                    image: image,
                    stateClick: false,
                    mode: 'no-pencil',
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
                    className={'pencil'}
                />;
        else
            img = <div className={'pencil'}
                onMouseMove={() => { this.Mouse.dragLayerManagement('.pencil') }}
                onClick={this.mouseClick}>
                <img src={image.src}
                    width={image.width}
                    height={image.height}
                    className={'pencil-img'}
                />
                <div className='pencil-resize'
                    onMouseMove={() => {
                        this.Mouse.resizeElement('.pencil-resize', '.pencil')
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