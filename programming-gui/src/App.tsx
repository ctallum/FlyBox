import React from "react";
import Item from "./types";
import { getDay, getHour, getMin, getMsTime } from "./util/timeHandler";
import useUndoableState from "./util/history";
import _ from "underscore";
import Modals from "./components/Modals";
import Header from "./components/Header";
import Day from "./components/Day";
import ContextMenu from "./components/ContextMenu";

interface StateHistory {
    state: Item[],
    setState: (data: Item[]) => void,
    goBack: (steps?: number) => void,
    goForward: (steps?: number) => void
}

const DAY = 86400000;

function App() {
    const [helpIsOpen, setHelpIsOpen] = React.useState<boolean>(false);
    const [reloadIsOpen, setReloadIsOpen] = React.useState<boolean>(false);
    const [downloadIsOpen, setDownloadIsOpen] = React.useState<boolean>(false);

    const [numDays, setNumDays] = React.useState<number>(1);
    const [currId, setCurrId] = React.useState<number>(1);

    const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
    const [copiedIds, setCopiedIds] = React.useState<number[]>([]);

    const [itemMenu, setItemMenu] = React.useState<{ itemId: number, x: number, y: number }>({ itemId: -1, x: 0, y: 0 });
    const [canvasMenu, setCanvasMenu] = React.useState<{ day: number, x: number, y: number }>({ day: -1, x: 0, y: 0 });

    const [currDrag, setCurrDrag] = React.useState<number>(-1);
    const [dragOver, setDragOver] = React.useState<number>(-1);

    const { state: data,
        setState: setData,
        goBack: undo,
        goForward: redo } = useUndoableState([]) as StateHistory;

    React.useEffect(() => {
        document.addEventListener("keydown", handleKeyPress);
        return () => document.removeEventListener("keydown", handleKeyPress);
    }, [selectedIds, data, copiedIds])

    const handleContextMenu = (itemId, e, time) => {
        let x = e.pageX;
        if (document.body.offsetWidth - e.pageX < 250)
            x -= 200;

        setItemMenu({ itemId: itemId, x: x, y: e.pageY })
    }

    const handleCanvasMenu = (group, time, e, day) => {
        setCanvasMenu({ day: day, x: e.pageX, y: e.pageY })
    }

    const removeDay = (dayNumber) => {
        if (numDays == 1) {
            setData([]);
            return;
        }

        const dayStart = DAY * dayNumber;
        const dayEnd = dayStart + DAY;

        let filteredData = data.filter(item =>
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

        setData(filteredData);
        setNumDays(numDays - 1);
    }

    const moveDayDown = (dayNumber: number) => {
        const dayGoingDownStart = DAY * dayNumber;
        const dayBoundary = dayGoingDownStart + DAY;
        const dayGoingUpEnd = dayBoundary + DAY

        const newData = data.map(item => {
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

        setData(newData);

        if (dayNumber === numDays - 1)
            setNumDays(numDays + 1)
    }

    const handleDragDrop = (e) => {
        const targetDay = +e.target.dataset.dayNumber;
        const sourceDay = currDrag;

        const sourceStart = getMsTime(sourceDay);
        const sourceEnd = getMsTime(sourceDay + 1) - 1;
        const targetEnd = getMsTime(targetDay + 1) - 1;


        const editedEvents = data.map((e) => {
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

        setData([...editedEvents]);
        setDragOver(-1)
    }

    const pasteItems = (time?: number) => {
        const pasteTime = time || (getDay(Math.max(..._(data).pluck("start"))) + 1) * DAY;

        const copiedItems = data.filter(item => copiedIds.includes(item.id));

        const newItems = copiedItems.map((item, i) => {
            return {
                ...item,
                start: item.start % DAY + pasteTime,
                end: item.end % DAY + pasteTime,
                id: currId + i
            }
        })

        const newMaxDay = Math.max(getDay(Math.max(..._(newItems).pluck("start"))) + 1, numDays);

        setData([...data, ...newItems]);
        setCurrId(currId + newItems.length);
        setNumDays(newMaxDay)
    }

    const copyItems = (day: number) => {
        setCopiedIds(_(data.filter(item => getDay(item.start) === day)).pluck("id"))
    }

    const clickAway = () => {
        setItemMenu({ itemId: -1, x: 0, y: 0 });
        setSelectedIds([]);
        setCanvasMenu({ ...canvasMenu, day: -1 });
    }

    const handleKeyPress = (e) => {
        if (e.key === "Escape")
            clickAway();

        if (e.key === "Backspace" || e.key === "Delete")
            setData(data.filter(item => !selectedIds.includes(item.id)))

        if (e.key === "z" && (e.metaKey || e.ctrlKey)) {
            undo();
            e.preventDefault();
        }
        if ((e.key === "Z" && (e.metaKey || e.ctrlKey)) || (e.key === "y" && (e.metaKey || e.ctrlKey))) {
            redo();
            e.preventDefault();
        }
        if (e.key === "v" && (e.metaKey || e.ctrlKey))
            pasteItems();

        if (e.key === "a" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            setSelectedIds(_(data).pluck("id"))
        }
    }

    return <div
        id="app"
        onClick={clickAway}
        tabIndex={0}
    >
        <Header
            setDownloadIsOpen={setDownloadIsOpen}
            setReloadIsOpen={setReloadIsOpen}
            setHelpIsOpen={setHelpIsOpen}
            setData={setData}
            setNumDays={setNumDays}
        />

        <div className="content">
            <div id="summary-info">{numDays} Days, {data.length} Tests</div>

            {itemMenu.itemId > -1 &&
                <ContextMenu
                    x={itemMenu.x}
                    y={itemMenu.y}
                    id={itemMenu.itemId}
                    data={data}
                    setData={setData}
                    setItemMenu={setItemMenu}
                />
            }

            {canvasMenu.day > -1 &&
                <div style={{
                    position: "absolute",
                    top: canvasMenu.y + "px",
                    left: canvasMenu.x + "px",
                    zIndex: 100
                }} >

                    <button onClick={() => copyItems(canvasMenu.day)}>Copy Day</button>

                </div>
            }

            {[...Array(numDays).keys()].map(i =>
                <>
                    <Day
                        items={data || []}
                        setData={setData}
                        dayNumber={i}
                        removeDay={removeDay}
                        currId={currId}
                        setCurrId={setCurrId}
                        moveDayDown={moveDayDown}
                        key={i}
                        handleContextMenu={handleContextMenu}
                        selectedIds={selectedIds}
                        setSelectedIds={setSelectedIds}
                        pasteItems={pasteItems}
                        setCurrDrag={setCurrDrag}
                        beingDragged={currDrag === i}
                        handleCanvasMenu={handleCanvasMenu}

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

        <div id="add-day-button">
            <button onClick={() => { setNumDays(numDays + 1) }} title="Add day">
                <img src="./images/plusbutton.svg" alt="Add Day" />
            </button>
        </div>

        <Modals
            downloadIsOpen={downloadIsOpen}
            reloadIsOpen={reloadIsOpen}
            helpIsOpen={helpIsOpen}
            setDownloadIsOpen={setDownloadIsOpen}
            setReloadIsOpen={setReloadIsOpen}
            setHelpIsOpen={setHelpIsOpen}
            setData={setData}
            data={data}
        />
    </div>
}

export default App;