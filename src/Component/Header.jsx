import React from 'react';

export default class Header extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
    }

    exitCanvasOptions = () => {
        this.props.popCanvasOptions();
    }

    render() {
        return (
              <ul className='nav-bar'>
                <li className='nav-bar-iteam logo'>
                    <a>LOGO</a>
                </li>
                <li className='nav-bar-iteam'>
                    <a onClick={this.props.popCanvasOptions}>
                        NEW
                    </a>
                    <ul className='canvas-options'>
                        <li>
                            <span className='canvas-options-exit'
                                onMouseDown={this.props.popCanvasOptions}>
                                X
                            </span>
                        </li>
                        <li>
                            <label htmlFor='canvas-width'>
                                WIDTH (in pxl)
                            </label>

                            <input id='canvas-width'
                                className='canvas-options-input' >
                            </input>
                        </li>

                        <li>
                            <label htmlFor='canvas-height'>
                                HEIGHT (in pxl)
                            </label>

                            <input id='canvas-height'
                                className='canvas-options-input'>
                            </input>
                        </li>

                        <li>
                            <button className='canvas-otpions-btn'
                                onClick={this.props.add}>
                                CREATE CANVAS
                            </button>
                        </li>
                    </ul>
                </li>

                <li className='nav-bar-iteam'>
                    <a>
                        <input type='file' name='add-image' id='add-image' onChange={this.props.addImage}/>
                        <label htmlFor='add-image' >Add image</label>
                    </a>
                </li>

                <li className='nav-bar-iteam'>
                    <a onClick={this.props.saveImg}>
                        SAVE
                    </a>
                </li>
              </ul>
        )
    }
}