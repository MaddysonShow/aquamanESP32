import React from 'react';
import module from "./serverResponse.module.css"
const ServerResponse = ({response}) => {

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
        return (<div key={el+ind} style={{backgroundColor: color}} className={module.message}>{innerTxt}</div>)
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