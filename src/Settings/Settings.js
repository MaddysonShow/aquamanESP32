import React, {useContext} from 'react';
import styles from "./Settings.module.css"
import WiFi from "./wifi/WiFi";
import SettingFile from "./FileSetting/SettingFile";
import Group from "./group/Group";

const Settings = ({setBack, setResponse}) => {
    return (
        <div className={styles.settingsContainer}>
            <button onClick={() => {setBack(false)}} className={styles.back}>X</button>
            <Group setResponse={setResponse}/>
            <WiFi/>
            <SettingFile setResponse={setResponse}/>
        </div>
    );
};

export default Settings;