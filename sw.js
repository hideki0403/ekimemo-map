if(!self.define){let n,e={};const s=(s,r)=>(s=new URL(s+".js",r).href,e[s]||new Promise((e=>{if("document"in self){const n=document.createElement("script");n.src=s,n.onload=e,document.head.appendChild(n)}else n=s,importScripts(s),e()})).then((()=>{let n=e[s];if(!n)throw new Error(`Module ${s} didn’t register its module`);return n})));self.define=(r,i)=>{const u=n||("document"in self?document.currentScript.src:"")||location.href;if(e[u])return;let l={};const t=n=>s(n,u),o={module:{uri:u},exports:l,require:t};e[u]=Promise.all(r.map((n=>o[n]||t(n)))).then((n=>(i(...n),l)))}}define(["./workbox-56a10583"],(function(n){"use strict";importScripts("static/sw.js"),self.skipWaiting(),n.clientsClaim(),n.precacheAndRoute([{url:"_nuxt/dayjs.min.668a802a.js",revision:null},{url:"_nuxt/default.03c1d46d.js",revision:null},{url:"_nuxt/default.e05d4626.css",revision:null},{url:"_nuxt/entry.a85db09a.js",revision:null},{url:"_nuxt/entry.cdf67f9e.css",revision:null},{url:"_nuxt/error-404.7754c392.css",revision:null},{url:"_nuxt/error-404.83bb5533.js",revision:null},{url:"_nuxt/error-500.10602de9.css",revision:null},{url:"_nuxt/error-500.80ffd000.js",revision:null},{url:"_nuxt/index.81ce20a0.js",revision:null},{url:"_nuxt/index.bb961bb5.css",revision:null},{url:"_nuxt/map.26af93b6.js",revision:null},{url:"_nuxt/MeButton.b4e9f49f.css",revision:null},{url:"_nuxt/MeButton.f86411f0.js",revision:null},{url:"_nuxt/nuxt-link.0edda45f.js",revision:null},{url:"_nuxt/settings.6270b54e.css",revision:null},{url:"_nuxt/settings.6ceb831b.js",revision:null},{url:"_nuxt/store.b15c8b6a.js",revision:null},{url:"_nuxt/updator.c88a9949.js",revision:null},{url:"_nuxt/workbox-window.prod.es5.a7b12eab.js",revision:null},{url:"200",revision:"947df161695a6bab8596c6149c0c07b7"},{url:"404",revision:"947df161695a6bab8596c6149c0c07b7"},{url:"css/nuxt-google-fonts.css",revision:"21e724e640dbd14b769ec27221c4e299"},{url:"/",revision:"947df161695a6bab8596c6149c0c07b7"},{url:"map",revision:"947df161695a6bab8596c6149c0c07b7"},{url:"settings",revision:"947df161695a6bab8596c6149c0c07b7"},{url:"static/sw.js",revision:"2fe8744565d9824de9067fc11d982ed7"},{url:"manifest.webmanifest",revision:"6adcbd56b902784ed960657a9ce7ebd0"}],{}),n.cleanupOutdatedCaches(),n.registerRoute(new n.NavigationRoute(n.createHandlerBoundToURL("/")))}));
