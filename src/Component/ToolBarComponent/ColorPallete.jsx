import React from 'react';
import {Image} from 'react-konva';

export default class ColorPallete extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            canvas: null,
            context: null,
            pixel: null,
        }
    }

    componentDidMount() {
        fetch('https://vignette.wikia.nocookie.net/color-list/images/2/2b/Color_wheel.png')
        .then(resp => {
            if (resp.ok) {
                const canvas = document.createElement('canvas');
                canvas.className = 'color-pallete';
                canvas.style.position = 'absolute';
                const context = canvas.getContext('2d');

                const image = new window.Image();
                canvas.width = 200;
                canvas.height = 200;
                image.src = resp.url;
                image.crossOrigin = "Anonymous";



                context.fillStyle = 'grey';
                context.fillRect(0 , 0, canvas.width, canvas.height);


                
                image.onload = () => {
                    context.drawImage(image, 0, 0, canvas.width, canvas.height);
                    
                    this.setState({
                        // image: context.drawImage(image, 0, 0, 300, 300),
                        canvas, 
                        context
                    });
                };
            } else {
                return Promise.reject(resp);
            }
        })
        .catch(error => {
            console.log('Błąd: ', error)
        });
    }
    
    mouseMove = () => {
        const {context, canvas} = this.state;
        const stage = this.image.parent.parent;
        this.lastPointerPosition = stage.getPointerPosition();
        
        let pos = {
            x: this.lastPointerPosition.x - this.props.returnDragX(),
            y: this.lastPointerPosition.y - this.props.returnDragY() - this.image.y(),
        };
        
        let imageData = context.getImageData(pos.x, pos.y, 1, 1);
        let pixel = imageData.data; 
                
        this.setState({
            pixel: pixel,
        });
        // this.image.getLayer().draw();
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
        this.props.changeColor(colorString);
    } 

    render() {
        const {canvas, x, y} = this.state;
        return (
            <Image image={canvas}
                ref={node => {this.image = node}}
                onMouseMove={this.mouseMove}
                onMouseDown={this.mosueClick}
                y={100}
            />
        )
    }
}