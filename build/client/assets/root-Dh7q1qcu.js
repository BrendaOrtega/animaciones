import{r as a,j as e}from"./jsx-runtime-DYkViK2L.js";import{p as j,q as g,t as m,v as x,_ as y,M as f,w,O as S,S as E,x as v,y as k}from"./components-BMN4foKF.js";/**
 * @remix-run/react v2.13.1
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */let l="positions";function T({getKey:t,...o}){let{isSpaMode:s}=j(),r=g(),h=m();x({getKey:t,storageKey:l});let d=a.useMemo(()=>{if(!t)return null;let n=t(r,h);return n!==r.key?n:null},[]);if(s)return null;let p=((n,u)=>{if(!window.history.state||!window.history.state.key){let i=Math.random().toString(32).slice(2);window.history.replaceState({key:i},"")}try{let c=JSON.parse(sessionStorage.getItem(n)||"{}")[u||window.history.state.key];typeof c=="number"&&window.scrollTo(0,c)}catch(i){console.error(i),sessionStorage.removeItem(n)}}).toString();return a.createElement("script",y({},o,{suppressHydrationWarning:!0,dangerouslySetInnerHTML:{__html:`(${p})(${JSON.stringify(l)}, ${JSON.stringify(d)})`}}))}const M=t=>{const o="G-BN504Z5FBK";a.useEffect(()=>{const s=document.createElement("script"),r=document.createElement("script");s.async=!0,s.src=`https://www.googletagmanager.com/gtag/js?id=${o}`,r.innerText=`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${o}');
        `,document.head.appendChild(s),document.head.appendChild(r)},[])},R=()=>{a.useEffect(()=>{const t=document.createElement("script");t.innerText=`
        (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:5220566,hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `,document.head.appendChild(t)},[])},_=()=>[{rel:"icon",href:"/icon.svg",type:"image/svg"}];function L(){return M(),R(),e.jsx(e.Fragment,{children:e.jsxs("html",{suppressHydrationWarning:!0,children:[e.jsxs("head",{children:[e.jsx("meta",{charSet:"utf-8"}),e.jsx("meta",{name:"viewport",content:"width=device-width, initial-scale=1"}),e.jsx(f,{}),e.jsx(w,{})]}),e.jsxs("body",{suppressHydrationWarning:!0,children:[e.jsx(S,{}),e.jsx(T,{}),e.jsx(E,{})]})]})})}function F(){const t=v();return k(t)?e.jsxs("html",{children:[e.jsx("head",{children:e.jsx("meta",{charset:"UTF-8"})}),e.jsx("body",{children:e.jsx("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh",textAlign:"center"},children:e.jsxs("div",{children:[e.jsx("img",{style:{width:"180px"},src:"/404.svg"}),e.jsx("h1",{style:{fontFamily:"monospace"},children:"Ups ¡Esta página no existe!"}),e.jsx("a",{href:"/",children:e.jsx("button",{style:{height:"48px",borderRadius:"24px",backgroundColor:"#5158F6",padding:"0 16px",color:"white",border:"none",marginTop:"32px",cursor:"pointer"},children:"Volver a la página principal"})})]})})})]}):t instanceof Error?e.jsxs("div",{children:[e.jsx("h1",{children:"como estan"}),e.jsxs("p",{children:["hola",t.message]}),e.jsx("p",{children:"The stack trace is:"}),e.jsx("pre",{children:t.stack})]}):e.jsx("h1",{children:"Unknown Error"})}export{F as ErrorBoundary,L as default,_ as links};
