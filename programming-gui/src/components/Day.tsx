import moment from "moment";
import React from "react";
import Timeline, {
    TimelineMarkers,
    TimelineHeaders,
    DateHeader,
} from "react-calendar-timeline";
import itemRenderer from "./itemRender";

const minTime = 0; //moment().add(-6, "months").valueOf();
const maxTime = moment().add(6, "months").valueOf();

const keys = {
    groupIdKey: "id",
    groupTitleKey: "title",
    groupRightTitleKey: "rightTitle",
    itemIdKey: "id",
    itemTitleKey: "title",
    itemDivTitleKey: "title",
    itemGroupKey: "group",
    itemTimeStartKey: "start",
    itemTimeEndKey: "end"
};

const Day = (props) => {
    const items = props.items;
    const itemIds = items.map((item) => item.id)

    const handleCanvasClick = (groupId, time) => {
        console.log("Canvas clicked", groupId, moment(time).format());

        let newItems = props.items.slice()

        newItems.push({
            id: props.currId,
            group: groupId + "",
            start: time,
            end: time + 3600000,
            itemProps: {
                "frequency": 0
            }
        });
        props.setCurrId(props.currId + 1)
        props.setData(newItems);
    };



    const handleItemMove = (itemId, dragTime, newGroupOrder) => {
        const group = props.groups[newGroupOrder];

        props.setData(props.items.map((item) =>
            item.id === itemId
                ? Object.assign({}, item, {
                    start: dragTime,
                    end: dragTime + (item.end - item.start),
                    group: String(group.id)
                })
                : item
        ))

        console.log("Moved", itemId, dragTime, newGroupOrder);
    };

    const handleItemResize = (itemId, time, edge) => {
        props.setData(
            items.map((item) =>
                item.id === itemId
                    ? Object.assign({}, item, {
                        start: edge === "left" ? time : item.start,
                        end: edge === "left" ? item.end : time
                    })
                    : item
            )
        )

        console.log("Resized", itemId, time, edge);
    };

    // this limits the timeline to -6 months ... +6 months
    const handleTimeChange = (visibleTimeStart, visibleTimeEnd, updateScrollCanvas) => {
        if (visibleTimeStart < minTime && visibleTimeEnd > maxTime) {
            updateScrollCanvas(minTime, maxTime);
        } else if (visibleTimeStart < minTime) {
            updateScrollCanvas(
                minTime,
                minTime + (visibleTimeEnd - visibleTimeStart)
            );
        } else if (visibleTimeEnd > maxTime) {
            updateScrollCanvas(
                maxTime - (visibleTimeEnd - visibleTimeStart),
                maxTime
            );
        } else {
            updateScrollCanvas(visibleTimeStart, visibleTimeEnd);
        }
    };

    const moveResizeValidator = (action, item, time) => {
        if (time < new Date().getTime()) {
            let newTime =
                Math.ceil(new Date().getTime() / (15 * 60 * 1000)) * (15 * 60 * 1000);
            return newTime;
        }

        return time;
    };

    return (
        <div className="timeline-container">
            <div className="day-side-details">
                <button onClick={() => { props.removeDay(props.dayNumber) }}>
                    <span className="day-number">{props.dayNumber + 1}</span>
                    <span className="x-button">
                        <img src="./images/xbutton.svg" alt="Remove Day" />
                    </span>
                </button>
            </div>
            <Timeline
                groups={props.groups}
                items={items}
                keys={keys}
                selected={itemIds}
                sidebarWidth={50}
                sidebarContent={<div>Above The Left</div>}
                lineHeight={40}
                minResizeWidth={0}
                canMove
                canResize="both"
                canSelect
                itemsSorted
                itemTouchSendsClick={false}
                stackItems
                dragSnap={1 * 60 * 1000} // can snap to one-minute accuracy
                itemHeightRatio={1}
                // Ideally visibleTimeStart would begin at 0 ms, but there is a bug with React Calendar Timeline that prevents this. 1 ms shouldn't make a difference *famous last words*
                visibleTimeStart={props.dayNumber * 86400000 + 1}
                visibleTimeEnd={(props.dayNumber + 1) * 86400000}
                itemRenderer={itemRenderer}
                onCanvasClick={handleCanvasClick}
                onItemMove={handleItemMove}
                onItemResize={handleItemResize}
                buffer={1}
                onTimeChange={handleTimeChange}
            // moveResizeValidator={this.moveResizeValidator}
            >
                <TimelineMarkers>
                </TimelineMarkers>
                <TimelineHeaders>
                    <DateHeader
                        unit="hour"
                        labelFormat="HH"
                        style={props.dayNumber == 0 ? {} : { display: "none" }} //hour numbers only on first day
                    />
                </TimelineHeaders>
            </Timeline>
        </div>
    );
}

export default Day;