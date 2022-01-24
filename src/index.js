import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {AppProvider, Frame} from '@shopify/polaris';
import App from './App';

ReactDOM.render(<AppProvider><Frame><div className={'orichi-main'} style={{margin : 'auto', width : '70%'}}><App /></div></Frame></AppProvider>, document.getElementById('root'));

