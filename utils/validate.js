// 1000~2000 的 甲方服务码
var isServiceCode = (serviceCode) => {
    if (serviceCode > 10000 && serviceCode < 19999) {
        return true;
    } else {
        return false;
    }
}
// 2-4 中文名
var isName = (val) => {
    if (!(/^[\u4E00-\u9FA5]{2,6}$/).test(val)) {
        return false;
    } else {
        return true;
    }
}

// 11位电话号码
var isPhone = (val) => {
    if (!(/^1(3|4|5|7|8)\d{9}$/).test(val)) {
        return false;
    } else {
        return true;
    }
}

module.exports = {
    isServiceCode:isServiceCode,
    isName:isName,
    isPhone:isPhone
}
