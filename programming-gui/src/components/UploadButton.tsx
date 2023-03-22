import React from "react";
import _ from "underscore";
import Item from "../types";
import { getDay, getMsTime } from "../util/timeHandler";

function UploadButton(props) {
    const uploadFile = (fileInput) => {

        const file = fileInput.target.files[0];
        let reader = new FileReader();

        reader.onload = function () {
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

            const numDays = formatted.length > 0 ? getDay(Math.max(..._(formatted).pluck("start"))) + 1 : 1;
            props.setNumDays(numDays);
            const maxId = _(_(formatted).pluck("id")).max();
            props.setCurrId(maxId + 1);
            fileInput.target.value = ""; //to be able to upload the same file again
        };

        reader.readAsText(file);
    }

    return (
        <div>

            <input type="file" id="upload-btn" accept=".txt" onChange={uploadFile} hidden />
            <label className="button" htmlFor="upload-btn">Upload test <img src="./images/upload_symbol.svg" alt="" /></label>
        </div>
    )
}

export default UploadButton;

