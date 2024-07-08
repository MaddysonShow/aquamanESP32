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
    let isDev = true
    const host = isDev ? "ws://192.168.43.231/ws" : `ws://${window.location.host}/ws`

    useEffect(() => {
        const array = response;
        if (typeof responseTimer.current === "number") {
            clearTimeout(responseTimer.current)
        }
        responseTimer.current = setTimeout(() => {
                if (response.length != 0) {
                    console.log("deleting")
                    array.pop()
                    setResponse([...array])
                }
            }, 2000)
        return(() => {clearTimeout(responseTimer.current)})
    }, [response.length]);
    let colors = [{eng: "red", rus: "Красный"},
        {eng: "green", rus: "Зеленый"}, {eng: "blue", rus: "Синий"}, {eng: "white", rus: "Белый"},
        {eng: "darkviolet", rus: "УФ"}, {eng: "khaki", rus: "ХЗ"}, {eng: "cyan", rus: "Цианид"}, {
            eng: "orange",
            rus: "Оранжевый"
        }]

    useEffect(() => {
        ws.current = new WebSocket(host)
        ws.current.onopen = event => {
            console.log("WS opened");
            setOnline(true)
            ws.current.send("user")
        }
        ws.current.onerror = event => {
            console.log(`WS ERROR: ${event}`);
        }
        ws.current.onclose = (event) => {
            console.log("Connection closed");
            setOnline(false)
        };
        ws.current.onmessage = event => {
            let parsedData = JSON.parse(event.data)
            console.log(parsedData);
            setServerData({...parsedData})
            setLoading(true)
        }
        return (() => {
            ws.current.close()
        })
    }, []);

    function sync() {
        fetch("/sync", {method: "post"})
            .then(data => console.log(data))
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
                    <button onClick={() => setShowWiFi(true)} style={{fontSize: "20px", cursor: "pointer", margin: 0}}><h5 style={{margin: 0, padding: 0}}>Настройки</h5>
                    </button>
                </header>
                <h3 style={{color: online ? "green" : "red", margin: "0 0 15px 0"}}>{online ? "online" : "offline"}</h3>
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
                   (showLedSet.add || showLedSet.patch || showLedSet.remove) && <LedPreferences add={showLedSet.add} remove={showLedSet.remove} patch={showLedSet.patch}
                                    dots={makeLabelsForChart()}
                                    setResponse={setResponse} ws={ws}>{<button onClick={() => {
                        setShowLedSet({add: false, patch: false, remove: false})
                    }}>X</button>}</LedPreferences>
                }
                <div className={"chart"}>
                    <Line options={options} data={data} ref={chart} height={"500px"}/>
                </div>
                <div className="syncButtonContainer">
                    <span>Синхронизировать данные с другимим светильниками</span>
                    <button className="syncButton" onClick={() => {
                        sync();
                    }}>Синхронизировать</button>
                </div>

                {/*{!Loading &&*/}
                {/*    <ModalWindow>*/}
                {/*        <div className="loader">*/}
                {/*            <span></span>*/}
                {/*            <span></span>*/}
                {/*            <span></span>*/}
                {/*            <span></span>*/}
                {/*        </div>*/}
                {/*    </ModalWindow>}*/}
            </div>
        </Storage.Provider>
    );
}

export default App;
