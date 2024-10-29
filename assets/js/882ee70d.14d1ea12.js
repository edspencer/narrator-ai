"use strict";(self.webpackChunkdocs_2=self.webpackChunkdocs_2||[]).push([[748],{6563:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>o,contentTitle:()=>s,default:()=>h,frontMatter:()=>a,metadata:()=>d,toc:()=>c});var i=r(4848),t=r(8453);const a={},s="Interface: SaveExampleArgs",d={id:"api/interfaces/SaveExampleArgs",title:"Interface: SaveExampleArgs",description:"Arguments for saving examples.",source:"@site/docs/api/interfaces/SaveExampleArgs.md",sourceDirName:"api/interfaces",slug:"/api/interfaces/SaveExampleArgs",permalink:"/api/interfaces/SaveExampleArgs",draft:!1,unlisted:!1,tags:[],version:"current",frontMatter:{},sidebar:"docs",previous:{title:"GenerateOptions",permalink:"/api/interfaces/GenerateOptions"},next:{title:"Narration",permalink:"/api/type-aliases/Narration"}},o={},c=[{value:"Properties",id:"properties",level:2},{value:"content?",id:"content",level:3},{value:"Defined in",id:"defined-in",level:4},{value:"docId",id:"docid",level:3},{value:"Defined in",id:"defined-in-1",level:4},{value:"reason?",id:"reason",level:3},{value:"Defined in",id:"defined-in-2",level:4},{value:"verdict",id:"verdict",level:3},{value:"Defined in",id:"defined-in-3",level:4}];function l(e){const n={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",header:"header",hr:"hr",p:"p",strong:"strong",...(0,t.R)(),...e.components};return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(n.header,{children:(0,i.jsx)(n.h1,{id:"interface-saveexampleargs",children:"Interface: SaveExampleArgs"})}),"\n",(0,i.jsx)(n.p,{children:"Arguments for saving examples."}),"\n",(0,i.jsx)(n.h2,{id:"properties",children:"Properties"}),"\n",(0,i.jsx)(n.h3,{id:"content",children:"content?"}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"optional"})," ",(0,i.jsx)(n.strong,{children:"content"}),": ",(0,i.jsx)(n.code,{children:"string"})]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"The content of the example being saved.\nIf not provided, it defaults to the generated content associated with the document ID.\n(optional)"}),"\n",(0,i.jsx)(n.h4,{id:"defined-in",children:"Defined in"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.a,{href:"https://github.com/edspencer/narrator-ai/blob/a524b8822fae61097d8b11019e587b0b06c3350a/packages/narrator-ai/src/Narrator.ts#L133",children:"Narrator.ts:133"})}),"\n",(0,i.jsx)(n.hr,{}),"\n",(0,i.jsx)(n.h3,{id:"docid",children:"docId"}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"docId"}),": ",(0,i.jsx)(n.code,{children:"string"})]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:"The document ID for the example. This ID is used to identify the document being evaluated."}),"\n",(0,i.jsx)(n.h4,{id:"defined-in-1",children:"Defined in"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.a,{href:"https://github.com/edspencer/narrator-ai/blob/a524b8822fae61097d8b11019e587b0b06c3350a/packages/narrator-ai/src/Narrator.ts#L126",children:"Narrator.ts:126"})}),"\n",(0,i.jsx)(n.hr,{}),"\n",(0,i.jsx)(n.h3,{id:"reason",children:"reason?"}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.code,{children:"optional"})," ",(0,i.jsx)(n.strong,{children:"reason"}),": ",(0,i.jsx)(n.code,{children:"string"})]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:'The reason for assigning the verdict. This provides context or justification for why\nthe example was marked as "good" or "bad".\n(optional)'}),"\n",(0,i.jsx)(n.h4,{id:"defined-in-2",children:"Defined in"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.a,{href:"https://github.com/edspencer/narrator-ai/blob/a524b8822fae61097d8b11019e587b0b06c3350a/packages/narrator-ai/src/Narrator.ts#L146",children:"Narrator.ts:146"})}),"\n",(0,i.jsx)(n.hr,{}),"\n",(0,i.jsx)(n.h3,{id:"verdict",children:"verdict"}),"\n",(0,i.jsxs)(n.blockquote,{children:["\n",(0,i.jsxs)(n.p,{children:[(0,i.jsx)(n.strong,{children:"verdict"}),": ",(0,i.jsx)(n.code,{children:"string"})]}),"\n"]}),"\n",(0,i.jsx)(n.p,{children:'The verdict for the example, indicating whether the example is classified as "good" or "bad".\nThis verdict is used to categorize the example.'}),"\n",(0,i.jsx)(n.h4,{id:"defined-in-3",children:"Defined in"}),"\n",(0,i.jsx)(n.p,{children:(0,i.jsx)(n.a,{href:"https://github.com/edspencer/narrator-ai/blob/a524b8822fae61097d8b11019e587b0b06c3350a/packages/narrator-ai/src/Narrator.ts#L139",children:"Narrator.ts:139"})})]})}function h(e={}){const{wrapper:n}={...(0,t.R)(),...e.components};return n?(0,i.jsx)(n,{...e,children:(0,i.jsx)(l,{...e})}):l(e)}},8453:(e,n,r)=>{r.d(n,{R:()=>s,x:()=>d});var i=r(6540);const t={},a=i.createContext(t);function s(e){const n=i.useContext(a);return i.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function d(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(t):e.components||t:s(e.components),i.createElement(a.Provider,{value:n},e.children)}}}]);