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
    let isDev = false
    const host = isDev ? "ws://192.168.43.34/ws" : `ws://${window.location.host}/ws`
    useEffect(() => {
        window.scroll(0,0)
    }, [showLedSet, showWiFi]);

    function getOS() {
        const userAgent = window.navigator.userAgent,
            platform = window.navigator?.userAgentData?.platform || window.navigator.platform,
            macosPlatforms = ['macOS', 'Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
            windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
            iosPlatforms = ['iPhone', 'iPad', 'iPod'];

        if (macosPlatforms.indexOf(platform) !== -1) {
            return 'apple';
        } else if (iosPlatforms.indexOf(platform) !== -1) {
            return 'apple';
        } else if (windowsPlatforms.indexOf(platform) !== -1) {
            return 'notApple';
        } else if (/Android/.test(userAgent)) {
            return 'notApple';
        } else if (/Linux/.test(platform)) {
            return 'notApple';
        }
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
        }
        ws.current.onclose = event => {
            console.log("Connection closed");
            setOnline(false)
            // ws.current.close()
            !isDev && connect()
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

    function iosFetch() {
        fetch("/all")
            .then(data => data.json())
            .then(data => {
                setServerData({...data, iosFetch: iosFetch})
                setLoading(true)
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        const os = getOS()
        // const os = "apple"
        if (os && os !== "apple") {
            connect()
            return (() => {
                ws.current.close()
            })
        } else {
            iosFetch()
        }
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
            .finally(() => typeof serverData.iosFetch == "function" && serverData.iosFetch())
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
            .finally(() => typeof serverData.iosFetch == "function" && serverData.iosFetch())
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
                display: false,
                text: 'Точки времени и яркости',
            },

        },
    };


    return (
        <Storage.Provider value={{serverData}}>
            {showWiFi && <Settings setBack={setShowWiFi} setResponse={setResponse}></Settings>}
            {
                (showLedSet.add || showLedSet.patch || showLedSet.remove) &&
                <LedPreferences add={showLedSet.add} remove={showLedSet.remove} patch={showLedSet.patch}
                                dots={makeLabelsForChart()}
                                setResponse={setResponse} ws={ws}>{<button onClick={() => {
                    setShowLedSet({add: false, patch: false, remove: false})
                }}>X</button>}</LedPreferences>
            }
            <ServerResponse response={response} setResponse={setResponse}/>
            <div className="main"
                 style={{display: showLedSet.add || showLedSet.remove || showLedSet.patch || showWiFi ? "none" : "flex"}}>
                <div id={"status"} style={{padding: 0}}>
                    {typeof serverData.iosFetch !== "function" && <h3 className={"statusText"} style={{
                        color: online ? "green" : "red",
                        margin: "0"
                    }}>Статус:</h3>}
                    {typeof serverData.iosFetch !== "function" &&
                        <h3 style={{color: online ? "green" : "red", margin: "0"}}>{online ? "online" : "offline"}</h3>}

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

                <div className={"chart"}>
                    <Line options={options} data={data} ref={chart}/>
                </div>
                <div className={"footerNav"}>
                        <button onClick={() => setShowWiFi(true)} title={"Настройки"}>
                            <svg width="30px" height="30px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M14.2788 2.15224C13.9085 2 13.439 2 12.5 2C11.561 2 11.0915 2 10.7212 2.15224C10.2274 2.35523 9.83509 2.74458 9.63056 3.23463C9.53719 3.45834 9.50065 3.7185 9.48635 4.09799C9.46534 4.65568 9.17716 5.17189 8.69017 5.45093C8.20318 5.72996 7.60864 5.71954 7.11149 5.45876C6.77318 5.2813 6.52789 5.18262 6.28599 5.15102C5.75609 5.08178 5.22018 5.22429 4.79616 5.5472C4.47814 5.78938 4.24339 6.1929 3.7739 6.99993C3.30441 7.80697 3.06967 8.21048 3.01735 8.60491C2.94758 9.1308 3.09118 9.66266 3.41655 10.0835C3.56506 10.2756 3.77377 10.437 4.0977 10.639C4.57391 10.936 4.88032 11.4419 4.88029 12C4.88026 12.5581 4.57386 13.0639 4.0977 13.3608C3.77372 13.5629 3.56497 13.7244 3.41645 13.9165C3.09108 14.3373 2.94749 14.8691 3.01725 15.395C3.06957 15.7894 3.30432 16.193 3.7738 17C4.24329 17.807 4.47804 18.2106 4.79606 18.4527C5.22008 18.7756 5.75599 18.9181 6.28589 18.8489C6.52778 18.8173 6.77305 18.7186 7.11133 18.5412C7.60852 18.2804 8.2031 18.27 8.69012 18.549C9.17714 18.8281 9.46533 19.3443 9.48635 19.9021C9.50065 20.2815 9.53719 20.5417 9.63056 20.7654C9.83509 21.2554 10.2274 21.6448 10.7212 21.8478C11.0915 22 11.561 22 12.5 22C13.439 22 13.9085 22 14.2788 21.8478C14.7726 21.6448 15.1649 21.2554 15.3694 20.7654C15.4628 20.5417 15.4994 20.2815 15.5137 19.902C15.5347 19.3443 15.8228 18.8281 16.3098 18.549C16.7968 18.2699 17.3914 18.2804 17.8886 18.5412C18.2269 18.7186 18.4721 18.8172 18.714 18.8488C19.2439 18.9181 19.7798 18.7756 20.2038 18.4527C20.5219 18.2105 20.7566 17.807 21.2261 16.9999C21.6956 16.1929 21.9303 15.7894 21.9827 15.395C22.0524 14.8691 21.9088 14.3372 21.5835 13.9164C21.4349 13.7243 21.2262 13.5628 20.9022 13.3608C20.4261 13.0639 20.1197 12.558 20.1197 11.9999C20.1197 11.4418 20.4261 10.9361 20.9022 10.6392C21.2263 10.4371 21.435 10.2757 21.5836 10.0835C21.9089 9.66273 22.0525 9.13087 21.9828 8.60497C21.9304 8.21055 21.6957 7.80703 21.2262 7C20.7567 6.19297 20.522 5.78945 20.2039 5.54727C19.7799 5.22436 19.244 5.08185 18.7141 5.15109C18.4722 5.18269 18.2269 5.28136 17.8887 5.4588C17.3915 5.71959 16.7969 5.73002 16.3099 5.45096C15.8229 5.17191 15.5347 4.65566 15.5136 4.09794C15.4993 3.71848 15.4628 3.45833 15.3694 3.23463C15.1649 2.74458 14.7726 2.35523 14.2788 2.15224ZM12.5 15C14.1695 15 15.5228 13.6569 15.5228 12C15.5228 10.3431 14.1695 9 12.5 9C10.8305 9 9.47716 10.3431 9.47716 12C9.47716 13.6569 10.8305 15 12.5 15Z" fill="#585d6f"></path> </g></svg>
                        </button>
                        <button onClick={turnOnOff} style={{
                            borderWidth: "0px 2px", borderColor: "green", borderStyle: "solid"
                        }} title={serverData.isOn == 1 ? "Выключить" : "Включить"}>
                            {serverData.isOn == 1 ?
                                <svg width="34px" height="34px" viewBox="-2.4 -2.4 28.80 28.80" fill="none"
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
                                <svg width="34px" height="34px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                                     fill="none">
                                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path stroke="#ff0000" strokeLinecap="round" strokeLinejoin="round"
                                              strokeWidth="2"
                                              d="M10 18v-.107c0-.795-.496-1.488-1.117-1.984a5 5 0 1 1 6.235 0c-.622.497-1.118 1.189-1.118 1.984V18m-4 0v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-2m-4 0h4m-2-3v-2"></path>
                                    </g>
                                </svg>}
                        </button>
                        <button onClick={sync} title={"Синхронизация других светильников"}>
                            <svg width="30px" height="30px" viewBox="0 0 24.00 24.00" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#ffffff" transform="rotate(45)"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" stroke="#CCCCCC" strokeWidth="0.144"></g><g id="SVGRepo_iconCarrier"> <path d="M18.5249 9.46C18.8317 10.2474 19 11.1041 19 12C19 15.866 15.866 19 12 19H9M5.47507 14.54C5.16832 13.7526 5 12.8959 5 12C5 8.13401 8.13401 5 12 5H15M15 5L12 2M15 5L12 8M9 19L12 16M9 19L12 22" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
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
