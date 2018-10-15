import React from 'react';
import colorWheel from '../../Image/color-wheel.png';
import Mouse from '../../Functionality/Mouse';

export default class ColorPallete extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            context: null,
            pixel: null,
        }
        this.Mouse = new Mouse();
    }

    componentDidMount() {
        this.canvas = document.querySelector('.colorPallete');
        const context = this.canvas.getContext('2d');
        const image = new window.Image();
        this.canvas.width = 150;
        this.canvas.height = 150;
        image.src = colorWheel;
        context.fillStyle = 'black';
        context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        image.onload = () => {
            context.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
            this.setState({
                context: context,
            });
        };
    }
    
    mouseMove = (e) => {
        const { context } = this.state;
        let xx = e.nativeEvent.clientX;
        let yy = e.nativeEvent.clientY;
        let image = {
            x : parseInt(window.getComputedStyle(this.canvas).left, 10),
            y : parseInt(window.getComputedStyle(this.canvas).top, 10),
        }
        
        let pos = {
            x: xx - image.x,
            y: yy - image.y,
        };
        
        let imageData = context.getImageData(pos.x, pos.y, 1, 1);
        let pixel = imageData.data; 
        this.setState({
            pixel: pixel,
        });
        this.Mouse.dragLayerManagement('.colorPallete');
    }
    
    mosueClick = () => {
        const {pixel} = this.state;
        let color = {
            R: pixel[0],
            G: pixel[1],
            B: pixel[2],
            A: pixel[3],
        }

        let colorString = `rgba(${color.R},${color.G},${color.B},${color.A})`;
        //Set value of rgba in settings options
        const r = document.getElementById('color-R');
        const g = document.getElementById('color-G');
        const b = document.getElementById('color-B');
        if (r !== null && g !== null && b !== null) {
            r.value = color.R;
            g.value = color.G;
            b.value = color.B;
        }

        this.props.changeColor(colorString);
    } 

    render() {
        return (
            <div>
                <canvas className={'colorPallete'} 
                    onMouseDown={this.mosueClick} 
                    onMouseMove={(e) => { this.mouseMove(e) }}
                >
                </canvas>
            </div>
        )
    }
}