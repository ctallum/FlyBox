import React from "react";
import Item from "../types";

function UploadButton(props) {
    const uploadFile = (fileInput) => {
        const DAY = 86400000;
        const HOUR = 3600000;
        const MIN = 60000;

        const file = fileInput.target.files[0];
        let reader = new FileReader();

        reader.onload = function () {
            console.log('uploading')
            const result = JSON.parse(reader.result as any);
            const formatted: Item[] = result.map((item) => {
                return {
                    id: item.id,
                    group: `${item.group}`, //needs to be string for rct
                    start: item.start_day * DAY + item.start_hour * HOUR + item.start_min * MIN,
                    end: item.end_day * DAY + item.end_hour * HOUR + item.end_min * MIN,
                    intensity: item.intensity,
                    frequency: item.frequency,
                    sunset: item.sunset
                }
            })
            props.setData(formatted);
        };

        reader.readAsText(file);
    }

    return (
        <div>
            <input type="file" id="upload-btn" accept=".txt" onChange={uploadFile} hidden />
            <label htmlFor="upload-btn">Upload test <img src="./images/upload_symbol.svg" alt="" /></label>
        </div>
    )
}

export default UploadButton;

