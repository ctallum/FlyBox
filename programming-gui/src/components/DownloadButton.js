import React, { Component } from "react";
import ReactDOM from 'react-dom';
import exportFromJSON from 'export-from-json';
/*import Timeline from './Timeline';*/

const fileName = 'FlyBoxTest'
const exportType = exportFromJSON.types.txt

class DownloadButton extends Component {

  handleClick = () => {
    const data = this.props.data;
    exportFromJSON({ data, fileName, exportType });
  }

  render() {
    return <div>
      <button onClick={this.handleClick} type="button" name="Download">Download test <img src="./images/download_symbol.svg" alt="" /></button>
    </div>
  }
}

export default DownloadButton;
