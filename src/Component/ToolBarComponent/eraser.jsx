import React from 'react';
import {Image} from 'react-konva';   
import ruber from '../../Image/ruber.png';
import ruberWhite from '../../Image/ruber-white.png';

export default class Eraser extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            image: null,
            stateClick: false,
        }
    }
    
    componentDidMount() {
        const image = new window.Image();
        image.src = ruber;
        image.width = 64;
        image.height = 64;
        image.onload = () => {
            this.setState({
                image: image,
            });
        };
    }

    mouseClick = () => {
        const {stateClick} = this.state;
        
        if (!stateClick) {
            const image = new window.Image();
            image.width = 64;
            image.height = 64;
            image.src = ruberWhite;
            image.onload = () => {
                this.setState({
                    image: image,
                    stateClick: true,
                });
            };
        } else {
            const image = new window.Image();
            image.width = 64;
            image.height = 64;
            image.src = ruber;
            image.onload = () => {
                this.setState({
                    image: image,
                    stateClick: false,
                });
            };
        }
        this.props.changeMode();
    }

    render() {
        return (
            <Image image={this.state.image} onClick={this.mouseClick}/>
        )
    }
} 