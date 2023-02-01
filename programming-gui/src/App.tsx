import TLine from "./components/Timeline";
import React from "react";
import UploadButton from "./components/UploadButton";
import exportFromJSON from "export-from-json";

function App() {
    const [data, setData] = React.useState<any>([]);

    const handleClick = () => {
        const DAY = 86400000;
        const HOUR = 3600000;
        const MIN = 60000;

        const formattedData = data.map(item => {
            return {
                id: item.id,
                group: item.group,
                start_day: Math.floor(item.start / DAY),
                start_hour: Math.floor((item.start % DAY) / HOUR),
                start_min: Math.floor(item.start % HOUR) / MIN,
                end_day: Math.floor(item.end / DAY),
                end_hour: Math.floor((item.end % DAY) / HOUR),
                end_min: Math.floor(item.end % HOUR) / MIN,
                itemProps: item.itemProps
            }
        })


        exportFromJSON({ data: formattedData, fileName: 'FlyBoxTest', exportType: exportFromJSON.types.txt });
    }

    return <div>
        <div className="header">
            <div className="brandeis_logo">
                <a href="https://www.brandeis.edu/" target="_blank">
                    <img src="./images/brandeis_logo.svg" alt="" />
                </a>
            </div>
            <h1 className="site-title">Rosbash Lab FlyBox Test Creator</h1>

            <div className="action-buttons" id="action-buttons">
                <button type="button" onClick={() => window.location.reload()} name="Reset"><img src="./images/reset_symbol.svg" alt="" /></button>
                <button onClick={handleClick} type="button" name="Download">
                    Download test <img src="./images/download_symbol.svg" alt="" />
                </button>
                <UploadButton setData={setData} />
            </div>
        </div>

        <div className="content">
            <TLine data={data} setData={setData} />
        </div>
    </div>
}

export default App;