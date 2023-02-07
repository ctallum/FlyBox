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
        props.setData(_(props.data).without(item))
    }

    const updateIntensity = (value: number) => {
        item.itemProps.intensity = value;
        const newData = props.data;
        newData[props.data.indexOf(item)] = item;

        props.setData(newData);
    }

    return <div className="context-menu" style={styling} onClick={e => { e.stopPropagation() }}>
        <button onClick={deleteItem}>test</button>
        <div className="context-menu-section">
            <label>Intensity</label>
            <ReactSlider
                className="slider"
                thumbClassName="slider-thumb"
                trackClassName="slider-track"
                onAfterChange={updateIntensity}
                defaultValue={item.itemProps.intensity || 100}
                renderThumb={(props, state) => <div {...props}>{state.valueNow}%</div>}
            />
        </div>
    </div>
}

export default ContextMenu;