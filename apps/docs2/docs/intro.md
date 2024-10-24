---
sidebar_position: 1
title: NarratorAI Introduction
slug: /
---

# NarratorAI: Introduction

**NarratorAI** is a **Node JS** & **React** package that makes it easy to generate meta-content "narration" based on other content. It shines at reading and understanding your existing content like articles, help pages, blog posts, etc, and generating short, friendly summaries that tell the reader what content may be most useful to them.

For content creators, it lets you focus on your content itself, offloading the boring bits like "if you liked this, you might like our articles on X, Y and Z interesting" intro and outro content. It can also dynamically generate this content per-user, based on what they've been looking at or doing so far.

![Narration regeneration with Narrator AI](/img/Narration-regeneration.gif)

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

There are 2 sides of NarratorAI - generation and rendering. See these docs for more on each:

- [Generating Content](/generation)
- [Rendering Content](/rendering)

## Live Demo

If you want to play with a live demo of NarratorAI head over to the introductory [blog post for NarratorAI](https://edspencer.net/2024/10/4/introducing-narrator-ai) that has a live demo near the top of the article.
