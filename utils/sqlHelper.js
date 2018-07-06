/**
 * 
 * author: Xiaofei Xie
 * create data : 2017.3.2
 * 
 */

var SQLHelper = function (table) {
    this.table = table
}

/**
 * Query function
 * 
 * @param {String} sql 
 * @param {Array} dataList 
 * 
 * @return {Object}
 */
SQLHelper.prototype.query = function (sql, dataList) {

    var p = new Promise(function (resolve, reject) {
        dbPool.getConnection(function (err, connection) {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, dataList, function (error, results, fields) {
                    connection.release();
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
            }
        })
    })

    return p;
}


/**
 * @param {Object} option 
 * @param {Object} option.where  Query condition. Eg: {id:1, name:"haha"}
 * @param {String} option.orderby  
 * @param {String} option.sort  
 * @param {Number} option.offset  
 * @param {Number} option.limit  
 * 
 * @return {Array}
 */
SQLHelper.prototype.select = async function (option) {
    var sql1 = 'SELECT * FROM ' + this.table + ' ';     // SELECT * FROM table where `score` = 1 order by `score` limite 0,10;
    var sql2 = '';
    var sql3 = option.orderby ? ('order by ' + option.orderby + ' ' + option.sort + ' ') : ('');
    var sql4 = (option.offset > -1 && option.limit > 0) ? ('limit ' + option.offset + ',' + option.limit) : ('');

    var dataList = [];
    var sql2List = [];
    for (var i in option.where) {
        sql2List.push('`' + i + '` = ?');
        dataList.push(option.where[i]);
    }

    sql2 = sql2List.length ? (('where ' + sql2List.join(' and ')) + ' ') : ('');

    var sql = sql1 + sql2 + sql3 + sql4;

    var results = await this.query(sql, dataList);

    return results;
}

/**
 * @param {Object} option 
 * @param {Object} option.where
 * @param {String} option.orderby  
 * @param {String} option.sort  
 * @param {Number} option.offset  
 * @param {Number} option.limit  
 * 
 * @return {Array}
 */
SQLHelper.prototype.selectLike = async function (option) {
    var sql1 = 'SELECT * FROM ' + this.table + ' '; // SELECT * FROM table where `score` like "%xx%";
    var sql2 = '';
    var sql3 = option.orderby ? ('order by ' + option.orderby + ' ' + option.sort + ' ') : ('');
    var sql4 = (option.offset > -1 && option.limit > 0) ? ('limit ' + option.offset + ',' + option.limit) : ('');

    var dataList = [];
    var sql2List = [];
    for (var i in option.where) {
        sql2List.push('`' + i + '` like ?');
        dataList.push("%" + option.where[i] + "%");
    }

    sql2 = sql2List.length ? (('where ' + sql2List.join(' and ')) + ' ') : ('');

    var sql = sql1 + sql2 + sql3 + sql4;

    var results = await this.query(sql, dataList);

    return results;
}

/**
 * @param {Object} option 
 * @param {Object} option.data   
 * 
 * @return {Array}
 */
SQLHelper.prototype.insert = async function (option) {
    var sql1 = 'INSERT INTO ' + this.table + ' ';

    var sql2List = [];
    var dataList = [];
    var sql3List = [];

    for (let i in data) {
        sql2List.push('`' + i + '`');
        dataList.push(option.data[i]);
        sql3List.push('?');
    }

    var sql2 = '(' + sql2List.join(' , ') + ')';
    var sql3 = '(' + sql3List.join(', ') + ')';
    var sql = sql1 + sql2 + ' VALUES ' + sql3;
    var results = await this.query(sql, dataList);

    return results;
}

/**
 * @param {Object} option 
 * @param {Object} option.where  Eg:{id:1}
 * @param {Object} option.data   Eg:{name:"haha", age:"18"}
 * 
 * @return {Array}
 */
SQLHelper.prototype.update = async function (option) {
    var sql1 = 'UPDATE `' + this.table + '` SET ';
    var sql2List = [];
    var dataList = []; // 原始数据

    for (var i in option.data) {
        sql2List.push('`' + i + '` = ?');
        dataList.push(option.data[i]);
    }

    var sql2 = sql2List.join(', ') + ' where ';

    var sql2List2 = [];

    for (var i in option.where) {
        sql2List2.push('`' + i + '`=?');
        dataList.push(option.where[i]);
    }

    var sql3 = sql2List2.join(' and ')

    var sql = sql1 + sql2 + sql3;

    var results = await this.query(sql, dataList);

    return results;
}

/**
 * @param {Object} option 
 * @param {Object} option.where
 * 
 * @return {Array}
 */
SQLHelper.prototype.delete = async function (option) {
    var sql1 = 'DELETE FROM ' + this.table + ' ';
    var sql2 = '';

    var dataList = [];
    var sql2List = [];

    for (var i in where) {
        sql2List.push('`' + i + '`=?');
        dataList.push(where[i]);
    }

    sql2 = '(' + sql2List.join(' and ') + ')'
    var sql = sql1 + 'where ' + sql2;

    var results = await this.query(sql, dataList);

    return results;
}

/**
 * @param {Object} option 
 * @param {Object} option.where
 * 
 * @return {Bool}
 */
SQLHelper.prototype.isExist = async function (option) {
    var results = await this.asyncSelect(option);
    if (results.length > 0) {
        return true;
    } else {
        return false;
    }
}

/**
 * @param {Object} option 
 * @param {Object} option.where
 * 
 * @return {Number}
 */
SQLHelper.prototype.count = async function (option) {
    var sql1 = "select count(*)num from " + this.table;
    var sql2 = '';
    var dataList = [];
    var sqlList = [];
    for (var i in option.where) {
        sqlList.push('`' + i + '` = ?');
        dataList.push(option.where[i]);
    }

    sql2 = sqlList.length ? ((' where ' + sqlList.join(' and ')) + ' ') : ('');
    var sql = sql1 + sql2;

    var results = await this.query(sql, dataList);

    return results[0].num;
}

/**
 * @param {Object} option 
 * @param {Object} option.where
 * 
 * @return {Number}
 */
SQLHelper.prototype.likeCount = async function (option) {
    var sql1 = "select count(*)num from " + this.table;
    var sql2 = '';
    var dataList = [];
    var sqlList = [];

    for (var i in option.where) {
        sqlList.push('`' + i + '` like ?');
        dataList.push("%" + option.where[i] + "%");
    }

    sql2 = sqlList.length ? ((' where ' + sqlList.join(' and ')) + ' ') : ('');
    var sql = sql1 + sql2;

    var results = await this.query(sql, dataList);

    return results;
}

/**
 * @return {Array}
 */
SQLHelper.prototype.comments = async function () {
    var results = await this.query("show full columns from " + this.table);
    return results
}

module.exports = SQLHelper;