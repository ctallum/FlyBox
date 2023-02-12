
const DAY = 86400000;
const HOUR = 3600000;
const MIN = 60000;

const getHour = (msTime: number) => {
    return new Date(msTime).getUTCHours()
}

const getMin = (msTime: number) => {
    return new Date(msTime).getUTCMinutes()
}

const getDay = (msTime: number) => {
    return Math.floor(msTime / DAY)
}

const getMsTime = (day, hour, min) => {
    return day * DAY + hour * HOUR + min * MIN
}

const getFormattedTime = (msTime) => {
    //adds leading zeroes
    return ("0" + getHour(msTime)).slice(-2) + ":" + ("0" + getMin(msTime)).slice(-2)
}

export { getDay, getHour, getMin, getMsTime, getFormattedTime }