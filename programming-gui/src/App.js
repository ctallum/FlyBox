/* eslint-disable no-console */
import React, { Component } from "react";
import moment from "moment";

import Timeline, {
  TimelineMarkers,
  TimelineHeaders,
  TodayMarker,
  CustomMarker,
  CursorMarker,
  CustomHeader,
  SidebarHeader,
  DateHeader
} from "react-calendar-timeline";

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

export default class App extends Component {
  constructor(props) {
    super(props);

    const { jkadsfjkasjkdfld, items } = generateFakeData(3,100);

    var group_names = ["R", "G", "W"];
    var groups = [];
    for (var i = 0; i < group_names.length; i++) {
      groups.push({
        id: i,
        title: group_names[i]
      })
    }

    const visibleTimeStart = moment().startOf("day").valueOf();
    const visibleTimeEnd = moment().startOf("day").add(1, "day").valueOf();

    this.state = {
      groups,
      items,
      visibleTimeStart,
      visibleTimeEnd
    };
  }

  itemRenderer = ({ item, timelineContext, itemContext, getItemProps, getResizeProps }) => {
    const { left: leftResizeProps, right: rightResizeProps } = getResizeProps();
    const backgroundColor = itemContext.selected ? (item.selectedBgColor/*itemContext.dragging ? '#bd1c1c' : item.selectedBgColor*/) : item.bgColor;
    /*const borderColor = itemContext.resizing ? "red" : /*item.color"#6F1111";*/
    const borderColor = itemContext.selected ? (itemContext.dragging ? "orange" : item.selectedBgColor) : item.bgColor;
    return (
      <div
        {...getItemProps({
          style: {
            backgroundColor,
            color: /*item.color*/'black',
            borderColor,
            borderStyle: "solid",
            borderWidth: itemContext.dragging ? 0 : 1,
            borderRadius: 3,
            borderLeftWidth: itemContext.selected ? 5 : 1,
            borderRightWidth: itemContext.selected ? 5 : 1
          },
          onMouseDown: () => {
            console.log("on item click", item);
          }
        })}
      >
        {itemContext.useResizeHandle ? <div {...leftResizeProps} /> : null}

        <div
          style={{
            height: itemContext.dimensions.height,
            overflow: "hidden",
            paddingLeft: 3,
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}
        >
          {itemContext.title}
        </div>

        {itemContext.useResizeHandle ? <div {...rightResizeProps} /> : null}
      </div>
    );
  };


  handleCanvasClick = (groupId, time) => {
    console.log("Canvas clicked", groupId, moment(time).format());
  };

  handleCanvasDoubleClick = (groupId, time) => {
    console.log("Canvas double clicked", groupId, moment(time).format());
  };

  handleCanvasContextMenu = (group, time) => {
    console.log("Canvas context menu", group, moment(time).format());
  };

  handleItemClick = (itemId, _, time) => {
    console.log("Clicked: " + itemId, moment(time).format());
  };

  handleItemSelect = (itemId, _, time) => {
    console.log("Selected: " + itemId, moment(time).format());
  };

  handleItemDoubleClick = (itemId, _, time) => {
    console.log("Double Click: " + itemId, moment(time).format());
  };

  handleItemContextMenu = (itemId, _, time) => {
    console.log("Context Menu: " + itemId, moment(time).format());
  };

  handleItemMove = (itemId, dragTime, newGroupOrder) => {
    const { items, groups } = this.state;

    const group = groups[newGroupOrder];

    this.setState({
      items: items.map((item) =>
        item.id === itemId
          ? Object.assign({}, item, {
              start: dragTime,
              end: dragTime + (item.end - item.start),
              group: group.id
            })
          : item
      )
    });

    console.log("Moved", itemId, dragTime, newGroupOrder);
  };

  handleItemResize = (itemId, time, edge) => {
    const { items } = this.state;

    this.setState({
      items: items.map((item) =>
        item.id === itemId
          ? Object.assign({}, item, {
              start: edge === "left" ? time : item.start,
              end: edge === "left" ? item.end : time
            })
          : item
      )
    });

    console.log("Resized", itemId, time, edge);
  };

  // this limits the timeline to -6 months ... +6 months
  handleTimeChange = (visibleTimeStart, visibleTimeEnd, updateScrollCanvas) => {
    if (visibleTimeStart < minTime && visibleTimeEnd > maxTime) {
      updateScrollCanvas(minTime, maxTime);
    } else if (visibleTimeStart < minTime) {
      updateScrollCanvas(
        minTime,
        minTime + (visibleTimeEnd - visibleTimeStart)
      );
    } else if (visibleTimeEnd > maxTime) {
      updateScrollCanvas(
        maxTime - (visibleTimeEnd - visibleTimeStart),
        maxTime
      );
    } else {
      updateScrollCanvas(visibleTimeStart, visibleTimeEnd);
    }
  };

  moveResizeValidator = (action, item, time) => {
    if (time < new Date().getTime()) {
      var newTime =
        Math.ceil(new Date().getTime() / (15 * 60 * 1000)) * (15 * 60 * 1000);
      return newTime;
    }

    return time;
  };

  onPrevClick = () => {
    this.setState((state) => {
      const zoom = state.visibleTimeEnd - state.visibleTimeStart;
      return {
        visibleTimeStart: state.visibleTimeStart - zoom,
        visibleTimeEnd: state.visibleTimeEnd - zoom
      };
    });
  };

  onNextClick = () => {
    this.setState((state) => {
      const zoom = state.visibleTimeEnd - state.visibleTimeStart;
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

  renderFirstDay() {
    const { groups, items, visibleTimeStart, visibleTimeEnd } = this.state;

    return (
        <Timeline
          groups={groups}
          items={items}
          keys={keys}
          sidebarWidth={150}
          sidebarContent={<div>Above The Left</div>}
          lineHeight={40}
          minResizeWidth={0}
          canMove
          canResize="both"
          canSelect
          itemsSorted
          itemTouchSendsClick={false}
          stackItems
          itemHeightRatio={1}
          visibleTimeStart={visibleTimeStart}
          visibleTimeEnd={visibleTimeEnd}
          itemRenderer={this.itemRenderer}
          onCanvasClick={this.handleCanvasClick}
          onCanvasDoubleClick={this.handleCanvasDoubleClick}
          onCanvasContextMenu={this.handleCanvasContextMenu}
          onItemClick={this.handleItemClick}
          onItemSelect={this.handleItemSelect}
          onItemContextMenu={this.handleItemContextMenu}
          onItemMove={this.handleItemMove}
          onItemResize={this.handleItemResize}
          onItemDoubleClick={this.handleItemDoubleClick}
          buffer={1}
          onTimeChange={this.handleTimeChange}
          // moveResizeValidator={this.moveResizeValidator}
        >
          <TimelineMarkers>
          </TimelineMarkers>
          <TimelineHeaders>
            <DateHeader
              unit="hour"
              labelFormat="HH"
            />
          </TimelineHeaders>
        </Timeline>
    );
  }

  renderDay() {
    const { groups, items, visibleTimeStart, visibleTimeEnd } = this.state;

    return (
        <Timeline
          groups={groups}
          items={items}
          keys={keys}
          sidebarWidth={150}
          sidebarContent={<div>Above The Left</div>}
          lineHeight={40}
          minResizeWidth={0}
          canMove
          canResize="both"
          canSelect
          itemsSorted
          itemTouchSendsClick={false}
          stackItems
          itemHeightRatio={1}
          visibleTimeStart={moment().startOf("day").add(1, "day").valueOf()}
          visibleTimeEnd={moment().startOf("day").add(2, "day").valueOf()}
          itemRenderer={this.itemRenderer}
          onCanvasClick={this.handleCanvasClick}
          onCanvasDoubleClick={this.handleCanvasDoubleClick}
          onCanvasContextMenu={this.handleCanvasContextMenu}
          onItemClick={this.handleItemClick}
          onItemSelect={this.handleItemSelect}
          onItemContextMenu={this.handleItemContextMenu}
          onItemMove={this.handleItemMove}
          onItemResize={this.handleItemResize}
          onItemDoubleClick={this.handleItemDoubleClick}
          buffer={1}
          onTimeChange={this.handleTimeChange}
          // moveResizeValidator={this.moveResizeValidator}
        >
          <TimelineMarkers>
          </TimelineMarkers>
          <TimelineHeaders>
            <DateHeader
              unit="hour"
              labelFormat="HH"
              height={0} /* not a great solution but it'll work*/
            />
          </TimelineHeaders>
        </Timeline>
    );
  }

  render() {
    return (
      <div>
        {this.renderFirstDay()}
        {this.renderDay()}
      </div>
    )
  }
}