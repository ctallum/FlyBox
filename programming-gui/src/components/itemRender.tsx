import React from "react";
import { getHour, getMin } from "../util/timeHandler";

const itemRenderer = ({ item, timelineContext, itemContext, getItemProps, getResizeProps }) => {
    const { left: leftResizeProps, right: rightResizeProps } = getResizeProps();

    let backgroundColor = "";

    switch (item.group) {
        case "0":
            if (itemContext.selected || itemContext.dragging || itemContext.resizing) { backgroundColor = "#bd1c1c"; } else { backgroundColor = "#6F1111"; }
            break;
        case "1":
            if (itemContext.selected) { backgroundColor = "#2d8f15"; } else { backgroundColor = "#15430A"; }
            break;
        case "2":
            if (itemContext.selected) { backgroundColor = "#ededed"; } else { backgroundColor = "#A0A0A0"; }
            break;
        default:
            console.log(typeof (item.group))
            if (itemContext.selected) { backgroundColor = "#000000"; } else { backgroundColor = "#FFFFFF"; }
    }

    const borderColor = backgroundColor;

    return (
        <div
            {...getItemProps({
                style: {
                    backgroundColor,
                    color: /*item.color*/'black',
                    borderColor,
                    borderStyle: "solid",
                    borderWidth: itemContext.dragging ? 0 : 1,
                    borderRadius: 3,
                    borderLeftWidth: itemContext.selected ? 5 : 1,
                    borderRightWidth: itemContext.selected ? 5 : 1
                },
                onMouseDown: (e) => {
                    console.log("on item click", item);
                }
            })}
            onClick={(e) => e.stopPropagation()} // So opening context menu doesn't bubble up to cancel itself
        >
            {itemContext.useResizeHandle ? <div {...leftResizeProps} /> : null}
            {itemContext.width > 100 &&
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "0px 10px 0px 10px",
                    }}
                >
                    <span>{getHour(item.start)}:{getMin(item.start)}</span>
                    <span>{getHour(item.end)}:{getMin(item.end)}</span>
                </div>
            }

            {itemContext.useResizeHandle ? <div {...rightResizeProps} /> : null}
        </div>
    );
};

export default itemRenderer;