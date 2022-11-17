import React, { Component } from "react";

class UploadButton extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClick() {
  }

  render() {
    return (
      <>
      <input type="file" id="upload-btn" hidden/>
      <label for="upload-btn">Upload test <img src="./images/upload_symbol.svg" alt="" /></label>
      </>
    )
  }
}

export default UploadButton;
