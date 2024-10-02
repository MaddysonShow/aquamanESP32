import React from 'react';
import module from "./serverResponse.module.css"
import ServerResponseInner from "./serverResponseInner";
const ServerResponse = ({response, setResponse}) => {
    function after2Sec(id) {
        setResponse(prev => [...prev.filter(el => el.taskID != id)])
    }

    function colText(el, ind) {
        if (response[ind] == undefined) {
            return
        }
        let innerTxt = ""
        let color = "green"
        if (!el.response) {
            color = "white"
            innerTxt = el.value + "..."
        }
        else {
            if (el.response.endsWith("E")) {
                color = "red"
            }
            innerTxt = el.value + el.response.slice(0, (el.response.length-1))
        }
        return (<ServerResponseInner key={el+ind} el={el} ind={ind} color={color} innerTxt={innerTxt} after2Sec={after2Sec}/>)
    }

    return (
        <div className={module.container}>
            <div className={module.isOk}>
                {
                    response.map((el, ind) => colText(el, ind))
                }
            </div>
        </div>
    );
};

export default ServerResponse;