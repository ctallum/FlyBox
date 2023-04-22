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
    const [memeMode, setMemeMode] = React.useState<boolean>(false);

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
            }
        })

        exportFromJSON({ data: formattedData, fileName: downloadName, exportType: exportFromJSON.types.txt });
    }

    return <>
        {memeMode && <img src="./images/fruit-fly2.png" height={25} style={{ position: "fixed", right: 500, bottom: 300 }} />}

        <Modal
            style={{
                content: {
                    background: "#1C1C1C",
                    border: "none",
                    textAlign: "center",
                    height: "500px",
                    width: "700px",
                    position: "relative",
                    lineHeight: 1.4
                },
                overlay: { background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" }
            }}
            isOpen={props.helpIsOpen}
            onRequestClose={() => props.setHelpIsOpen(false)}
            contentLabel="Info Modal"
        >
            <div style={{ width: "100%", textAlign: "right" }}>
                <button onClick={() => props.setHelpIsOpen(false)}>
                    <img src="./images/xbutton.svg" alt="close" />
                </button>
            </div>

            <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                <img src="./images/brandeis_logo.svg" alt="" />
                <img src="./images/olinlogo.svg" alt="" />
            </div>

            <div style={{ padding: "0 15% 0 15%" }}>
                <h2>Rosbash Lab FlyBox Test Creator</h2>
                <p>Version 1.0.0</p>
                <p><a href="https://github.com/ctallum/FlyBox/blob/main/programming-gui/README.md" >How to Use</a></p>
                <p>The FlyBox Test Creator is a minimal webapp that makes it easy to create, edit, and save FlyBox tests.</p>

                <p>Made for the Rosbash Lab at Brandeis University <br />By the 2022-23 Olin College SCOPE Team</p>

                <p>
                    Design: Zachary Sherman<br />
                    Implementation: Rebecca Flach<br />
                    Quality Assurance: Christopher Allum
                </p>
            </div>

            <div style={{ position: "absolute", bottom: 20, left: 20 }}>
                <label className="switch">
                    <input type="checkbox" checked={memeMode} onChange={(e) => setMemeMode(e.target.checked)} />
                    <span className="slider round"></span>
                </label>

                <span> Drosophila Mode</span>
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
                }}><img src="./images/xbutton.svg" alt="close" /></button>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "15px" }}>
                <input
                    value={downloadName}
                    onKeyDown={(e) => { e.stopPropagation(); e.key === "Enter" && downloadData() }}
                    onChange={(e) => { setDownloadName(e.target.value) }}
                    autoFocus
                    onFocus={(e) => e.target.select()}
                    className="text-input"
                />
                <button onClick={downloadData}>Save</button>
            </div>
        </Modal>
    </>
}

export default Modals;