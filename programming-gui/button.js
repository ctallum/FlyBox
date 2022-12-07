import React, { Component } from "react";

var App = function App() {
  return React.createElement(
    "div",
    null,
    React.createElement(
      "button",
      { type: "button" },
      "Click Me"
    )
  );
};

export default App;