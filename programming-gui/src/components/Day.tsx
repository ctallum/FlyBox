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
    selectedIds: number[]
    setSelectedIds: (ids: number[]) => void
    pasteItems: (time?: number) => void
}

const Day = (props: IProps) => {
    const items = props.items;

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

    const checkOverlap = (item: Item, startTime: number, endTime: number, group: string) => {
        const itemSize = endTime - startTime;

        const overlapper = props.items.find((x) =>
            ((startTime > x.start && startTime < x.end) ||
                (endTime > x.start && endTime < x.end) ||
                (x.start > startTime && x.start < endTime) ||
                (x.end > startTime && x.end < endTime)
            ) && x.id !== item.id && group === x.group
        );

        if (overlapper) {
            if (startTime > (overlapper.end - overlapper.start) / 2 + overlapper.start)
                return [overlapper.end, overlapper.end + itemSize]
            else
                return [overlapper.start - itemSize, overlapper.start]
        }
        return [startTime, endTime]
    }


    const handleItemMove = (itemId, dragTime, newGroupOrder) => {
        const item = props.items.find(x => x.id == itemId);
        if (!item)
            return

        const group = String(props.groups[newGroupOrder].id);
        const endTime = dragTime + (item.end - item.start);
        const [start, end] = checkOverlap(item, dragTime, endTime, group);

        props.setData(props.items.map((item) =>
            item.id === itemId
                ? Object.assign({}, item, {
                    start: start,
                    end: end,
                    group: group
                })
                : item
        ))

        console.log("Moved", itemId, dragTime, newGroupOrder);
    };

    const handleItemResize = (itemId, time, edge) => {
        const item = props.items.find(x => x.id == itemId);
        if (!item)
            return;
        let startTime = edge === "left" ? time : item.start;
        let endTime = edge === "left" ? item.end : time;

        [startTime, endTime] = checkOverlap(item, startTime, endTime, item.group)
        props.setData(
            items.map((item) =>
                item.id === itemId
                    ? Object.assign({}, item, {
                        start: startTime,
                        end: endTime
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

    const handleEventClick = (itemId, e) => {
        if (e.button !== 0) //must be left click
            return

        e.stopPropagation();

        if (e.shiftKey) {
            props.setSelectedIds([...props.selectedIds, itemId])
        }
        else {
            props.setSelectedIds([itemId])
            props.handleContextMenu(itemId, e);

        }
    }

    //so renderer can get info about what is selected
    const newEvents = items.map(item => { return { ...item, selected: props.selectedIds.includes(item.id) } })

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
                onCanvasContextMenu={() => props.pasteItems(getMsTime(props.dayNumber, 0, 0))}
                groups={props.groups}
                items={newEvents}
                keys={keys}
                selected={_(props.items).pluck("id")}
                sidebarWidth={50}
                sidebarContent={<div>Above The Left</div>}
                lineHeight={40}
                minResizeWidth={0}
                canMove
                canResize="both"
                canSelect
                itemsSorted
                itemTouchSendsClick={false}
                useResizeHandle
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
                onItemClick={handleEventClick}
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