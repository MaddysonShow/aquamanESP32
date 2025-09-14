import React from 'react';
import module from "./serverResponse.module.css";

function ServerResponseInner ({el, ind, color, innerTxt, after2Sec}) {
    if (el?.response) {
        setTimeout(() => {after2Sec(el.taskID)}, 2000)
    }
    return (
        <div style={{backgroundColor: color}} className={module.message}>{innerTxt}</div>
    );
};

export default ServerResponseInner;