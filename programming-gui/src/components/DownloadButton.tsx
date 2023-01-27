import React, { Component } from "react";
import ReactDOM from 'react-dom';
import exportFromJSON from 'export-from-json';
/*import Timeline from './Timeline';*/

const fileName = 'FlyBoxTest'
const exportType = exportFromJSON.types.txt

function DownloadButton(props) {

  const handleClick = () => {
    const data = (props).data; //TODO
    exportFromJSON({ data, fileName, exportType });
  }

  return <div>
    <button onClick={handleClick} type="button" name="Download">
      Download test <img src="./images/download_symbol.svg" alt="" />
    </button>
  </div>
}

export default DownloadButton;
