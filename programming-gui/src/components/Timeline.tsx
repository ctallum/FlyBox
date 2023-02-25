import React from "react";
import moment from "moment-timezone";
import Day from "./Day";
import Item from "../types";
import ContextMenu from "./ContextMenu";

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
            />
        )}

    </div>
}


export default TLine;