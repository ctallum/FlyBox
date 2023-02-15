import moment from "moment";
import React from "react";
import Timeline, {
    TimelineMarkers,
    TimelineHeaders,
    DateHeader,
} from "react-calendar-timeline";
import Item from "../types";
import itemRenderer from "./itemRender";
import _ from "underscore"
import { getDay, getHour, getMin, getMsTime } from "../util/timeHandler";

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

interface IProps {
    items: Item[],
    currId: number,
    setCurrId: (id: number) => void,
    setData: (data: Item[]) => void,
    groups: any[],
    dayNumber: number,
    removeDay: (id: number) => void,
    moveDayDown: (id: number) => void,
    handleContextMenu: (id: number, e, time?: any) => void
}

const Day = (props: IProps) => {
    const items = props.items;
    const itemIds = items.map((item) => item.id)

    const handleCanvasClick = (groupId: string, time: number) => {
        console.log("Canvas clicked", groupId, moment(time).format());

        let newItems = props.items.slice();
        const hour = getHour(time);

        newItems.push({
            id: props.currId,
            group: groupId + "",
            start: getMsTime(props.dayNumber, hour, 0),
            end: getMsTime(props.dayNumber, hour + 1, 0),
            frequency: 100,
            intensity: 100,
            sunset: false

        });
        props.setCurrId(props.currId + 1)
        props.setData(newItems);
    };

    const checkOverlap = (item: Item, startTime: number) => {
        const endTime = startTime + (item.end - item.start)
        const overlap = props.items.find((x) => (startTime > x.start && startTime < x.end) || (endTime > x.start && endTime < x.end));

        if (!overlap || overlap.id == item.id)
            return

        console.log("OVERLAP")
        console.log(item)
        console.log(overlap)
        const newData = _(props.items).without(item)

    }


    const handleItemMove = (itemId, dragTime, newGroupOrder) => {
        const item = props.items.find(x => x.id == itemId);
        if (!item)
            return

        checkOverlap(item, dragTime);

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
        const DAY = 86400000;

        if (time < DAY * props.dayNumber)
            return DAY * props.dayNumber;

        // max start time = end of day - size of item
        const max = DAY * (props.dayNumber + 1) - (item.end - item.start);
        console.log(action)
        if (action === "move" && time > max)
            return max
        if (action === "resize" && time > DAY * (props.dayNumber + 1))
            return DAY * (props.dayNumber + 1)

        return time;
    };

    return (
        <div className="timeline-container">
            <div className="day-side-details">
                {props.dayNumber !== 0 &&
                    <button className="arrow-button" onClick={() => { props.moveDayDown(props.dayNumber - 1) }}>
                        <img src="./images/uparrow.svg" alt="Move Up" />
                    </button>
                }
                <button className="day-number-x-button" onClick={() => { props.removeDay(props.dayNumber) }}>
                    <span className="button-day-number">{props.dayNumber + 1}</span>
                    <span className="button-x">
                        <img src="./images/xbutton.svg" alt="Remove Day" />
                    </span>
                </button>
                <button className="arrow-button" onClick={() => { props.moveDayDown(props.dayNumber) }}>
                    <img src="./images/downarrow.svg" alt="Move Down" />
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
                useResizeHandle
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
                onItemClick={(itemId, e) => { e.stopPropagation(); props.handleContextMenu(itemId, e) }}
                moveResizeValidator={moveResizeValidator}
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
