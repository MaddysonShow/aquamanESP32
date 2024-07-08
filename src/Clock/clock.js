import React, {useContext, useEffect, useRef} from 'react';
import {Storage} from "../Context";

const Clock = ({setResponse}) => {
    ////////////////////////////////////////////////////////// NOT DONE/////////////////////////////////////
    const {serverData} = useContext(Storage)
    let {time} = serverData

    const TIME = useRef()

    useEffect(() => {
        /// если стэйт от response change then TIME to renewed data
        TIME.current.value = time
    }, [serverData]);

    function sendTime(val) {
        fetch(`/settime?time=${val}`, {method: "POST"})
            .then(data => data.text())
            .then(data => setResponse(prev => [data, ...prev]))
            .catch(er => console.log(er))
    }

    return (
        <div id="clock">
            <label htmlFor={"clock"} id="textTime">Время</label>
            <input className="time mclock" type="time" name={"clock"} onChange={(ev) =>
                {sendTime(ev.target.value)}
            } ref={TIME}/>
        </div>
    );
};

export default Clock;