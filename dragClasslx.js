function on(ele,type,fn){
    if(ele.addEventListener){
        ele.addEventListener(type,fn,false);
        return;
    }
    if(!ele['AAA'+type]){
        ele['AAA'+type]=[];
        ele.attachEvent('on'+type,function(){ run.call(ele); })
    }
    var a=ele['AAA'+type];
    for(var i=0;i< a.length;i++){
        if(a[i]===fn){
            return;
        }
    }
    a.push(fn);
}
function run(e){
    e=window.event;
    e.target= e.srcElement;
    e.pageX=(document.documentElement.scrollLeft||document.body.scrollLeft)+ e.clientX;
    e.pageY=(document.documentElement.scrollTop||document.body.scrollTop)+ e.clientY;
    e.preventDefault= function () {
        e.returnValue=false;
    };
    e.stopPropagation= function () {
        e.cancelBubble=true;
    };
    var a=this['AAA'+ e.type];
    if(a){
        for(var i=0;i< a.length;i++){
            if(typeof a[i]==='function'){
                a[i].call(this,e);
            }else{
                a.splice(i,1);
                i--;
            }
        }
    }
}
function off(ele,type,fn){
    if(ele.removeEventListener){
        ele.removeEventListener(type,fn,false);
        return;
    }
    var a=ele['AAA'+type];
    if(a){
        for(var i=0;i< a.length;i++){
            if(a[i]===fn){
                a[i]=null;
                break;
            }
        }
    }
}


function Drag(ele){
    this.ele=ele;
    this.l=null;
    this.t=null;
    var that=this;
    this.DOWN= function (e) {
        that.down.call(that,e)
    };
    this.MOVE= function (e) {
        that.move.call(that,e)
    };
    this.UP= function (e) {
        that.up.call(that,e)
    };
    on(this.ele,'mousedown',that.DOWN);
}

Drag.prototype.down= function (e) {
    this.l= e.pageX-this.ele.offsetLeft;
    this.t= e.pageY-this.ele.offsetTop;
    if(this.ele.setCapture){
        this.ele.setCapture();
        on(this.ele,'mousemove',this.MOVE);
    }else{
        on(document,'mousemove',this.MOVE);
        on(document,'mouseup',this.UP);
    }
};
Drag.prototype.move= function (e) {
    var l= e.pageX-this.l;
    var t= e.pageY-this.t;
    this.ele.style.left=l+'px';
    this.ele.style.top=t+'px';
    e.preventDefault();
};
Drag.prototype.up= function (e) {
    if(this.ele.releaseCapture){
        this.ele.releaseCapture();
        off(this.ele,'mousemove',this.MOVE);
        off(this.ele,'mouseup',this.UP);
    }else{
        off(document,'mousemove',this.MOVE);
        off(document,'mouseup',this.UP);
    }
};




