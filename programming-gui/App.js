var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint-disable no-console */
import React, { Component } from "react";
import moment from "moment";

import Timeline, { TimelineMarkers, TimelineHeaders, TodayMarker, CustomMarker, CursorMarker, CustomHeader, SidebarHeader, DateHeader } from "react-calendar-timeline";

import generateFakeData from "./generate_fake_data";

var minTime = moment().add(-6, "months").valueOf();
var maxTime = moment().add(6, "months").valueOf();

var keys = {
  groupIdKey: "id",
  groupTitleKey: "title",
  groupRightTitleKey: "rightTitle",
  itemIdKey: "id",
  itemTitleKey: "title",
  itemDivTitleKey: "title",
  itemGroupKey: "group",
  itemTimeStartKey: "start",
  itemTimeEndKey: "end"
};

var App = function (_Component) {
  _inherits(App, _Component);

  function App(props) {
    _classCallCheck(this, App);

    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this, props));

    _initialiseProps.call(_this);

    var _generateFakeData = generateFakeData(3, 100),
        jkadsfjkasjkdfld = _generateFakeData.jkadsfjkasjkdfld,
        items = _generateFakeData.items;

    var group_names = ["R", "G", "W"];
    var groups = [];
    for (var i = 0; i < group_names.length; i++) {
      groups.push({
        id: i,
        title: group_names[i]
      });
    }

    var visibleTimeStart = moment().startOf("day").valueOf();
    var visibleTimeEnd = moment().startOf("day").add(1, "day").valueOf();

    _this.state = {
      groups: groups,
      items: items,
      visibleTimeStart: visibleTimeStart,
      visibleTimeEnd: visibleTimeEnd
    };
    return _this;
  }

  // this limits the timeline to -6 months ... +6 months


  _createClass(App, [{
    key: "renderFirstDay",
    value: function renderFirstDay() {
      var _state = this.state,
          groups = _state.groups,
          items = _state.items,
          visibleTimeStart = _state.visibleTimeStart,
          visibleTimeEnd = _state.visibleTimeEnd;


      return React.createElement(
        Timeline,
        {
          groups: groups,
          items: items,
          keys: keys,
          sidebarWidth: 150,
          sidebarContent: React.createElement(
            "div",
            null,
            "Above The Left"
          ),
          lineHeight: 40,
          minResizeWidth: 0,
          canMove: true,
          canResize: "both",
          canSelect: true,
          itemsSorted: true,
          itemTouchSendsClick: false,
          stackItems: true,
          itemHeightRatio: 1,
          visibleTimeStart: visibleTimeStart,
          visibleTimeEnd: visibleTimeEnd,
          itemRenderer: this.itemRenderer,
          onCanvasClick: this.handleCanvasClick,
          onCanvasDoubleClick: this.handleCanvasDoubleClick,
          onCanvasContextMenu: this.handleCanvasContextMenu,
          onItemClick: this.handleItemClick,
          onItemSelect: this.handleItemSelect,
          onItemContextMenu: this.handleItemContextMenu,
          onItemMove: this.handleItemMove,
          onItemResize: this.handleItemResize,
          onItemDoubleClick: this.handleItemDoubleClick,
          buffer: 1,
          onTimeChange: this.handleTimeChange
          // moveResizeValidator={this.moveResizeValidator}
        },
        React.createElement(TimelineMarkers, null),
        React.createElement(
          TimelineHeaders,
          null,
          React.createElement(DateHeader, {
            unit: "hour",
            labelFormat: "HH"
          })
        )
      );
    }
  }, {
    key: "renderDay",
    value: function renderDay() {
      var _state2 = this.state,
          groups = _state2.groups,
          items = _state2.items,
          visibleTimeStart = _state2.visibleTimeStart,
          visibleTimeEnd = _state2.visibleTimeEnd;


      return React.createElement(
        Timeline,
        {
          groups: groups,
          items: items,
          keys: keys,
          sidebarWidth: 150,
          sidebarContent: React.createElement(
            "div",
            null,
            "Above The Left"
          ),
          lineHeight: 40,
          minResizeWidth: 0,
          canMove: true,
          canResize: "both",
          canSelect: true,
          itemsSorted: true,
          itemTouchSendsClick: false,
          stackItems: true,
          itemHeightRatio: 1,
          visibleTimeStart: moment().startOf("day").add(1, "day").valueOf(),
          visibleTimeEnd: moment().startOf("day").add(2, "day").valueOf(),
          itemRenderer: this.itemRenderer,
          onCanvasClick: this.handleCanvasClick,
          onCanvasDoubleClick: this.handleCanvasDoubleClick,
          onCanvasContextMenu: this.handleCanvasContextMenu,
          onItemClick: this.handleItemClick,
          onItemSelect: this.handleItemSelect,
          onItemContextMenu: this.handleItemContextMenu,
          onItemMove: this.handleItemMove,
          onItemResize: this.handleItemResize,
          onItemDoubleClick: this.handleItemDoubleClick,
          buffer: 1,
          onTimeChange: this.handleTimeChange
          // moveResizeValidator={this.moveResizeValidator}
        },
        React.createElement(TimelineMarkers, null),
        React.createElement(
          TimelineHeaders,
          null,
          React.createElement(DateHeader, {
            unit: "hour",
            labelFormat: "HH",
            height: 0 /* not a great solution but it'll work*/
          })
        )
      );
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        this.renderFirstDay(),
        this.renderDay()
      );
    }
  }]);

  return App;
}(Component);

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.itemRenderer = function (_ref) {
    var item = _ref.item,
        timelineContext = _ref.timelineContext,
        itemContext = _ref.itemContext,
        getItemProps = _ref.getItemProps,
        getResizeProps = _ref.getResizeProps;

    var _getResizeProps = getResizeProps(),
        leftResizeProps = _getResizeProps.left,
        rightResizeProps = _getResizeProps.right;

    var backgroundColor = itemContext.selected ? item.selectedBgColor /*itemContext.dragging ? '#bd1c1c' : item.selectedBgColor*/ : item.bgColor;
    /*const borderColor = itemContext.resizing ? "red" : /*item.color"#6F1111";*/
    var borderColor = itemContext.selected ? itemContext.dragging ? "orange" : item.selectedBgColor : item.bgColor;
    return React.createElement(
      "div",
      getItemProps({
        style: {
          backgroundColor: backgroundColor,
          color: /*item.color*/'black',
          borderColor: borderColor,
          borderStyle: "solid",
          borderWidth: itemContext.dragging ? 0 : 1,
          borderRadius: 3,
          borderLeftWidth: itemContext.selected ? 5 : 1,
          borderRightWidth: itemContext.selected ? 5 : 1
        },
        onMouseDown: function onMouseDown() {
          console.log("on item click", item);
        }
      }),
      itemContext.useResizeHandle ? React.createElement("div", leftResizeProps) : null,
      React.createElement(
        "div",
        {
          style: {
            height: itemContext.dimensions.height,
            overflow: "hidden",
            paddingLeft: 3,
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }
        },
        itemContext.title
      ),
      itemContext.useResizeHandle ? React.createElement("div", rightResizeProps) : null
    );
  };

  this.handleCanvasClick = function (groupId, time) {
    console.log("Canvas clicked", groupId, moment(time).format());
  };

  this.handleCanvasDoubleClick = function (groupId, time) {
    console.log("Canvas double clicked", groupId, moment(time).format());
  };

  this.handleCanvasContextMenu = function (group, time) {
    console.log("Canvas context menu", group, moment(time).format());
  };

  this.handleItemClick = function (itemId, _, time) {
    console.log("Clicked: " + itemId, moment(time).format());
  };

  this.handleItemSelect = function (itemId, _, time) {
    console.log("Selected: " + itemId, moment(time).format());
  };

  this.handleItemDoubleClick = function (itemId, _, time) {
    console.log("Double Click: " + itemId, moment(time).format());
  };

  this.handleItemContextMenu = function (itemId, _, time) {
    console.log("Context Menu: " + itemId, moment(time).format());
  };

  this.handleItemMove = function (itemId, dragTime, newGroupOrder) {
    var _state3 = _this2.state,
        items = _state3.items,
        groups = _state3.groups;


    var group = groups[newGroupOrder];

    _this2.setState({
      items: items.map(function (item) {
        return item.id === itemId ? Object.assign({}, item, {
          start: dragTime,
          end: dragTime + (item.end - item.start),
          group: group.id
        }) : item;
      })
    });

    console.log("Moved", itemId, dragTime, newGroupOrder);
  };

  this.handleItemResize = function (itemId, time, edge) {
    var items = _this2.state.items;


    _this2.setState({
      items: items.map(function (item) {
        return item.id === itemId ? Object.assign({}, item, {
          start: edge === "left" ? time : item.start,
          end: edge === "left" ? item.end : time
        }) : item;
      })
    });

    console.log("Resized", itemId, time, edge);
  };

  this.handleTimeChange = function (visibleTimeStart, visibleTimeEnd, updateScrollCanvas) {
    if (visibleTimeStart < minTime && visibleTimeEnd > maxTime) {
      updateScrollCanvas(minTime, maxTime);
    } else if (visibleTimeStart < minTime) {
      updateScrollCanvas(minTime, minTime + (visibleTimeEnd - visibleTimeStart));
    } else if (visibleTimeEnd > maxTime) {
      updateScrollCanvas(maxTime - (visibleTimeEnd - visibleTimeStart), maxTime);
    } else {
      updateScrollCanvas(visibleTimeStart, visibleTimeEnd);
    }
  };

  this.moveResizeValidator = function (action, item, time) {
    if (time < new Date().getTime()) {
      var newTime = Math.ceil(new Date().getTime() / (15 * 60 * 1000)) * (15 * 60 * 1000);
      return newTime;
    }

    return time;
  };

  this.onPrevClick = function () {
    _this2.setState(function (state) {
      var zoom = state.visibleTimeEnd - state.visibleTimeStart;
      return {
        visibleTimeStart: state.visibleTimeStart - zoom,
        visibleTimeEnd: state.visibleTimeEnd - zoom
      };
    });
  };

  this.onNextClick = function () {
    _this2.setState(function (state) {
      var zoom = state.visibleTimeEnd - state.visibleTimeStart;
      console.log({
        visibleTimeStart: state.visibleTimeStart + zoom,
        visibleTimeEnd: state.visibleTimeEnd + zoom
      });
      return {
        visibleTimeStart: state.visibleTimeStart + zoom,
        visibleTimeEnd: state.visibleTimeEnd + zoom
      };
    });
  };
};

export default App;