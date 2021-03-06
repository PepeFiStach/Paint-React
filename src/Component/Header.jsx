import React from 'react';
import download from '../Image/icons2/download-cloud-outline/512x512w.png';
import addImage from '../Image/icons2/image-square-outline/512x512w.png';
import newFile from '../Image/icons2/compose-outline/512x512w.png';

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
                <div id="nav-icon1" onClick={(e) => {
                    this.hambureger = document.querySelector('#nav-icon1');
                    this.nav = document.querySelector('#pop-up-navbar');
                    this.nav.classList.toggle('open');
                    this.hambureger.classList.toggle('open');}}
                     >
                        <span></span>
                        <span></span>
                        <span></span>
                </div>
                <li className='nav-bar-iteam logo'>
                    <a>Pluma</a>
                </li>
                    <ul id={'pop-up-navbar'}>
                    <li className='nav-bar-iteam'>
                        <button className={'draw'} onClick={this.props.popCanvasOptions}>
                            <a>
                                New
                            </a>
                            <img src={newFile} width={28} height={28}></img>
                        </button>
                </li>

                <li className='nav-bar-iteam add-image'>
                    <a className={'a-draw'}>
                        <input type='file' name='add-image' id='add-image' onChange={this.props.addImage}/>
                        <label htmlFor='add-image' >Add image</label>
                        <img src={addImage} width={28} height={28}></img>
                    </a>
                </li>

                <li className='nav-bar-iteam'>
                    <button className='draw' onClick={this.props.saveImg}>
                        <a>
                            Save
                        </a>
                        <img src={download} width={28} height={28}></img>
                    </button>
                </li>
                    </ul>

                        <ul className='canvas-options'>
                        <li>
                            <span className='canvas-options-exit'
                                onMouseDown={this.props.popCanvasOptions}>
                                X
                            </span>
                        </li>
                        <li>
                            <label htmlFor='canvas-width'>
                                Width (in px)
                            </label>

                            <input id='canvas-width'
                                className='canvas-options-input' 
                                type='number' min='0' max='5000'>
                            </input>
                        </li>

                        <li>
                            <label htmlFor='canvas-height'>
                                Height (in px)
                            </label>

                            <input id='canvas-height'
                                className='canvas-options-input'
                                type='number' min='0' max='5000'>
                            </input>
                        </li>

                        <li>
                            <button className='canvas-otpions-btn'
                                onClick={this.props.add}>
                                Create
                            </button>
                        </li>
                    </ul>
              </ul>
        )
    }
}