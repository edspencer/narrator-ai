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

### Generating Content

All of the configurations for Narrator are optional, but if you want to generate and save content you can pass in `outputDir` and (optionally) `outputFilename` to have Narrator automatically save its generations for you. For example, if we want to save our generated content as `.md` files in the `./editorial` directory, we can configure it like this:

```tsx
export const narrator = new Narrator({
  outputFilename: (docId) => `${docId}.md`,
  outputDir: path.join(process.cwd(), "editorial"),
});
```

Now we can generate some content, which in this case will be saved to `./editorial/tag/ai.md` (directories will be created for you):

```tsx
const content = await narrator.generate(
  {
    docId: "tag/ai",
    suffix: "Please reply with only the markdown you generate", //suffix is optional
    prompt: `
These are summaries of my most recent articles about AI. Your task is to generate a 2-3 sentence
introduction that tells readers at-a-glance what I've been writing about. Please generate markdown,
and include links to the articles. Do not use triple backticks or section headings in your response.

<<Articles go here>>
`,
  },
  { save: true }
);
```

This will generate content for you and save it according to the configuration you provided. You can set `docId` to whatever you want - in this case we're generating intro text for a blog that contains [articles about AI](https://edspencer.net/blog/tag/ai). If you don't specify a `model` it will default to using OpenAI's "gpt-4o", but you can pass in any model provided by the [Vercel AI SDK](https://sdk.vercel.ai/docs/introduction).

### Rendering Content

See the @narrator-ai/react docs for

`NarratorAI` outputs text and optionally saves it to a file of your choice, so you can render it how you like from there. If you're using **React** you may choose to use the [@narrator-ai/react](https://www.npmjs.com/package/@narrator-ai/react) package to get some nice features out of the box:

