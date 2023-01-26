import React, { Component } from "react";
import ReactDOM from 'react-dom';
import TLine from './Timeline'

class UploadButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //data: ["bleep bleep"],
    };
  }

  uploadFile = (fileInput) => {

    const file = fileInput.target.files[0];
    let reader = new FileReader();

    reader.onload = function () {
      let data = reader.result;
      this.setState({
        data: JSON.parse(data),
      })
    }.bind(this);

    reader.readAsText(file);
  }

  render() {
    return (
      <div>
        <input type="file" id="upload-btn" accept=".txt" onChange={this.uploadFile} hidden />
        <label for="upload-btn">Upload test <img src="./images/upload_symbol.svg" alt="" /></label>
      </div>
    )
  }
}

export default UploadButton;
