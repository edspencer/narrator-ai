---
sidebar_position: 2
title: Generating Content
---

# Generating Content

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
