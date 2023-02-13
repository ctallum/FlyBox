import React from "react";
import Item from "../types";
import { getMsTime } from "../util/timeHandler";

function UploadButton(props) {
    const uploadFile = (fileInput) => {

        const file = fileInput.target.files[0];
        let reader = new FileReader();

        reader.onload = function () {
            console.log('uploading')
            const result = JSON.parse(reader.result as any);
            const formatted: Item[] = result.map((item) => {
                return {
                    id: item.id,
                    group: `${item.group}`, //needs to be string for rct
                    start: getMsTime(item.start_day, item.start_hour, item.start_min),
                    end: getMsTime(item.end_day, item.end_hour, item.end_min),
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
            <button>
                <input type="file" id="upload-btn" accept=".txt" onChange={uploadFile} hidden />
                <label htmlFor="upload-btn">Upload test <img src="./images/upload_symbol.svg" alt="" /></label>
            </button>
        </div>
    )
}

export default UploadButton;

