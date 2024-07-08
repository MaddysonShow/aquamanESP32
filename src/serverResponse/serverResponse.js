import React from 'react';
import module from "./serverResponse.module.css"
const ServerResponse = ({response}) => {

    function colText(el, ind) {
        if (response[ind] == undefined || el[el.length-1] == (undefined || null)) {
            return
        }
        let color = "green"
        if (el.endsWith("E")) {
            color = "red"
        }
        return (<div key={el+ind} style={{backgroundColor: color}} className={module.message}>{el.slice(0, (el.length-1))}</div>)
    }
    return (
        <div className={module.container}>
            <div className={module.isOk}>
                {
                    response.map((el, ind)=> {return colText(el, ind)})
                }
            </div>
        </div>
    );
};

export default ServerResponse;