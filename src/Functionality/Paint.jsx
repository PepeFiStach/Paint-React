import React from 'react';

export default class Paint extends React.Component {
    constructor(props) {
        super(props);
        this.lastPointerPositionTemp = 0;
        this.localPositionTMP = {};
    }

    getPosition = (pos) => {
        this.lastPointerPositionTemp = pos;
    }
    
    startPainting = (child, img, mode, stage, isGroup, color, sizePencil, brush, sizeEraser, alpha) => {
        if (!child) {
            return;
        }
        let can = child.getImage();
        let ctx = can.getContext('2d');
        const elBrushOptions = document.querySelectorAll('.brush-list option');
        if (mode === 'pencil') {
            ctx.lineWidth = sizePencil;
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = (alpha/100);
        }
        else if (mode === 'eraser') {
            ctx.lineWidth = sizeEraser;
            ctx.lineJoin = "round";
            ctx.lineCap = "round";
            ctx.shadowBlur = null;
            ctx.shadowColor = null;
            ctx.globalCompositeOperation = 'destination-out';
        } else 
            return;

        elBrushOptions.forEach((brushOptions, _index) => {
            if (brushOptions.value === brush) {
                document.querySelector('.brush-list').selectedIndex = _index ;
            }
        });
        
        ctx.strokeStyle = color;
        
        ctx.beginPath();
        const group = stage.find('Group');
        const layer = stage.find('Layer');
        let density = 50;
        let groupX;
        let groupY;
        let transformerX;
        let transformerY;
        let transformerWidth;
        let transformerHeight;
        
        if (group[0] === undefined || isGroup === false) {
            groupX = 0;
            groupY = 0;
            transformerX = 1;
            transformerY = 1;
            transformerWidth = 1;
            transformerHeight = 1;
        } else {
            // child.parent is a group 
            groupX = child.parent.x() * stage.scaleX();
            groupY = child.parent.y() * stage.scaleY();
            transformerX = child.parent.scaleX();
            transformerY = child.parent.scaleY();
            // This is because i set width and height in group in App.jsx
            transformerWidth = child.parent.parent.clipWidth() / child.parent.width();
            transformerHeight = child.parent.parent.clipHeight() / child.parent.height();
        }

        // img = shape, layer[0] = layer
        let localPos = {
            x: (((this.lastPointerPositionTemp.x
                - img.x()
                - layer[0].x()
                - stage.x()
                - groupX) * transformerWidth)
                / stage.scaleX())
                / transformerX,

            y: (((this.lastPointerPositionTemp.y
                - img.y()
                - layer[0].y()
                - stage.y()
                - groupY) * transformerHeight)
                / stage.scaleY())
                / transformerY,
        }
        if (brush !== 'spray' || mode === 'eraser')
            ctx.moveTo(localPos.x, localPos.y);

        let pos = stage.getPointerPosition();

        localPos = {
            x: (((pos.x
                - img.x()
                - layer[0].x()
                - stage.x()
                - groupX) * transformerWidth)
                / stage.scaleX())
                / transformerX,

            y: (((pos.y
                - img.y()
                - layer[0].y()
                - stage.y()
                - groupY) * transformerHeight)
                / stage.scaleY())
                / transformerY,
        }
        this.localPositionTMP = {
            x: localPos.x,
            y: localPos.y,
        };
        if (mode !== 'eraser') {
            switch (brush) {
                case 'default':
                    ctx.lineJoin = "round";
                    ctx.lineCap = "round";
                    ctx.shadowBlur = null;
                    ctx.shadowColor = null;
                    break;

                case 'shadow':
                    ctx.lineJoin = "round";
                    ctx.lineCap = "round";
                    ctx.shadowBlur = sizePencil;
                    ctx.shadowColor = color;
                    break;

                case 'thick-brush':
                    ctx.shadowBlur = null;
                    ctx.shadowColor = null;
                    ctx.lineJoin = 'miter';
                    ctx.lineCap = 'butt';
                    break;

                case 'spray':
                    function getRandomFloat(min, max) {
                        return Math.random() * (max - min) + min;
                    }

                    for (var i = density; i--;) {
                        var angle = getRandomFloat(0, Math.PI * 2);
                        var radius = getRandomFloat(0, sizePencil);
                        ctx.fillStyle = color;
                        ctx.fillRect(
                            localPos.x + radius * Math.cos(angle),
                            localPos.y + radius * Math.sin(angle),
                            1, 1);
                    }
                    break;
                
                case 'blender':
                    let r = can.getBoundingClientRect();
                    let x = localPos.x - r.left;
                    let y = localPos.y - r.top;
                    ctx.fillStyle = color;
                    ctx.arc(x, y, sizePencil, 0, 2*Math.PI);
                    ctx.fill();

                    break;

                default:
                    alert('Brush is undefined');
                    break;
            }
        }

        if (brush !== 'spray' && brush !== 'blender' || mode === 'eraser') {
            ctx.lineTo(localPos.x, localPos.y);
            ctx.closePath();
            ctx.stroke();
        }

        this.lastPointerPositionTemp = pos;
        if (img.parent.id === 'group') {
            child.parent.parent.draw();
        } else {
            child.parent.draw();
        }
    }
}