import React from "react";

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
                onMouseDown: () => {
                    console.log("on item click", item);
                }
            })}
        >
            {itemContext.useResizeHandle ? <div {...leftResizeProps} /> : null}

            <div
                style={{
                    height: itemContext.dimensions.height,
                    overflow: "hidden",
                    paddingLeft: 3,
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                }}
            >
                {itemContext.title}
            </div>

            {itemContext.useResizeHandle ? <div {...rightResizeProps} /> : null}
        </div>
    );
};

export default itemRenderer;