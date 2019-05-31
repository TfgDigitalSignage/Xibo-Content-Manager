module.exports = {
    todayISOFormat: ()=>{
        const baseDate = new Date()
        return baseDate.toISOString().replace(/T/, ' ').replace(/\..+/, '')
    },

    dateToISOFormat: date => {
        return date.replace(/T/, ' ').split('+')[0].split(".")[0]
    },

    addHoursToISOFormat: (date, hoursToAdd) => {
        const datePart = date.split(' ')
        const time = datePart[1].split(':')
        let hoursInt = parseInt(time[0]) + hoursToAdd
        return datePart[0] + " " + hoursInt + ":" + time[1] + ":" + time[2]
    },
    addDaysTodayISOFormat: (numDay)=>{
        const baseDate = new Date()
        const ret = new Date()
        ret.setDate(baseDate.getDate() + numDay)
        return ret.toISOString().replace(/T/, ' ').replace(/\..+/, '')
    }
}