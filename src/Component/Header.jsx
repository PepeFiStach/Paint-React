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
                        onClick={this.props.clearAll}>
                        NEW
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