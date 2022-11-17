import React from 'react';
import ReactDOM from 'react-dom/client';
import Timeline from './components/Timeline';
import UploadButton from './components/UploadButton';
import DownloadButton from './components/DownloadButton';
import reportWebVitals from './reportWebVitals';
import "./style.css";

var days = ReactDOM.createRoot(document.getElementById('day'));
days.render(React.createElement(
  React.StrictMode,
  null,
  React.createElement(Timeline, null)
));

var uploadButton = ReactDOM.createRoot(document.getElementById('upload-button'));
uploadButton.render(React.createElement(
  React.StrictMode,
  null,
  React.createElement(UploadButton, null)
));

var downloadButton = ReactDOM.createRoot(document.getElementById('download-button'));
downloadButton.render(React.createElement(
  React.StrictMode,
  null,
  React.createElement(DownloadButton, null)
));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();