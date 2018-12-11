import React from 'react';
import Konva from 'konva';
//import text from '../../Image/pencil.jpg';
//import textWhite from '../../Image/pencil-white.png';
import text from '../../Image/icons2/text/512x512bgw.png';
import textBlack from '../../Image/icons2/text/512x512bgb.png';
import Mouse from '../../Functionality/Mouse';

export default class Text extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            image: null,
            stateClick: false,
            mode: 'text',
            name: 'text',
        };

        this.Mouse = new Mouse();
    }

    componentDidMount() {
        const image = new window.Image();
        image.src = text;
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
        image.src = text;
        this.state.mode = 'no-text';
        this.state.stateClick = false;
        image.onload = () => {
            this.setState({
                image: image,
                stateClick: false,
                mode: 'no-text',
            });
        };
    }

    createTextArea = (canvas, _stageLayers, drawingPlace, stage) => {
        const textNode = new Konva.Text({
            id: 'text',
            fontSize: 20,
        });

        const group = new Konva.Group({
            id: 'group',
        });

        group.add(textNode);
        _stageLayers.add(group);
        // console.log(_stageLayers);

        textNode.on('dblclick', () => {
            // create textarea over canvas with absolute position

            // first we need to find its positon
            var textPosition = textNode.getAbsolutePosition();
            var stageBox = stage.getContainer().getBoundingClientRect();

            var areaPosition = {
                x: textPosition.x + stageBox.left,
                y: textPosition.y + stageBox.top
            };


            // create textarea and style it
            var textarea = document.createElement('textarea');
            document.body.appendChild(textarea);

            textarea.value = textNode.text();
            textarea.style.position = 'absolute';
            textarea.style.top = areaPosition.y + 'px';
            textarea.style.left = areaPosition.x + 'px';
            textarea.style.width = textNode.width();
            textarea.focus();

            textarea.addEventListener('keydown', function (e) {
                // hide on enter
                console.log(e.keyCode);
                if (e.keyCode === 27) {
                    textNode.text(textarea.value);
                    stage.draw();
                    document.body.removeChild(textarea);
                }
            });
            textarea.addEventListener('mouseleave', function(e) {
                if (e.buttons === 0) {
                    textNode.text(textarea.value);
                    document.body.removeChild(textarea);
                    _stageLayers.draw();
                }
            });
        });
    }

    mouseClick = () => {
        const { stateClick } = this.state;
        this.props.offAllButtons();
        const elMove = document.querySelector('.text-img');
        if (!stateClick) {
            const image = new window.Image();
            elMove.parentElement.style.backgroundColor = "#000";
            image.width = 32;
            image.height = 32;
            image.src = textBlack;
            this.state.mode = 'text';
            elMove.id = 'text-id';
            this.state.stateClick = true;
            this.props.changeText('on');
            image.onload = () => {
                this.setState({
                    image: image,
                    stateClick: true,
                    mode: 'text',
                });
            };
        } else {
            const image = new window.Image();
            elMove.parentElement.style.backgroundColor = "#fff";
            image.width = 32;
            image.height = 32;
            image.src = text;
            this.state.mode = 'no-text';
            elMove.removeAttribute('id');
            this.state.stateClick = false;
            this.props.changeText('off');
            image.onload = () => {
                this.setState({
                    image: image,
                    stateClick: false,
                    mode: 'no-text',
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
                ref={node => { this.text = node }}
                className={'text'}
            />;
        else
            img = <div className={'text'}
                onMouseMove={() => { this.Mouse.dragLayerManagement('.text') }}
                onClick={this.mouseClick}>
                <img src={image.src}
                    width={image.width}
                    height={image.height}
                    className={'text-img'}
                />
                <div className='text-resize'
                    onMouseMove={() => {
                        this.Mouse.resizeElement('.text-resize', '.text')
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