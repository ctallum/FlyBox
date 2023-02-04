import React from "react";

function ContextMenu(props) {

    const styling = {
        position: "absolute",
        top: props.menuY + "px",
        left: props.menuX + "px",
        zIndex: 100
    } as React.CSSProperties;

    return <div className="context-menu" style={styling} onClick={e => { e.stopPropagation() }}>
        <p>HI</p>
    </div>
}

export default ContextMenu;