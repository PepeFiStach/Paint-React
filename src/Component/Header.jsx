import React from 'react';

export default class Header extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
    }

    render() {
        return (
        <div className='header'>
          <div className='header-wrapper wrapper'>
            <div className='nav-bar'>
              <ul className='nav-bar-list list'>
                <li>
                    <a className='nav-bar-list-iteam nav-bar-new'
                        onClick={this.props.popCanvasOptions}>
                        NEW
                    </a>
                    <div className='canvas-options'>
                            <label htmlFor='canvas-width'>
                                width
                            </label>

                            <input id='canvas-width' 
                                className='canvas-options-input' >
                            </input>

                            <label htmlFor='canvas-height'>
                                height
                            </label>
                            
                            <input id='canvas-height'
                                className='canvas-options-input'>
                            </input>
                            <button className='canvas-otpions-btn'
                                onClick={this.props.add}>
                                CREATE CANVAS
                            </button>
                        </div>
                </li>

                <li>
                    <a className='nav-bar-list-iteam nav-bar-reset-all'
                        onClick={this.props.clearAll}
                    >
                        RESET ALL
                    </a>
                </li>

                <li>
                    <a className='nav-bar-list-iteam nav-bar-open'>
                        <input type='file' id='test' onChange={this.props.addImage}/>
                    </a>
                </li>

                <li>
                    <a className='nav-bar-list-iteam nav-bar-clear'
                        onClick={this.props.clearDrawingPlace}>
                        CLEAR
                    </a>
                </li>

                <li>
                    <a className='nav-bar-list-iteam'
                        onClick={this.props.saveImg}>
                        SAVE
                    </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        )
    }
}