import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.jsx';
import AppTest from './AppTest.jsx';
import registerServiceWorker from './registerServiceWorker';

// ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(<AppTest />, document.getElementById('root'));
registerServiceWorker();
