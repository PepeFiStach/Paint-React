import React from 'react';
import colorWheel from '../../Image/color-wheel.png';
import Mouse from '../../Functionality/Mouse';

export default class ColorPicker extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            context: null,
            pixel: null,
        }
        this.Mouse = new Mouse();
    }

    componentDidMount() {
        var colorBlock = document.getElementById('color-block');
        this.colorPicker = document.getElementById('color-picker');
        this.ctx1 = colorBlock.getContext('2d');
        this.width1 = colorBlock.width;
        this.height1 = colorBlock.height;

        this.colorStrip = document.getElementById('color-strip');
        this.ctx2 = this.colorStrip.getContext('2d');
        var width2 = this.colorStrip.width;
        var height2 = this.colorStrip.height;

        this.x = 0;
        this.y = 0;
        this.drag = false;
        this.rgbaColor = 'rgba(255,0,0,1)';

        this.ctx1.rect(0, 0, this.width1, this.height1);
        this.fillGradient();

        this.ctx2.rect(0, 0, width2, height2);
        var grd1 = this.ctx2.createLinearGradient(0, 0, 0, this.height1);
        grd1.addColorStop(0, 'rgba(255, 0, 0, 1)');
        grd1.addColorStop(0.17, 'rgba(255, 255, 0, 1)');
        grd1.addColorStop(0.34, 'rgba(0, 255, 0, 1)');
        grd1.addColorStop(0.51, 'rgba(0, 255, 255, 1)');
        grd1.addColorStop(0.68, 'rgba(0, 0, 255, 1)');
        grd1.addColorStop(0.85, 'rgba(255, 0, 255, 1)');
        grd1.addColorStop(1, 'rgba(255, 0, 0, 1)');
        this.ctx2.fillStyle = grd1;
        this.ctx2.fill();
    }

    click = (e) => {
        this.x = e.nativeEvent.clientX;
        this.y = e.nativeEvent.clientY;

        let image = {
            x : parseInt(window.getComputedStyle(this.colorPicker).left, 10),
            y : parseInt(window.getComputedStyle(this.colorPicker).top, 10),
            width : parseInt(window.getComputedStyle(this.colorPicker).width, 10),
        }

        let colorStripEl = document.querySelector('#color-strip');
        let colorStripElWidth = parseInt(window.getComputedStyle(colorStripEl).width, 10);
        
        let pos = {
            x: this.x - image.x - image.width + colorStripElWidth + 5, // 35 = colorStrip.width(30px) + padding(5px);
            y: this.y - image.y - 5, // 5 = padding(5px);
        };

        var imageData = this.ctx2.getImageData(pos.x, pos.y, 1, 1).data;
        this.rgbaColor = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';
        this.fillGradient();
    }

    fillGradient = () => {
        this.ctx1.fillStyle = this.rgbaColor;
        this.ctx1.fillRect(0, 0, this.width1, this.height1);
        
        var grdWhite = this.ctx2.createLinearGradient(0, 0, this.width1, 0);
        grdWhite.addColorStop(0, 'rgba(255,255,255,1)');
        grdWhite.addColorStop(1, 'rgba(255,255,255,0)');
        this.ctx1.fillStyle = grdWhite;
        this.ctx1.fillRect(0, 0, this.width1, this.height1);
        
        var grdBlack = this.ctx2.createLinearGradient(0, 0, 0, this.height1);
        grdBlack.addColorStop(0, 'rgba(0,0,0,0)');
        grdBlack.addColorStop(1, 'rgba(0,0,0,1)');
        this.ctx1.fillStyle = grdBlack;
        this.ctx1.fillRect(0, 0, this.width1, this.height1);
    }

    mousedown = (e) => {
        this.drag = true;
        this.changeColor(e);
    }
    
    mousemove = (e) => {
        if (this.drag) {
            this.changeColor(e);
        }
    }

    dragColorPicker = () => {
        this.Mouse.dragLayerManagement('#color-picker')
    }
    
    mouseup = (e) => {
        this.drag = false;
    }

    changeColor = (e) => {
        this.x = e.nativeEvent.clientX;
        this.y = e.nativeEvent.clientY;

        let image = {
            x : parseInt(window.getComputedStyle(this.colorPicker).left, 10),
            y : parseInt(window.getComputedStyle(this.colorPicker).top, 10),
            width : parseInt(window.getComputedStyle(this.colorPicker).width, 10),
        }
        
        let pos = {
            x: this.x - image.x - 5, // 5 = padding(5px);
            y: this.y - image.y - 5, // 5 = padding(5px);
        };

        var imageData = this.ctx1.getImageData(pos.x, pos.y, 1, 1).data;
        this.rgbaColor = 'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)';

        const r = document.getElementById('color-R');
        const g = document.getElementById('color-G');
        const b = document.getElementById('color-B');
        if (r !== null && g !== null && b !== null) {
            r.value = imageData[0];
            g.value = imageData[1];
            b.value = imageData[2];
        }

        this.props.changeColor(this.rgbaColor);
    }

    render() {
        return (
            <div>
                <input type="checkbox" id="color-input" checked></input>

                <div id="color-picker" onMouseMove={(e) => {this.dragColorPicker(e)}}>
                    <canvas id="color-block" height="150" width="150"
                        onMouseDown={(e) => {this.mousedown(e)}}
                        onMouseUp={(e) => {this.mouseup(e)}}
                        onMouseMove={(e) => {this.mousemove(e)}}
                    ></canvas>
                    <canvas id="color-strip" height="150" width="30"
                        onClick={(e) => {this.click(e)}}
                    ></canvas>
                </div>
            </div>
        )
    }
}