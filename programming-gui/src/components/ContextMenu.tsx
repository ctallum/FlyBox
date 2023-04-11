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
}
function ContextMenu(props: IProps) {
    const [intensity, setIntensity] = React.useState<number>();
    const [frequency, setFrequency] = React.useState<number>();
    const [edit, setEdit] = React.useState<any>(props.data.find(item => item.id == props.id));
    const item = props.data.find(item => item.id == props.id);

    React.useEffect(() => {
        const item = props.data.find(item => item.id == props.id);
        setIntensity(item?.intensity);
        setFrequency(item?.frequency);
        setEdit(item)
    }, [props.id])

    if (!edit || !item)
        return <></>

    const styling = {
        position: "absolute",
        top: props.y + "px",
        left: props.x + "px",
        zIndex: 100
    } as React.CSSProperties;

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

        let day = getDay(item.start)
        const splitTime = val.split(":");
        if (label === "end" && splitTime[0] === "00" && splitTime[1] === "00") {
            //handle extend event to end of day
            day += 1;
        }
        const time = getMsTime(day, splitTime[0], splitTime[1]);

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
            return;

        if (edit.start > edit.end)
            return;

        const newData = props.data;
        newData[props.data.indexOf(item)] = edit;

        props.setData(newData);
        props.setItemMenu({ itemId: -1, x: 0, y: 0 })
    }

    return <div className="context-menu" style={styling} onClick={e => { e.stopPropagation() }}>
        <button className="modal-x-button" onClick={() => props.setItemMenu({ itemId: -1, x: 0, y: 0 })}>
            <img src="./images/xbutton.svg" alt="" />
        </button>
        <div className={"context-menu-section time-picker-section"}>
            <TimePicker
                disableClock
                format="HH:mm"
                value={`${getHour(edit.start)}:${getMin(edit.start)}`}
                onChange={(val) => handleTimeInput(val, "start")}
                clearIcon={null}
                onKeyDown={e => { e.code === "Enter" && e.target.blur(); e.stopPropagation() }}
                className={edit.end < edit.start ? " invalid" : ""}
            />
            to
            <TimePicker
                disableClock
                format="HH:mm"
                value={`${getHour(edit.end)}:${getMin(edit.end)}`}
                onChange={(val) => handleTimeInput(val, "end")}
                clearIcon={null}
                onKeyDown={e => { e.code === "Enter" && e.target.blur(); e.stopPropagation() }}
                className={edit.end < edit.start ? " invalid" : ""}
            />
        </div>
        <div className="context-menu-section">
            <label>Intensity: </label>
            <input
                className="text-input"
                value={intensity}
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
                value={frequency}
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
            <button onClick={handleSave} className="save-button">Save <img src="./images/save.svg" alt="" /></button>
        </div>
    </div>
}

export default ContextMenu;