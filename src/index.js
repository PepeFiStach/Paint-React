import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App.jsx';
import AppTest from './AppTest.jsx';
import Test2 from './Test2.jsx';
import registerServiceWorker from './registerServiceWorker';

// ReactDOM.render(<App />, document.getElementById('root'));
// ReactDOM.render(<AppTest />, document.getElementById('root'));
ReactDOM.render(<Test2 />, document.getElementById('root'));
registerServiceWorker();
