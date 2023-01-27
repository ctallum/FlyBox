import TLine from "./components/Timeline";
import React from "react";
import UploadButton from "./components/UploadButton";
import DownloadButton from "./components/DownloadButton";

function App() {
    const [imported, setImported] = React.useState(false);

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
                <DownloadButton />
                <UploadButton />
            </div>
        </div>
        <div className="content">
            <TLine data={null} />
            <div className="days">
                <div id="day">

                </div>
            </div>

        </div>
        <div className="footer">

        </div>


    </div>
}

export default App;