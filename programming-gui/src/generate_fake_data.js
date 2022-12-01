import faker from "faker";
import randomColor from "randomcolor";
import moment from "moment";

export default function(groupCount = 30, itemCount = 1000, daysInPast = 30) {
  let randomSeed = Math.floor(Math.random() * 1000);
  let groups = [];
  for (let i = 0; i < groupCount; i++) {
    groups.push({
      id: `${i + 1}`,
      title: faker.name.firstName(),
      rightTitle: faker.name.lastName(),
      bgColor: randomColor({ luminosity: "light", seed: randomSeed + i })
    });
  }

  let items = [];
  for (let i = 0; i < itemCount; i++) {
    const startDate = faker.date.past(0.05, '1970-01-05T00:00:00.000Z');
      //faker.date.recent(daysInPast).valueOf() + daysInPast * 0.3 * 86400 * 1000;
    const startValue =
      Math.floor(moment(startDate).valueOf() / 10000000) * 10000000;
    const endValue = moment(
      startDate + faker.random.number({ min: 2, max: 20 }) * 15 * 60 * 1000
    ).valueOf();

    const group = faker.random.number({ min: 0, max: groups.length -1});

    items.push({
      id: i + "",
      group: group + "",
      //title: faker.hacker.phrase(),
      start: startValue,
      end: endValue,
      //canMove: true, //startValue > new Date().getTime(),
      //canResize: 'both', /*
        /*startValue > new Date().getTime()
          ? endValue > new Date().getTime()
            ? "both"
            : "left"
          : endValue > new Date().getTime()
            ? "right"
            : false,*/
      /*className:
        moment(startDate).day() === 6 || moment(startDate).day() === 0
          ? "item-weekend"
          : "",*/
      //bgColor: group == 0 ? '#6F1111' : (group==1 ? '#15430A' : (group==2 ? '#A0A0A0' : '#ffffff')),
      //selectedBgColor: group == 0 ? '#bd1c1c' : (group==1 ? '#2d8f15' : (group==2 ? '#ededed' : '#000000')),
      /*color: randomColor({ luminosity: "dark", seed: randomSeed + i }),*/
      itemProps: {
        "frequency": 0
        //"data-tip": faker.hacker.phrase()
      }
    });
  }

  items = items.sort((a, b) => b - a);

  return { groups, items };
}