![Example of @narrator-ai/react](https://raw.githubusercontent.com/edspencer/narrator-ai/HEAD/packages/narrator-ai/docs/UI-training-example.gif)

Check out the [@narrator-ai/react](https://www.npmjs.com/package/@narrator-ai/react) docs for more.

## Prompting

In the example above I left an `<<Articles go here>>` string inside the `prompt` that I passed to `generate()`, but that's not much use - we need to provide the articles themselves. My prompt also referred to summaries of the articles - you could pass the whole article in but it's generally a better idea to summarize them first or the LLM can lose track of what its supposed to be doing.

Generating the prompt strings is really up to you, but a good pattern is to use a Factory to create the `prompt` for a given docId. This allows you to encapsulate the logic for fetching those articles (or whatever else you need to fetch) in a centralized place, and as an added benefit makes it easy to regenerate content for a given `docId` - which is exactly what [@narrator-ai/react](https://www.npmjs.com/package/@narrator-ai/react) does when you click the "Regenerate section" button.

### Factory pattern

Here's a simplified version of the Factory I use to generate content for my blog. I generate 3 types of content:

- Tag intro sections - docIds like `tag/ai` or `tag/rsc`
- Post outro sections - docIds like `post/whatever-the-post-url-slug-is`
- Blog intro section - like a tag intro section but it's for all recent posts (docId is `recent-posts`)

I'll skip that last category for simplicity and pretend we only generate tag intros and post outros:

```tsx
class TaskFactory {
  //returns a GenerationTask for a given docId
  jobForId(docId: string): GenerationTask {
    const [exampleKey, slug] = docId.split("/");
    const { publishedPosts } = this.posts;

    if (exampleKey === "post") {
      return this.postJob(publishedPosts.find((post) => post.slug === slug));
    } else if (exampleKey === "tag") {
      return this.tagJob({ tag: slug });
    }
  }

  //returns a GenerationTask for a post outro
  postJob(post): GenerationTask {
    //summaries of related articles
    const relatedArticles = post.related
      ?.map((slug) => this.posts.publishedPosts.find((p) => p.slug === slug))
      .map((post) => ({ post, summary: this.readNext.getSummaryById(post.slug) }));

    return {
      docId: `post/${post.slug}`,
      prompt: postReadNextPrompt(post, this.posts.getContent(post), relatedArticles),
      suffix: "Please reply with a 2 sentence suggestion for what the reader should read next.",
    };
  }

  //returns a GenerationTask for a tag intro
  tagJob({ tag }): GenerationTask {
    //the 10 most recent posts for a given tag
    const recentPosts = this.posts.publishedPosts
      .filter((post) => post.tags.includes(tag))
      .slice(0, 10)
      .map((post) => ({ post, summary: this.readNext.getSummaryById(post.slug) }));

    return {
      docId: `tag/${tag}`,
      prompt: tagIntroPrompt(tag, recentPosts),
    };
  }
}
```

A `GenerationTask` is just a type with a `docId`, `prompt` and optional `suffix` to help keep the LLM on track. I have a little class called `Posts` that exposes `publishedPosts` and a way to `getContent` for a given post - pretty basic stuff. Both types of task are using [ReadNext](https://github.com/edspencer/read-next) to generate article summaries (as well as populating the list of related articles for the postJob), but you can do that however you like.

The `tagIntroPrompt` and `postReadNextPrompt` functions just return strings that get passed in as the `prompt`. Here's what my `tagIntroPrompt` function looks like:

```tsx
//it's just a string. A long string, but a string.
function tagIntroPrompt(tag: string, recentPosts: RecentPost[] = []) {
  return `
    These are summaries of the ${recentPosts.length} most recent blog posts on my technical blog for the tag "${tag}".
    The summaries have been specifically prepared for you so that you have the context you need to 
    a very brief 2 paragraph overview of what I've been writing about recently regarding this tag. I want you 
    to write this editorial in my own tone of voice, as if I were writing it myself. It should be around 100 words.
    
    Your response will be rendered in a markdown file and published on my blog. It should contain 
    several links to various posts, giving extra credence to topics that have been covered more than
    once, or covering open source projects that I've been working on. You will be told the article
    relative url for each post, so you can link to them in your editorial. Please link to as many
    posts as you can.
    All of the links inside the text that you generate should be relative links, precisely matching
    the relativeLink you were given for each post, or absolute links with edspencer.net as the domain.
    
    Do not include any headings as there is already a heading for this section in the page layout.
  
    If the most recent articles are more than 5 years old, the first part of your answer should be to point out
    to the reader that nothing has been posted for this tag in a while.
  
    Keep it humble and not too high-faluting. I'm a technical writer, not a poet. Avoid starting with the phrase
    "I've been diving in" or similar.
    
    Here are the summaries of the recent blog posts:
    
    ${recentPosts.map(({ post, summary }) => articleRenderer(post, summary)).join("\n\n")}  

    You must not include \`\`\`markdown or \`\`\`html code blocks in your response.
    You must not include any headings in your response.
`;
}

//LLM-friendly string for a given post summary
const articleRenderer = (post, summary) => `
ARTICLE METADATA:
Article Title: ${post.title}
Article relative url: ${post.relativeLink}
Tags: ${post.tags.join(", ")}
Published: ${timeAgo.format(new Date(post.date))}
ARTICLE SUMMARY: ${summary}
`;
```

Now we can generate/regenerate content for a section just based on a docId string:

```tsx
await narrator.generate(factory.taskForId("tag/ai"));
```

### Batch Generating

It's probably pretty obvious now how to generate more than one piece of content. Here's a simple script I use to do it for my blog:

```ts
//to expose the OPENAI_API_KEY
import * as dotenv from "dotenv";
dotenv.config();

import Posts from "@/lib/blog/Posts";
import { TaskFactory, narrator } from "@/lib/blog/TaskFactory";

async function main() {
  const taskFactory = new TaskFactory();
  const posts = new Posts();

  //generate post "read next" outros
  for (const post of posts.publishedPosts) {
    await narrator.generate(taskFactory.jobForId(`post/${post.slug}`)!, { save: true });
  }

  //generate the intro per tag (but only for tags with 3 or more posts)
  const tags = posts.getTagsWithCounts().filter(({ count }) => count > 3);

  for (const tag of tags) {
    await narrator.generate(taskFactory.jobForId(`tag/${tag.tag}`)!, { save: true });
  }

  //generate the overall /blog intro
  await narrator.generate(taskFactory.jobForId("recent-posts")!);
}

main()
  .catch(console.error)
  .then(() => process.exit(0));
```

In my `package.json` I added a couple of `scripts`:

```json
  "scripts": {
    "narrator:train": "npx tsx script/train-narrator.ts",
    "narrator:generate": "npx tsx script/generate-narration.ts"
  },
```

So now I can just run this to generate all of the meta-content for my blog:

```sh
npm run narrator:generate
```

My actual script uses [commander](https://www.npmjs.com/package/commander) so that I can have it just do the posts, the tags, the overview, or some combination based on flags I pass in, but you get the idea.

## Training

Spending 5 minutes to train Narrator is likely to significantly improve your results. Training just means giving a good/bad verdict to a piece of content that Narrator generated. Narrator saves this verdict, along with an optional reason (you don't have to give a reason, but it's a good idea), and next time it generates content for you it will use those good/bad examples to produce a better response.

Under the covers, Narrator uses Few Shot Prompting to grab a selection of the content examples you marked as good or bad, and automatically passes them to the LLM along with your prompt when you call `generate`.

Training is done via the `train` and `saveExample` functions, and is easy to hook up to the command line, and even easier to hook up to your UI if you use [@narrator-ai/react](https://www.npmjs.com/package/@narrator-ai/react).

### Training in the CLI

Let's provide an `examplesDir` to our Narrator this time:

```tsx
//this time we configured an examplesDir to tell Narrator where to save good/bad examples
export const narrator = new Narrator({
  outputFilename: (docId) => `${docId}.md`,
  outputDir: path.join(process.cwd(), "editorial"),
  examplesDir: path.join(process.cwd(), "editorial", "examples"),
});
```

Here's a simple script I use to train Narrator on content that it generates for my post outros GenerationTasks:

```ts
//expose the OPENAI_API_KEY
import * as dotenv from "dotenv";
dotenv.config();

import { TaskFactory, narrator } from "@/lib/blog/TaskFactory";
import Posts from "@/lib/blog/Posts";

async function main() {
  const taskFactory = new TaskFactory();
  const posts = new Posts();

  for (const post of posts.publishedPosts) {
    await narrator.train(taskFactory.jobForId("post/" + post.slug));
  }
}

main()
  .catch(console.error)
  .then(() => process.exit(0));
```

That's pretty basic. We're just looping over each published post, creating a GenerationTask (docId + prompt) for each, and passing it in to the `train` function, which is optimized for CLI-based training. It will generate content and ask you to give it a good/bad rating, or skip it. It will also ask you for a reason why you gave that rating.

Here's the actual shell output from running this:

![Training via the CLI](https://raw.githubusercontent.com/edspencer/narrator-ai/HEAD/packages/narrator-ai/docs/training-example.gif)

It will keep doing that until it runs out of published posts to generate content for, or you ctrl-c out of it. Note that all this is doing is saving good/bad examples, calling `train` does generate text, but it won't save it as the actual text for the given docId.

Note that each of the examples above will be saved under the `post` key - internally, Narrator takes everything before the `/` in the `docId` (if there is one) and treats that as a group. Above, we trained by generating content for `post/read-next-ai-content-recommendations-node` and `post/ai-content-recommendations-typescript`, and the verdicts and optional reasons we supplied were saved under the `post` key. Next time we either `generate` or `train` on a `docId` that starts with `post/`, Narrator will grab some or all of those good/bad examples and pass them to the LLM to tell it what we like and don't like.

The performance of the LLM in generating the type of content you want goes up significantly even after only training on a few examples. You only have to do it once; under the covers the examples are saved as .yml files and should be committed to source control.

### Training in the UI

If you are using [@narrator-ai/react](https://www.npmjs.com/package/@narrator-ai/react), you can train Narrator directly in your UI while you're developing. This is perhaps even easier than doing it via the CLI, and has the benefit of showing you the fully rendered content in the actual context it will be shown in inside your UI:

![Example of @narrator-ai/react](https://raw.githubusercontent.com/edspencer/narrator-ai/HEAD/packages/narrator-ai/docs/UI-training-example.gif)

Check out the [@narrator-ai/react](https://www.npmjs.com/package/@narrator-ai/react) docs for more.

## Configuration

All of the configurations for Narrator are optional, but you can significantly influence its operation by passing some or all of the following:

```ts
export const narrator = new Narrator({
  //lets you specify the output filename for a given docId
  outputFilename: (docId) => `${docId}.md`,

  //directory where generated content will be saved (nested under the docId)
  outputDir: path.join(process.cwd(), "editorial"),

  //directory where examples of good/bad content will be saved (in .yml files)
  examplesDir: path.join(process.cwd(), "editorial", "examples"),

  //provide your own model (using Vercel AI SDK)
  model: openai("gpt-4o-mini"),

  //if you want to set the temperature (defaults to 0.9)
  temperature: 0.7,

  //if you want to pass in your own winston logger instance
  logger: myCustomWinstonLogger,

  //you probably won't do this, just lets you pass in a different class to evaluate during training
  //check out Trainer.ts if this interests you
  trainer: myTrainer,

  //if you want to change how the examples are presented to the LLM
  exampleTemplate: ({ verdict, content }) => `This content was marked as ${verdict}: ${content}`,
});
```

### Generation Options

As well as the `GenerationTask`, you can pass in some options when generating:

```ts
const docId = "tag/ai";
const prompt = "Generate some intro text for blah blah blah...";

narrator.generate(
  { docId, prompt },
  {
    //to save the generated content (defaults to false)
    save: true,

    //to return a text stream object instead of a string response (defaults to false)
    stream: true,

    //if you want to use a different model for this generation
    model: openai("gpt-4o-mini"),

    //if you want to use a different temperature for this generation
    temperature: 0.3,

    //to change the default limit of good examples passed to the LLM (defaults to 5)
    goodExamplesLimit: 10,

    //to change the default limit of bad examples passed to the LLM (defaults to 5)
    badExamplesLimit: 10,
  }
);
```

If you have more good/bad examples than the limits allow, Narrator will randomly select as many as you asked for.

### Example Saving Options

When saving some content as a good/bad example, you can pass in the following (`docId` and `verdict` are required):

```ts
narrator.saveExample({
  docId: "tag/ai",

  //could also be 'bad'...
  verdict: "good",

  //optional, but recommended
  reason: "it has that certain je ne sais quoi",

  //optional, but if you don't pass it in then Narrator will try to retrieve it based on docId
  content: "If you don't provide this yourself, Narrator will try to find it",
});
```