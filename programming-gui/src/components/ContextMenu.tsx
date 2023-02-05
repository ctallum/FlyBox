import React from "react";
import _ from "underscore"

function ContextMenu(props) {
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

    return <div className="context-menu" style={styling} onClick={e => { e.stopPropagation() }}>
        <button onClick={deleteItem}>test</button>
    </div>
}

export default ContextMenu;