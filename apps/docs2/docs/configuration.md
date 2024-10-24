---
sidebar_position: 5
title: Configuration
---

# Configuration

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
