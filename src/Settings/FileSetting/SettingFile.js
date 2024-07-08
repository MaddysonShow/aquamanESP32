import React, {useContext, useRef, useState} from 'react';
import styles from "../Settings.module.css"
import {Storage} from "../../Context";
const SettingFile = ({setResponse}) => {
    const {serverData} = useContext(Storage)
    const [fileData, setFileData] = useState({})
    async function handleFileChange(event) {
        try {
            console.log(event.target.files[0]);
            const [file] = event.target.files
            const fileVal = JSON.parse(await file.text())
            const SDkeys = Object.keys(serverData)
            const Fkeys = Object.keys(fileVal)
            if (!SDkeys || !Fkeys) {return}
            for (let i = 0; i < SDkeys.length; i++) {
                let ind = SDkeys.indexOf(Fkeys[i])
                if (ind === -1) {
                    throw new Error("Файл поврежден");
                } else {

                }
            }
            console.log(Fkeys)
            fileVal.time = null
            setFileData(fileVal)
        }
        catch (error) {
            window.alert("Ошибка файла")
        }
    }

    function uploadSettings(ev) {
        ev.preventDefault()

        fetch("/uploadsettings", {method: "POST", body: JSON.stringify(fileData)})
            .then(data => data.text())
            .then(data => setResponse(prev => [...prev, data]))
            .catch(er => console.log(er))
    }

    return (
            <div className={styles.container2}>
                    <a href={"data:text/plain;charset=utf-8," + JSON.stringify(serverData)} download={"aquaman.json"}>Скачать файл настроек</a>
                <div className={styles.uploadContainer}>
                    <form onSubmit={uploadSettings}>
                       <label htmlFor="fileInput" className={styles.uploadLabel} >
                            Загрузить настройки
                        </label>
                        <input
                            type="file"
                            name="fileInput"
                            accept={"application/json"}
                            className={styles.uploadInput}
                            onInput={() => {console.log("input")}}
                            onChange={(ev) => {console.log("change"); handleFileChange(ev)}}
                            required
                        />
                        <button type={"submit"}>Отправить</button>
                    </form>

                </div>
            </div>
    );
};

export default SettingFile;