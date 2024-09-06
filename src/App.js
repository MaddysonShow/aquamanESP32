import './App.css';
import React, {useEffect, useRef, useState} from "react";
import ModalWindow from "./ModalWindow/ModalWindow";
import Clock from "./Clock/clock";
import {Storage, defVal} from "./Context";
import Settings from "./Settings/Settings";
import {Line} from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import LedPreferences from "./LedPreferences/LedPreferences";
import ServerResponse from "./serverResponse/serverResponse";
import ConnectedDev from "./ConnectedDev/ConnectedDev";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

function App() {
    const [Loading, setLoading] = useState(false)
    const [serverData, setServerData] = useState(defVal)
    const [showWiFi, setShowWiFi] = useState(false)
    const [showLedSet, setShowLedSet] = useState({add: false, remove: false, patch: false})
    const [response, setResponse] = useState([])
    const chart = useRef()
    const [online, setOnline] = useState(false)
    const ws = useRef(undefined)
    const responseTimer = useRef(undefined)
    const reconnectInterval = useRef(null)
    let isDev = false
    const host = isDev ? "ws://192.168.43.231/ws" : `ws://${window.location.host}/ws`

    if (response.length) {
        const array = response;
        if (typeof responseTimer.current === "number") {
            clearTimeout(responseTimer.current)
        }
        responseTimer.current = setTimeout(() => {
            if (array.length != 0) {
                for (let i = array.length - 1; i >= 0; i--) { // yield?
                    if (array[i].response) {
                        array.splice(i, 1)
                        console.log("deleting") // при обновлении массива обновляется таймер, ФИКС
                        break;
                    }
                }
                setResponse([...array])
            }
        }, 2000)
    }
    let colors = [{eng: "red", rus: "Красный"},
        {eng: "green", rus: "Зеленый"}, {eng: "blue", rus: "Синий"}, {eng: "white", rus: "Белый"},
        {eng: "darkviolet", rus: "УФ"}, {eng: "khaki", rus: "ХЗ"}, {eng: "cyan", rus: "Цианид"}, {
            eng: "orange",
            rus: "Оранжевый"
        }]

    function connect() {
        ws.current = new WebSocket(host)
        ws.current.onopen = event => {
            console.log("WS opened");
            setOnline(true)
            ws.current.send("user")
            if (reconnectInterval.current) {
                clearInterval(reconnectInterval.current);
                reconnectInterval.current = null;
            }
        }
        ws.current.onclose = event => {
            console.log("Connection closed");
            setOnline(false)
            if (!reconnectInterval.current) {
                reconnectInterval.current = setInterval(() => {
                    connect()
                }, 2000)
            }
        }
        ws.current.onmessage = event => {
            let parsedData = JSON.parse(event.data)
            console.log(parsedData);
            setServerData({...parsedData})
            setLoading(true)
        }
        ws.current.onerror = event => {
            console.log(`WS ERROR: ${event}`)
        }
    }

    useEffect(() => {
        connect()
        return (() => {
            ws.current.close()
            if (reconnectInterval.current) {
                clearInterval(reconnectInterval.current);
            }
        })
    }, [])

    function sync() {
        const ID = Date.now()
        setResponse(prev => [{value: "Синх.: ", response: null, taskID: ID}, ...prev])
        fetch("/sync", {method: "post"})
            .then(data => data.json())
            .then(data => setResponse(prev => prev.map(function (el) {
                if (el.taskID == ID) {
                    el.response = data.value
                }
                return el
            })))
            .catch(er => console.log(er))
    }

    function turnOnOff() {
        const ID = Date.now()
        const payload = {
            taskID: ID,
            isOn: serverData.isOn == 1 ? 0 : 1
        }
        setResponse(prev => [{value: "Режим: ", response: null, taskID: ID}, ...prev])
        fetch("/turnonoff", {method: "POST", body: JSON.stringify(payload)})
            .then(data => data.json())
            .then(data => setResponse(prev => prev.map(function (el) {
                if (el.taskID == ID) {
                    el.response = data.value
                }
                return el
            })))
            .catch(er => console.log(er))
    }

    function mapperForDatasets() {
        let dataset = []
        for (let i = 0; i < colors.length; i++) {
            dataset.push(
                {
                    label: colors[i].rus,
                    data: makeDataBrightness()[i],
                    borderColor: colors[i].eng,
                    borderWidth: 1,
                    backgroundColor: colors[i].eng,
                }
            )
        }
        return dataset
    }

    function makeLabelsForChart() {
        let mass = []
        let once = true
        for (let i = 0; i < serverData["Br_time"].length; i++) {
            if (serverData["Br_time"][0] == "00:00" && once) {
                mass.push(serverData["Br_time"][0])
                once = false
            }
            if (serverData["Br_time"][i] !== "00:00") {
                mass.push(serverData["Br_time"][i])
            }
        }
        return mass;
    }

    function makeDataBrightness() {
        let length = makeLabelsForChart().length
        let mass = [[], [], [], [], [], [], [], []]
        let colorsArray = ["Br1", "Br2", "Br3", "Br4", "Br5", "Br6", "Br7", "Br8"]
        // CA = colors array
        for (let CA = 0; CA < colorsArray.length; CA++) {
            // DFB = data from brightess ARRAY
            for (let DFB = 0; DFB < length; DFB++) {
                mass[CA].push(serverData[colorsArray[CA]][DFB])
            }
        }
        return mass
    }

    const data = {
        labels: makeLabelsForChart(),
        datasets: mapperForDatasets(),
    };
    const options = {
        responsive: true,
        minimum: 0,
        maximum: 100,
        maintainAspectRatio: false,
        scales: {
            y: {
                min: 0,
                max: 100
            }
        },
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Точки времени и яркости',
            },

        },
    };


    return (
        <Storage.Provider value={{serverData}}>
            {showWiFi && <Settings setBack={setShowWiFi} setResponse={setResponse}></Settings>}
            <div className="main">
                <ServerResponse response={response}/>
                <header>
                    <h4 id="logo">AQUAMAN</h4>
                    <div style={{display: "flex", justifyContent: "center", width: "100%"}} onClick={turnOnOff}>
                        {serverData.isOn == 1 ?
                            <svg width="30px" height="30px" viewBox="-2.4 -2.4 28.80 28.80" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"
                                   stroke="#CCCCCC" strokeWidth="0.24000000000000005"></g>
                                <g id="SVGRepo_iconCarrier">
                                    <path fillRule="evenodd" clipRule="evenodd"
                                          d="M12 2C12.5523 2 13 2.44772 13 3V4C13 4.55228 12.5523 5 12 5C11.4477 5 11 4.55228 11 4V3C11 2.44772 11.4477 2 12 2Z"
                                          fill="#00ff33"></path>
                                    <path fillRule="evenodd" clipRule="evenodd"
                                          d="M19.7071 4.29289C20.0976 4.68342 20.0976 5.31658 19.7071 5.70711L18.7071 6.70711C18.3166 7.09763 17.6834 7.09763 17.2929 6.70711C16.9024 6.31658 16.9024 5.68342 17.2929 5.29289L18.2929 4.29289C18.6834 3.90237 19.3166 3.90237 19.7071 4.29289Z"
                                          fill="#00ff33"></path>
                                    <path fillRule="evenodd" clipRule="evenodd"
                                          d="M19 12C19 11.4477 19.4477 11 20 11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H20C19.4477 13 19 12.5523 19 12Z"
                                          fill="#00ff33"></path>
                                    <path fillRule="evenodd" clipRule="evenodd"
                                          d="M2 12C2 11.4477 2.44772 11 3 11H4C4.55228 11 5 11.4477 5 12C5 12.5523 4.55228 13 4 13H3C2.44772 13 2 12.5523 2 12Z"
                                          fill="#00ff33"></path>
                                    <path fillRule="evenodd" clipRule="evenodd"
                                          d="M4.29289 4.29289C4.68342 3.90237 5.31658 3.90237 5.70711 4.29289L6.70711 5.29289C7.09763 5.68342 7.09763 6.31658 6.70711 6.70711C6.31658 7.09763 5.68342 7.09763 5.29289 6.70711L4.29289 5.70711C3.90237 5.31658 3.90237 4.68342 4.29289 4.29289Z"
                                          fill="#00ff33"></path>
                                    <path fillRule="evenodd" clipRule="evenodd"
                                          d="M12 6C8.68629 6 6 8.68629 6 12C6 13.6332 6.65387 15.1157 7.71186 16.1966C7.97971 16.4703 8.1241 16.7217 8.16867 16.9444L8.69776 19.5886C8.97833 20.9908 10.2095 22 11.6395 22H12.3605C13.7905 22 15.0217 20.9908 15.3022 19.5886L15.8313 16.9444C15.8759 16.7217 16.0203 16.4703 16.2881 16.1966C17.3461 15.1157 18 13.6332 18 12C18 8.68629 15.3137 6 12 6ZM11 16C10.4477 16 10 16.4477 10 17C10 17.5523 10.4477 18 11 18H13C13.5523 18 14 17.5523 14 17C14 16.4477 13.5523 16 13 16H11Z"
                                          fill="#00ff33"></path>
                                </g>
                            </svg> :
                            <svg width="30px" height="30px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                                 fill="none">
                                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                <g id="SVGRepo_iconCarrier">
                                    <path stroke="#ff0000" strokeLinecap="round" strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M10 18v-.107c0-.795-.496-1.488-1.117-1.984a5 5 0 1 1 6.235 0c-.622.497-1.118 1.189-1.118 1.984V18m-4 0v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2m-4 0h4m-2-3v-2"></path>
                                </g>
                            </svg>}
                    </div>
                    <div style={{display: "flex", justifyContent: "end", width: "100%"}}>
                        <button onClick={() => setShowWiFi(true)}
                                style={{fontSize: "13px", cursor: "pointer", margin: 0}}>Настройки
                        </button>
                    </div>
                </header>
                <div id={"status"} style={{padding: 0}}>
                    <h3 className={"statusText"} style={{color: online ? "green" : "red", margin: "0"}}>Статус:</h3>
                    <h3 style={{color: online ? "green" : "red", margin: "0"}}>{online ? "online" : "offline"}</h3>
                    <h3 className={"statusText"} style={{
                        color: serverData.isMaster == null ? "black" : serverData.isMaster == 0 ? "red" : "green",
                        margin: 0
                    }}>Группа:</h3>
                    <h3 style={{
                        color: serverData.isMaster == null ? "black" : serverData.isMaster == 0 ? "red" : "green",
                        margin: 0
                    }}>{serverData.isMaster == null ? "..." : serverData.isMaster == 0 ? "открытая" : "закрытая"}</h3>
                </div>
                <ConnectedDev/>
                <Clock setResponse={setResponse}></Clock>
                <div className={"buttons btn"}>
                    <button onClick={() => setShowLedSet({remove: false, patch: false, add: true})}
                            style={{background: "green", color: "white"}}>Добавить
                    </button>
                    <button onClick={() => setShowLedSet({remove: false, patch: true, add: false})}
                            style={{background: "yellow", color: "black"}}>Изменить
                    </button>
                    <button onClick={() => setShowLedSet({remove: true, patch: false, add: false})}
                            style={{background: "red", color: "white"}}>Удалить
                    </button>
                </div>
                {
                    (showLedSet.add || showLedSet.patch || showLedSet.remove) &&
                    <LedPreferences add={showLedSet.add} remove={showLedSet.remove} patch={showLedSet.patch}
                                    dots={makeLabelsForChart()}
                                    setResponse={setResponse} ws={ws}>{<button onClick={() => {
                        setShowLedSet({add: false, patch: false, remove: false})
                    }}>X</button>}</LedPreferences>
                }
                <div className={"chart"}>
                    <Line options={options} data={data} ref={chart}/>
                </div>
                <div className="syncButtonContainer">
                    <span>Синхронизировать данные с другимим светильниками</span>
                    <button className="syncButton" onClick={() => {
                        sync();
                    }}>Синхронизировать
                    </button>
                </div>

                {!Loading && !isDev &&
                    <ModalWindow>
                        <div className="loader">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </ModalWindow>}
            </div>

        </Storage.Provider>
    );
}

export default App;
