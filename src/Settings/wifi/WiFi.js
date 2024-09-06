import React, {useContext, useState} from 'react';
import styles from "../Settings.module.css";
import {Storage} from "../../Context";

const WiFi = () => {
    const {serverData} = useContext(Storage)
    const [ssid, setSsid] = useState("")
    const [password, setPassword] = useState("")
    const [hideOldAP, setHideOldAP] = useState(0)
    const [avWifi, setAvWifi] = useState([])
    const [loading, setLoading] = useState(false)
    const [scanLoops, setScanLoops] = useState(0)
    function sendData(ev) {
        ev.preventDefault()
        fetch(`/connect?wifi=${ssid}&pass=${password}&hideold=${hideOldAP}`, {method: "POST"})
            .then(data => console.log(data))
            .catch(er => console.log(er))
    }

    function getAvailableNetwrks() {
        fetch(`/availablenet`, {method: "GET"})
            .then((data) => {if (!data.ok) {
                return null
            } else  {
                return data.json()
            }})
            .then((data) => { console.log(data)
                if (!data && scanLoops < 10) {
                    console.log(scanLoops)
                    setScanLoops(prevState => prevState++)
                    setTimeout(getAvailableNetwrks, 1500)
                    return null
                } else {
                    setScanLoops(0)
                    return data
                }
            })
            .then((data) => {
                if (data) {
                    let mass = new Set(data)
                    setAvWifi([...mass])
                    setLoading(false)
                }
            })
            .catch((er) => {
                if (scanLoops < 10) {
                    setScanLoops(prevState => prevState++)
                    setTimeout(getAvailableNetwrks, 1500)
                }
                console.log(er)
            })
    }
    return (
        <div className={styles.container}>
            {loading ? <h1>ЗАГРУЗКА....</h1> : <button onClick={() => {
                getAvailableNetwrks()
                setLoading(true)
            }}>Найти WI-Fi сеть</button>}
            {avWifi.length > 0 &&
                <div className={styles.optionContainer}>
                    <label htmlFor={"ssids"}>Найденые сети</label>
                    <select name="ssids" onChange={(ev) => {
                        setSsid(ev.target.value)
                    }}>
                        <option>Выбрать</option>
                        {avWifi.map((el, ind) => <option value={el} key={ind}>{el}</option>)}
                    </select>
                </div>}
            <form onSubmit={sendData}>
                <input placeholder={"Название Wi-Fi сети"} onChange={ev => {
                    setSsid(ev.target.value)
                }} value={ssid} required min={1}/>
                <input placeholder={"Пароль от сети"} onChange={ev => setPassword(ev.target.value)}
                       value={password}/>
                <label htmlFor={"hide"}>Скрыть существующую сеть (Aquaman)</label>
                <input type={"checkbox"} name={"hide"} className={styles.chkBox}
                       onChange={ev => setHideOldAP(ev.target.checked ? 1 : 0)}
                       checked={hideOldAP == 1 ? true : false}/>
                {   serverData.isMaster ? <h4 style={{color: "white"}}>Откройте группу для подключения</h4> :
                    <button type={"submit"} className={styles.submitBtn}>Готово</button>
                }
            </form>
        </div>
    );
};

export default WiFi;