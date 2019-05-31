module.exports = {
    todayISOFormat: ()=>{
        const baseDate = new Date()
        return baseDate.toISOString().replace(/T/, ' ').replace(/\..+/, '')
    },

    dateToISOFormat: date => {
        return date.replace(/T/, ' ').split('+')[0].split(".")[0]
    },

    addDaysTodayISOFormat: (numDay)=>{
        const baseDate = new Date()
        const ret = new Date()
        ret.setDate(baseDate.getDate() + numDay)
        return ret.toISOString().replace(/T/, ' ').replace(/\..+/, '')
    }
}