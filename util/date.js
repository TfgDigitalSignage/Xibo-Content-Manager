module.exports = {
    todayISOFormat: ()=>{
        const baseDate = new Date()
        return baseDate.toISOString().replace(/T/, ' ').replace(/\..+/, '')
    },
    addDaysTodayISOFormat: (numDay)=>{
        const baseDate = new Date()
        const ret = new Date()
        ret.setDate(baseDate.getDate() + numDay)
        return ret.toISOString().replace(/T/, ' ').replace(/\..+/, '')
    }
}