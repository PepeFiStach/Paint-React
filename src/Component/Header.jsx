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
                <a className='nav-bar-list-iteam'>OPEN</a>
                </li>

                <li>
                    <a className='nav-bar-list-iteam'
                        onClick={this.props.clearDrawingPlace}>
                        CLEAR
                    </a>
                </li>

                <li>
                <a className='nav-bar-list-iteam'>SAVE</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        )
    }
}