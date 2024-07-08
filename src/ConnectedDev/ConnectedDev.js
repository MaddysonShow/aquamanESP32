import React, {useContext, useState} from 'react';
import {Storage} from "../Context";
import style from "./connDev.module.css"

const ConnectedDev = () => {
    let {serverData} = useContext(Storage);
    const [showDev, setShowDev] = useState(false)
    if (serverData != undefined && serverData.devices != undefined && serverData.devices[0] !=  "0") {
    return (
        <div>
            <h3 className={style.text} onClick={() => setShowDev(true)}>Синхронизированные светильники: {serverData.devices.filter((el)=> {return el != 0 && el != "0"}).length}</h3>
            {showDev && <div className={style.cndev}>
                <button onClick={() => {
                    setShowDev(false)
                }}>Х
                </button>
                {serverData.devices.filter((el)=> {return el != 0 || el != "0"}).map((el)=> {
                    return <h5 key={el} className={style.text} style={{margin: 0}}>{el}</h5>
                })}
            </div>}
        </div>
    ); } else {
        return <div></div>
    }
};

export default ConnectedDev;