import React from "react";
import _ from "underscore";
import ReactSlider from "react-slider";
import TimePicker from 'react-time-picker';

function ContextMenu(props) {
    const [startInput, setStartInput] = React.useState<string>("10:00");

    const DAY = 86400000;
    const HOUR = 3600000;
    const MIN = 60000;

    const item = props.data.find(item => item.id == props.id);

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
        const time = splitTime[0] * HOUR + splitTime[1] * MIN + Math.floor(item.start / DAY) * DAY;

        updateData(time, label)
    }

    const date = item ? new Date(item.start) : new Date();

    return <div className="context-menu" style={styling} onClick={e => { e.stopPropagation() }}>
        <button onClick={deleteItem}>Delete</button>
        <div className="context-menu-section">
            <TimePicker
                disableClock
                format="H:mm"
                value={`${date.getUTCHours()}:${date.getUTCMinutes()}`}
                onChange={(val) => handleTimeInput(val, "start")}
                clearIcon={null}
            />
            to
            <TimePicker
                disableClock
                format="H:mm"
                value={`${new Date(item.end).getUTCHours()}:${new Date(item.end).getUTCMinutes()}`}
                onChange={(val) => handleTimeInput(val, "end")}
                clearIcon={null}
            />
        </div>
        <div className="context-menu-section">
            <label>Intensity</label>
            <ReactSlider
                className="slider"
                thumbClassName="slider-thumb"
                trackClassName="slider-track"
                onAfterChange={value => updateData(value, "intensity")}
                defaultValue={item?.itemProps?.intensity || 100}
                renderThumb={(props, state) => <div {...props}>{state.valueNow}%</div>}
            />
        </div>
        <div className="context-menu-section">
            <label>Frequency</label>
            <ReactSlider
                className="slider"
                thumbClassName="slider-thumb"
                trackClassName="slider-track"
                onAfterChange={value => updateData(value, "frequency")}
                defaultValue={item?.itemProps?.frequency || 100}
                renderThumb={(props, state) => <div {...props}>{state.valueNow}Hz</div>}
            />
        </div>
        {item?.group == "2" &&
            <div className="context-menu-section">
                <label>
                    <input type="checkbox" onChange={(e) => { updateData(e.target.checked, "sunset") }} />
                    Sunset Mode
                </label>
            </div>
        }
    </div>
}

export default ContextMenu;