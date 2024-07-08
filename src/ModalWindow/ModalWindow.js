import React from 'react';
import "./ModalWindow.css"
const ModalWindow = ({children}) => {
    return (
        <div className="modalWindow">
            {children}
        </div>
    );
};

export default ModalWindow;