// "2018-04-19 11:33:37"

var date2timeStamp = (date) => {
    return date.getFullYear()
        + '-' + (((date.getMonth() + 1) > 9) ? (date.getMonth() + 1) : ('0' + (date.getMonth() + 1)))
        + '-' + (date.getDate() > 9 ? date.getDate() : ('0' + date.getDate()))
        + ' '
        + (date.getHours() > 9 ? date.getHours() : ('0' + date.getHours()))
        + ':' + (date.getMinutes() > 9 ? date.getMinutes() : ('0' + date.getMinutes()))
        + ':' + (date.getSeconds() > 9 ? date.getSeconds() : ('0' + date.getSeconds()));

}


// 格式1："2018/1/21 下午6:59:48"
var now = () => {
    return (new Date()).toLocaleString();
}

// 格式2：2018.1.21
var now1 = () => {
    var date = new Date()
    var year = date.getYear() - 100 + 2000;
    var mo = date.getMonth() + 1;
    var da = date.getDate()
    var dateStr = year.toString() + "." + mo.toString() + "." + da.toString();
    return dateStr;
}

// 格式3：2018121
var now2 = () => {

    var date = new Date()
    var year = date.getYear() - 100 + 2000;
    var mo = date.getMonth() + 1;
    var da = date.getDate()
    var dateStr = year.toString() + mo.toString() + da.toString();
    return dateStr;
}
module.exports = {
    date2timeStamp: date2timeStamp,
    now: now,
    now1: now1
};