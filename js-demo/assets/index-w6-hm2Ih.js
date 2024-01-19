!function(){const t=document.createElement("link").relList;if(!(t&&t.supports&&t.supports("modulepreload"))){for(const t of document.querySelectorAll('link[rel="modulepreload"]'))i(t);new MutationObserver((t=>{for(const e of t)if("childList"===e.type)for(const t of e.addedNodes)"LINK"===t.tagName&&"modulepreload"===t.rel&&i(t)})).observe(document,{childList:!0,subtree:!0})}function i(t){if(t.ep)return;t.ep=!0;const i=function(t){const i={};return t.integrity&&(i.integrity=t.integrity),t.referrerPolicy&&(i.referrerPolicy=t.referrerPolicy),"use-credentials"===t.crossOrigin?i.credentials="include":"anonymous"===t.crossOrigin?i.credentials="omit":i.credentials="same-origin",i}(t);fetch(t.href,i)}}();var t=function(i,e){return(t=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(t,i){t.__proto__=i}||function(t,i){for(var e in i)Object.prototype.hasOwnProperty.call(i,e)&&(t[e]=i[e])})(i,e)};function i(i,e){if("function"!=typeof e&&null!==e)throw new TypeError("Class extends value "+String(e)+" is not a constructor or null");function s(){this.constructor=i}t(i,e),i.prototype=null===e?Object.create(e):(s.prototype=e.prototype,new s)}"function"==typeof SuppressedError&&SuppressedError;const e={_events:Object.create(null),on(t,i){this._events[t]?this._events[t].push(i):this._events[t]=[i]},on_(t,i,e){return e&&(i=i.bind(e)),this.on(t,i),{type:t,listener:i}},off(t,i){this._events[t]&&(this._events[t]=this._events[t].filter((t=>t!==i)))},off_(t){if(!t)return;const i=t instanceof Array?t:[t];i.forEach((t=>this.off(t.type,t.listener))),i.length=0},emit(t,...i){this._events[t]&&this._events[t].forEach((t=>t.call(this,...i)))}};const s=["destroy","constructor"];const o={};const n={set(t,i=1,e=0,s=0,o=1,n=0,h=0){t.a=i,t.b=e,t.c=s,t.d=o,t.e=n,t.f=h},get:function(){return{a:1,b:0,c:0,d:1,e:0,f:0}},translateInner(t,i,e){t.e+=t.a*i+t.c*e,t.f+=t.b*i+t.d*e},scale(t,i,e=i){t.a*=i,t.b*=i,t.c*=e,t.d*=e},scaleOfInner(t,i,e,s=e){h.translateInner(t,i.x,i.y),h.scale(t,e,s),h.translateInner(t,-i.x,-i.y)},scaleOfOuter(t,i,e,s=e){h.toInnerPoint(t,i,o),h.scaleOfInner(t,o,e,s)},toInnerPoint(t,i,e,s){const{x:o,y:n}=i,{a:h,b:r,c:a,d:c}=t,l=1/(h*c-r*a);if(e||(e=i),e.x=(o*c-n*a)*l,e.y=(n*h-o*r)*l,!s){const{e:i,f:s}=t;e.x-=(i*c-s*a)*l,e.y-=(s*h-i*r)*l}}},h=n;function r(t,i,e,s){let o=1/0,n=-1;return i.forEach(((i,e)=>{let s=Math.sqrt(Math.pow(i.x-t.x,2)+Math.pow(i.y-t.y,2));s<o&&(o=s,n=e)})),o<e/s?n:-1}const a=(t,i,e=50,s=40)=>{const{x:o,y:n}=t,{x:h,y:r}=i;let a=Math.atan2(r-n,h-o);return[{x:h-e*Math.cos(a+s*Math.PI/180),y:r-e*Math.sin(a+s*Math.PI/180)},{x:h-e*Math.cos(a-s*Math.PI/180),y:r-e*Math.sin(a-s*Math.PI/180)}]},c=(t,i)=>Math.sqrt(Math.pow(t.x-i.x,2)+Math.pow(t.y-i.y,2));function l(t,i){return t.x===i.x&&t.y===i.y}function p(t,i){let e=!1,s=1/0;for(let o=0,n=i.length-1;o<i.length;n=o++){const h=i[o].x,r=i[o].y,a=i[n].x,c=i[n].y;r>t.y!=c>t.y&&t.x<(a-h)*(t.y-r)/(c-r)+h&&(e=!e);const l=a-h,p=c-r,u=((t.x-h)*l+(t.y-r)*p)/(l*l+p*p),d=Math.max(0,Math.min(1,u)),x=h+d*l,y=r+d*p,L=Math.sqrt((t.x-x)**2+(t.y-y)**2);L<s&&(s=L)}return e?-s:s}function u(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,(function(t){var i=16*Math.random()|0;return("x"===t?i:3&i|8).toString(16)}))}const d=Object.freeze(Object.defineProperty({__proto__:null,MatrixHelper:n,getArrow:a,getDistance:c,getMinDistance:r,getSides:(t,i)=>{const{x:e,y:s}=t,{x:o,y:n}=i;return[{x:(e+o)/2-(s-n)/6,y:(s+n)/2+(e-o)/6},{x:(e+o)/2+(s-n)/6,y:(s+n)/2-(e-o)/6}]},getUUID:u,isPointInPolygon:p,isSamePoint:l},Symbol.toStringTag,{value:"Module"}));class x{}class y extends x{constructor(t){super(),this.config=t}get __tag(){return"Circle"}draw(){const{center:t,radius:i,fillColor:e="black",ctx:s}=this.config,{x:o,y:n}=t;s.save(),s.beginPath(),s.fillStyle=e,s.arc(o,n,i,0,2*Math.PI),s.fill(),s.closePath(),s.restore()}}class L{constructor(){this.id="",this.group=[],this.pointList=[],this.oldPointList=[],this.label="",this.color="#ff0000",this.index=1,this.boxEventIds=[],this.status="draw",this.completeing=!1,this.expent=5,this.mouseDown=!1,this.lastMousePoint={x:0,y:0},this.acctivePointIndex=-1}setSelect(t){this.box.selectObject&&(this.box.selectObject.status="done",this.box.selectObject.render(),this.box.selectObject=void 0),this.status=t?"edit":"done",this.box.selectObject=this,this.render(),this.box.emit("onchange")}}class b extends L{constructor(t){super(),this.completeOffset=30,this.id=u(),this.minPointCount=2,this.box=t,this.index=t.markObjectList.length+1}boxMousedown(t){let i=t;"draw"==this.status&&(this.pointList=[i,i],this.mouseDown=!0),this.box.selectObject&&this.box.selectObject.id===this.id&&this.isPointInside(i)&&(this.mouseDown=!0,this.lastMousePoint=this.box.lastPoint)}setCursor(){}setMoveEdit(t){}boxMousemove(){var t;if((!this.box.selectObject||this.box.selectObject.id==this.id)&&1!=this.completeing)if("draw"==this.status&&this.pointList[0]&&(this.pointList[1]=this.box.lastPoint,this.render()),this.setCursor(),(null==(t=this.box.selectObject)?void 0:t.id)===this.id&&this.mouseDown&&"edit"==this.status){let t={x:this.box.lastPoint.x-this.lastMousePoint.x,y:this.box.lastPoint.y-this.lastMousePoint.y};-1==this.acctivePointIndex?this.pointList=this.pointList.map((i=>({x:i.x+t.x,y:i.y+t.y}))):this.setMoveEdit(t),this.lastMousePoint=this.box.lastPoint,this.render()}else"edit"==this.status&&(this.acctivePointIndex=r(this.box.lastPoint,this.vertexList,this.expent,this.box.t.a),this.render())}boxMouseup(){if(this.mouseDown&&"edit"==this.status&&this.acctivePointIndex>-1&&(this.box.selectObject=this),this.box.selectObject){if(this.box.selectObject.id!=this.id)return;this.box.selectObject.id===this.id&&(this.status="edit",this.lastMousePoint=this.box.lastPoint,this.acctivePointIndex=r(this.lastMousePoint,this.vertexList,this.expent,this.box.t.a),this.render(),this.box.render())}else"draw"!==this.status&&(this.status="done");this.mouseDown=!1,"draw"==this.status&&2===this.pointList.length&&this.complete()}destory(){this.pointList=[],this.removeAll()}removeAll(){for(var t=0;t<this.group.length;t++)this.group[t]=null;this.group=[]}async complete(){if(this.pointList.length<this.minPointCount)return;if(Math.max(Math.abs(this.pointList[0].x-this.pointList[1].x),Math.abs(this.pointList[0].y-this.pointList[1].y))<this.completeOffset)return this.status="draw",this.pointList=[],void this.render();this.completeing=!0;let t=await new Promise(((t,i)=>{this.box.emit("oncomplete",{ok:t,err:i})})).catch((()=>{this.completeing=!1,this.pointList=[],this.render()}));t&&(this.completeing=!1,this.label=null==t?void 0:t.label,this.color=null==t?void 0:t.color,this.status="done",this.render(),this.box.render(),this.box.addObjectData())}get vertexList(){return 2===this.pointList.length?[this.pointList[0],this.pointList[1]]:[]}get pathData(){let t="";return this.pointList.length&&(this.pointList.forEach(((i,e)=>{t+=0===e?`M${i.x},${i.y}`:`L${i.x},${i.y}`})),t+="Z "),t}get indexPoint(){return this.pointList[0]}render(){this.removeAll();let t=this.box.t.a,i=this.box.regionCtx;this.box.selectObject||this.box.clearCanvas(i),i.lineWidth=this.box.config.lineWidth/t,i.strokeStyle="draw"===this.status?this.box.config.drawColor:this.color;let e=new Path2D(this.pathData);this.group.push(e),"draw"===this.status&&i.stroke(e),"edit"===this.status&&(this.box.clearCanvas(i),i.stroke(e),i.fillStyle="edit"===this.status?this.box.config.fillColor:"rgba(0,0,0,0)",i.fill(e),this.vertexList.map(((e,s)=>{let o=null;o=this.acctivePointIndex===s?new y({ctx:i,center:e,radius:8/t,fillColor:this.color}):new y({ctx:i,center:e,radius:4/t,fillColor:this.color}),o.draw(),this.group.push(o)})))}isPointInside(t){if(!this.pointList.length||"draw"===this.status)return!1;let i=this.expent/this.box.t.a;return p(t,this.vertexList)<i}static import(t,i){let e=new this(t);return e.label=i.label,e.color=i.color||e.color,e.pointList=i.pointList,e.status="done",e.render(),e}}class f extends b{constructor(t){super(t),this.type=g.LINE,this.completeOffset=2}setMoveEdit(){this.pointList[this.acctivePointIndex]={x:this.lastMousePoint.x,y:this.lastMousePoint.y}}isPointInside(t){let i=this.expent/this.box.t.a;return p(t,this.pointList)<i}}let v=class extends L{constructor(t){super(),this.isClosed=!1,this.maxPointCount=1/0,this.drag=!1,this.minPointCount=2,this.id=u(),this.box=t,this.index=t.markObjectList.length+1,this.boxEventIds=[this.box.on_("oncontextmenu",this.boxContextmenu,this)]}boxContextmenu(){"draw"===this.status&&(this.pointList.pop(),this.render())}async boxMousedown(t){if(!this.lastPointDown||!l(t,this.lastPointDown)){if(this.box.selectObject){if(this.box.selectObject.id!==this.id)return;this.isPointInside(t)&&(this.mouseDown=!0),this.lastMousePoint=this.box.lastPoint}if("draw"==this.status){if(this.lastPointDown=t,this.pointList.length>=this.minPointCount&&this.isClosed){let i=2,e={x:t.x-this.pointList[0].x,y:t.y-this.pointList[0].y};if(Math.abs(e.x)<4*i&&Math.abs(e.y)<4*i)return void(await this.complete())}this.pointList.push(t)}}}boxMousemove(){if(!this.box.selectObject||this.box.selectObject.id==this.id){if(this.mouseDown&&"edit"==this.status){this.drag=!0;let t={x:this.box.lastPoint.x-this.lastMousePoint.x,y:this.box.lastPoint.y-this.lastMousePoint.y};-1==this.acctivePointIndex?this.pointList=this.pointList.map((i=>({x:i.x+t.x,y:i.y+t.y}))):this.pointList[this.acctivePointIndex]={x:this.lastMousePoint.x,y:this.lastMousePoint.y},this.lastMousePoint=this.box.lastPoint}else"edit"==this.status&&(this.acctivePointIndex=r(this.box.lastPoint,this.pointList,this.expent,this.box.t.a));"done"!==this.status&&this.render()}}boxMouseup(){if(this.box.selectObject){if(this.box.selectObject.id===this.id?(this.status="edit",this.lastMousePoint=this.box.lastPoint,this.acctivePointIndex=r(this.lastMousePoint,this.pointList,this.expent,this.box.t.a)):"draw"!=this.status&&(this.status="done"),"draw"===this.status&&this.box.selectObject.id!==this.id)return this.pointList=[],void(this.mouseDown=!1);this.render()}else if("edit"===this.status)this.status="done",this.box.render();else if("draw"===this.status){if(this.pointList.length===this.maxPointCount)return void this.complete();this.render()}this.drag&&"edit"==this.status&&this.box.render(),this.drag=!1,this.mouseDown=!1}destory(){this.box.off_(this.boxEventIds),this.pointList=[],this.removeAll()}removeAll(){for(var t=0;t<this.group.length;t++)this.group[t]=null;this.group=[]}async complete(){if(this.pointList.length<this.minPointCount)return;this.completeing=!0;let t=await new Promise(((t,i)=>{this.box.emit("oncomplete",{ok:t,err:i})})).catch((()=>{this.completeing=!1,this.pointList=[],this.render()}));t&&(this.completeing=!1,this.label=null==t?void 0:t.label,this.color=null==t?void 0:t.color,this.status="done",this.render(),this.box.render(),this.box.addObjectData())}get pathData(){let t="";return this.pointList.length&&(this.pointList.forEach(((i,e)=>{t+=0===e?`M${i.x},${i.y}`:`L${i.x},${i.y}`})),t+="Z "),t}get indexPoint(){return this.pointList[0]}render(){this.removeAll();let t=this.box.regionCtx;this.box.selectObject||this.box.clearCanvas(t);let i=this.box.t.a;if(t.lineWidth=this.box.config.lineWidth/i,t.strokeStyle="draw"===this.status?this.box.config.drawColor:this.color,"draw"===this.status){let e=this.pathData;this.pointList.length>=2&&(e+=`\n        M${this.pointList[this.pointList.length-1].x},\n        ${this.pointList[this.pointList.length-1].y}\n        L${this.pointList[this.pointList.length-1].x},\n        ${this.pointList[this.pointList.length-1].y} Z`),e+=`L${this.box.lastPoint.x},${this.box.lastPoint.y} Z`;let s=new Path2D(e);this.group.push(s),t.stroke(s),this.pointList.map((e=>{let s=null;s=new y({ctx:t,center:e,radius:4/i,fillColor:this.color}),this.group.push(s),s.draw()}))}if("edit"===this.status){this.box.clearCanvas(t);let e=new Path2D(this.pathData);this.group.push(e),t.stroke(e),t.fillStyle="edit"===this.status?this.box.config.fillColor:"rgba(0,0,0,0)",t.fill(new Path2D(this.pathData)),this.pointList.map(((e,s)=>{let o=null;o=this.acctivePointIndex===s?new y({ctx:t,center:e,radius:8/i,fillColor:this.color}):new y({ctx:t,center:e,radius:4/i,fillColor:this.color}),this.group.push(o),o.draw()}))}}isPointInside(t){let i=this.expent/this.box.t.a;return p(t,this.pointList)<i}static import(t,i){let e=new this(t);return e.label=i.label,e.color=i.color||e.color,e.pointList=i.pointList,e.status="done",e.render(),e}};var g=(t=>(t.NONE="",t.RECT="rect",t.POLYGON="polygon",t.CIRCLE="circle",t.ELLIPSE="ellipse",t.POINT="point",t.LINE="line",t.POLYLINE="polyline",t.LINE_ARROW="line_arrow",t))(g||{});const m={"":"",rect:class extends b{constructor(t){super(t),this.type=g.POLYGON,this.minPointCount=2}setCursor(){-1!==this.acctivePointIndex&&(this.box.view.style.cursor=["nwse-resize","nesw-resize","nwse-resize","nesw-resize"][this.acctivePointIndex])}setMoveEdit(){let t,i={...this.vertexList[this.acctivePointIndex]};0==this.acctivePointIndex?t={...this.vertexList[2]}:1==this.acctivePointIndex?t={...this.vertexList[3]}:2==this.acctivePointIndex?t={...this.vertexList[0]}:3==this.acctivePointIndex&&(t={...this.vertexList[1]}),i={...this.box.lastPoint};let e=Math.min(i.x,t.x),s=Math.min(i.y,t.y),o=Math.max(i.x,t.x),n=Math.max(i.y,t.y);this.pointList=[{x:e,y:s},{x:o,y:n}],this.acctivePointIndex=this.vertexList.findIndex((t=>t.x==i.x&&t.y==i.y))}get pathData(){let t="";return this.vertexList.length&&(this.vertexList.forEach(((i,e)=>{t+=0===e?`M${i.x},${i.y}`:`L${i.x},${i.y}`})),t+="Z "),t}get vertexList(){return 2===this.pointList.length?[this.pointList[0],{x:this.pointList[0].x,y:this.pointList[1].y},this.pointList[1],{x:this.pointList[1].x,y:this.pointList[0].y}]:[]}},polygon:class extends v{constructor(t){super(t),this.type=g.POLYGON,this.minPointCount=3,this.isClosed=!0}},circle:class extends b{constructor(t){super(t),this.type=g.CIRCLE}setCursor(){1===this.acctivePointIndex&&(this.box.view.style.cursor="col-resize")}setMoveEdit(t){this.pointList[1]={x:this.pointList[1].x+t.x,y:this.pointList[1].y+t.y}}get vertexList(){return 2===this.pointList.length?[this.pointList[1]]:[]}get indexPoint(){var t;return null==(t=this.pointList)?void 0:t[1]}get pathData(){let t="";if(this.pointList.length){let i={x:2*this.pointList[0].x-this.pointList[1].x,y:2*this.pointList[0].y-this.pointList[1].y},e=c(this.pointList[0],this.pointList[1]);t+=`\n          M ${i.x} ${i.y} \n          A ${e} ${e} 0 0 1 ${this.pointList[1].x} ${this.pointList[1].y}\n          A ${e} ${e} 0 0 1 ${i.x} ${i.y}\n        `,t+="Z "}return t}isPointInside(t){let i=this.expent/this.box.initLayout.zoom;if(!this.pointList.length||"draw"===this.status)return!1;let e=Math.sqrt(Math.pow(this.pointList[0].x-t.x,2)+Math.pow(this.pointList[0].y-t.y,2)),s=c(this.pointList[0],this.pointList[1]);return e<=s+i&&0!==s}},ellipse:class extends b{constructor(t){super(t),this.type=g.ELLIPSE}setCursor(){[0,2].includes(this.acctivePointIndex)?this.box.view.style.cursor="col-resize":[1,3].includes(this.acctivePointIndex)&&(this.box.view.style.cursor="row-resize")}setMoveEdit(t){0===this.acctivePointIndex?this.pointList[1]={x:this.pointList[1].x-t.x,y:this.pointList[1].y}:1===this.acctivePointIndex?this.pointList[1]={x:this.pointList[1].x,y:this.pointList[1].y+t.y}:2===this.acctivePointIndex?this.pointList[1]={x:this.pointList[1].x+t.x,y:this.pointList[1].y}:3===this.acctivePointIndex&&(this.pointList[1]={x:this.pointList[1].x,y:this.pointList[1].y-t.y})}get vertexList(){if(2===this.pointList.length){let t=this.pointList[1].x-this.pointList[0].x,i=this.pointList[1].y-this.pointList[0].y;return[{x:this.pointList[0].x-t,y:this.pointList[0].y},{x:this.pointList[0].x,y:this.pointList[0].y+i},{x:this.pointList[1].x,y:this.pointList[1].y-i},{x:this.pointList[0].x,y:this.pointList[0].y-i}]}return[]}get ellipseData(){if(2===this.pointList.length){let t=Math.abs(this.pointList[1].x-this.pointList[0].x),i=Math.abs(this.pointList[1].y-this.pointList[0].y);return{pointList:this.pointList[0],xr:t,yr:i}}return null}get indexPoint(){return this.vertexList[1]}get pathData(){let t="";if(this.pointList.length){let i=Math.abs(this.pointList[1].x-this.pointList[0].x),e=Math.abs(this.pointList[1].y-this.pointList[0].y);t+=`\n        M ${this.vertexList[0].x} ${this.vertexList[0].y} \n        A ${i} ${e} 0 0 1 ${this.vertexList[2].x} ${this.vertexList[2].y}\n        A ${i} ${e} 0 0 1 ${this.vertexList[0].x} ${this.vertexList[0].y}\n      `,t+="Z "}return t}isPointInside(t){if(!this.pointList.length||"draw"===this.status)return!1;const{xr:i,yr:e,pointList:s}=this.ellipseData;return(t.x-s.x)**2/i**2+(t.y-s.y)**2/e**2<=1||r(t,this.vertexList,this.expent,this.box.t.a)>-1}},polyline:class extends v{constructor(t){super(t),this.type=g.POLYLINE,this.minPointCount=3}get pathData(){let t="";return this.pointList.length&&this.pointList.forEach(((i,e)=>{t+=0===e?`M${i.x},${i.y}`:`L${i.x},${i.y}`})),t}},line:f,line_arrow:class extends f{constructor(t){super(t),this.type=g.LINE_ARROW}get pathData(){let t="";if(this.pointList.length){if(2===this.pointList.length&&this.pointList[0].x!=this.pointList[1].x&&this.pointList[0].y!=this.pointList[1].y){t+=`M${this.pointList[0].x},${this.pointList[1].y}`,t+=`L${this.pointList[0].x},${this.pointList[1].y}`;const[i,e]=this.pointList,[s,o]=a(i,e,20/this.box.t.a);t+="Z",t+=`M${i.x},${i.y}`,t+=`L${e.x},${e.y}`,t+="Z",t+=`M${s.x},${s.y}`,t+=`L${e.x},${e.y}`,t+=`M${e.x},${e.y}`,t+=`L${o.x},${o.y}`,t+="Z"}t+="Z "}return t}}};var w=Object.defineProperty,O=Object.getOwnPropertyDescriptor;const{scaleOfOuter:P}=n;let M=class{constructor(t){this.config={drawColor:"yellow",lineWidth:2,fillColor:"rgba(255, 255, 255, 0.3)",showIndex:!0},this.t={a:1,b:0,c:0,d:1,e:0,f:0},this.initLayout={zoom:1,offsetx:0,offsety:0,width:0,height:0},this.lastMovePoint={x:0,y:0},this.moveStatus=!1,this.mouseDown=!1,this.drag=!1,this.currentDrawingType=g.NONE,this.markObjectList=[],this.renderGroup=[],this.markMap=m,this._events=Object.create(null),this.init(t)}static register(t,i){if(!t||!i)throw new Error("need type or markObject");M.markMap[t]=i}init(t){Object.assign(this.config,t||{}),this.view=document.querySelector(t.view),this.view.style.overflow="hidden",this.view.style.position="relative",this.view.style.cursor="default",this.canvas=this.createCanvas(),this.regionCanvas=this.createCanvas(),this.ctx=this.canvas.getContext("2d"),this.regionCtx=this.regionCanvas.getContext("2d"),this.view.addEventListener("mousemove",this.appMousemove.bind(this)),this.view.addEventListener("mousedown",this.appMousedown.bind(this)),this.view.addEventListener("mouseup",this.appMouseup.bind(this)),this.view.addEventListener("wheel",this.appWheel.bind(this)),this.view.addEventListener("dblclick",this.appDblclick.bind(this)),this.view.addEventListener("contextmenu",(t=>{t.preventDefault(),this.emit("oncontextmenu",this.lastMovePoint)})),this.windowKeydown=this.windowKeydown.bind(this),this.windowKeyup=this.windowKeyup.bind(this),window.addEventListener("keydown",this.windowKeydown),window.addEventListener("keyup",this.windowKeyup)}get viewDomInfo(){return this.view.getBoundingClientRect()}get lastPoint(){return this.lastMovePoint?this.lastMovePoint:null}createCanvas(){let t=document.createElement("canvas");return t.setAttribute("style",` width: ${this.viewDomInfo.width}px;\n        height: ${this.viewDomInfo.height}px;\n        position: absolute;\n        `),t.width=this.viewDomInfo.width,t.height=this.viewDomInfo.height,this.view.appendChild(t),t}clearCanvas(t){t.save(),t.globalCompositeOperation="copy",t.beginPath(),t.lineTo(0,0),t.stroke(),t.restore()}clearMarkShapes(){this.markObjectList.forEach((t=>{t.destory(),t.render()})),this.markObjectList=[],this.render(),this.emit("onchange"),this.addObjectData()}async setBackground(t){return new Promise((i=>{var e;(null==(e=this.img)?void 0:e.src)?this.img.src=t:(this.img=new Image,this.img.src=t,this.img.style.position="absolute",this.img.style.userSelect="none"),this.img.onload=()=>{this.view.insertBefore(this.img,this.canvas),this.setLayout(this.img),i(null)}}))}transfrom(){var t;this.ctx.setTransform(this.t),this.regionCtx.setTransform(this.t),this.img&&this.imgTrans(),null==(t=this.selectObject)||t.render(),this.render(),this.emit("ontransform",{t:this.t})}setLayout({width:t,height:i}){let e=this.viewDomInfo.width/t,s=this.viewDomInfo.height/i,o=Math.min(e,s),n=(this.viewDomInfo.width-t*o)/2,h=(this.viewDomInfo.height-i*o)/2;this.t={a:o,b:0,c:0,d:o,e:n,f:h},this.initLayout={zoom:o,offsetx:n,offsety:h,width:t,height:i},this.transfrom()}imgTrans(){this.img.style.transformOrigin=`${this.t.e}px ${this.t.f}px`,this.img.style.transform=`scale(${this.t.a}) translate(${this.t.e}px,${this.t.f}px)`}render(){for(var t=0;t<this.renderGroup.length;t++)this.renderGroup[t]=null;this.renderGroup=[],this.clearCanvas(this.ctx),this.ctx.font=`bold ${~~(16/this.t.a)}px serif`,this.ctx.lineWidth=2/this.t.a,this.markObjectList.map(((t,i)=>{"draw"!==t.status&&this.config.showIndex&&this.ctx.fillText(i+"",t.indexPoint.x,t.indexPoint.y-3/this.t.a),this.ctx.strokeStyle=t.color;let e=new Path2D(t.pathData);this.renderGroup.push(e),this.ctx.stroke(e)}))}appWheel(t){if(t.metaKey||t.ctrlKey||t.altKey){t.preventDefault();const i={x:t.offsetX,y:t.offsetY};let e=t.deltaY>0?.9:1.1;P(this.t,i,e,e),this.transfrom()}}appDblclick(){this.t={a:this.initLayout.zoom,b:0,c:0,d:this.initLayout.zoom,e:this.initLayout.offsetx,f:this.initLayout.offsety},this.transfrom()}appMoving(t){this.view.style.cursor="grab";let i=(t.x-this.lastMovePoint.x)*this.t.a,e=(t.y-this.lastMovePoint.y)*this.t.a;this.t.e+=i,this.t.f+=e,this.transfrom(),this.emit("onmove",{status:this.moveStatus})}appMousemove(t){let i=this.pointMapping(t);if(this.mouseDown&&this.moveStatus)return this.appMoving(i),void(this.lastMovePoint=this.pointMapping(t));this.view.style.cursor="default",!!this.markObjectList.find((t=>"draw"===t.status))&&(this.view.style.cursor="crosshair"),this.mouseDown&&this.selectObject&&(this.drag=!0,this.view.style.cursor="move"),void 0!==t.buttons&&(this.lastMovePoint={x:i.x,y:i.y}),this.getDrawMark("boxMousemove",i)}appMousedown(t){let i=this.pointMapping(t);this.mouseDown=!0,this.moveStatus||1===t.buttons&&this.getDrawMark("boxMousedown",i)}getDrawMark(t,i){var e,s;this.selectObject&&this.selectObject[t](i);const o=this.markObjectList[this.markObjectList.length-1];o&&"draw"==o.status&&(null==(s=null==(e=this.markObjectList)?void 0:e[this.markObjectList.length-1])||s[t](i))}appMouseup(t){var i,e,s,o,n,h,r;if(this.mouseDown=!1,this.moveStatus)return;let a=this.pointMapping(t);if(this.selectObject&&this.drag)return this.selectObject.isPointInside(a)||(this.selectObject=void 0),this.drag=!1,this.getDrawMark("boxMouseup",a),void this.emit("onchange");let c=this.markObjectList[this.markObjectList.length-1];if("draw"===c.status&&c.pointList&&(null==(i=this.lastMovePoint)?void 0:i.x)!==(null==(s=null==(e=null==c?void 0:c.pointList)?void 0:e[0])?void 0:s.x)&&c.pointList.length>0&&(null==(n=null==(o=null==c?void 0:c.pointList)?void 0:o[0])?void 0:n.x)!==(null==(r=null==(h=null==c?void 0:c.pointList)?void 0:h[1])?void 0:r.x))this.selectObject=void 0;else{let t=this.getSelectedIndex(a);void 0!==t&&this.markObjectList[t]?(this.drag&&this.selectObject&&this.selectObject.id!==this.markObjectList[t].id||(this.selectObject=this.markObjectList[t]),"draw"===this.markObjectList[t].status&&(this.selectObject=void 0)):this.selectObject=void 0}this.moveStatus=!1,this.mouseDown=!1,this.drag=!1,this.getDrawMark("boxMouseup",a),this.emit("onchange")}pointMapping(t){let i={x:0,y:0},e=t.offsetX||t.x,s=t.offsetY||t.y;return i.x=(e-this.t.e)/this.t.a,i.y=(s-this.t.f)/this.t.a,i}getSelectedIndex(t){let i=this.markObjectList.map(((t,i)=>i)).reverse().filter((i=>this.markObjectList[i].isPointInside(t)));if(i.length){if(1===i.length)return i[0];if(i.length>1){if(this.drag&&this.selectObject)return this.selectObject.index-1;if(this.selectObject){const t=this.selectObject.index-1;if(i.indexOf(t)>-1)return i[i.indexOf(t)+1]}if(!this.selectObject)return i[0]}}}async setDrawType(t){if(this.currentDrawingType){let t=this.markObjectList[this.markObjectList.length-1];t&&"draw"===t.status&&(null==t||t.destory(),this.markObjectList.pop())}this.currentDrawingType=t,this.addObjectData(),this.emit("ondraw",{type:t})}get objects(){return this.markObjectList.filter((t=>"draw"!==t.status)).map((t=>{var i;return{id:t.id,label:t.label,type:t.type,color:t.color,select:t.id===(null==(i=this.selectObject)?void 0:i.id),pointList:t.pointList}}))}addObjectData(){let t=null;if(this.currentDrawingType)try{t=new M.markMap[this.currentDrawingType](this)}catch(i){throw new Error(`${this.currentDrawingType} mark type is not supported`)}t&&this.markObjectList.push(t),this.emit("onchange")}setObjectData(t){t.forEach((t=>{let i;if(t.type)try{i=M.markMap[t.type].import(this,t)}catch(e){throw new Error(`${t.type} mark type is not supported`)}i&&this.markObjectList.push(i)})),this.render(),this.emit("onchange")}selectObjectById(t){let i=this.markObjectList.find((i=>i.id===t));i&&i.setSelect(!0)}deleteObject(t){var i;let e=this.markObjectList.find((i=>i.id===t));e&&(e.destory(),null==(i=this.selectObject)||i.render(),this.markObjectList.splice(this.markObjectList.indexOf(e),1),this.render(),this.emit("onchange"))}setMoveEditStatus(t){this.moveStatus!=t&&(this.moveStatus=t)}async windowKeydown(t){if("Space"==t.code&&(this.setMoveEditStatus(!0),t.preventDefault()),"NumpadEnter"==t.code||"Enter"==t.code){let t=this.markObjectList[this.markObjectList.length-1];"draw"==(null==t?void 0:t.status)&&await t.complete()}"Delete"==t.code&&this.selectObject&&this.deleteObject(this.selectObject.id)}windowKeyup(t){"Space"==t.code&&this.setMoveEditStatus(!1)}destroy(){window.removeEventListener("keydown",this.windowKeydown),window.removeEventListener("keyup",this.windowKeyup),this.view.innerHTML="",this.view.replaceWith(this.view.cloneNode(!0))}on(t,i){}on_(t,i,e){return{}}off(t,i){}off_(t){}emit(t,...i){}};var j,k;M.MoveMarkObject=b,M.ClickMarkObject=v,M.markMap=m,M.MarkBoardUtils=d,M=((t,i,e,s)=>{for(var o,n=s>1?void 0:s?O(i,e):i,h=t.length-1;h>=0;h--)(o=t[h])&&(n=(s?o(i,e,n):o(n))||n);return s&&n&&w(i,e,n),n})([(j=e,t=>{var i;(j.prototype?(i=j.prototype,Object.getOwnPropertyNames(i)):Object.keys(j)).forEach((i=>{if(!(s.includes(i)||k&&k.includes(i)))if(j.prototype){const e=function(t,i){return Object.getOwnPropertyDescriptor(t,i)}(j.prototype,i);e.writable&&(t.prototype[i]=j.prototype[i])}else t.prototype[i]=j[i]}))})],M);const I=M,D=""+new URL("image-etDKo1Lq.jpg",import.meta.url).href,E=[{id:"f9e1cf23-8903-4f40-8ff9-724363190272",label:"person",type:"polygon",color:"gray",pointList:[{x:257.7016248153619,y:189.06942392909895},{x:380.5967503692762,y:191.90546528803543},{x:520.5081240768095,y:191.90546528803543},{x:768.1890694239291,y:192.85081240768093},{x:760.6262924667651,y:222.15657311669128},{x:633.0044313146234,y:225.93796159527326},{x:632.0590841949778,y:257.13441654357456},{x:257.7016248153619,y:260.9158050221566}]},{id:"f414b029-1311-43f8-b2e5-fa0508ce5740",label:"women",type:"rect",color:"blue",pointList:[{x:653.8020679468241,y:251.4623338257016},{x:770.07976366322,y:287.3855243722304}]},{id:"b420899a-1488-4885-97a2-c9c4131a08e2",label:"home",type:"circle",color:"pink",pointList:[{x:80.92171344165445,y:460.384047267356},{x:40.27178729689808,y:424.4608567208272}]},{id:"f0b68f67-7af1-4a69-8502-774ab07676cf",label:"cloud",type:"ellipse",color:"#20B4D9",pointList:[{x:144.25997045790254,y:302.51107828655836},{x:232.1772525849335,y:326.1447562776957}]},{id:"b2e9e160-ae8b-4992-a832-6423af623764",label:"person",type:"line",color:"#063D4E",pointList:[{x:126.29837518463813,y:349.77843426883305},{x:576.2836041358936,y:345.0516986706056}]},{id:"9aff9994-991e-44fe-b67e-7b57f31f751f",label:"arrow",type:"line_arrow",color:"#F924d2",pointList:[{x:129.13441654357462,y:66.17429837518463},{x:254.8655834564254,y:162.59970457902511}]},{id:"bb3f20df-1594-4dc8-b3e5-1262a4ae8ea6",label:"person",type:"polyline",color:"#E27A18",pointList:[{x:849.4889217134416,y:42.540620384047266},{x:944.9689807976366,y:127.62186115214179},{x:814.5110782865584,y:160.7090103397341}]}];var $=I.ClickMarkObject,C=I.MarkBoardUtils,S=function(t){function e(i){var e=t.call(this,i)||this;return e.type="sides_polygon",e}return i(e,t),Object.defineProperty(e.prototype,"pathData",{get:function(){var t="";if(this.pointList.forEach((function(i,e){t+=0===e?"M".concat(i.x,",").concat(i.y):"L".concat(i.x,",").concat(i.y)})),this.pointList.length>=2){var i=C.getSides(this.pointList[0],this.pointList[1]),e=i[0],s=i[1],o=C.getArrow(s,e,20/this.box.t.a),n=o[0],h=o[1];t+="Z",t+="M".concat(s.x,",").concat(s.y),t+="L".concat(e.x,",").concat(e.y),t+="Z",t+="M".concat(n.x,",").concat(n.y),t+="L".concat(e.x,",").concat(e.y),t+="M".concat(e.x,",").concat(e.y),t+="L".concat(h.x,",").concat(h.y),t+="Z",t+="M".concat(this.pointList[0].x,",").concat(this.pointList[0].y),t+="L".concat(this.pointList[1].x,",").concat(this.pointList[1].y),t+="L".concat(this.pointList[0].x,",").concat(this.pointList[0].y," "),t+="L".concat(this.pointList[this.pointList.length-1].x,",").concat(this.pointList[this.pointList.length-1].y," ")}return t+="Z "},enumerable:!1,configurable:!0}),e}($),_=function(t){function e(i){var e=t.call(this,i)||this;return e.type="polyline_arrow",e}return i(e,t),Object.defineProperty(e.prototype,"pathData",{get:function(){var t="";if(this.pointList.length&&(this.pointList.forEach((function(i,e){t+=0===e?"M".concat(i.x,",").concat(i.y):"L".concat(i.x,",").concat(i.y)})),this.pointList.length>=2))for(var i=0;i<this.pointList.length-1;i++){var e=C.getArrow(this.pointList[i],this.pointList[i+1],20/this.box.t.a),s=e[0],o=e[1];t+="M".concat(s.x,",").concat(s.y),t+="L".concat(this.pointList[i+1].x,",").concat(this.pointList[i+1].y),t+="M".concat(this.pointList[i+1].x,",").concat(this.pointList[i+1].y),t+="L".concat(o.x,",").concat(o.y),t+="M".concat(this.pointList[i+1].x,",").concat(this.pointList[i+1].y)}return t},enumerable:!1,configurable:!0}),e}($);function T(){var t;document.getElementById("upload").onclick=function(){var i=document.createElement("input");i.type="file",i.accept="image/*",i.onchange=function(i){var e=i.target.files[0];if(e){var s=new FileReader;s.onload=function(i){null==t||t.setBackground(i.target.result).then((function(){t.setDrawType(t.currentDrawingType||"rect")}))},s.readAsDataURL(e)}},i.click()},document.getElementById("clear").onclick=function(){t.clearMarkShapes()},document.getElementById("importJson").onclick=function(){t.setObjectData(E)},document.getElementById("creact").onclick=r,document.getElementById("destroy").onclick=function(){t.destroy(),t=void 0};var i=[],e=document.querySelector("#labelInput"),s=document.querySelector("#colorInput"),o=document.querySelector("#textarea"),n=e.value,h=s.value;function r(){t||(null==(t=new I({view:"#mark-box"}))||t.setBackground(D).then((function(){t.setDrawType(t.currentDrawingType||"rect")})),t.on("ondraw",(function(i){t.currentDrawingType=i.type})),t.on("oncomplete",(function(t){t.ok({label:n,color:h})})),t.on("onchange",(function(){i=t.objects,function(){var e=document.getElementById("mark-list"),s=[];s.push("<ul id='mark-list-ul'>");for(var o=0;o<i.length;o++){var n=i[o].label;s.push("<li>\n        ".concat(n,"\n      <button data-type='del' data-id=").concat(i[o].id,">删除</button>\n      </li>"))}s.push("</ul>"),e.innerHTML=s.join(""),document.getElementById("mark-list-ul").onclick=function(i){if(i.target.dataset.type&&"del"===i.target.dataset.type)t.deleteObject(i.target.dataset.id)}}(),o.value=JSON.stringify(i)})))}e.onchange=function(t){n=t.target.value},s.onchange=function(t){h=t.target.value},r(),document.querySelector(".mark-operate").onclick=function(i){i.target.dataset.type&&t.setDrawType(i.target.dataset.type)}}I.register("sides_polygon",S),I.register("polyline_arrow",_),window.onload=T,T(),console.log("load");
