import React from 'react';
import bucket from '../../Image/icons2/bucket/512x512bgw.png';
import bucketBlack from '../../Image/icons2/bucket/512x512bgb.png';
import Mouse from '../../Functionality/Mouse';

export default class Bucket extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            image: null,
            stateClick: false,
            mode: 'bucket',
            name: 'bucket',
        };

        this.Mouse = new Mouse();
    }

    componentDidMount() {
        const image = new window.Image();
        image.src = bucket;
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
        image.src = bucket;
        this.state.mode = 'no-bucket';
        this.state.stateClick = false;
        image.onload = () => {
            this.setState({
                image: image,
                stateClick: false,
                mode: 'no-bucket',
            });
        };
    }

    mouseClick = () => {
        const { stateClick } = this.state;
        this.props.offAllButtons();
        const elMove = document.querySelector('.bucket-img');
        if (!stateClick) {
            const image = new window.Image();
            elMove.parentElement.style.backgroundColor = "#000";
            image.width = 32;
            image.height = 32;
            image.src = bucketBlack;
            this.state.mode = 'bucket';
            elMove.id = 'bucket-id';
            this.state.stateClick = true;
            image.onload = () => {
                this.setState({
                    image: image,
                    stateClick: true,
                    mode: 'bucket',
                });
            };
        } else {
            const image = new window.Image();
            elMove.parentElement.style.backgroundColor = "#fff";
            image.width = 32;
            image.height = 32;
            image.src = bucket;
            this.state.mode = 'no-bucket';
            elMove.removeAttribute('id');
            this.state.stateClick = false;
            image.onload = () => {
                this.setState({
                    image: image,
                    stateClick: false,
                    mode: 'no-bucket',
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
            img = <div className={'bucket'}
                onMouseMove={() => { this.Mouse.dragLayerManagement('.bucket') }}
                onClick={this.mouseClick}>
                <img src={image.src}
                    width={image.width}
                    height={image.height}
                    className={'bucket-img'}
                />
                <div className='bucket-resize'
                    onMouseMove={() => {
                        this.Mouse.resizeElement('.bucket-resize', '.bucket')
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