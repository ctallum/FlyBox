import exportFromJSON from "export-from-json";
import React from "react";
import Modal from 'react-modal'
import Item from "../types";
import { getDay, getHour, getMin } from "../util/timeHandler";

interface IProps {
    helpIsOpen: boolean,
    downloadIsOpen: boolean,
    reloadIsOpen: boolean,
    setHelpIsOpen: (open: boolean) => void,
    setDownloadIsOpen: (open: boolean) => void,
    setReloadIsOpen: (open: boolean) => void,
    setData: (data: Item[]) => void,
    data: Item[]
}

function Modals(props: IProps) {
    const [downloadName, setDownloadName] = React.useState<string>("FlyBoxTest");

    const downloadData = () => {
        props.setDownloadIsOpen(false);
        console.log("downloading")

        const formattedData = props.data.map(item => {
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

    return <div>
        <Modal
            style={{ content: { background: "#1C1C1C", border: "none" }, overlay: { background: "rgba(0,0,0,0.5)" } }}
            isOpen={props.helpIsOpen}
            onRequestClose={() => props.setHelpIsOpen(false)}
            contentLabel="Info Modal"
        >
            <button onClick={() => props.setHelpIsOpen(false)}
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
            isOpen={props.reloadIsOpen}
            onRequestClose={() => props.setReloadIsOpen(false)}
            contentLabel="Confirm Modal"
        >
            <h2>Reset Data</h2>
            <h3>Are you sure you want to reset all data?</h3>
            <div id="modal-actions">
                <button id="cancel-button" onClick={() => { props.setReloadIsOpen(false) }}>Cancel</button>
                <button className="danger-button" onClick={() => { props.setData([]); props.setReloadIsOpen(false) }}>Reset</button>
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
            isOpen={props.downloadIsOpen}
            onRequestClose={() => props.setDownloadIsOpen(false)}
            contentLabel="Download Modal"
            shouldReturnFocusAfterClose={false}
        >
            <h2>Save as:</h2>

            <button onClick={() => props.setDownloadIsOpen(false)}
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
    </div>
}

export default Modals;