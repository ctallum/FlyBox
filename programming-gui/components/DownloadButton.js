var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React, { Component } from "react";
import ReactDOM from 'react-dom';
import exportFromJSON from 'export-from-json';
/*import Timeline from './Timeline';*/

var fileName = 'FlyBoxTest';
var exportType = exportFromJSON.types.txt;

var DownloadButton = function (_Component) {
  _inherits(DownloadButton, _Component);

  function DownloadButton() {
    var _ref;

    var _temp, _this, _ret;

    _classCallCheck(this, DownloadButton);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = DownloadButton.__proto__ || Object.getPrototypeOf(DownloadButton)).call.apply(_ref, [this].concat(args))), _this), _this.handleClick = function () {
      var data = _this.props.data;
      exportFromJSON({ data: data, fileName: fileName, exportType: exportType });
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(DownloadButton, [{
    key: 'render',
    value: function render() {
      return ReactDOM.createPortal(React.createElement(
        'div',
        null,
        React.createElement(
          'button',
          { onClick: this.handleClick, type: 'button', name: 'Download' },
          'Download test ',
          React.createElement('img', { src: './images/download_symbol.svg', alt: '' })
        )
      ), document.getElementById('download-button'));
    }
  }]);

  return DownloadButton;
}(Component);

export default DownloadButton;