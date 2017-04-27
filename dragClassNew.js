//new Drag(ele).on('selfdragstart',increaseZIndex)
function Emitter(){}
Emitter.prototype.on = function (type,fn) {
    if(!this[type]){
        this[type] = [];
    }
    var a = this[type];
    for(var i=0;i<0;i++){
        if(a[i] === fn){
            return;
        }
    }
    a.push(fn);
    return this;//为了链式写法
};
Emitter.prototype.off = function (type,fn) {
    var a = this[type];
    if(a && a.length){
        for(var i=0;i< a.length;i++){
            if(a[i] === fn){
                a[i] = null;
                break;
            }
        }
    }
    return this;//为了链式写法
};
Emitter.prototype.run = function (type,e) {
    var a = this[type];
    if(a && a.length){
        for(var i=0;i< a.length;i++){
            if(typeof a[i]==='function'){
                a[i].call(this,e);
            }else{
                a.splice(i,1);
                i--;
            }
        }
    }
};
function Drag(ele){
    this.element = ele;
    this.l = null;
    this.t = null;
    var that = this;
    this.DOWN = function (e) {
        that.down(e);
    };
    this.MOVE = function (e) {
        that.move(e);
    };
    this.UP = function (e) {
        that.up(e);
    };
    on(this.element,'mousedown',this.DOWN);
}
Drag.prototype = new Emitter();
Drag.prototype.constructor = Drag;

Drag.prototype.down = function (e) {
    //this => new Drag()
    this.l = e.pageX - this.element.offsetLeft;
    this.t = e.pageY - this.element.offsetTop;
    if(this.element.setCaptur){
        this.element.setCapture();
        on(this.element,'mousemove',this.MOVE);
        on(this.element,'mouseup',this.UP);
    }else{
        on(document,'mousemove',this.MOVE);
        on(document,'mouseup',this.UP);
    }
    //我准备开始拖拽了 =>广播通知 =>那些函数订阅过这个事那么就有可以在这个时刻执行了
    this.run('selfdragstart',e)
};

Drag.prototype.move = function (e) {
    var l = e.pageX - this.l;
    var t = e.pageY - this.t;
    var minL = 0, minT = 0;
    var maxL = (document.documentElement.clientWidth || document.body.clientWidth) - this.element.offsetWidth;
    var maxT = (document.documentElement.clientHeight || document.body.clientHeight) - this.element.offsetHeight;
    l = l < minL ? minL : l > maxL ? maxL : l;
    t = t < minT ? minT : t > maxT ? maxT : t;
    this.element.style.left = l + 'px';
    this.element.style.top = t + 'px';
    e.preventDefault();
    //move方法在执行的时候，那一定在拖拽的过程中。那么谁订阅了拖拽中的事件，在现在该出发了；
    this.run('selfdraging',e);
};
Drag.prototype.up = function (e) {
    if(this.element.releaseCapture){
        this.element.releaseCapture();
        off(this.element,'mousemove',this.MOVE);
        off(this.element,'mouseup',this.UP);
    }else{
        off(document,'mousemove',this.MOVE);
        off(document,'mouseup',this.UP);
    }
    //最后这一步虽然容易忘，但是这行代码才是真正让拖拽和其他在拖拽过程中要执行的函数联系起来的根本。这就是拖拽产品主动暴漏给别人的接口
    this.run('selfdragend',e);
}



