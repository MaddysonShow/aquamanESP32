import React, {useContext, useEffect, useRef, useState} from 'react';
import style from "./led.module.css";
import {Storage} from "../Context";

const LedPreferences = ({add: plus, patch: pach, remove: del, dots, setResponse, ws, children}) => {
    const {serverData} = useContext(Storage);
    const [previewActive, setPreviewActive] = useState(0)
    const [add, setAdd] = useState({br1: 0, br2: 0, br3: 0, br4: 0, br5: 0, br6: 0, br7: 0, br8: 0, time: "00:00", previewActive: 0})
    const [patch, setPatch] = useState({br1: 0, br2: 0, br3: 0, br4: 0, br5: 0, br6: 0, br7: 0, br8: 0, time: null , previewActive: 0})
    const [remove, setRemove] = useState({time: null})
    const timeout = useRef(null)
    function getCurrentBr(time) {
        // console.log(time);
        const index = serverData.Br_time.indexOf(time)
        setPatch(prev => { return {time: time, br1: serverData.Br1[index], br2: serverData.Br2[index], br3: serverData.Br3[index], br4: serverData.Br4[index], br5: serverData.Br5[index], br6: serverData.Br6[index], br7: serverData.Br7[index], br8: serverData.Br8[index], previewActive: prev.previewActive}})
    }

     function sendRemove() {
        const ID = Date.now()
        if (!remove.time || remove.time == "Выбрать") {
            setResponse(prev => [{value: "Удалить: ", response: "не выбрано время!E", taskID: ID}, ...prev])
        } else {
            setResponse(prev => [{value: "Удалить: ", response: null, taskID: ID}, ...prev])
             fetch(`/setting`, {
                method: "DELETE", body: JSON.stringify({...remove, taskID: ID})
            }).then(data => data.json())
            //  }).then(data => {return {value: "okO", taskID: ID}})
               .then(data => setResponse(prev => prev.map(function (el) {
                    if (el.taskID == ID) {
                        el.response = data.value
                    }
                    return el
                })))
                .catch(er => console.log(er))
                 .finally(() => typeof serverData.iosFetch == "function" && serverData.iosFetch())
        }
    }
    function sendAdd() {
        const ID = Date.now()
        setResponse(prev => [{value: "Добавить: ", response: null, taskID: ID}, ...prev])
        fetch("/setting", {
            method: "POST", body: JSON.stringify({...add, taskID: ID})
        })
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
    function sendPatch() {
        const ID = Date.now()
        setResponse(prev => [{value: "Редакт.: ", response: null, taskID: ID}, ...prev])
        if (!patch.time) {
            setResponse(prev => [{value: "Редакт.: ", response: "не выбрано время!E", taskID: ID}, ...prev])
            return;
        }
        fetch("/setting", {
            method: "PATCH", body: JSON.stringify(patch)
        })
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
    function sendPreview() {
        const ID = Date.now()
        setResponse(prev => [{value: "Превью: ", response: null, taskID: ID}, ...prev])
        fetch("/ledpreview", {
            method: "POST", body: JSON.stringify((plus && {...add, taskID: ID}) || (pach && {...patch, taskID: ID}))
        })
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

    useEffect(() => {
        // пикаем в сервер что демо предпросмотр все еще работает
        let interval;
        if (previewActive) {
        interval = setInterval(() => {
            // чек если ВС открыт (0 - соединение, 1 - открыто, 2 - закрываеМСЯ, 3 - Закрыто)
            if (ws?.current?.readyState == 1) {
                ws.current.send("stD")
            }
        }, 3500)}
        return () => {
            // чистим таймеры и сообщаем серваку что превью закончено
            clearInterval(interval)
            if (typeof interval === "number") {
                if (ws?.current?.readyState == 1) {
                    // console.log("stop Interval DEMO")
                    ws.current.send("spD")
                }
            }
         typeof serverData.iosFetch == "function" && fetch("/ledpreview", {
             method: "POST", body: JSON.stringify((plus && {...add, previewActive: 0 , taskID: 1}) || (pach && {...patch, previewActive: 0 ,taskID: 1}))
         })
        }
    }, [previewActive]);

    useEffect(() => {
        if (typeof timeout.current === "number") {
            clearTimeout(timeout.current)
        }
        timeout.current = setTimeout(() => {
            if (previewActive === 1) sendPreview()
        }, 1500)
        return () => {
            clearTimeout(timeout.current)
        }
    }, [add, patch]);
    function keyboardInput(key) {
        let value = parseInt(window.prompt("Введите значение от 0 до 100"))
        if (isNaN(value)) {
            return;
        }
        if (value > 100 || value < 0) {
            window.alert("Значение не должно выходить за рамки допустимого диапазона 0-100")
            return
        }

        if (pach) {
            setPatch({...patch, [key]: value})
        }
        else if (plus) {
            setAdd({...add, [key]: value})
        }
    }

    if (del) {
        return (<div className={style.leds}>
            {children}
            <h6 className={style.text} style={{color: "#FF4933", paddingBottom: "5px"}}>Удалить</h6>
                <select onChange={(ev) => {
                    setRemove({time: ev.target.value})
                }} style={{margin: "20px 0 20px 0"}}>
                    <option>Выбрать</option>
                    {dots.map((el) => {
                        return <option value={el} key={el}>{el}</option>
                    })}
                </select>
                <button onClick={sendRemove} style={{background: "red"}}>УДАЛИТЬ</button>
            </div>)
    }
    if (pach) {
        return (<div className={style.leds}>
            {children}
            <h1 className={style.text} style={{color: "#E3FF33", paddingBottom: "5px"}}>Редактировать</h1>
            <div className={style.topContainer}>
                <div>
                    <h1 className={style.text}>Превью</h1>
                </div>
                <div>
                    <h1 className={style.text}>Свободно {23 - dots.length}</h1>
                </div>
                <div className={style.inputContainer}>
                    <label style={{width: "auto", margin: 0, padding: 0}}>{previewActive > 0 ? "Вкл" : "Выкл"}</label>
                    <label className={style.switch}>
                        <input type="checkbox" name={"slider"} checked={previewActive > 0} onChange={(event) => {setPreviewActive(event.target.checked ? 1 : 0); setPatch({...patch, previewActive: event.target.checked ? 1 : 0}) }}/>
                        <span className={style.slider}></span>
                    </label>
                </div>
                <div className={style.inputContainer}>
                    <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                        <label htmlFor={"time"} style={{width: "auto", margin: 0, padding: 0}}>Выбрать время</label>
                        <select onChange={(ev) => {
                            getCurrentBr(ev.target.value)
                        }} name={"time"}>
                            <option value={null}>Выбрать</option>
                            {dots.map((el) => {
                                return <option value={el} key={el}>{el}</option>
                            })}
                        </select>
                    </div></div>
            </div>
            <div>
                <label htmlFor={"i1"} style={{color: "red"}} onClick={() => {keyboardInput("br1")}}>{patch.br1}</label>
                <input name={"i1"} type={"range"} className={style.range} style={{"--SliderColor": "red"}} max={100}
                       min={0} value={patch.br1} onChange={(event) => {setPatch({...patch, br1: +event.target.value})}}/>
            </div>
            <div>
                <label htmlFor={"i2"} style={{color: "green"}} onClick={() => {keyboardInput("br2")}}>{patch.br2}</label>
                <input name={"i2"} type={"range"} className={style.range} style={{"--SliderColor": "green"}}
                       max={100}
                       min={0} value={patch.br2} onChange={(event) => {setPatch({...patch, br2: +event.target.value})}}/>
            </div>
            <div>
                <label htmlFor={"i3"} style={{color: "blue"}} onClick={() => {keyboardInput("br3")}}>{patch.br3}</label>
                <input name={"i3"} type={"range"} className={style.range} style={{"--SliderColor": "blue"}}
                       max={100}
                       min={0} value={patch.br3} onChange={(event) => { setPatch({...patch, br3: +event.target.value})}}/>
            </div>
            <div>
                <label htmlFor={"i4"} style={{color: "white"}} onClick={() => {keyboardInput("br4")}}>{patch.br4}</label>
                <input name={"i4"} type={"range"} className={style.range} style={{"--SliderColor": "white"}}
                       max={100}
                       min={0} value={patch.br4} onChange={(event) => {setPatch({...patch, br4: +event.target.value})}}/>
            </div>
            <div>
                <label htmlFor={"i5"} style={{color: "darkviolet"}} onClick={() => {keyboardInput("br5")}}>{patch.br5}</label>
                <input name={"i5"} type={"range"} className={style.range} style={{"--SliderColor": "darkviolet"}}
                       max={100} min={0} value={patch.br5}
                       onChange={(event) => {setPatch({...patch, br5: +event.target.value})}}/>
            </div>
            <div>
                <label htmlFor={"i6"} style={{color: "khaki"}} onClick={() => {keyboardInput("br6")}}>{patch.br6}</label>
                <input name={"i6"} type={"range"} className={style.range} style={{"--SliderColor": "khaki"}}
                       max={100}
                       min={0} value={patch.br6}
                       onChange={(event) => {setPatch({...patch, br6: +event.target.value})}}/>

            </div>
            <div>
                <label htmlFor={"i7"} style={{color: "cyan"}} onClick={() => {keyboardInput("br7")}}>{patch.br7}</label>
                <input name={"i7"} type={"range"} className={style.range} style={{"--SliderColor": "cyan"}}
                       max={100} min={0} value={patch.br7}
                       onChange={(event) => {setPatch({...patch, br7: +event.target.value})}}/>

            </div>
            <div>
                <label htmlFor={"i8"} style={{color: "orange"}} onClick={() => {keyboardInput("br8")}}>{patch.br8}</label>
                <input name={"i8"} type={"range"} className={style.range}
                       style={{"--SliderColor": "orange", marginBottom: "20px"}} max={100} min={0}
                       value={patch.br8}
                       onChange={(event) => {setPatch({...patch, br8: +event.target.value})}}/>
            </div>
            <button onClick={(ev) => {sendPatch()}}>Изменить</button>
            </div>)
    }
    if (plus) {
        return (<div className={style.leds}>
            {children}
            <h1 className={style.text} style={{color: "#33FF7A", paddingBottom: "5px"}}>Добавить</h1>
            <div className={style.topContainer}>
                <div>
                    <h1 className={style.text}>Превью</h1>
                </div>
                <div>
                    <h1 className={style.text}>Свободно {23 - dots.length}</h1>
                </div>
                <div className={style.inputContainer}>
                    <label style={{width: "auto", margin: 0, padding: 0}}>{previewActive > 0 ? "Вкл" : "Выкл"}</label>
                    <label className={style.switch}>
                        <input type="checkbox" name={"slider"} checked={previewActive > 0} onChange={(event) => {setPreviewActive(event.target.checked ? 1 : 0); setAdd({...add, previewActive: event.target.checked ? 1 : 0})} }/>
                        <span className={style.slider}></span>
                    </label>
                </div>
                <div className={style.inputContainer}>
                    <label htmlFor={"time"} style={{width: "auto", margin: 0, padding: 0}}>Задать время</label>
                    <input type={"time"} style={{fontSize: "0.5em", width: "auto"}} defaultValue={"00:00"} onChange={(e) => {setAdd({...add, time: e.target.value})}}/>
                </div>
            </div>
                <div>
                    <label htmlFor={"i1"} style={{color: "red"}} onClick={() => {keyboardInput("br1")}}>{add.br1}</label>
                    <input name={"i1"} type={"range"} className={style.range} style={{"--SliderColor": "red"}} max={100}
                           min={0} value={add.br1} onChange={(event) => {
                        setAdd({...add, br1: +event.target.value})}}/>
                </div>
                <div>
                    <label htmlFor={"i2"} style={{color: "green"}} onClick={() => {keyboardInput("br2")}}>{add.br2}</label>
                    <input name={"i2"} type={"range"} className={style.range} style={{"--SliderColor": "green"}}
                           max={100}
                           min={0} value={add.br2} onChange={(event) => {
                        setAdd({...add, br2: +event.target.value});
                    }}/>
                </div>
                <div>
                    <label htmlFor={"i3"} style={{color: "blue"}} onClick={() => {keyboardInput("br3")}}>{add.br3}</label>
                    <input name={"i3"} type={"range"} className={style.range} style={{"--SliderColor": "blue"}}
                           max={100}
                           min={0} value={add.br3} onChange={(event) => {
                        setAdd({...add, br3: +event.target.value});
                    }}/>
                </div>
                <div>
                    <label htmlFor={"i4"} style={{color: "white"}} onClick={() => {keyboardInput("br4")}}>{add.br4}</label>
                    <input name={"i4"} type={"range"} className={style.range} style={{"--SliderColor": "white"}}
                           max={100}
                           min={0} value={add.br4} onChange={(event) => {
                        setAdd({...add, br4: +event.target.value});
                    }}/>
                </div>
                <div>
                    <label htmlFor={"i5"} style={{color: "darkviolet"}} onClick={() => {keyboardInput("br5")}}>{add.br5}</label>
                    <input name={"i5"} type={"range"} className={style.range} style={{"--SliderColor": "darkviolet"}}
                           max={100} min={0} value={add.br5}
                           onChange={(event) => {
                               setAdd({...add, br5: +event.target.value});
                           }}/>
                </div>
                <div>
                    <label htmlFor={"i6"} style={{color: "khaki"}} onClick={() => {keyboardInput("br6")}}>{add.br6}</label>
                    <input name={"i6"} type={"range"} className={style.range} style={{"--SliderColor": "khaki"}}
                           max={100}
                           min={0} value={add.br6}
                           onChange={(event) => {
                               setAdd({...add, br6: +event.target.value})}}/>

                </div>
                <div>
                    <label htmlFor={"i7"} style={{color: "cyan"}} onClick={() => {keyboardInput("br7")}}>{add.br7}</label>
                    <input name={"i7"} type={"range"} className={style.range} style={{"--SliderColor": "cyan"}}
                           max={100} min={0} value={add.br7}
                           onChange={(event) => {
                               setAdd({...add, br7: +event.target.value})}}/>
                </div>
                <div>
                    <label htmlFor={"i8"} style={{color: "orange"}} onClick={() => {keyboardInput("br8")}}>{add.br8}</label>
                    <input name={"i8"} type={"range"} className={style.range}
                           style={{"--SliderColor": "orange", marginBottom: "20px"}} max={100} min={0}
                           value={add.br8}
                           onChange={(event) => {
                               setAdd({...add, br8: +event.target.value})}}/>
                </div>
                <button onClick={(ev) => {sendAdd()}}>Добавить</button>
            </div>);
    }
};

export default LedPreferences;