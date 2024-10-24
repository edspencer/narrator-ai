# Class: Narrator

Narrator generates meta-content narrations based on other content. It shines at reading and
understanding your existing content like articles, help pages, blog posts, etc, and
generating short, friendly summaries that tell the reader what content may be most useful to them.

All of the configurations for Narrator are optional, but if you want to generate and save content you
can pass in `outputDir` and (optionally) `outputFilename` to have Narrator automatically save its
generations for you. For example, if we want to save our generated content as `.md` files in
the `./editorial` directory, we can configure it like this:

```tsx
export const narrator = new Narrator({
  outputFilename: (docId) => `${docId}.md`,
  outputDir: path.join(process.cwd(), "editorial"),
});
```

Now we can generate some content, which in this case will be saved to `./editorial/tag/ai.md`
(directories will be created for you):

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

This will generate content for you and save it according to the configuration you provided. You can set
`docId` to whatever you want - in this case we're generating intro text for a blog that contains
[articles about AI](https://edspencer.net/blog/tag/ai). If you don't specify a `model` it will default
to using OpenAI's "gpt-4o", but you can pass in any model provided by the
[Vercel AI SDK](https://sdk.vercel.ai/docs/introduction).

## Constructors

### new Narrator()

> **new Narrator**(`args`): [`Narrator`](Narrator.md)

Creates a new instance of the Narrator class.

#### Parameters

• **args**: [`NarratorArgs`](../interfaces/NarratorArgs.md)

The arguments to configure the Narrator instance.

#### Returns

[`Narrator`](Narrator.md)

#### Defined in

[Narrator.ts:266](https://github.com/edspencer/narrator-ai/blob/2638f4692e0fe7ed51a1a126401e7368094e9587/packages/narrator-ai/src/Narrator.ts#L266)

## Properties

### examplesDir

> **examplesDir**: `undefined` \| `string`

Directory where example YAML files are stored.
Used for fetching good and bad examples to guide model generation.

#### Defined in

[Narrator.ts:220](https://github.com/edspencer/narrator-ai/blob/2638f4692e0fe7ed51a1a126401e7368094e9587/packages/narrator-ai/src/Narrator.ts#L220)

***

### exampleTemplate

> **exampleTemplate**: `Function`

Function to format examples.
This function is applied to examples before they are used in prompts.
Example function signature: `(example: Example) => string`.

#### Defined in

[Narrator.ts:227](https://github.com/edspencer/narrator-ai/blob/2638f4692e0fe7ed51a1a126401e7368094e9587/packages/narrator-ai/src/Narrator.ts#L227)

***

### logger

> **logger**: `Logger`

Custom logger instance for logging (e.g., a Winston logger).
If undefined, a default logger will be used.

#### Defined in

[Narrator.ts:253](https://github.com/edspencer/narrator-ai/blob/2638f4692e0fe7ed51a1a126401e7368094e9587/packages/narrator-ai/src/Narrator.ts#L253)

***

### model

> **model**: `any`

The model used for text generation, such as an instance of OpenAI's GPT models.
If undefined, a default model (e.g., `openai("gpt-4o")`) will be used.

#### Defined in

[Narrator.ts:240](https://github.com/edspencer/narrator-ai/blob/2638f4692e0fe7ed51a1a126401e7368094e9587/packages/narrator-ai/src/Narrator.ts#L240)

***

### outputDir

> **outputDir**: `undefined` \| `string`

Directory where generated outputs will be saved.
If undefined, outputs will not be saved automatically.

#### Defined in

[Narrator.ts:214](https://github.com/edspencer/narrator-ai/blob/2638f4692e0fe7ed51a1a126401e7368094e9587/packages/narrator-ai/src/Narrator.ts#L214)

***

### outputFilename

> **outputFilename**: `Function`

Function to generate output filenames based on the document ID.
If undefined, filenames are generated using the document ID by default.
Example function signature: `(docId: string) => string`.

#### Defined in

[Narrator.ts:247](https://github.com/edspencer/narrator-ai/blob/2638f4692e0fe7ed51a1a126401e7368094e9587/packages/narrator-ai/src/Narrator.ts#L247)

***

### parallel

> **parallel**: `number` = `1`

Number of parallel processes to use when running `generateMulti`.
Defaults to 1 if not provided.

#### Defined in

[Narrator.ts:208](https://github.com/edspencer/narrator-ai/blob/2638f4692e0fe7ed51a1a126401e7368094e9587/packages/narrator-ai/src/Narrator.ts#L208)

***

### temperature

> **temperature**: `any`

Temperature for the model generation.
Controls the randomness of the generated output, where a higher value results in more varied responses.
If undefined, the default temperature is used.

#### Defined in

[Narrator.ts:234](https://github.com/edspencer/narrator-ai/blob/2638f4692e0fe7ed51a1a126401e7368094e9587/packages/narrator-ai/src/Narrator.ts#L234)

***

### trainer

> **trainer**: [`Trainer`](../interfaces/Trainer.md)

Trainer instance responsible for evaluating generated examples.
Used to classify examples as good or bad based on feedback or custom logic.

#### Defined in

[Narrator.ts:259](https://github.com/edspencer/narrator-ai/blob/2638f4692e0fe7ed51a1a126401e7368094e9587/packages/narrator-ai/src/Narrator.ts#L259)

## Methods

### generate()

> **generate**(`task`, `options`): `Promise`\<`string` \| `AsyncIterableStream`\<`string`\>\>

Generates content for the provided task based on the given options.

#### Parameters

• **task**: [`GenerationTask`](../type-aliases/GenerationTask.md)

The task containing the prompt and document ID.

• **options**: [`GenerateOptions`](../interfaces/GenerateOptions.md) = `{}`

Optional settings for generation (temperature, model, etc.).

#### Returns

`Promise`\<`string` \| `AsyncIterableStream`\<`string`\>\>

The generated text content.

#### Defined in

[Narrator.ts:312](https://github.com/edspencer/narrator-ai/blob/2638f4692e0fe7ed51a1a126401e7368094e9587/packages/narrator-ai/src/Narrator.ts#L312)

***

### getExampleGroup()

> **getExampleGroup**(`docId`?): `undefined` \| `string`

Extracts the first part of a document ID, representing the example group.

#### Parameters

• **docId?**: `string`

The document ID.

#### Returns

`undefined` \| `string`

The group key.

#### Defined in

[Narrator.ts:518](https://github.com/edspencer/narrator-ai/blob/2638f4692e0fe7ed51a1a126401e7368094e9587/packages/narrator-ai/src/Narrator.ts#L518)

***

### getExampleKey()

> **getExampleKey**(`docId`): `string`

Extracts the key from a document ID.

#### Parameters

• **docId**: `string`

The document ID.

#### Returns

`string`

The extracted key.

#### Defined in

[Narrator.ts:528](https://github.com/edspencer/narrator-ai/blob/2638f4692e0fe7ed51a1a126401e7368094e9587/packages/narrator-ai/src/Narrator.ts#L528)

***

### getExamplesForTask()

> **getExamplesForTask**(`task`, `verdict`, `limit`?): `Promise`\<[`Example`](../type-aliases/Example.md)[]\>

Retrieves examples for a specific task based on the verdict (good or bad).

#### Parameters

• **task**: [`GenerationTask`](../type-aliases/GenerationTask.md)

The generation task for which examples are retrieved.

• **verdict**: `string`

The type of examples to retrieve ("good" or "bad").

• **limit?**: `number`

The maximum number of examples to retrieve (optional).

#### Returns

`Promise`\<[`Example`](../type-aliases/Example.md)[]\>

An array of examples.

#### Defined in

[Narrator.ts:490](https://github.com/edspencer/narrator-ai/blob/2638f4692e0fe7ed51a1a126401e7368094e9587/packages/narrator-ai/src/Narrator.ts#L490)

***

### getNarration()

> **getNarration**(`docId`): `string` \| `false`

Retrieves previously saved narration by document ID.

#### Parameters

• **docId**: `string`

The document ID of the narration.

#### Returns

`string` \| `false`

The narration content or false if the content is not found or could not be read.

#### Defined in

[Narrator.ts:396](https://github.com/edspencer/narrator-ai/blob/2638f4692e0fe7ed51a1a126401e7368094e9587/packages/narrator-ai/src/Narrator.ts#L396)

***

### readExampleYaml()

> **readExampleYaml**(`filename`): `any`

Reads a YAML file and parses its contents.

#### Parameters

• **filename**: `string`

The path to the YAML file.

#### Returns

`any`

The parsed YAML content or an empty array in case of an error.

#### Defined in

[Narrator.ts:474](https://github.com/edspencer/narrator-ai/blob/2638f4692e0fe7ed51a1a126401e7368094e9587/packages/narrator-ai/src/Narrator.ts#L474)

***

### saveExample()

> **saveExample**(`args`): `Promise`\<`boolean`\>

Saves the evaluation result as an example for future reference.

#### Parameters

• **args**: [`SaveExampleArgs`](../interfaces/SaveExampleArgs.md)

The arguments for saving the example (document ID, content, etc.).

#### Returns

`Promise`\<`boolean`\>

A boolean indicating success or failure of the save operation.

#### Defined in

[Narrator.ts:426](https://github.com/edspencer/narrator-ai/blob/2638f4692e0fe7ed51a1a126401e7368094e9587/packages/narrator-ai/src/Narrator.ts#L426)

***

### saveNarration()

> **saveNarration**(`narration`): `boolean`

Saves the generated narration to the output directory.

#### Parameters

• **narration**: [`Narration`](../type-aliases/Narration.md)

The narration object containing document ID and content.

#### Returns

`boolean`

A boolean indicating success or failure of the save operation.

#### Defined in

[Narrator.ts:368](https://github.com/edspencer/narrator-ai/blob/2638f4692e0fe7ed51a1a126401e7368094e9587/packages/narrator-ai/src/Narrator.ts#L368)

***

### train()

> **train**(`task`): `Promise`\<`undefined` \| `boolean`\>

Trains the Narrator using a task and evaluates the result.
If the result is marked for saving, it will be saved.

#### Parameters

• **task**: [`GenerationTask`](../type-aliases/GenerationTask.md)

The generation task to be processed.

#### Returns

`Promise`\<`undefined` \| `boolean`\>

#### Defined in

[Narrator.ts:294](https://github.com/edspencer/narrator-ai/blob/2638f4692e0fe7ed51a1a126401e7368094e9587/packages/narrator-ai/src/Narrator.ts#L294)
