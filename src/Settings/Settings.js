import React from 'react';
import styles from "./Settings.module.css"
// import WiFi from "./wifi/WiFi";
import SettingFile from "./FileSetting/SettingFile";
import Group from "./group/Group";

const Settings = ({setBack, setResponse}) => {
    let count = 0;
    async function popup(val = null) {
        if (val) {
            let nowMin;
            nowMin = await fetch("/minval", {method: "GET"}).then(data => data.text())
            let minval = window.prompt(`значение мин яркости 0-255, щас ${nowMin}`)
            fetch(`/minval?val=${minval}`, {method: "POST"}).then(data => data.text()).then(data => alert(data))
        }
        let pass = window.prompt("password")
        if (pass == "pawa") {
            popup(true)
        }
    }
    return (
        <div className={styles.settingsContainer}>
            <button onClick={() => {setBack(false)}} className={styles.back}>X</button>
            <Group setResponse={setResponse}/>
            {/*<WiFi/>*/}
            <SettingFile setResponse={setResponse}/>
            <h3 style={{color: "white"}} onClick={() => {
                count++ > 5 && popup()
            }}>AQUAMAN</h3>
        </div>
    );
};

export default Settings;