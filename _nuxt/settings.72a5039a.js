import{_ as T}from"./MeButton.a0d3d024.js";import{l as D,d as U,e as R}from"./updator.036a5925.js";import{f as M,k as N,r as C,g as v,l as f,o as b,c as y,a as o,t as $,m as j,v as q,h as n,q as p,n as d,F as S,i as A,b as m,s as F,_ as B,x as O,y as z,w as V,d as h}from"./entry.3b2d6913.js";import{d as E,s as u}from"./store.a3b86f48.js";const I={class:"_label"},L=["disabled","readonly"],P=M({__name:"MeSelect",props:{modelValue:{},readonly:{type:Boolean},disabled:{type:Boolean},items:{},label:{}},emits:["update:modelValue"],setup(k,{emit:c}){const l=k,{modelValue:a}=N(l),t=C(a.value);v(t,e=>{c("update:modelValue",e)}),v(a,e=>{t.value=e});const r=f(()=>{if(Array.isArray(l.items)){const e={};for(const s of l.items)e[s]=s;return e}else return l.items});return(e,s)=>(b(),y("div",null,[o("div",I,$(e.label),1),o("div",{class:d(e.$style.root)},[j(o("select",{"onUpdate:modelValue":s[0]||(s[0]=_=>p(t)?t.value=_:null),disabled:e.disabled,readonly:"readonly"in e?e.readonly:n(F),class:d(e.$style.select)},[(b(!0),y(S,null,A(n(r),(_,i)=>(b(),y("option",{key:i},$(_),1))),128))],10,L),[[q,n(t)]]),m(n(E),{class:d(e.$style.arrow)},null,8,["class"])],2)]))}}),x="_root_1fnem_1",G="_select_1fnem_6",H="_arrow_1fnem_27",J={root:x,select:G,arrow:H},K={$style:J},g=B(P,[["__cssModules",K]]),Q={class:"_label"},W=["onClick"],X=M({__name:"MeSwitch",props:{modelValue:{type:Boolean},label:{}},emits:["update:modelValue","click"],setup(k,{emit:c}){const l=k,{modelValue:a}=N(l),t=C(a.value);v(a,e=>{t.value=e});function r(){t.value=!t.value,c("update:modelValue",t.value),c("click")}return(e,s)=>(b(),y(S,null,[o("div",Q,$(e.label),1),o("div",{class:d(e.$style.root)},[o("input",{type:"checkbox",class:d(e.$style.input)},null,2),o("span",{class:d([e.$style.button,{[e.$style.checked]:n(t)}]),onClick:O(r,["prevent"])},[o("div",{class:d(e.$style.knob)},null,2)],10,W),o("span",{class:d(e.$style.text),onClick:r},[z(e.$slots,"default")],2)],2)],64))}}),Y="_root_10ff8_1",Z="_input_10ff8_7",ee="_button_10ff8_15",te="_checked_10ff8_31",se="_knob_10ff8_35",oe="_text_10ff8_51",le={root:Y,input:Z,button:ee,checked:te,knob:se,text:oe},ne={$style:le},w=B(X,[["__cssModules",ne]]),ae={class:"_gap"},ie=o("span",{class:"_section_title"},"通知",-1),ce=o("span",{class:"_section_title"},"テーマ",-1),de=o("span",{class:"_section_title"},"駅データ",-1),fe=M({__name:"settings",setup(k){const c=f(u.toModel("useDarkMode")),l=f(u.toModel("lightTheme")),a=f(u.toModel("darkTheme")),t=f(u.toModel("enableNotification"));function r(){if(Notification.permission==="denied"){alert("通知を許可してください"),u.set("enableNotification",!1);return}if(Notification.permission==="default"){Notification.requestPermission().then(e=>{e==="granted"&&u.set("enableNotification",!0)});return}u.set("enableNotification",!t.value)}return(e,s)=>{const _=T;return b(),y("div",ae,[ie,m(w,{modelValue:n(t),"onUpdate:modelValue":s[0]||(s[0]=i=>p(t)?t.value=i:null),onClick:r},{default:V(()=>[h("最寄り駅が変わったら通知する")]),_:1},8,["modelValue"]),ce,m(w,{modelValue:n(c),"onUpdate:modelValue":s[1]||(s[1]=i=>p(c)?c.value=i:null)},{default:V(()=>[h("ダークモードにする")]),_:1},8,["modelValue"]),m(g,{items:Object.keys(D),label:"ライトテーマ",modelValue:n(l),"onUpdate:modelValue":s[2]||(s[2]=i=>p(l)?l.value=i:null)},null,8,["items","modelValue"]),m(g,{items:Object.keys(U),label:"ダークテーマ",modelValue:n(a),"onUpdate:modelValue":s[3]||(s[3]=i=>p(a)?a.value=i:null)},null,8,["items","modelValue"]),de,m(_,{onClick:n(R)},{default:V(()=>[h("最新の駅データにする")]),_:1},8,["onClick"])])}}});export{fe as default};
