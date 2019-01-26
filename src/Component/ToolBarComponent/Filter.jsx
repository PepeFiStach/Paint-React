import React from 'react';
import filter from '../../Image/icons2/options-horizontal-outline/512x512bgw.png';
import filterBlack from '../../Image/icons2/options-horizontal-outline/512x512bgb.png';
import Mouse from '../../Functionality/Mouse';

export default class Filter extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            image: null,
            stateClick: false,
            mode: 'filter',
            name: 'filter',
        };

        this.Mouse = new Mouse();
    }

    componentDidMount() {
        const image = new window.Image();
        image.src = filter;
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
        image.src = filter;
        this.state.mode = 'no-filter';
        this.state.stateClick = false;
        image.onload = () => {
            this.setState({
                image: image,
                stateClick: false,
                mode: 'no-filter',
            });
        };
    }

    mouseClick = () => {
        const { stateClick } = this.state;
        this.props.offAllButtons();
        const elMove = document.querySelector('.filter-img');
        if (!stateClick) {
            const image = new window.Image();
            elMove.parentElement.style.backgroundColor = "#000";
            image.width = 32;
            image.height = 32;
            image.src = filterBlack;
            this.state.mode = 'filter';
            elMove.id = 'filter-id';
            this.state.stateClick = true;
            image.onload = () => {
                this.setState({
                    image: image,
                    stateClick: true,
                    mode: 'filter',
                });
            };
        } else {
            const image = new window.Image();
            elMove.parentElement.style.backgroundColor = "#fff";
            image.width = 32;
            image.height = 32;
            image.src = filter;
            this.state.mode = 'no-filter';
            elMove.removeAttribute('id');
            this.state.stateClick = false;
            image.onload = () => {
                this.setState({
                    image: image,
                    stateClick: false,
                    mode: 'no-filter',
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
        else
            img = <div className={'filter'}
                    onMouseMove={() => { this.Mouse.dragLayerManagement('.filter') }}
                    onClick={this.mouseClick}>
                        <img src={image.src}
                            width={image.width}
                            height={image.height}
                            className={'filter-img'}
                        />
                <div className='filter-resize'
                    onMouseMove={() => { 
                        this.Mouse.resizeElement('.filter-resize', '.filter') 
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