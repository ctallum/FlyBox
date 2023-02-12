import TLine from "./components/Timeline";
import React from "react";
import UploadButton from "./components/UploadButton";
import exportFromJSON from "export-from-json";
import Item from "./types";
import Modal from 'react-modal'
import { getDay, getHour, getMin } from "./util/timeHandler";

function App() {
    const [data, setData] = React.useState<Item[]>([]);
    const [modalIsOpen, setIsOpen] = React.useState<boolean>(false)
    const [showContextMenu, setShowContextMenu] = React.useState<boolean>(false);

    const downloadData = () => {

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


        exportFromJSON({ data: formattedData, fileName: 'FlyBoxTest', exportType: exportFromJSON.types.txt });
    }

    return <div onClick={() => { setShowContextMenu(false); console.log("cancel") }} id="app">
        <div className="header">
            <div className="brandeis_logo">
                <a href="https://www.brandeis.edu/" target="_blank">
                    <img src="./images/brandeis_logo.svg" alt="" />
                </a>
            </div>
            <h1 className="site-title">Rosbash Lab FlyBox Test Creator</h1>

            <div className="action-buttons" id="action-buttons">
                <button type="button" onClick={() => window.location.reload()} name="Reset"><img src="./images/reset_symbol.svg" alt="" /></button>
                <button onClick={downloadData} type="button" name="Download">
                    Download test <img src="./images/download_symbol.svg" alt="" />
                </button>
                <UploadButton setData={setData} />
            </div>
        </div>

        <div className="content">
            <TLine
                data={data}
                setData={setData}
                showContextMenu={showContextMenu}
                setShowContextMenu={setShowContextMenu}
            />
        </div>
        <button onClick={() => setIsOpen(true)} id="open-modal-button">?</button>
        <Modal
            style={{ content: { background: "#1C1C1C" }, overlay: { background: "rgba(0,0,0,0.5)" } }}
            isOpen={modalIsOpen}
            onRequestClose={() => setIsOpen(false)}
            contentLabel="Example Modal"
        >
            <div>wow content</div>
        </Modal>
    </div>
}

export default App;