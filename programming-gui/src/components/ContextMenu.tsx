import React from "react";
import _ from "underscore";
import ReactSlider from "react-slider";
import TimePicker from 'react-time-picker';
import { getMsTime, getDay, getHour, getMin } from "../util/timeHandler";

function ContextMenu(props) {
    const [checked, setChecked] = React.useState<boolean>();
    const item = props.data.find(item => item.id == props.id);

    React.useEffect(() => {
        setChecked(item.sunset)
    }, [])

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


    return <div className="context-menu" style={styling} onClick={e => { e.stopPropagation() }}>
        <button onClick={deleteItem}>Delete</button>
        <div className="context-menu-section">
            <TimePicker
                disableClock
                format="HH:mm"
                value={`${getHour(item.start)}:${getMin(item.start)}`}
                onChange={(val) => handleTimeInput(val, "start")}
                clearIcon={null}
            />
            to
            <TimePicker
                disableClock
                format="HH:mm"
                value={`${getHour(item.end)}:${getMin(item.end)}`}
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
                defaultValue={item?.intensity || 100}
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
                defaultValue={item?.frequency || 100}
                renderThumb={(props, state) => <div {...props}>{state.valueNow}Hz</div>}
            />
        </div>
        {item?.group == "2" &&
            <div className="context-menu-section">
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