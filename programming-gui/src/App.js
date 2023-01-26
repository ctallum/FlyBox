import TLine from "./components/Timeline";
import React from "react";
import UploadButton from "./components/UploadButton";

function App() {
    const [imported, setImported] = React.useState(false);

    return <div>
        {/* <UploadButton /> */}
        <div class="header">
            <div class="brandeis_logo">
                <a href="https://www.brandeis.edu/" target="_blank">
                    <img src="./images/brandeis_logo.svg" alt="" />
                </a>
            </div>
            <h1 class="site-title">Rosbash Lab FlyBox Test Creator</h1>
            <div class="action-buttons" id="action-buttons">
                <button type="button" onClick="window.location.reload();" name="Reset"><img src="./images/reset_symbol.svg" alt="" /></button>
                <div id="upload-button"></div>
                <div id="download-button"></div>
            </div>
        </div>
        <div class="content">
            <TLine data={null} imported={imported} />
            <div class="days">
                <div id="day">

                </div>
            </div>

        </div>
        <div class="footer">

        </div>


    </div>
}

export default App;