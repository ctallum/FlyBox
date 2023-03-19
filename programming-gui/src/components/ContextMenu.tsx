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
    const [checked, setChecked] = React.useState<boolean>();
    const [intensity, setIntensity] = React.useState<number>();
    const [frequency, setFrequency] = React.useState<number>()
    const item = props.data.find(item => item.id == props.id);

    React.useEffect(() => {
        setChecked(item?.sunset);
        setIntensity(item?.intensity);
        setFrequency(item?.frequency);
    }, [props.id])

    if (!item)
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
        item[label] = value;
        const newData = props.data;
        newData[props.data.indexOf(item)] = item;

        props.setData(newData);
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

    return <div className="context-menu" style={styling} onClick={e => { e.stopPropagation() }}>
        <button className="modal-x-button" onClick={() => props.setItemMenu({ itemId: -1, x: 0, y: 0 })}>
            <img src="./images/xbutton.svg" alt="" />
        </button>
        <div className="context-menu-section time-picker-section">
            <TimePicker
                disableClock
                format="HH:mm"
                value={`${getHour(item.start)}:${getMin(item.start)}`}
                onChange={(val) => handleTimeInput(val, "start")}
                clearIcon={null}
                onKeyDown={e => { e.code === "Enter" && e.target.blur(); e.stopPropagation() }}
            />
            to
            <TimePicker
                disableClock
                format="HH:mm"
                value={`${getHour(item.end)}:${getMin(item.end)}`}
                onChange={(val) => handleTimeInput(val, "end")}
                clearIcon={null}
                onKeyDown={e => { e.code === "Enter" && e.target.blur(); e.stopPropagation() }}
            />
        </div>
        <div className="context-menu-section">
            <label>Intensity: </label>
            <input
                className="text-input"
                value={intensity}
                onChange={handleIntensity}
                onKeyDown={handleKeyDown}
            />
        </div>
        <div className="context-menu-section">
            <label>Frequency: </label>
            <input
                className="text-input"
                value={frequency}
                onChange={handleFrequency}
                onKeyDown={handleKeyDown}
            /> Hz
        </div>
        {item?.group == "2" &&
            <div className="context-menu-section" id="sunset-mode-section">
                <label>
                    <input
                        type="checkbox"
                        onChange={(e) => { updateData(e.target.checked, "sunset"); setChecked(e.target.checked) }}
                        checked={checked}
                    />
                    Sunset Mode
                </label>
            </div>
        }
        <div className="context-menu-section buttons-section">
            <button onClick={deleteItem} className="danger-button" >
                Delete
                <img src="./images/delete.svg" alt="" />
            </button>
            <button onClick={() => props.setItemMenu({ itemId: -1, x: 0, y: 0 })}>Save</button>
        </div>
    </div>
}

export default ContextMenu;