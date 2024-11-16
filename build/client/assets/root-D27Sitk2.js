import{t as y,v as h,w as m,x as S,r as i,_ as w,j as e,M as j,y as f,O as g,S as M}from"./components-DPsHuwtA.js";/**
 * @remix-run/react v2.13.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */let a="positions";function k({getKey:r,...l}){let{isSpaMode:u}=y(),o=h(),c=m();S({getKey:r,storageKey:a});let d=i.useMemo(()=>{if(!r)return null;let t=r(o,c);return t!==o.key?t:null},[]);if(u)return null;let p=((t,x)=>{if(!window.history.state||!window.history.state.key){let s=Math.random().toString(32).slice(2);window.history.replaceState({key:s},"")}try{let n=JSON.parse(sessionStorage.getItem(t)||"{}")[x||window.history.state.key];typeof n=="number"&&window.scrollTo(0,n)}catch(s){console.error(s),sessionStorage.removeItem(t)}}).toString();return i.createElement("script",w({},l,{suppressHydrationWarning:!0,dangerouslySetInnerHTML:{__html:`(${p})(${JSON.stringify(a)}, ${JSON.stringify(d)})`}}))}function v(){return e.jsx(e.Fragment,{children:e.jsxs("html",{suppressHydrationWarning:!0,children:[e.jsxs("head",{children:[e.jsx("meta",{charSet:"utf-8"}),e.jsx("meta",{name:"viewport",content:"width=device-width, initial-scale=1"}),e.jsx(j,{}),e.jsx(f,{})]}),e.jsxs("body",{suppressHydrationWarning:!0,children:[e.jsx(g,{}),e.jsx(k,{}),e.jsx(M,{})]})]})})}export{v as default};
