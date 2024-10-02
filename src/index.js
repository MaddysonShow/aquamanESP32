import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {install} from 'resize-observer';

const root = ReactDOM.createRoot(document.getElementById('root'));
if (!window.ResizeObserver) {
    console.log("no observer");
    install();
}

root.render(
    // <React.StrictMode>
        <App/>
    // {/*</React.StrictMode>*/}
);

