import{d as L}from"./dayjs.min.668a802a.js";import{s as m,C as G,a as V}from"./store.9a0a85b3.js";import{r as C,f as W,g as q,o as g,c as E,a as d,t as f,n as S,h as u,_ as z,b as I,w as P,F as T,i as D,j as M,d as F}from"./entry.58a82d46.js";import{c as k,s as _}from"./database.58d451c2.js";import{_ as O}from"./MeButton.ba8c34f6.js";function H(r,t,e,s){let o=Math.PI*t/180,a=Math.PI*r/180,i=Math.PI*s/180,n=Math.PI*e/180,c=(o-i)/2,h=(a-n)/2;return 6378137*2*Math.asin(Math.sqrt(Math.pow(Math.sin(h),2)+Math.cos(a)*Math.cos(n)*Math.pow(Math.sin(c),2)))}function N(r){return r<1e3?`${r.toFixed(0)}m`:`${(r/1e3).toFixed(1)}km`}function A(r,t=!1){return t?`${Math.floor(r/60)}分${r%60}秒`:`${Math.floor(r/60)}:${(r%60).toString().padStart(2,"0")}`}class J{watchId;callbacks;active;constructor(){this.watchId=null,this.callbacks=[],this.active=C(!1)}get isActive(){return this.active}startWatch(t){t&&this.callbacks.push(t),!this.watchId&&(this.watchId=navigator.geolocation.watchPosition(e=>{this.callbacks.forEach(s=>s(e))}),this.active.value=!0,console.log("start watch"))}stopWatch(){this.watchId&&(navigator.geolocation.clearWatch(this.watchId),this.watchId=null,this.active.value=!1,this.callbacks=[],console.log("stop watch"))}getCurrentPosition(){return new Promise((t,e)=>{navigator.geolocation.getCurrentPosition(t,e)})}}const y=new J;function B(r,t=!1){const e=t?`最後に通知してから${A(m.get("cooldownSeconds"),!0)}が経過しました`:`${r.station.name} が最寄り駅になりました`,s={body:N(r.distance),renotify:!0,tag:"nearestStation",vibrate:[100,50,100]};K(e,s),console.log("showStationNotification",e,s)}function K(r,t){navigator.serviceWorker.controller?.postMessage({type:"notificationCreate",payload:{title:r,options:t}})}function j(r,t,e){return t>=r.south&&t<=r.north&&e>=r.west&&e<=r.east}class b{depth;code;region;segmentName;station;left;right;constructor(t,e,s){this.depth=t,this.code=e.code,this.region=s}async build(t,e){return await this.buildTree(t,e),this}async buildTree(t,e){if(t.segment){this.segmentName=t.segment;return}if(this.station=await k.stations.get(t.code),!this.station)throw new Error(`Station ${t.code} not found`);if(!j(this.region,this.station.lat,this.station.lng))throw new Error(`Station ${t.code} is out of region`);const s=this.depth%2===0;if(t.left){const o=e.get(t.left);if(!o)throw new Error(`Node ${t.left} not found`);this.left=await new b(this.depth+1,o,{north:s?this.region.north:this.station.lat,south:this.region.south,east:s?this.station.lng:this.region.east,west:this.region.west}).build(o,e)}if(t.right){const o=e.get(t.right);if(!o)throw new Error(`Node ${t.right} not found`);this.right=await new b(this.depth+1,o,{north:this.region.north,south:s?this.region.south:this.station.lat,east:this.region.east,west:s?this.station.lng:this.region.west}).build(o,e)}}clear(){this.station=void 0,this.left?.clear(),this.right?.clear(),this.left=void 0,this.right=void 0}async get(){if(this.station)return this.station;if(!this.segmentName)throw new Error("Segment name not found");const t=await k.treeSegments.get(this.segmentName);if(!t)throw new Error(`Tree segment ${this.segmentName} not found`);if(t.root!==this.code)throw new Error("Root node is not matched");const e=new Map;t.node_list.forEach(o=>e.set(o.code,o));const s=e.get(t.root);if(!s)throw new Error(`Root node ${t.root} not found`);if(await this.buildTree(s,e),!this.station)throw new Error("Station not found");return this.station}}class Q{root;lastPosition;lastChangedDate;currentStation;searchList=[];reactiveSearchList=C([]);serviceAvailable=!1;locked=!1;constructor(){}async initialize(t="root"){if(!await k.treeSegments.count())return this;const e=await k.treeSegments.get(t),s=new Map;if(!e)throw new Error(`Tree segment ${t} not found`);e.node_list.forEach(a=>s.set(a.code,a));const o=s.get(e.root);if(!o)throw new Error(`Root node ${e.root} not found`);return this.root=await new b(0,o,{north:90,south:-90,east:180,west:-180}).build(o,s),this.serviceAvailable=!0,this}clear(){this.root?.clear(),this.root=void 0}async updateLocation(t,e,s=0){const o=m.get("stationResultCount");if(o<1)throw new Error("maxResults must be greater than 0");if(!this.root)throw new Error("Tree not initialized");if(this.searchList.length>=o&&this.lastPosition?.latitude===t&&this.lastPosition?.longitude===e||this.locked)return;this.locked=!0,this.searchList=[],await this.search(this.root,t,e,o,s);const a=this.searchList[0].station,i=a.code!==this.currentStation?.code;this.currentStation=a,this.lastPosition={latitude:t,longitude:e};let n;if(i){const c=new Date;this.lastChangedDate=c;const h=await _.accessLog.get(a.id),l={lastAccess:c.toISOString(),accessCount:(h?.accessCount??0)+1};n=h?.lastAccess,h?await _.accessLog.update(a.id,l):(l.firstAccess=c.toISOString(),l.id=a.id,await _.accessLog.add(l))}this.reactiveSearchList.value=await Promise.all(this.searchList.map(async(c,h)=>{const l=await _.accessLog.get(c.station.id),w={station:c.station,distance:H(t,e,c.station.lat,c.station.lng),lastAccess:l?.lastAccess?new Date(l.lastAccess):null,accessCount:l?.accessCount??0,isNew:!l?.accessCount,index:h+1};if(h===0&&i){const p=m.get("cooldownSeconds"),v=L().diff(n??0,"second")<p;(!n||p&&!v)&&B(w)}return w})),this.locked=!1}async updateRectRegion(t,e){if(!this.root)throw new Error("Tree not initialized");const s=[];return await this.searchRect(this.root,t,s,e),s}get getReactive(){return this.reactiveSearchList}getAllNearStations(){return this.searchList.map(t=>t.station)}getNearStations(t){return this.searchList?(t<0&&(t=0),t>this.searchList.length&&(t=this.searchList.length),this.searchList.slice(0,t).map(e=>e.station)):[]}async search(t,e,s,o,a=0){const i={value:0,threshold:0},n=await t.get(),c=Math.sqrt(Math.pow(n.lat-e,2)+Math.pow(n.lng-s,2));let h=-1,l=this.searchList.length;if(l>0&&c<this.searchList[l-1].distance)for(h=l-1;h>0&&!(c>=this.searchList[h-1].distance);)h--;else l||(h=0);h>=0&&(this.searchList.splice(h,0,{station:n,distance:c}),l>=o&&this.searchList[l].distance>a&&this.searchList.pop());const w=t.depth%2===0;i.value=w?s:e,i.threshold=w?n.lng:n.lat;const p=i.value<i.threshold?t.left:t.right;p&&await this.search(p,e,s,o,a);const v=i.value<i.threshold?t.right:t.left,R=this.searchList;v&&Math.abs(i.value-i.threshold)<Math.max(R[R.length-1].distance,a)&&await this.search(v,e,s,o,a)}async searchRect(t,e,s,o){const a=await t.get();if(o&&s.length>=o)return;j(e,a.lat,a.lng)&&s.push(a);const i=[],n=t.depth%2===0?e.west<a.lng:e.south<a.lat,c=t.depth%2===0?a.lng<e.east:a.lat<e.north;t.left&&n&&i.push(this.searchRect(t.left,e,s,o)),t.right&&c&&i.push(this.searchRect(t.right,e,s,o)),await Promise.all(i)}}const $=await new Q().initialize(),U=W({__name:"MeStationSimple",props:{data:{}},setup(r){const t=r,e=C(null);let s=0,o=!1;q(t,()=>{a()});function a(){t.data.lastAccess&&!o&&i()}a();function i(){const n=m.get("cooldownSeconds"),c=m.get("enableStationReminder");if(!n){e.value=null;return}o=!0;const h=L().diff(L(t.data.lastAccess),"second");if(h<n){e.value=A(n-h),setTimeout(i,1e3);return}if(c&&t.data.index===1){e.value=A(n-s),s++,n-s<0&&(s=0,B(t.data,!0)),setTimeout(i,1e3);return}e.value=null,o=!1}return(n,c)=>(g(),E("div",{class:S([n.$style.root,"_panel transition-colors"])},[d("div",{class:S([n.$style.index,{[n.$style.accessed]:!n.data.isNew,[n.$style.cooldown]:u(e)}])},f(t.data.index),3),d("div",{class:S(n.$style.main)},[d("div",null,f(t.data.station.name),1),d("div",{class:S(n.$style.sub)},f(u(N)(t.data.distance)),3)],2),d("div",null,f(u(e)),1)],2))}}),X="_root_6oc7k_1",Y="_index_6oc7k_9",Z="_cooldown_6oc7k_20",x="_accessed_6oc7k_24",tt="_main_6oc7k_29",et="_sub_6oc7k_34",st={root:X,index:Y,cooldown:Z,accessed:x,main:tt,sub:et},ot={$style:st},it=z(U,[["__cssModules",ot]]),at={class:"_gap"},ut=W({__name:"index",setup(r){const t=y.isActive,e=$.getReactive,s=C({latitude:0,longitude:0,accuracy:0,updatedAt:""});function o(){t.value?y.stopWatch():y.startWatch(i=>{s.value={latitude:i.coords.latitude,longitude:i.coords.longitude,accuracy:i.coords.accuracy,updatedAt:L().format("HH:mm:ss")},$.updateLocation(i.coords.latitude,i.coords.longitude)})}function a(){y.getCurrentPosition().then(async i=>{$.updateLocation(i.coords.latitude,i.coords.longitude)})}return(i,n)=>(g(),E(T,null,[I(O,{color:u(t)?"primary":null,onClick:o},{default:P(()=>[u(t)?(g(),M(u(V),{key:1})):(g(),M(u(G),{key:0})),F(" 位置情報"+f(u(t)?"ON":"OFF"),1)]),_:1},8,["color"]),I(O,{onClick:a},{default:P(()=>[F("検索")]),_:1}),d("div",null,[d("div",null,f(u(s).latitude)+", "+f(u(s).longitude)+" (精度: "+f(u(N)(u(s).accuracy))+")",1),d("div",null,"最終更新: "+f(u(s).updatedAt),1)]),d("div",at,[(g(!0),E(T,null,D(u(e),c=>(g(),M(it,{key:c.station.id,data:c},null,8,["data"]))),128))])],64))}});export{ut as default};
