# NarratorAI - AI-powered text narrations for your content

**NarratorAI** is a **Node JS** & **React** package that makes it easy to generate meta-content "narration" based on other content. It shines at reading and understanding your existing content like articles, help pages, blog posts, etc, and generating short, friendly summaries that tell the reader what content may be most useful to them.

For content creators, it lets you focus on your content itself, offloading the boring bits like "if you liked this, you might like our articles on X, Y and Z interesting" intro and outro content. It can also dynamically generate this content per-user, based on what they've been looking at or doing so far.

![Narration regeneration with Narrator AI](https://raw.githubusercontent.com/edspencer/narrator-ai/HEAD/packages/react/docs/Narration-regeneration.gif)

Examples of where it can be used include:

- Summarizing search results _a la_ the AI Overview on Google search results
- Introducing your latest content tagged with XYZ
- Paragraphs to introduce the topics most recently discussed on your blog
- "Read Next" paragraphs that link to other content based on what the user is currently viewing

## Key Features

- **Automates tedious meta-content generation**: Uses an LLM of your choice to generate meta-content for you
- **Quick & easy Training**: CLI and UI-driven training options to rapidly align the LLM to what you want
- **Built on top of Vercel AI SDK**: Fast, flexible and extensible foundation
- **Optional React Components**: make it easy to integrate and train Narrator live in your UI

## Installation

There are 2 packages - [narrator-ai](https://www.npmjs.com/package/narrator-ai) and [@narrator-ai/react](https://www.npmjs.com/package/@narrator-ai/react). `narrator-ai` generates the meta-content for you, and [@narrator-ai/react](https://www.npmjs.com/package/@narrator-ai/react) is a collection of React components that make it easy to show, regenerate and train Narrator via your UI:

```sh
npm install narrator-ai
npm install @narrator-ai/react
```

The React package is optional and it's easy to roll your own. Use it to get started or if you want to do in-place training live in your UI.

## Usage

To learn about how to generate content, check out the [narrator-ai docs](https://www.npmjs.com/package/narrator-ai). The @narrator-ai/react package is more focused on showing the content, though it also makes it easy to regenerate and train Narrator based on your feedback.

### Rendering Content

`NarratorAI` outputs text and optionally saves it to a file of your choice, so you can render it how you like from there. But if you use @narrator-ai/react you can use the included `Narration` component, in concert with the React context provided by `createNarrator`.

I use [@narrator-ai/react](https://www.npmjs.com/package/@narrator-ai/react) in various places in my [personal blog](https://edspencer.net) so I created a little `NarrationWrapper` that I can easily reuse and re-configure depending on the context. Here's my actual `NarrationWrapper`:

```tsx
import { Narration } from "@narrator-ai/react";
import NarrationMarkdown from "./NarrationMarkdown";

const sparkleText = "This summary was generated by AI using my narrator-ai npm package.<br /> Click to learn more.";

export function NarrationWrapper({
  id,
  title,
  className,
  titleClassName,
}: {
  id: string;
  title: string;
  className?: string;
  titleClassName?: string;
}) {
  return (
    <Narration
      title={title}
      id={id}
      className={className}
      titleClassName={titleClassName}
      sparkleLink="/about/ai"
      sparkleText={sparkleText}
      showActions={process.env.NODE_ENV === "development"}
    >
      <NarrationMarkdown id={id} />
    </Narration>
  );
}
```

This simple React component accomplishes a few things:

- Lets me pass in a title ("7 posts tagged ai" in this case)
- Shows me buttons to regenerate, mark as good/bad generation only when I'm developing
- Configures an "AI Sparkle" with some text to let the reader know this section was AI generated
- Delegates the actual rendering of the content to `NarrationMarkdown`
- Lets me pass in optional `className`/`titleClassName` props to control styling

And here's what it looks like when rendered:

![NarrationWrapper screenshot](https://raw.githubusercontent.com/edspencer/narrator-ai/HEAD/packages/react/docs/Narration-example.png)

My actual `NarrationMarkdown` component looks like this:

```tsx
"use server";

import { narrator } from "@/lib/blog/TaskFactory";
import { MDXRemote } from "next-mdx-remote/rsc";

async function NarrationMarkdown({ id }) {
  const content = narrator.getNarration(id);

  if (!content) {
    return null;
  } else {
    return <MDXRemote source={content} />;
  }
}

export default NarrationMarkdown;
```

That just grabs the `narrator` instance we created earlier, and uses its `getNarration` function to fetch the content itself, rendering it using the excellent [MDXRemote](https://github.com/hashicorp/next-mdx-remote) library. In this case we're able to render everything using React Server Components, but you could do it the old `useEffect` way if you wanted.

### Narration Provider

To take advantage of the content regeneration and training buttons present in the Narration UI, we need to wrap our UI in a Narrator context, which provides the functionality to regenerate/train when we click the buttons. The easiest way to do that is via `createNarrator`:

```tsx
//this file is called ./providers/Narrator.tsx, but call it what you like
import { createNarrator } from "@narrator-ai/react";
import { regenerateNarration, saveExample } from "../actions/narration";

//this just creates a React context provider that helps Narrator perform regeneration & training
const NarratorProvider = createNarrator({
  actions: {
    saveExample,
    regenerateNarration,
  },
});

export default NarratorProvider;
```

Now we just place that Narrator provider into our app layout, such that all of our usages of `Narration` or `NarrationWrapper` are children of it:

```tsx
import NarratorProvider from "./providers/Narrator";

export default function layout({ children }) {
  return <NarratorProvider>{children}</NarratorProvider>;
}
```

### Server Functions

The provider we created using `createNarrator` took a couple of optional arguments, `regenerateNarration` and `saveExample`. Here's an example of how you might choose to implement those. The `regenerateNarration` function below uses the Vercel AI SDK along with MDXRemote to stream rendered markdown content back to the browser. You could also just have it return a string, but streaming is where it's at:

```ts
'use server';

import { TaskFactory, narrator } from '@/lib/blog/TaskFactory';
import { createStreamableUI } from 'ai/rsc';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Spinner } from '@narrator-ai/react';

//this is fancy... it returns a streaming MDXRemote component so that you can see the new content
//stream in instead of waiting. You could also just return a string - Narrator supports that too
export async function regenerateNarration(docId: string) {
  const editor = await TaskFactory.create();
  const ui = createStreamableUI(<Spinner />);

  (async () => {
    const textStream = await narrator.generate(editor.jobForId(docId), { stream: true, save: true });
    let currentContent = '';

    for await (const delta of textStream) {
      currentContent += delta;
      ui.update(<MDXRemote source={currentContent} />);
    }

    ui.done(<MDXRemote source={currentContent} />);
  })();

  return ui.value;
}

//this gets called if you click the thumbs up/down buttons in the UI
export async function saveExample(example) {
  return await narrator.saveExample(example);
}
```

Now we can click the regenerate button to our heart's content in the UI, and see new content generations streaming in:

![Narration regeneration via the UI](https://raw.githubusercontent.com/edspencer/narrator-ai/HEAD/packages/react/docs/Narration-regeneration.gif)

#### Don't forget about security

Don't forget - Server Functions are API endpoints. Just because you didn't write any code that exposes your `regenerateNarration` and `saveExample` functions to an HTTP endpoint a la Express JS, it doesn't mean you can treat these as if they're private or protected in any way.

There's a good chance you only use these functions while developing locally (unless you want your users rating and regenerating your NarratorAI-generated content), in which case you can disable these Server Functions outside of the dev env and you're all good. But if you do want these features to be user-facing, bear in mind that you may need to add some auth to these functions.

## Training

Spending 5 minutes to train Narrator is likely to significantly improve your results. Training just means giving a good/bad verdict to a piece of content that Narrator generated. Narrator saves this verdict, along with an optional reason (you don't have to give a reason, but it's a good idea), and next time it generates content for you it will use those good/bad examples to produce a better response.

Under the covers, Narrator uses Few Shot Prompting to grab a selection of the content examples you marked as good or bad, and automatically passes them to the LLM along with your prompt when you call `generate`.

Training is done via the `train` and `saveExample` functions, and is easy to hook up to the command line, and even easier to hook up to your UI if you use [@narrator-ai/react](https://www.npmjs.com/package/@narrator-ai/react).

### Training in the UI

If you are using [@narrator-ai/react](https://www.npmjs.com/package/@narrator-ai/react), you can train Narrator directly in your UI while you're developing. This is perhaps even easier than doing it via the CLI, and has the benefit of showing you the fully rendered content in the actual context it will be shown in inside your UI.

If you set up your Narrator provider like shown above, you can now train directly in your UI by just clicking the thumbs up/down buttons and optionally providing a reason for your selection. The outcome is exactly the same as in the CLI, but this is more fun:

![Training via the UI](https://raw.githubusercontent.com/edspencer/narrator-ai/HEAD/packages/react/docs/Narration-training.gif)

### Training in the CLI

You can also train Narrator via the CLI - see the [narrator-ai docs](https://www.npmjs.com/package/narrator-ai) for information on how to do this.

## Configuration

### Narration

The principal component in this package is `<Narration>`, which can be configured in the following ways:

```tsx
<Narration
  //The title that will be rendered (inside an h1 tag unless you specify a titleTag)
  title="Some Title"
  //the docId that should be shown in this component
  id="post/my-awesome-post"
  //optional CSS classes to add to the outer element
  className="border border-red-500"
  //optional CSS class names to add to the rendered titleTag
  titleClassName="text-3xl"
  //titleTag defaults to h1 but you can pass in any element type you like here
  titleTag="h3"
  //if provided, the sparkle will be a link to this url
  sparkleLink="/url/to/go/when/sparkle/is/clicked"
  //if provided, the sparkle will show a tooltip when hovered
  sparkleText="Tooltip text that will show<br /> when hovering over the sparkle"
  //to show the regenerate/thumbs up/thumbs down buttons (defaults to false)
  showActions={true}
  //to show the sparkle icon (defaults to true)
  showSparkle={false}
>
  <MyCustomTextRenderingComponent id="post/my-awesome-post" />
</Narration>
```

The only other configuration is `children`, which in the case above is the well-named `<MyCustomTextRenderingComponent>`. Because you probably have your own way of rendering the actual content, Narration doesn't do this for you, it just wraps your own component so you can style it how you like.

Take a look at the `<NarrationWrapper>` example component defined above for one way to do this - in that case using Markdown.

While regenerating content, whatever you passed in as `children` (e.g. your `<MyCustomTextRenderingComponent>`) will be replaced with whatever your `regenerateNarration` function returned. In the example found in the "Server Functions" section above, `regenerateNarration` streams back a React component using Vercel AI SDK's [createStreamableUI](https://sdk.vercel.ai/docs/reference/ai-sdk-rsc/create-streamable-ui) function, which is what allows the UI to stream the rendered Markdown text back to the browser.

### NarrationProvider

The `NarrationProvider` is a React context provider that chiefly exists in order to support the in-UI regeneration and rating of generated content. If you don't need to use the buttons rendered by setting `showActions` to true, then you probably don't need to use `<Narration>` either as that's most of what the component provides for you - the rest is just rendering a title and some content, the latter of which you have to handle anyway.

NarrationProvider is usually created via `createNarrator`, like this:

```tsx
//this file is called ./providers/Narrator.tsx, but call it what you like
import { createNarrator } from "@narrator-ai/react";
import { regenerateNarration, saveExample } from "../actions/narration";

//this just creates a React context provider that helps Narrator perform regeneration & training
const NarratorProvider = createNarrator({
  actions: {
    saveExample,
    regenerateNarration,
  },
});

export default NarratorProvider;
```

#### saveExample

Narration will call your `saveExample` function whenever the thumbs up/down buttons are clicked, and whenever the `<ReasonForm>` is submitted (the form that pops up to allow you to enter a reason for your judgment). It is passed an object with up to 3 keys:

- **docId** - the id of the content you judged
- **verdict** - 'good' or 'bad', depending on which thumb you clicked
- **reason** - optional, will be a string if passed at all. Whatever you typed into ReasonForm

You can pass all this directly through to the narrator - this could be your `actions/narration.ts` file, for example:

```ts
const narrator = new Narrator({
  outputDir: "/path/to/some/place",
  examplesDir: "/path/to/examples/dir",
});

export async function saveExample(example): boolean {
  //you could/should do some auth or other stuff here

  //but really, this is all you need to make it work
  return await narrator.saveExample(example);
}
```

#### regenerateNarration

Your `regenerateNarration` function will be called whenever you click the regenerate button in the title bar of a `<Narration>` component (`showActions` must be true for those buttons to be rendered). This function can return either a string, a text stream or a UI stream (via the Vercel AI SDK).

Each of these code examples uses the Factory pattern to create the `GenerationTask` objects that we send to `narrator.generate()`. See the [narrator-ai docs](https://github.com/edspencer/narrator-ai?tab=readme-ov-file#factory-pattern) for examples of how that can be done, but basically `editor.getJobForId(docId)` is just returning a JS object with a `docId` and a `prompt`.

First, here's how to do the simplest thing and just return a string:

```ts
export async function regenerateNarration(docId: string) {
  //this might take a few seconds to resolve...
  const text = await narrator.generate(editor.jobForId(docId), { save: true });

  //text is a string
  return text;
}
```

Streaming is better though, right? Here's how to stream the text back instead:

```ts
import { createStreamableValue } from "ai/rsc";

export async function regenerateNarration(docId: string) {
  const stream = createStreamableValue("");

  //note that we're now passing in stream: true
  (async () => {
    const textStream = await narrator.generate(editor.jobForId(docId), { stream: true, save: true });

    for await (const delta of textStream) {
      stream.update(delta);
    }

    stream.done();
  })();

  //this is a streamable value that Narration knows how to consume
  return stream.value;
}
```

Streaming text is one thing, but streaming React components is so much more satisfying:

```tsx
import { createStreamableUI } from "ai/rsc";

export async function regenerateNarration(docId: string) {
  const ui = createStreamableUI(<Spinner />);

  (async () => {
    const textStream = await narrator.generate(editor.jobForId(docId), { stream: true, save: true });
    let currentContent = "";

    for await (const delta of textStream) {
      currentContent += delta;
      ui.update(<MDXRemote source={currentContent} />);
    }

    ui.done(<MDXRemote source={currentContent} />);
  })();

  //this is a streamable UI object that Narration knows how to consume
  return ui.value;
}
```

That third `regenerateNarration` function above is the exact code that makes this streaming Markdown work:

![Narration regeneration via the UI](https://raw.githubusercontent.com/edspencer/narrator-ai/HEAD/packages/react/docs/Narration-regeneration.gif)

Check out the docs on [createStreamableUI](https://sdk.vercel.ai/docs/reference/ai-sdk-rsc/create-streamable-ui) and [createStreamableValue](https://sdk.vercel.ai/docs/reference/ai-sdk-rsc/create-streamable-value) for more information on how to use those parts of the Vercel AI SDK.