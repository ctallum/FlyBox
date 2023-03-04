import React from "react";
import moment from "moment-timezone";
import Day from "./Day";
import Item from "../types";
import ContextMenu from "./ContextMenu";
import { getHour, getMin, getMsTime } from "../util/timeHandler";

// Using UTC because there's no need to deal with timezones in this UI
moment.tz.setDefault('Etc/UTC');

interface IProps {
    data: Item[];
    setData: (data: any) => void;
    showContextMenu: boolean;
    setShowContextMenu: (status: boolean) => void;
    numDays: number;
    setNumDays: (num: number) => void
    selectedIds: number[];
    setSelectedIds: (ids: number[]) => void
    currId: number,
    setCurrId: (id: number) => void
    pasteItems: (time?: number) => void
}

function TLine(props: IProps) {
    const [groups, setGroups] = React.useState<any>([]);

    const [menuX, setMenuX] = React.useState<number>(0);
    const [menuY, setMenuY] = React.useState<number>(0);
    const [menuItemId, setMenuItemId] = React.useState<any>(0);
    const [currDrag, setCurrDrag] = React.useState<number>(-1);
    const [dragOver, setDragOver] = React.useState<number>(-1);

    const handleContextMenu = (itemId, e, time) => {
        props.setShowContextMenu(true);
        setMenuItemId(itemId);

        if (document.body.offsetWidth - e.pageX < 200)
            setMenuX(e.pageX - 200);
        else
            setMenuX(e.pageX);

        setMenuY(e.pageY);

    }


    const DAY = 86400000;

    const items = props.data || [];

    React.useEffect(() => {
        const group_names = ["R", "G", "W"];
        let groupsInitial = [] as any;
        for (let i = 0; i < group_names.length; i++) {
            groupsInitial.push({
                id: i,
                title: group_names[i]
            })
        }
        setGroups(groupsInitial);
    }, []);

    const removeDay = (dayNumber) => {

        if (props.numDays == 1) {
            props.setData([]);
            return;
        }

        const dayStart = DAY * dayNumber;
        const dayEnd = dayStart + DAY;

        let filteredData = props.data.filter(item =>
            item.start < dayStart || item.start > dayEnd
        );
        filteredData = filteredData.map(item => {
            //move later days up
            if (item.start > dayStart) {
                item.start -= DAY;
                item.end -= DAY;
            }
            return item;
        })

        props.setData(filteredData);
        props.setNumDays(props.numDays - 1);
    }

    const moveDayDown = (dayNumber: number) => {
        const dayGoingDownStart = DAY * dayNumber;
        const dayBoundary = dayGoingDownStart + DAY;
        const dayGoingUpEnd = dayBoundary + DAY

        const newData = props.data.map(item => {
            if (item.start > dayGoingDownStart && item.end < dayBoundary) {
                item.start += DAY;
                item.end += DAY;
            }
            else if (item.start > dayBoundary && item.start < dayGoingUpEnd) {
                item.start -= DAY;
                item.end -= DAY;
            }
            return item;
        })


        props.setData(newData);

        if (dayNumber === props.numDays - 1)
            props.setNumDays(props.numDays + 1)
    }

    const handleDragDrop = (e) => {
        const targetDay = +e.target.dataset.dayNumber;
        const sourceDay = currDrag;

        const sourceStart = getMsTime(sourceDay);
        const sourceEnd = getMsTime(sourceDay + 1) - 1;
        const targetEnd = getMsTime(targetDay + 1) - 1;


        const editedEvents = props.data.map((e) => {
            e = { ...e } //makes equality checking work so it rerenders

            if (targetDay > sourceDay) {
                if (e.start >= sourceStart && e.start < sourceEnd) {
                    console.log("updating this one: ", e)
                    e.start = getMsTime(targetDay, getHour(e.start), getMin(e.start));
                    e.end = getMsTime(targetDay, getHour(e.end), getMin(e.end));
                }
                else if (e.start > sourceEnd && e.start < targetEnd) {
                    e.start -= DAY;
                    e.end -= DAY;
                }
            }
            else if (targetDay < sourceDay) {
                if (e.start >= sourceStart && e.start < sourceEnd) {
                    console.log("updating this one: ", e)
                    e.start = getMsTime(targetDay + 1, getHour(e.start), getMin(e.start));
                    e.end = getMsTime(targetDay + 1, getHour(e.end), getMin(e.end));
                }
                else if (e.start > targetEnd && e.start < sourceStart) {
                    e.start += DAY;
                    e.end += DAY;
                }
            }
            return e;
        })

        props.setData([...editedEvents]);
        setDragOver(-1)
    }


    const days = [...Array(props.numDays).keys()];

    return <div>
        <div id="summary-info">{props.numDays} Days, {props.data.length} Tests</div>
        {props.showContextMenu &&
            <ContextMenu
                x={menuX}
                y={menuY}
                id={menuItemId}
                data={props.data}
                setData={props.setData}
                setShowContextMenu={props.setShowContextMenu}
            />
        }
        {days.map(i =>
            <>
                <Day
                    items={items}
                    groups={groups}
                    setData={props.setData}
                    dayNumber={i}
                    removeDay={removeDay}
                    currId={props.currId}
                    setCurrId={props.setCurrId}
                    moveDayDown={moveDayDown}
                    key={i}
                    handleContextMenu={handleContextMenu}
                    selectedIds={props.selectedIds}
                    setSelectedIds={props.setSelectedIds}
                    pasteItems={props.pasteItems}
                    setCurrDrag={setCurrDrag}
                    beingDragged={currDrag === i}
                />

                <div
                    className={dragOver !== i ? "drop-zone" : "drop-zone drop-zone-active"}

                    onDrop={handleDragDrop}
                    onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = "move";
                        setDragOver(i)
                    }}
                    onDragEnter={(e) => e.preventDefault()}
                    onDragLeave={(e) => {
                        setDragOver(-1)
                    }}
                    data-day-number={i}
                >

                </div>
            </>
        )}

    </div>
}


export default TLine;