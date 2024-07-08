import React from 'react';
import styles from "./Settings.module.css"
import WiFi from "./wifi/WiFi";
import SettingFile from "./FileSetting/SettingFile";

const Settings = ({setBack, setResponse}) => {


    return (
        <div className={styles.settingsContainer}>
            <button onClick={() => {setBack(false)}} className={styles.back}>X</button>
            <WiFi/>
            <SettingFile setResponse={setResponse}/>
        </div>
    );
};

export default Settings;