import React from 'react';
import Mouse from '../Functionality/Mouse';
import settings from '../Image/icons2/settings-outline/512x512.png';

export default class Settings extends React.Component {
    constructor(props) {
        super(props);

        this.modes = {
            PENCIL: 'pencil',
            ERASER: 'eraser',
            MOVE: 'move',
            FILTER: 'filter',
            SHAPE: 'shape',
            BEZIER: 'bezier',
            BUCKET: 'bucket',
        }

        this.state = {
            valueBlur: '0',
            valueBrightness: '100',
            valueContrast: '100',
            valueGrayscale: '0',
            valueHueRotate: '0',
            valueInvert: '0',
            valueOpacity: '100',
            valueSaturate: '100',
            valueSepia: '0',
            valueSizePencil: 5,
            valueSizeEraser: 5,
            valueSizeBezier: 5,
            whichShape: '',
            bezier: '',
            valueAlpha: '100',
        }

        this.Mouse = new Mouse();
    }
    
    componentDidUpdate() {
        if (this.props.mode === this.modes.PENCIL || this.props.mode === this.modes.SHAPE || this.props.mode === this.modes.BEZIER || this.props.mode === this.modes.BUCKET) {
            this.colorBox = document.querySelector('#color-box');
            this.colorBox.style.backgroundColor = this.props.color;
        }

        const el = document.querySelector('#color-box');
        const r = document.getElementById('color-R');
        const g = document.getElementById('color-G');
        const b = document.getElementById('color-B');

        if (el !== null && r !== null && g !== null && b !== null) {
            let regExp = new RegExp('\\D');
            let splitEl = el.style.backgroundColor.split(regExp);
            r.value = splitEl[4];
            g.value = splitEl[6];
            b.value = splitEl[8];
        }
    }

    setSizePencil = (e) => {
        this.props.changeSizePencil(e.target.value);
    }

    setAlpha = (e) => {
        this.props.changeAlpha(e.target.value);
    }

    setSizeBezier = (e) => {
        this.props.changeSizeBezier(e.target.value);
    }

    setSizeEraser = (e) => {
        this.props.changeSizeEraser(e.target.value);
    }

    setColor = () => {
        const r = document.getElementById('color-R');
        const g = document.getElementById('color-G');
        const b = document.getElementById('color-B');
        let color = 'rgba(' + r.value + ','
                            + g.value + ','
                            + b.value + ','
                            + '255)';

        this.props.changeColor(color);
    }

    setBrush = (e) => {
        this.props.changeBrush(e.target.value);
    }

    setFilter = () => {
        const { valueBlur, valueBrightness, valueContrast,
            valueGrayscale, valueHueRotate, valueInvert,
            valueOpacity, valueSaturate, valueSepia, } = this.state;
            
        let filter = 'blur(' + valueBlur + 
                    'px) brightness(' + valueBrightness + 
                    '%) contrast(' + valueContrast + 
                    '%) grayscale(' + valueGrayscale + 
                    '%) hue-rotate(' + valueHueRotate + 
                    'deg) invert(' + valueInvert + 
                    '%) opacity(' + valueOpacity + 
                    '%) saturate(' + valueSaturate + 
                    '%) sepia(' + valueSepia + '%)';
        const elKonva = document.querySelector('.konvajs-content');
        elKonva.style.filter = filter;

        this.props.changeFilter(filter);
    }

    setShape = (shape) => {
        this.state.whichShape = shape;
        this.props.changeShape(shape);
        this.setState({
            whichShape: shape,
        });
    }

    setBezier = (bezier, isClicked) => {
        this.state.whichBezier = bezier;
        this.props.changeBezier(bezier, isClicked);
        this.setState({
            whichBezier: bezier,
        });
    }

    resetFilter = () => {
        this.state.valueBlur = '0';
        this.state.valueBrightness = '100';
        this.state.valueContrast = '100';
        this.state.valueGrayscale = '0';
        this.state.valueHueRotate ='0';
        this.state.valueInvert ='0';
        this.state.valueOpacity ='100';
        this.state.valueSaturate ='100';
        this.state.valueSepia ='0';

        this.setFilter();

        this.setState({
            valueBlur: '0',
            valueBrightness: '100',
            valueContrast: '100',
            valueGrayscale: '0',
            valueHueRotate: '0',
            valueInvert: '0',
            valueOpacity: '100',
            valueSaturate: '100',
            valueSepia: '0',
        })
    }

