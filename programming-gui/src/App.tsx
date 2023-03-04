import TLine from "./components/Timeline";
import React from "react";
import UploadButton from "./components/UploadButton";
import exportFromJSON from "export-from-json";
import Item from "./types";
import Modal from 'react-modal'
import { getDay, getHour, getMin } from "./util/timeHandler";
import useUndoableState from "./util/history";
import _ from "underscore";

function App() {
    const [helpIsOpen, setHelpIsOpen] = React.useState<boolean>(false);
    const [reloadIsOpen, setReloadIsOpen] = React.useState<boolean>(false);
    const [downloadIsOpen, setDownloadIsOpen] = React.useState<boolean>(false);
    const [showContextMenu, setShowContextMenu] = React.useState<boolean>(false);
    const [numDays, setNumDays] = React.useState<number>(1);
    const [currId, setCurrId] = React.useState<number>(1);

    const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
    const [copiedIds, setCopiedIds] = React.useState<number[]>([]);

    const [downloadName, setDownloadName] = React.useState<string>("FlyBoxTest");


    interface StateHistory {
        state: Item[],
        setState: (data: Item[]) => void,
        resetState: (data: Item[]) => void,
        index: number,
        lastIndex: number,
        goBack: (steps?: number) => void,
        goForward: (steps?: number) => void
    }

    const { state: data,
        setState: setData,
        resetState: resetData,
        index: stateIndex,
        lastIndex: lastIndex,
        goBack: undo,
        goForward: redo } = useUndoableState([]) as StateHistory;

    React.useEffect(() => {
        document.addEventListener("keydown", handleKeyPress);
        return () => document.removeEventListener("keydown", handleKeyPress);
    }, [selectedIds, data, copiedIds])

    const downloadData = () => {
        setDownloadIsOpen(false);
        console.log("downloading")

        const formattedData = data.map(item => {
            return {
                id: item.id,
                group: +item.group,
                start_day: getDay(item.start),
                start_hour: getHour(item.start),
                start_min: getMin(item.start),
                end_day: getDay(item.end),
                end_hour: getHour(item.end),
                end_min: getMin(item.end),
                intensity: item.intensity,
                frequency: item.frequency,
                sunset: item.sunset
            }
        })

        exportFromJSON({ data: formattedData, fileName: downloadName, exportType: exportFromJSON.types.txt });
    }

    const pasteItems = (time?: number) => {
        const DAY = 86400000;
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

    const handleKeyPress = (e) => {
        if (e.key === "Escape")
            setShowContextMenu(false);

        if (e.key === "Backspace" || e.key === "Delete")
            setData(data.filter(item => !selectedIds.includes(item.id)))

        if (e.key === "z" && (e.metaKey || e.ctrlKey)) {
            undo();
            e.preventDefault();
        }
        if (e.key === "Z" && (e.metaKey || e.ctrlKey) || (e.key === "y" && (e.metaKey || e.ctrlKey))) {
            redo();
            e.preventDefault();
        }

        if (e.key === "c" && (e.metaKey || e.ctrlKey))
            setCopiedIds(selectedIds)

        if (e.key === "v" && (e.metaKey || e.ctrlKey))
            pasteItems();

        if (e.key === "a" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault()
            setSelectedIds(_(data).pluck("id"))
        }
    }

    return <div
        id="app"
        onClick={() => { setShowContextMenu(false); setSelectedIds([]); }}
        tabIndex={0}
    >
        <div className="header">
            <div className="brandeis_logo">
                <a href="https://www.brandeis.edu/" target="_blank">
                    <img src="./images/brandeis_logo.svg" alt="" />
                </a>
            </div>
            <h1 className="site-title">Rosbash Lab FlyBox Test Creator</h1>

            <div className="action-buttons" id="action-buttons">
                <button
                    type="button"
                    onClick={() => setHelpIsOpen(true)}
                >
                    <img src="./images/about.svg" alt="" />
                </button>
                <button
                    type="button"
                    onClick={() => setHelpIsOpen(true)}
                >
                    <img src="./images/settings.svg" alt="" />
                </button>
                <button
                    type="button"
                    onClick={() => setReloadIsOpen(true)}
                    name="Reset"
                    title="Reset all test data"
                >
                    <img src="./images/reset_symbol.svg" alt="" />
                </button>
                <UploadButton setData={setData} setNumDays={setNumDays} />
                <button onClick={() => setDownloadIsOpen(true)} type="button" name="Download">
                    Download test <img src="./images/download_symbol.svg" alt="" />
                </button>
            </div>
        </div>

        <div className="content">
            <TLine
                data={data}
                setData={setData}
                showContextMenu={showContextMenu}
                setShowContextMenu={setShowContextMenu}
                numDays={numDays}
                setNumDays={setNumDays}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
                currId={currId}
                setCurrId={setCurrId}
                pasteItems={pasteItems}
            />
        </div>
        <Modal
            style={{ content: { background: "#1C1C1C", border: "none" }, overlay: { background: "rgba(0,0,0,0.5)" } }}
            isOpen={helpIsOpen}
            onRequestClose={() => setHelpIsOpen(false)}
            contentLabel="Info Modal"
        >
            <button onClick={() => setHelpIsOpen(false)}
                style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px"
                }}>x</button>
            <div>wow content</div>
        </Modal>
        <Modal
            style={{
                content: {
                    background: "#1C1C1C",
                    width: "400px",
                    height: "200px",
                    position: "relative",
                    textAlign: "center",
                    border: "none"

                },
                overlay: { background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" }
            }}
            isOpen={reloadIsOpen}
            onRequestClose={() => setReloadIsOpen(false)}
            contentLabel="Confirm Modal"
        >
            <h2>Reset Data</h2>
            <h3>Are you sure you want to reset all data?</h3>
            <div id="modal-actions">
                <button id="cancel-button" onClick={() => { setReloadIsOpen(false) }}>Cancel</button>
                <button id="confirm-reset-button" onClick={() => { setData([]); setReloadIsOpen(false) }}>Reset</button>
            </div>
        </Modal>
        <Modal
            style={{
                content: {
                    background: "#1C1C1C",
                    width: "400px",
                    height: "200px",
                    position: "relative",
                    textAlign: "center",
                    border: "none"

                },
                overlay: { background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" }
            }}
            isOpen={downloadIsOpen}
            onRequestClose={() => setDownloadIsOpen(false)}
            contentLabel="Download Modal"
            shouldReturnFocusAfterClose={false}
        >
            <h2>Save as:</h2>

            <button onClick={() => setDownloadIsOpen(false)}
                style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px"
                }}>x</button>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "15px" }}>
                <input
                    value={downloadName}
                    onKeyDown={(e) => e.key === "Enter" && downloadData()}
                    onChange={(e) => setDownloadName(e.target.value)}
                    autoFocus
                    onFocus={(e) => e.target.select()}
                    className="text-input"
                />
                <button onClick={downloadData}>Save</button>
            </div>
        </Modal>
        <div id="add-day-button">
            <button onClick={() => { setNumDays(numDays + 1) }} title="Add day">
                <img src="./images/plusbutton.svg" alt="Add Day" />
            </button>
        </div>
    </div>
}

export default App;