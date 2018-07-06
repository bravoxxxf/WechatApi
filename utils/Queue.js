// 模拟阻塞

class Queue {
    constructor(name) {
        this.list = []; // 队列
        this.cando = true;
        this.name = name || "noname";
        setInterval(this.step.bind(this), 100);
    }

    // 增加请求到队列
    addRequest(params, fn) {
        this.list.push({ params: params, fn: fn });
    }

    // 执行所有注册的函数
    step() {
        if (this.list.length > 0 && this.cando) {
            this.cando = false;
            var obj = this.list.shift()
            try {
                obj.fn(obj.params, function () {
                    this.cando = true;  // 执行完毕，才能往下执行
                    console.log(this.list.length);
                }.bind(this));
            } catch (error) {
                this.cando = true;  // 执行完毕，才能往下执行
            }


        }
    }
}

module.exports = Queue;