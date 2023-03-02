import React from "react";
import _ from "underscore";
import ReactSlider from "react-slider";
import TimePicker from 'react-time-picker';
import { getMsTime, getDay, getHour, getMin } from "../util/timeHandler";

function ContextMenu(props) {
    const [checked, setChecked] = React.useState<boolean>();
    const item = props.data.find(item => item.id == props.id);



    React.useEffect(() => {
        setChecked(item?.sunset)
    }, [])

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
        props.setShowContextMenu(false);
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


    return <div className="context-menu" style={styling} onClick={e => { e.stopPropagation() }}>
        <button onClick={deleteItem}>Delete</button>
        <div className="context-menu-section">
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
                type="number" min="0" max="100"
                defaultValue={item.intensity}
                onChange={(e) => handleInput(e, "intensity")}
                onKeyDown={handleKeyDown}
            />
        </div>
        <div className="context-menu-section">
            <label>Frequency: </label>
            <input
                className="text-input"
                type="number" min="0" max="100"
                defaultValue={item.frequency}
                onChange={(e) => handleInput(e, "frequency")}
                onKeyDown={handleKeyDown}
            />
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
    </div>
}

export default ContextMenu;