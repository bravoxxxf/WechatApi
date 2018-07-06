/**
 * 根据字段名，消除数据中的冗余数据
 * @param {array} data 
 * @param {string} field 
 */
var clearRedundantField = (data, field) => {
    var array = [];


    for (let i = 0; i < data.length; i++) {
        let fieldValue = data[i][field];

        let isNew = true;
        for (let j = 0; j < array.length; j++) {
            if (array[j][field] === data[i][field]) { // 名字相同
                delete data[i][field];
                array[j].data.push(data[i]);
                isNew = false;
            }
        }

        if (!isNew) {
            continue;
        } else {
            let obj = {};
            obj[field] = data[i][field];
            delete data[i][field];
            obj['data'] = [data[i]];
            array.push(obj);
        }


    }

    return array;
}

module.exports = clearRedundantField;