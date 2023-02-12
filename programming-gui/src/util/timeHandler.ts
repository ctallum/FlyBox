
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

export { getDay, getHour, getMin, getMsTime }