/* eslint-disable no-console */
import React, { Component } from "react";
import ReactDOM from 'react-dom';
import moment from "moment-timezone";
import DownloadButton from './DownloadButton'

import Timeline, {
  TimelineMarkers,
  TimelineHeaders,
  DateHeader
} from "react-calendar-timeline";

// Using UTC because there's no need to deal with timezones in this UI
moment.tz.setDefault('Etc/UTC');

var minTime = 0; //moment().add(-6, "months").valueOf();
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

interface IProps {
  data: any;
}


function TLine(props: IProps) {
  const [groups, setGroups] = React.useState<any>([]);
  const [items, setItems] = React.useState<any>([]);
  const [imported, setImported] = React.useState<boolean>(false);

  // Ideally visibleTimeStart would begin at 0 ms, but there is a bug with React Calendar Timeline that prevents this. 1 ms shouldn't make a difference *famous last words*
  const [visibleTimeStart, setVisibleTimeStart] = React.useState<number>(moment(1).valueOf());
  const [visibleTimeEnd, setVisibleTimeEnd] = React.useState<number>(moment(1).add(1, "day").valueOf());

  React.useEffect(() => {
    const group_names = ["R", "G", "W"];
    let groupsInitial = [] as any;
    for (var i = 0; i < group_names.length; i++) {
      groupsInitial.push({
        id: i,
        title: group_names[i]
      })
    }

    if (props.data) {
      setItems(props.data)
    }
    setGroups(groupsInitial);
  }, []);




  //TODO seperate components?
  const itemRenderer = ({ item, timelineContext, itemContext, getItemProps, getResizeProps }) => {
    const { left: leftResizeProps, right: rightResizeProps } = getResizeProps();

    let backgroundColor = "";

    switch (item.group) {
      case "0":
        if (itemContext.selected || itemContext.dragging || itemContext.resizing) { backgroundColor = "#bd1c1c"; } else { backgroundColor = "#6F1111"; }
        break;
      case "1":
        if (itemContext.selected) { backgroundColor = "#2d8f15"; } else { backgroundColor = "#15430A"; }
        break;
      case "2":
        if (itemContext.selected) { backgroundColor = "#ededed"; } else { backgroundColor = "#A0A0A0"; }
        break;
      default:
        console.log(typeof (item.group))
        if (itemContext.selected) { backgroundColor = "#000000"; } else { backgroundColor = "#FFFFFF"; }
    }

    const borderColor = backgroundColor;

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


  const handleCanvasClick = (groupId, time) => {
    console.log("Canvas clicked", groupId, moment(time).format());

    let newItems = items.slice()

    newItems.push({
      id: items.length + "", // don't need to do +1 here because item IDs start at 0
      group: groupId + "",
      start: time,
      end: time + 3600000,
      itemProps: {
        "frequency": 0
      }
    });

    setItems(newItems);
  };

  const handleCanvasDoubleClick = (groupId, time) => {
    console.log("Canvas double clicked", groupId, moment(time).format());
  };

  const handleCanvasContextMenu = (group, time) => {
    console.log("Canvas context menu", group, moment(time).format());
  };

  const handleItemClick = (itemId, _, time) => {
    console.log("Clicked: " + itemId, moment(time).format());
  };

  const handleItemSelect = (itemId, _, time) => {
    console.log("Selected: " + itemId, moment(time).format());
  };

  const handleItemDoubleClick = (itemId, _, time) => {
    console.log("Double Click: " + itemId, moment(time).format());
  };

  const handleItemContextMenu = (itemId, _, time) => {
    console.log("Context Menu: " + itemId, moment(time).format());
  };

  const handleItemMove = (itemId, dragTime, newGroupOrder) => {
    const group = groups[newGroupOrder];

    setItems(items.map((item) =>
      item.id === itemId
        ? Object.assign({}, item, {
          start: dragTime,
          end: dragTime + (item.end - item.start),
          group: String(group.id)
        })
        : item
    ))

    console.log("Moved", itemId, dragTime, newGroupOrder);
  };

  const handleItemResize = (itemId, time, edge) => {
    setItems(
      items.map((item) =>
        item.id === itemId
          ? Object.assign({}, item, {
            start: edge === "left" ? time : item.start,
            end: edge === "left" ? item.end : time
          })
          : item
      )
    )

    console.log("Resized", itemId, time, edge);
  };

  // this limits the timeline to -6 months ... +6 months
  const handleTimeChange = (visibleTimeStart, visibleTimeEnd, updateScrollCanvas) => {
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

  const moveResizeValidator = (action, item, time) => {
    if (time < new Date().getTime()) {
      var newTime =
        Math.ceil(new Date().getTime() / (15 * 60 * 1000)) * (15 * 60 * 1000);
      return newTime;
    }

    return time;
  };

  const onPrevClick = () => {
    const zoom = visibleTimeEnd - visibleTimeStart;
    setVisibleTimeStart(visibleTimeStart - zoom);
    setVisibleTimeEnd(visibleTimeEnd - zoom)
  };

  const onNextClick = () => {
    const zoom = visibleTimeEnd - visibleTimeStart;
    console.log({
      visibleTimeStart: visibleTimeStart + zoom,
      visibleTimeEnd: visibleTimeEnd + zoom
    });


    setVisibleTimeStart(visibleTimeStart + zoom);
    setVisibleTimeStart(visibleTimeEnd + zoom);
  };

  const renderFirstDay = () => {
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
        dragSnap={1 * 60 * 1000} // can snap to one-minute accuracy
        itemHeightRatio={1}
        visibleTimeStart={visibleTimeStart}
        visibleTimeEnd={visibleTimeEnd}
        itemRenderer={itemRenderer}
        onCanvasClick={handleCanvasClick}
        onCanvasDoubleClick={handleCanvasDoubleClick}
        onCanvasContextMenu={handleCanvasContextMenu}
        onItemClick={handleItemClick}
        onItemSelect={handleItemSelect}
        onItemContextMenu={handleItemContextMenu}
        onItemMove={handleItemMove}
        onItemResize={handleItemResize}
        onItemDoubleClick={handleItemDoubleClick}
        buffer={1}
        onTimeChange={handleTimeChange}
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

  const renderDay = () => {
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
        dragSnap={1 * 60 * 1000} // can snap to one-minute accuracy
        itemHeightRatio={1}
        visibleTimeStart={moment(visibleTimeEnd).valueOf()}
        visibleTimeEnd={moment(visibleTimeEnd).add(1, "day").valueOf()}
        itemRenderer={itemRenderer}
        onCanvasClick={handleCanvasClick}
        onCanvasDoubleClick={handleCanvasDoubleClick}
        onCanvasContextMenu={handleCanvasContextMenu}
        onItemClick={handleItemClick}
        onItemSelect={handleItemSelect}
        onItemContextMenu={handleItemContextMenu}
        onItemMove={handleItemMove}
        onItemResize={handleItemResize}
        onItemDoubleClick={handleItemDoubleClick}
        buffer={1}
        onTimeChange={handleTimeChange}
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

  const exportItems = () => {
    console.log(items)
  }

  return <div>
    {renderFirstDay()}
    {renderDay()}
    {/* <DownloadButton data={this.state.items} /> */}
  </div>
}


export default TLine;