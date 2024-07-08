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
        setPatch({time: time, br1: serverData.Br1[index], br2: serverData.Br2[index], br3: serverData.Br3[index], br4: serverData.Br4[index], br5: serverData.Br5[index], br6: serverData.Br6[index], br7: serverData.Br7[index], br8: serverData.Br8[index], previewActive: 0})
    }

     function sendRemove() {
        if (!remove.time || remove.time == "Выбрать") {
            return
        } else {
             fetch(`/setting`, {
                method: "DELETE", body: JSON.stringify(remove)
            }).then(data => {data.text()})
                .then(data => setResponse(prev => [data, ...prev]))
                .catch(er => console.log(er))
        }
    }
    function sendAdd() {
        fetch("/setting", {
            method: "POST", body: JSON.stringify(add)
        })
            .then(data => data.text())
            .then(data => setResponse(prev => [data, ...prev]))
            .catch(er => console.log(er))
    }
    function sendPatch() {
        if (!patch.time) {
            setResponse(prev => ["Не выбрано времяE", ...prev])
            return;
        }
        fetch("/setting", {
            method: "PATCH", body: JSON.stringify(patch)
        })
            .then(data => data.text())
            .then(data => setResponse(prev => [data, ...prev]))
            .catch(er => console.log(er))
    }
    function sendPreview() {
        fetch("/ledpreview", {
            method: "POST", body: JSON.stringify((plus && add) || (pach && patch))
        })
            .then(data => data.text())
            .then(data => setResponse(prev => [data, ...prev]))
            .catch(er => console.log(er))
    }

    useEffect(() => {
        // пикаем в сервер что демо предпросмотр все еще работает
        let interval;
        if (previewActive) {
        interval = setInterval(() => {
            // чек если ВС открыт (0 - соединение, 1 - открыто, 2 - закрываеМСЯ, 3 - Закрыто)
            if (ws.current.readyState == 1) {
                // кидаем в ledpreview роут сервера настройки нашего стейта
                ws.current.send("startDemo")
            }
        }, 1500)}
        return () => {
            // чистим таймеры и сообщаем серваку что превью закончено
            clearInterval(interval)
            if (typeof interval === "number") {
                console.log("stop Interval DEMO")
                if (ws.current.readyState == 1) {
                    ws.current.send("stopDemo")
                }
            }
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

    if (del) {
        return (<div className={style.leds}>
            {children}
            <h6 className={style.text} style={{color: "#FF4933", paddingBottom: "5px"}}>Удалить точку</h6>
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
            <h1 className={style.text} style={{color: "#E3FF33", paddingBottom: "5px"}}>Редактировать точку</h1>
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
                <label htmlFor={"i1"} style={{color: "red"}}>{patch.br1}</label>
                <input name={"i1"} type={"range"} className={style.range} style={{"--SliderColor": "red"}} max={100}
                       min={0} value={patch.br1} onChange={(event) => {setPatch({...patch, br1: +event.target.value})}}/>
            </div>
            <div>
                <label htmlFor={"i2"} style={{color: "green"}}>{patch.br2}</label>
                <input name={"i2"} type={"range"} className={style.range} style={{"--SliderColor": "green"}}
                       max={100}
                       min={0} value={patch.br2} onChange={(event) => {setPatch({...patch, br2: +event.target.value})}}/>
            </div>
            <div>
                <label htmlFor={"i3"} style={{color: "blue"}}>{patch.br3}</label>
                <input name={"i3"} type={"range"} className={style.range} style={{"--SliderColor": "blue"}}
                       max={100}
                       min={0} value={patch.br3} onChange={(event) => { setPatch({...patch, br3: +event.target.value})}}/>
            </div>
            <div>
                <label htmlFor={"i4"} style={{color: "white"}}>{patch.br4}</label>
                <input name={"i4"} type={"range"} className={style.range} style={{"--SliderColor": "white"}}
                       max={100}
                       min={0} value={patch.br4} onChange={(event) => {setPatch({...patch, br4: +event.target.value})}}/>
            </div>
            <div>
                <label htmlFor={"i5"} style={{color: "darkviolet"}}>{patch.br5}</label>
                <input name={"i5"} type={"range"} className={style.range} style={{"--SliderColor": "darkviolet"}}
                       max={100} min={0} value={patch.br5}
                       onChange={(event) => {setPatch({...patch, br5: +event.target.value})}}/>
            </div>
            <div>
                <label htmlFor={"i6"} style={{color: "khaki"}}>{patch.br6}</label>
                <input name={"i6"} type={"range"} className={style.range} style={{"--SliderColor": "khaki"}}
                       max={100}
                       min={0} value={patch.br6}
                       onChange={(event) => {setPatch({...patch, br6: +event.target.value})}}/>

            </div>
            <div>
                <label htmlFor={"i7"} style={{color: "cyan"}}>{patch.br7}</label>
                <input name={"i7"} type={"range"} className={style.range} style={{"--SliderColor": "cyan"}}
                       max={100} min={0} value={patch.br7}
                       onChange={(event) => {setPatch({...patch, br7: +event.target.value})}}/>

            </div>
            <div>
                <label htmlFor={"i8"} style={{color: "orange"}}>{patch.br8}</label>
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
            <h1 className={style.text} style={{color: "#33FF7A", paddingBottom: "5px"}}>Добавить точку</h1>
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
                    <label htmlFor={"i1"} style={{color: "red"}}>{add.br1}</label>
                    <input name={"i1"} type={"range"} className={style.range} style={{"--SliderColor": "red"}} max={100}
                           min={0} defaultValue={add.br1} onChange={(event) => {
                        setAdd({...add, br1: +event.target.value})}}/>
                </div>
                <div>
                    <label htmlFor={"i2"} style={{color: "green"}}>{add.br2}</label>
                    <input name={"i2"} type={"range"} className={style.range} style={{"--SliderColor": "green"}}
                           max={100}
                           min={0} defaultValue={add.br2} onChange={(event) => {
                        setAdd({...add, br2: +event.target.value});
                    }}/>
                </div>
                <div>
                    <label htmlFor={"i3"} style={{color: "blue"}}>{add.br3}</label>
                    <input name={"i3"} type={"range"} className={style.range} style={{"--SliderColor": "blue"}}
                           max={100}
                           min={0} defaultValue={add.br3} onChange={(event) => {
                        setAdd({...add, br3: +event.target.value});
                    }}/>
                </div>
                <div>
                    <label htmlFor={"i4"} style={{color: "white"}}>{add.br4}</label>
                    <input name={"i4"} type={"range"} className={style.range} style={{"--SliderColor": "white"}}
                           max={100}
                           min={0} defaultValue={add.br4} onChange={(event) => {
                        setAdd({...add, br4: +event.target.value});
                    }}/>
                </div>
                <div>
                    <label htmlFor={"i5"} style={{color: "darkviolet"}}>{add.br5}</label>
                    <input name={"i5"} type={"range"} className={style.range} style={{"--SliderColor": "darkviolet"}}
                           max={100} min={0} defaultValue={add.br5}
                           onChange={(event) => {
                               setAdd({...add, br5: +event.target.value});
                           }}/>
                </div>
                <div>
                    <label htmlFor={"i6"} style={{color: "khaki"}}>{add.br6}</label>
                    <input name={"i6"} type={"range"} className={style.range} style={{"--SliderColor": "khaki"}}
                           max={100}
                           min={0} defaultValue={add.br6}
                           onChange={(event) => {
                               setAdd({...add, br6: +event.target.value})}}/>

                </div>
                <div>
                    <label htmlFor={"i7"} style={{color: "cyan"}}>{add.br7}</label>
                    <input name={"i7"} type={"range"} className={style.range} style={{"--SliderColor": "cyan"}}
                           max={100} min={0} defaultValue={add.br7}
                           onChange={(event) => {
                               setAdd({...add, br7: +event.target.value})}}/>
                </div>
                <div>
                    <label htmlFor={"i8"} style={{color: "orange"}}>{add.br8}</label>
                    <input name={"i8"} type={"range"} className={style.range}
                           style={{"--SliderColor": "orange", marginBottom: "20px"}} max={100} min={0}
                           defaultValue={add.br8}
                           onChange={(event) => {
                               setAdd({...add, br8: +event.target.value})}}/>
                </div>
                <button onClick={(ev) => {sendAdd()}}>Добавить</button>
            </div>);
    }
};

export default LedPreferences;