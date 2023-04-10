import React from "react";
import _ from "underscore";
import ReactSlider from "react-slider";
import TimePicker from 'react-time-picker';
import { getMsTime, getDay, getHour, getMin } from "../util/timeHandler";
import Item from "../types";

interface IProps {
    data: Item[],
    id: number,
    x: number,
    y: number,
    setData: (data: Item[]) => void,
    setItemMenu: (details: { itemId: number, x: number, y: number }) => void
    selectedIds: number[]
}
function ContextMenu(props: IProps) {
    const [intensity, setIntensity] = React.useState<number | null>();
    const [frequency, setFrequency] = React.useState<number | null>();
    const [edit, setEdit] = React.useState<any>(props.data.find(item => item.id == props.id));
    const item = props.data.find(item => item.id == props.id);
    const items = props.data.filter(item => props.selectedIds.includes(item.id));
    const multi = props.selectedIds.length > 1;

    React.useEffect(() => {
        setIntensity(findVal("intensity"));
        setFrequency(findVal("frequency"));
    }, [props.id, props.selectedIds])

    if (!edit || !item)
        return <></>

    const styling = {
        position: "absolute",
        top: (multi ? 200 : props.y) + "px",
        left: (multi ? 0 : props.x) + "px",
        zIndex: 100
    } as React.CSSProperties;

    const findVal = (label) => {
        const vals = _(items).pluck(label)
        console.log(vals)
        if (vals.every(val => val === vals[0]))
            return vals[0]
        return null;
    }

    const deleteItem = () => {
        props.setData(_(props.data).without(item));
        props.setItemMenu({ itemId: -1, x: 0, y: 0 });
    }

    const updateData = (value: any, label: string) => {
        setEdit({ ...edit, [label]: value })
    }

    const handleTimeInput = (val, label) => {
        if (!val)
            return;

        const splitTime = val.split(":");
        const time = getMsTime(getDay(item.start), splitTime[0], splitTime[1]);

        updateData(time, label)
    }

    const handleInput = (e, field) => {
        if (e.target.value >= 0 && e.target.value <= 100)
            updateData(+e.target.value, field)
    }

    const handleKeyDown = (e) => {
        e.stopPropagation();
        if (e.code === "Enter" && e.target.value >= 0 && e.target.value <= 100)
            e.currentTarget.blur()
    }

    const handleFrequency = (e) => {
        if (!isNaN(+e.target.value)) {
            handleInput(e, "frequency");
            setFrequency(+e.target.value);
        }
    }

    const handleIntensity = (e) => {
        if (!isNaN(+e.target.value)) {
            handleInput(e, "intensity");
            setIntensity(+e.target.value);
        }
    }

    const handleSave = (e) => {
        if (!item)
            return

        if (multi) {
            const newData = props.data.map((item) => {
                if (props.selectedIds.includes(item.id)) {
                    return {
                        ...item,
                        frequency: frequency === null ? item.frequency : frequency,
                        intensity: intensity === null ? item.intensity : intensity,
                    }
                }
                else {
                    return item;
                }
            })
            console.log(newData)
            props.setData(newData)

        }
        else {

            const newData = props.data;
            newData[props.data.indexOf(item)] = edit;

            props.setData(newData);
            props.setItemMenu({ itemId: -1, x: 0, y: 0 })
        }
    }

    return <div className="context-menu" style={styling} onClick={e => { e.stopPropagation() }}>
        <button className="modal-x-button" onClick={() => props.setItemMenu({ itemId: -1, x: 0, y: 0 })}>
            <img src="./images/xbutton.svg" alt="" />
        </button>
        {!multi &&
            <div className="context-menu-section time-picker-section">
                <TimePicker
                    disableClock
                    format="HH:mm"
                    value={`${getHour(edit.start)}:${getMin(edit.start)}`}
                    onChange={(val) => handleTimeInput(val, "start")}
                    clearIcon={null}
                    onKeyDown={e => { e.code === "Enter" && e.target.blur(); e.stopPropagation() }}
                />
                to
                <TimePicker
                    disableClock
                    format="HH:mm"
                    value={`${getHour(edit.end)}:${getMin(edit.end)}`}
                    onChange={(val) => handleTimeInput(val, "end")}
                    clearIcon={null}
                    onKeyDown={e => { e.code === "Enter" && e.target.blur(); e.stopPropagation() }}
                />
            </div>
        }
        <div className="context-menu-section">
            <label>Intensity: </label>
            <input
                className="text-input"
                value={intensity === null ? "" : intensity}
                onChange={handleIntensity}
                onKeyDown={handleKeyDown}
                type="number"
                min={0}
                max={100}
            />
        </div>
        <div className="context-menu-section">
            <label>Frequency: </label>
            <input
                className="text-input"
                value={frequency === null ? "" : frequency}
                onChange={handleFrequency}
                onKeyDown={handleKeyDown}
                type="number"
                min={0}
                max={100}
            /> Hz
        </div>
        <div className="context-menu-section buttons-section">
            <button onClick={deleteItem} className="danger-button" >
                Delete
                <img src="./images/delete.svg" alt="" />
            </button>
            <button onClick={handleSave}>Save</button>
        </div>
    </div>
}

export default ContextMenu;