"use strict";(self.webpackChunkdocs_2=self.webpackChunkdocs_2||[]).push([[443],{2205:(e,r,n)=>{n.r(r),n.d(r,{assets:()=>c,contentTitle:()=>i,default:()=>h,frontMatter:()=>o,metadata:()=>s,toc:()=>l});var t=n(4848),a=n(8453);const o={sidebar_position:3,title:"Rendering Content"},i="Rendering Content",s={id:"rendering",title:"Rendering Content",description:"NarratorAI outputs text and optionally saves it to a file of your choice, so you can render it how you like from there. If you're using React you may choose to use the @narrator-ai/react package to get some nice features out of the box:",source:"@site/docs/rendering.md",sourceDirName:".",slug:"/rendering",permalink:"/narrator-ai/rendering",draft:!1,unlisted:!1,tags:[],version:"current",sidebarPosition:3,frontMatter:{sidebar_position:3,title:"Rendering Content"},sidebar:"docs",previous:{title:"Generating Content",permalink:"/narrator-ai/generation"},next:{title:"Training Narrator",permalink:"/narrator-ai/training"}},c={},l=[{value:"Narration Provider",id:"narration-provider",level:3},{value:"Server Functions",id:"server-functions",level:3}];function d(e){const r={a:"a",code:"code",h1:"h1",h3:"h3",header:"header",img:"img",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,a.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(r.header,{children:(0,t.jsx)(r.h1,{id:"rendering-content",children:"Rendering Content"})}),"\n",(0,t.jsxs)(r.p,{children:[(0,t.jsx)(r.code,{children:"NarratorAI"})," outputs text and optionally saves it to a file of your choice, so you can render it how you like from there. If you're using ",(0,t.jsx)(r.strong,{children:"React"})," you may choose to use the ",(0,t.jsx)(r.a,{href:"https://www.npmjs.com/package/@narrator-ai/react",children:"@narrator-ai/react"})," package to get some nice features out of the box:"]}),"\n",(0,t.jsx)(r.pre,{children:(0,t.jsx)(r.code,{className:"language-sh",children:"npm install @narrator-ai/react\n"})}),"\n",(0,t.jsxs)(r.p,{children:["I use ",(0,t.jsx)(r.a,{href:"https://www.npmjs.com/package/@narrator-ai/react",children:"@narrator-ai/react"})," in various places in my ",(0,t.jsx)(r.a,{href:"https://edspencer.net",children:"personal blog"})," so I created a little ",(0,t.jsx)(r.code,{children:"NarrationWrapper"})," that I can easily reuse and re-configure depending on the context. Here's my actual ",(0,t.jsx)(r.code,{children:"NarrationWrapper"}),":"]}),"\n",(0,t.jsx)(r.pre,{children:(0,t.jsx)(r.code,{className:"language-tsx",children:'import { Narration } from "@narrator-ai/react";\nimport NarrationMarkdown from "./NarrationMarkdown";\n\nconst sparkleText = "This summary was generated by AI using my narrator-ai npm package.<br /> Click to learn more.";\n\nexport function NarrationWrapper({\n  id,\n  title,\n  className,\n  titleClassName,\n}: {\n  id: string;\n  title: string;\n  className?: string;\n  titleClassName?: string;\n}) {\n  return (\n    <Narration\n      title={title}\n      id={id}\n      className={className}\n      titleClassName={titleClassName}\n      sparkleLink="/about/ai"\n      sparkleText={sparkleText}\n      showActions={process.env.NODE_ENV === "development"}\n    >\n      <NarrationMarkdown id={id} />\n    </Narration>\n  );\n}\n'})}),"\n",(0,t.jsx)(r.p,{children:"This simple React component accomplishes a few things:"}),"\n",(0,t.jsxs)(r.ul,{children:["\n",(0,t.jsx)(r.li,{children:'Lets me pass in a title ("7 posts tagged ai" in this case)'}),"\n",(0,t.jsx)(r.li,{children:"Shows me buttons to regenerate, mark as good/bad generation only when I'm developing"}),"\n",(0,t.jsx)(r.li,{children:'Configures an "AI Sparkle" with some text to let the reader know this section was AI generated'}),"\n",(0,t.jsxs)(r.li,{children:["Delegates the actual rendering of the content to ",(0,t.jsx)(r.code,{children:"NarrationMarkdown"})]}),"\n",(0,t.jsxs)(r.li,{children:["Lets me pass in optional ",(0,t.jsx)(r.code,{children:"className"}),"/",(0,t.jsx)(r.code,{children:"titleClassName"})," props to control styling"]}),"\n"]}),"\n",(0,t.jsx)(r.p,{children:"And here's what it looks like when rendered:"}),"\n",(0,t.jsx)(r.p,{children:(0,t.jsx)(r.img,{alt:"NarrationWrapper screenshot",src:n(6464).A+"",width:"630",height:"242"})}),"\n",(0,t.jsxs)(r.p,{children:["My actual ",(0,t.jsx)(r.code,{children:"NarrationMarkdown"})," component looks like this:"]}),"\n",(0,t.jsx)(r.pre,{children:(0,t.jsx)(r.code,{className:"language-tsx",children:'"use server";\n\nimport { narrator } from "@/lib/blog/TaskFactory";\nimport { MDXRemote } from "next-mdx-remote/rsc";\n\nasync function NarrationMarkdown({ id }) {\n  const content = narrator.getNarration(id);\n\n  if (!content) {\n    return null;\n  } else {\n    return <MDXRemote source={content} />;\n  }\n}\n\nexport default NarrationMarkdown;\n'})}),"\n",(0,t.jsxs)(r.p,{children:["That just grabs the ",(0,t.jsx)(r.code,{children:"narrator"})," instance we created earlier, and uses its ",(0,t.jsx)(r.code,{children:"getNarration"})," function to fetch the content itself, rendering it using the excellent ",(0,t.jsx)(r.a,{href:"https://github.com/hashicorp/next-mdx-remote",children:"MDXRemote"})," library. In this case we're able to render everything using React Server Components, but you could do it the old ",(0,t.jsx)(r.code,{children:"useEffect"})," way if you wanted."]}),"\n",(0,t.jsx)(r.h3,{id:"narration-provider",children:"Narration Provider"}),"\n",(0,t.jsxs)(r.p,{children:["To take advantage of the content regeneration and training buttons present in the Narration UI, we need to wrap our UI in a Narrator context, which provides the functionality to regenerate/train when we click the buttons. The easiest way to do that is via ",(0,t.jsx)(r.code,{children:"createNarrator"}),":"]}),"\n",(0,t.jsx)(r.pre,{children:(0,t.jsx)(r.code,{className:"language-tsx",children:'//this file is called ./providers/Narrator.tsx, but call it what you like\nimport { createNarrator } from "@narrator-ai/react";\nimport { regenerateNarration, saveExample } from "../actions/narration";\n\n//this just creates a React context provider that helps Narrator perform regeneration & training\nconst NarratorProvider = createNarrator({\n  actions: {\n    saveExample,\n    regenerateNarration,\n  },\n});\n\nexport default NarratorProvider;\n'})}),"\n",(0,t.jsxs)(r.p,{children:["Now we just place that Narrator provider into our app layout, such that all of our usages of ",(0,t.jsx)(r.code,{children:"Narration"})," or ",(0,t.jsx)(r.code,{children:"NarrationWrapper"})," are children of it:"]}),"\n",(0,t.jsx)(r.pre,{children:(0,t.jsx)(r.code,{className:"language-tsx",children:'import NarratorProvider from "./providers/Narrator";\n\nexport default function layout({ children }) {\n  return <NarratorProvider>{children}</NarratorProvider>;\n}\n'})}),"\n",(0,t.jsx)(r.h3,{id:"server-functions",children:"Server Functions"}),"\n",(0,t.jsxs)(r.p,{children:["The provider we created using ",(0,t.jsx)(r.code,{children:"createNarrator"})," took a couple of optional arguments, ",(0,t.jsx)(r.code,{children:"regenerateNarration"})," and ",(0,t.jsx)(r.code,{children:"saveExample"}),". Here's an example of how you might choose to implement those. The ",(0,t.jsx)(r.code,{children:"regenerateNarration"})," function below uses the Vercel AI SDK along with MDXRemote to stream rendered markdown content back to the browser. You could also just have it return a string, but streaming is where it's at:"]}),"\n",(0,t.jsx)(r.pre,{children:(0,t.jsx)(r.code,{className:"language-ts",children:"'use server';\n\nimport { TaskFactory, narrator } from '@/lib/blog/TaskFactory';\nimport { createStreamableUI } from 'ai/rsc';\nimport { MDXRemote } from 'next-mdx-remote/rsc';\nimport { Spinner } from '@narrator-ai/react';\n\n//this is fancy... it returns a streaming MDXRemote component so that you can see the new content\n//stream in instead of waiting. You could also just return a string - Narrator supports that too\nexport async function regenerateNarration(docId: string) {\n  const editor = await TaskFactory.create();\n  const ui = createStreamableUI(<Spinner />);\n\n  (async () => {\n    const textStream = await narrator.generate(editor.jobForId(docId), { stream: true, save: true });\n    let currentContent = '';\n\n    for await (const delta of textStream) {\n      currentContent += delta;\n      ui.update(<MDXRemote source={currentContent} />);\n    }\n\n    ui.done(<MDXRemote source={currentContent} />);\n  })();\n\n  return ui.value;\n}\n\n//this gets called if you click the thumbs up/down buttons in the UI\nexport async function saveExample(example) {\n  return await narrator.saveExample(example);\n}\n"})}),"\n",(0,t.jsx)(r.p,{children:"Now we can click the regenerate button to our heart's content in the UI, and see new content generations streaming in:"}),"\n",(0,t.jsx)(r.p,{children:(0,t.jsx)(r.img,{alt:"Narration regeneration via the UI",src:n(7030).A+"",width:"640",height:"144"})})]})}function h(e={}){const{wrapper:r}={...(0,a.R)(),...e.components};return r?(0,t.jsx)(r,{...e,children:(0,t.jsx)(d,{...e})}):d(e)}},6464:(e,r,n)=>{n.d(r,{A:()=>t});const t=n.p+"assets/images/Narration-example-a163b3874657d884828ab312e8cef1cc.png"},7030:(e,r,n)=>{n.d(r,{A:()=>t});const t=n.p+"assets/images/Narration-regeneration-f51f65c8959adb41ca3d7e8658bc2919.gif"},8453:(e,r,n)=>{n.d(r,{R:()=>i,x:()=>s});var t=n(6540);const a={},o=t.createContext(a);function i(e){const r=t.useContext(o);return t.useMemo((function(){return"function"==typeof e?e(r):{...r,...e}}),[r,e])}function s(e){let r;return r=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:i(e.components),t.createElement(o.Provider,{value:r},e.children)}}}]);