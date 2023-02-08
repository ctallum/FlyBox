import React from "react";
import _ from "underscore";
import ReactSlider from "react-slider";
import TimePicker from 'react-time-picker';

function ContextMenu(props) {
    const [startInput, setStartInput] = React.useState<string>("10:00");
    //end time

    //controlled input start/end

    //set start
    //if valid, setstarttime, else controlled = starttime
    //update data- starttime -> ms (data handling or split + math)


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

    const updateSliderData = (value: any, label: string) => {
        item.itemProps[label] = value;
        const newData = props.data;
        newData[props.data.indexOf(item)] = item;

        props.setData(newData);
    }

    const handleTimeInput = (e) => {
        let val = e.target.value;
        const regex = /^\d*:*\d*$/
        if (regex.test(val))
            setStartInput(e.target.value);

        console.log(e)
    }

    const date = item ? new Date(item.start) : new Date();

    return <div className="context-menu" style={styling} onClick={e => { e.stopPropagation() }}>
        <button onClick={deleteItem}>Delete</button>
        <div className="context-menu-section">
            {/* <label> Start
                <input value={startInput} onChange={handleTimeInput} />
            </label>
            <label> End
                <input />
            </label> */}
            <TimePicker
                disableClock
                format="H:mm"
                value={`${date.getUTCHours()}:${date.getUTCMinutes()}`}
                onChange={(val) => { console.log(val) }}
                clearIcon={null}
            />
            to
            <TimePicker
                disableClock
                format="H:mm"
                value={`${new Date(item.end).getUTCHours()}:${new Date(item.end).getUTCMinutes()}`}
                onChange={(val) => { console.log(val) }}
                clearIcon={null}
            />
        </div>
        <div className="context-menu-section">
            <label>Intensity</label>
            <ReactSlider
                className="slider"
                thumbClassName="slider-thumb"
                trackClassName="slider-track"
                onAfterChange={value => updateSliderData(value, "intensity")}
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
                onAfterChange={value => updateSliderData(value, "frequency")}
                defaultValue={item?.itemProps?.frequency || 100}
                renderThumb={(props, state) => <div {...props}>{state.valueNow}Hz</div>}
            />
        </div>
        {item?.group == "2" &&
            <div className="context-menu-section">
                <label>
                    <input type="checkbox" onChange={(e) => { updateSliderData(e.target.checked, "sunset") }} />
                    Sunset Mode
                </label>
            </div>
        }
    </div>
}

export default ContextMenu;