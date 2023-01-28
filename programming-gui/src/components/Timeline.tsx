/* eslint-disable no-console */
import React, { Component } from "react";
import moment from "moment-timezone";
import Day from "./Day";

// Using UTC because there's no need to deal with timezones in this UI
moment.tz.setDefault('Etc/UTC');

interface IProps {
  data: any;
  setData: (data: any) => void
}

function TLine(props: IProps) {
  const [groups, setGroups] = React.useState<any>([]);
  const [imported, setImported] = React.useState<boolean>(false);

  // Ideally visibleTimeStart would begin at 0 ms, but there is a bug with React Calendar Timeline that prevents this. 1 ms shouldn't make a difference *famous last words*

  const items = props.data || [];

  React.useEffect(() => {
    const group_names = ["R", "G", "W"];
    let groupsInitial = [] as any;
    for (let i = 0; i < group_names.length; i++) {
      groupsInitial.push({
        id: i,
        title: group_names[i]
      })
    }
    setGroups(groupsInitial);
  }, []);



  return <div>
    <Day items={items} groups={groups} setData={props.setData} dayNumber={0} />
    <Day items={items} groups={groups} setData={props.setData} dayNumber={1} />
  </div>
}


export default TLine;