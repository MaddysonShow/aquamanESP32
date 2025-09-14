import React, {useContext} from 'react';
import styles from "../Settings.module.css"
import {Storage} from "../../Context";

const Group = ({setResponse}) => {
    const {serverData} = useContext(Storage)

    function master() {
        const ID = Date.now()
        const payload = {
            taskID: ID,
            isMaster: serverData.isMaster == 0 ? 1 : 0
        }
        setResponse(prev => [{value: "Группа: ", response: null, taskID: ID}, ...prev])
        fetch("/master", {method: "POST", body: JSON.stringify(payload)}
        )
            .then(data => data.json())
            .then(data => setResponse(prev => prev.map(function (el) {
                if (el.taskID == ID) {
                    el.response = data.value
                }
                return el
            })))
            .catch(() => setResponse(prev => prev.map(function (el) {
                if (el.taskID == ID) {
                    el.response = "нет подключенияE"
                }
                return el
            })))
            .finally(() => typeof serverData.iosFetch == "function" && serverData.iosFetch())
    }

    return (
        <div className={styles.container}>
            <button style={{color: serverData.isMaster == null ? "white" : serverData.isMaster == 0 ? "white" : "brown"}}
            onClick={master}>{serverData.isMaster == null ? " " : serverData.isMaster == 0 ? "Создать группу" : "Открыть группу"}</button>
            {
                serverData.isMaster != null &&
                <span style={{color: "white"}}>{
                    serverData.isMaster == 0 ? "Создает группу, светильник будет ведущим, запрещает подключение данного светильника другим светильником" :
                        "Открывает группу, ваш светильник может обьединиться с другим, и стать ведомым, управление будет утеряно"
                }</span>}
        </div>
    );
};

export default Group;