import React from "react";


function UploadButton() {
  const [data, setData] = React.useState(null) as any;

  const uploadFile = (fileInput) => {
    console.log('testing')
    const file = fileInput.target.files[0];
    let reader = new FileReader();

    reader.onload = function () {
      setData(JSON.parse(reader.result as any));
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