    changeOptionsMode = () => {
        const el = document.querySelector('.settings');
        const { valueBlur, valueBrightness, valueContrast,
            valueGrayscale, valueHueRotate, valueInvert, 
            valueOpacity, valueSaturate, valueSepia,
            valueSizePencil, valueSizeEraser, valueSizeBezier, valueAlpha} = this.state;

        switch (this.props.mode) {
            case this.modes.PENCIL:
                el.style.display = 'block';
                return (
                    <div>
                        <li className={'settings-header'}>
                            <img
                                src={settings}
                                width={15}
                                height={15}
                            ></img>
                            <p>Pencil</p>
                        </li>
                        <ul>
                            <li className={'pencil-size-options'}>
                                <label htmlFor='Size'>Pencil size</label>
                                <input id='size' type='text' value={valueSizePencil}
                                    onMouseLeave={(e) => {e.target.blur()}}
                                    onClick={(e) => { e.target.select() }}
                                    onChange={(e) => { 
                                        this.state.valueSizePencil = e.target.value;
                                        this.setSizePencil(e)
                                        if (!e.target.value || e.target.value === '0' || e.target.value < 0) {
                                            this.state.valueSizePencil = valueSizePencil;
                                            alert('Pencil size can not be a 0 or null');
                                        }
                                    }}
                                >
                                </input>
                            </li>
                            <li>
                                <select className={'brush-list'}
                                    onChange={(e) => { this.setBrush(e) }}
                                    >
                                    <option value="default">Default</option>
                                    <option value="shadow">Shadow</option>
                                    <option value="thick-brush">Thick brush</option>
                                    <option value="spray">Spray</option>
                                    <option value="blender">Blender</option>
                                </select>
                            </li>
                            <li>
                                <label for="blenderAlpha">Alpha:</label>
                                <input id="blenderAlpha" type="range" min='0' max='100' value={valueAlpha}
                                    onChange={(e) => { 
                                        this.state.valueAlpha = e.target.value;
                                            this.setAlpha(e);
                                        }}>
                                </input>
                            </li>
                            <li className={'rgb-options'}>
                                <label htmlFor='color-R'>R</label>
                                <input id='color-R' type='text'
                                    onMouseLeave={(e) => { e.target.blur() }}
                                    onClick={(e) => {e.target.select()}}
                                    onChange={(e) => { 
                                        this.setColor() 
                                    }}
                                >
                                </input>
                                <label htmlFor='color-G'>G</label>
                                <input id='color-G' type='text'
                                    onMouseLeave={(e) => { e.target.blur() }}
                                    onClick={(e) => { e.target.select() }}
                                    onChange={(e) => { 
                                        this.setColor()
                                    }}
                                >
                                </input>
                                <label htmlFor='color-B'>B</label>
                                <input id='color-B' type='text'
                                    onMouseLeave={(e) => { e.target.blur() }}
                                    onClick={(e) => { e.target.select() }}
                                    onChange={(e) => { 
                                        this.setColor()
                                    }}
                                >
                                </input>
                            </li>
                            <li>
                                <label>Color</label>
                                <div className={'color-box-wrapper'}>
                                    <div id='color-box'></div>
                                </div>
                            </li>
                        </ul>
                    </div>
                )
                break;
            case this.modes.ERASER:
                el.style.display = 'block';
                return (
                    <div>
                        <li className={'settings-header'}>
                        <img
                            src={settings}
                            width={15}
                            height={15}
                        ></img>
                        <p>Eraser</p>
                        </li>
                        <ul>
                            <li>
                                <label htmlFor='size'>Eraser size</label>
                                <input id='size' type='text' value={valueSizeEraser}
                                    onMouseLeave={(e) => { e.target.blur() }}
                                    onClick={(e) => { e.target.select() }}
                                    onChange={(e) => { 
                                        this.state.valueSizeEraser = e.target.value;
                                        this.setSizeEraser(e);
                                        if (!e.target.value || e.target.value === '0' || e.target.value < 0) {
                                            this.state.valueSizeEraser = valueSizeEraser;
                                            alert('Eraser size can not be a 0 or null');
                                        }
                                    }}>
                                </input>
                            </li>
                        </ul>
                    </div>
                )
                break;
            case this.modes.FILTER:
                el.style.display = 'block';
                return (
                    <div>
                        <li className={'settings-header'}>
                            <img
                                src={settings}
                                width={15}
                                height={15}
                            ></img>
                            <p>Filter</p>
                        </li>
                        <ul>
                            <li>
                                <label htmlFor='blur'>Blur {valueBlur}px</label>
                                <input id='blur' type='range'
                                    min='0' max='20' value={valueBlur}
                                    onChange={(e) => { 
                                        this.state.valueBlur = e.target.value;
                                        this.setFilter(e, e.target.id, 'px');
                                        this.setState({valueBlur: e.target.value});
                                    }}>
                                </input>
                            </li>
                            <li>
                                <label htmlFor='brightness'>Brightness {valueBrightness}%</label>
                                <input id='brightness' type='range'
                                    min='0' max='500' value={valueBrightness}
                                    onChange={(e) => {
                                        this.state.valueBrightness = e.target.value;
                                        this.setFilter(e, e.target.id, '%');
                                        this.setState({ valueBrightness: e.target.value });
                                    }}>
                                </input>
                            </li>
                            <li>
                                <label htmlFor='contrast'>Contrast {valueContrast}%</label>
                                <input id='contrast' type='range'
                                    min='0' max='100' value={valueContrast}
                                    onChange={(e) => {
                                        this.state.valueContrast = e.target.value;

                                        this.setFilter(e, e.target.id, '%');
                                        this.setState({ valueContrast: e.target.value });
                                    }}>
                                </input>
                            </li>
                            <li>
                                <label htmlFor='grayscale'>Grayscale {valueGrayscale}%</label>
                                <input id='grayscale' type='range'
                                    min='0' max='100' value={valueGrayscale}
                                    onChange={(e) => {
                                        this.state.valueGrayscale = e.target.value;

                                        this.setFilter(e, e.target.id, '%');
                                        this.setState({ valueGrayscale: e.target.value });
                                    }}>
                                </input>
                            </li>
                            <li>
                                <label htmlFor='hue-rotate'>Hue rotate {valueHueRotate}deg</label>
                                <input id='hue-rotate' type='range'
                                    min='0' max='360' value={valueHueRotate}
                                    onChange={(e) => {
                                        this.state.valueHueRotate = e.target.value;

                                        this.setFilter(e, e.target.id, '%');
                                        this.setState({ valueHueRotate: e.target.value });
                                    }}>
                                </input>
                            </li>
                            <li>
                                <label htmlFor='invert'>Invert {valueInvert}%</label>
                                <input id='invert' type='range'
                                    min='0' max='100' value={valueInvert}
                                    onChange={(e) => {
                                        this.state.valueInvert = e.target.value;

                                        this.setFilter(e, e.target.id, '%');
                                        this.setState({ valueInvert: e.target.value });
                                    }}>
                                </input>
                            </li>
                            <li>
                                <label htmlFor='opacity'>Opacity {valueOpacity}%</label>
                                <input id='opacity' type='range'
                                    min='0' max='100' value={valueOpacity}
                                    onChange={(e) => {
                                        this.state.valueOpacity = e.target.value;

                                        this.setFilter(e, e.target.id, '%');
                                        this.setState({ valueOpacity: e.target.value });
                                    }}>
                                </input>
                            </li>
                            <li>
                                <label htmlFor='saturate'>Saturate {valueSaturate}%</label>
                                <input id='saturate' type='range'
                                    min='0' max='500' value={valueSaturate}
                                    onChange={(e) => {
                                        this.state.valueSaturate = e.target.value;

                                        this.setFilter(e, e.target.id, '%');
                                        this.setState({ valueSaturate: e.target.value });
                                    }}>
                                </input>
                            </li>
                            <li>
                                <label htmlFor='sepia'>Sepia {valueSepia}%</label>
                                <input id='sepia' type='range'
                                    min='0' max='100' value={valueSepia}
                                    onChange={(e) => {
                                        this.state.valueSepia = e.target.value;

                                        this.setFilter(e, e.target.id, '%');
                                        this.setState({ valueSepia: e.target.value });
                                    }}>
                                </input>
                            </li>
                            <li>
                                <button id='reset'
                                    onMouseDown={() => { this.resetFilter() }}>
                                    Reset
                                </button>
                            </li>
                        </ul>
                    </div>
                )
                break;

            case this.modes.SHAPE:
                el.style.display = 'block';
                return (
                   <div>
                        <li className={'settings-header'}>
                            <img
                                src={settings}
                                width={15}
                                height={15}
                            ></img>
                            <p>Shape</p>
                        </li>
                        <ul>
                            <li>
                                <button
                                    onMouseDown={() => {
                                        this.setShape('rect');
                                    }}>
                                        Rect
                                </button>
                            </li>
                            <li>
                                <button
                                    onMouseDown={() => {
                                        this.setShape('star');
                                    }}>
                                        Star
                                </button>
                            </li>
                            <li>
                                <button
                                    onMouseDown={() => {
                                        this.setShape('arrow');
                                    }}>
                                        Arrow
                                </button>
                            </li>
                            <li>
                                <button
                                    onMouseDown={() => {
                                        this.setShape('circle');
                                    }}>
                                        Circle
                                </button>
                            </li>
                            <li>
                                <button
                                    onMouseDown={() => {
                                        this.setShape('ellipse');
                                    }}>
                                        Ellipse
                                </button>
                            </li>
                            <li>
                                <label>Color</label>
                                <div className={'color-box-wrapper'}>
                                    <div id='color-box'></div>
                                </div>
                            </li>
                        </ul>
                   </div>
                )
                break;

            case this.modes.BEZIER:
                el.style.display = 'block';
                return (
                    <div>
                        <li className={'settings-header'}>
                            <img
                                src={settings}
                                width={15}
                                height={15}
                            ></img>
                            <p>Bezier curve</p>
                        </li>
                        <ul>
                            <li>
                                <button
                                    onMouseDown={() => {
                                        this.setBezier('create-bezier', true);
                                    }}>
                                        Create bezier
                                </button>
                            </li>
                            <li>
                                <button
                                    onMouseDown={() => {
                                        this.setBezier('modify-bezier');
                                    }}>
                                        Modify bezier
                                </button>
                            </li>
                            <li className={'pencil-size-options'}>
                                <label htmlFor='size'>Bezier size</label>
                                <input id='size' type='text' value={valueSizeBezier}
                                    onMouseLeave={(e) => {e.target.blur()}}
                                    onClick={(e) => { e.target.select() }}
                                    onChange={(e) => { 
                                        this.state.valueSizeBezier = e.target.value;
                                        this.setSizeBezier(e)
                                        if (!e.target.value || e.target.value === '0' || e.target.value < 0) {
                                            this.state.valueSizeBezier = valueSizeBezier;
                                            alert('Pencil size can not be a 0 or null');
                                        }
                                    }}
                                >
                                </input>
                            </li>
                            <li className={'rgb-options'}>
                                <label htmlFor='color-R'>R</label>
                                <input id='color-R' type='text'
                                    onMouseLeave={(e) => { e.target.blur() }}
                                    onClick={(e) => {e.target.select()}}
                                    onChange={(e) => { 
                                        this.setColor() 
                                    }}
                                >
                                </input>
                                <label htmlFor='color-G'>G</label>
                                <input id='color-G' type='text'
                                    onMouseLeave={(e) => { e.target.blur() }}
                                    onClick={(e) => { e.target.select() }}
                                    onChange={(e) => { 
                                        this.setColor()
                                    }}
                                >
                                </input>
                                <label htmlFor='color-B'>B</label>
                                <input id='color-B' type='text'
                                    onMouseLeave={(e) => { e.target.blur() }}
                                    onClick={(e) => { e.target.select() }}
                                    onChange={(e) => { 
                                        this.setColor()
                                    }}
                                >
                                </input>
                            </li>
                            <li>
                                <label>Color</label>
                                <div className={'color-box-wrapper'}>
                                    <div id='color-box'></div>
                                </div>
                            </li>
                        </ul>
                    </div>
                )
                break;
            case this.modes.BUCKET:
                el.style.display = 'block';
                return (
                    <div>
                        <li className={'settings-header'}>
                            <img
                                src={settings}
                                width={15}
                                height={15}
                            ></img>
                            <p>Bucket</p>
                        </li>
                        <ul>
                            <li className={'rgb-options'}>
                                <label htmlFor='color-R'>R</label>
                                <input id='color-R' type='text'
                                    onMouseLeave={(e) => { e.target.blur() }}
                                    onClick={(e) => {e.target.select()}}
                                    onChange={(e) => { 
                                        this.setColor() 
                                    }}
                                >
                                </input>
                                <label htmlFor='color-G'>G</label>
                                <input id='color-G' type='text'
                                    onMouseLeave={(e) => { e.target.blur() }}
                                    onClick={(e) => { e.target.select() }}
                                    onChange={(e) => { 
                                        this.setColor()
                                    }}
                                >
                                </input>
                                <label htmlFor='color-B'>B</label>
                                <input id='color-B' type='text'
                                    onMouseLeave={(e) => { e.target.blur() }}
                                    onClick={(e) => { e.target.select() }}
                                    onChange={(e) => { 
                                        this.setColor()
                                    }}
                                >
                                </input>
                            </li>
                            <li>
                                <label>Color</label>
                                <div className={'color-box-wrapper'}>
                                    <div id='color-box'></div>
                                </div>
                            </li>
                        </ul>
                    </div>
                )
                break;
            default:
                if (el !== null)
                    el.style.display = 'none';
                break;
        }
    }

    render() {
        return (
            <div className='settings'
                onMouseMove={() => { this.Mouse.dragLayerManagement('.settings')}}
            >
                {this.changeOptionsMode()}
            </div>
        )
    }
}