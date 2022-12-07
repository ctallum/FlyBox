import React from 'react';
import ReactDOM from 'react-dom/client';
import Timeline from './components/Timeline';
import UploadButton from './components/UploadButton';
import DownloadButton from './components/DownloadButton';
import reportWebVitals from './reportWebVitals';
import "./style.css";

/*const days = ReactDOM.createRoot(document.getElementById('day'));
days.render(
  <React.StrictMode>
    <Timeline>
    </Timeline>
  </React.StrictMode>
);*/

const uploadButton = ReactDOM.createRoot(document.getElementById('upload-button'));
uploadButton.render(
  <React.StrictMode>
      <UploadButton />
  </React.StrictMode>
);

/*const downloadButton = ReactDOM.createRoot(document.getElementById('download-button'));
downloadButton.render(
  <React.StrictMode>
      <DownloadButton />
  </React.StrictMode>
);*/

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
