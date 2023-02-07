import React from "react";
import _ from "underscore";
import ReactSlider from "react-slider";

function ContextMenu(props) {
    //start time
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

    const updateSliderData = (value: number, label: string) => {
        item.itemProps[label] = value;
        const newData = props.data;
        newData[props.data.indexOf(item)] = item;

        props.setData(newData);
    }

    return <div className="context-menu" style={styling} onClick={e => { e.stopPropagation() }}>
        <button onClick={deleteItem}>Delete</button>
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
    </div>
}

export default ContextMenu;