# Class: Narrator

A class responsible for generating content using a model,
training on examples, and saving the results.

Example usage:
```typescript
const narrator = new Narrator({
  outputDir: "./output",
  examplesDir: "./examples",
});

const task: GenerationTask = {
  docId: "example1",
  prompt: "Generate a summary for this document",
};

await narrator.train(task);
```

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

[Narrator.ts:242](https://github.com/edspencer/narrator-ai/blob/f6b5712122157487bf68a395c25655c7779e9bca/packages/narrator-ai/src/Narrator.ts#L242)

## Properties

### examplesDir

> **examplesDir**: `undefined` \| `string`

Directory where example YAML files are stored.
Used for fetching good and bad examples to guide model generation.

#### Defined in

[Narrator.ts:196](https://github.com/edspencer/narrator-ai/blob/f6b5712122157487bf68a395c25655c7779e9bca/packages/narrator-ai/src/Narrator.ts#L196)

***

### exampleTemplate

> **exampleTemplate**: `Function`

Function to format examples.
This function is applied to examples before they are used in prompts.
Example function signature: `(example: Example) => string`.

#### Defined in

[Narrator.ts:203](https://github.com/edspencer/narrator-ai/blob/f6b5712122157487bf68a395c25655c7779e9bca/packages/narrator-ai/src/Narrator.ts#L203)

***

### logger

> **logger**: `Logger`

Custom logger instance for logging (e.g., a Winston logger).
If undefined, a default logger will be used.

#### Defined in

[Narrator.ts:229](https://github.com/edspencer/narrator-ai/blob/f6b5712122157487bf68a395c25655c7779e9bca/packages/narrator-ai/src/Narrator.ts#L229)

***

### model

> **model**: `any`

The model used for text generation, such as an instance of OpenAI's GPT models.
If undefined, a default model (e.g., `openai("gpt-4o")`) will be used.

#### Defined in

[Narrator.ts:216](https://github.com/edspencer/narrator-ai/blob/f6b5712122157487bf68a395c25655c7779e9bca/packages/narrator-ai/src/Narrator.ts#L216)

***

### outputDir

> **outputDir**: `undefined` \| `string`

Directory where generated outputs will be saved.
If undefined, outputs will not be saved automatically.

#### Defined in

[Narrator.ts:190](https://github.com/edspencer/narrator-ai/blob/f6b5712122157487bf68a395c25655c7779e9bca/packages/narrator-ai/src/Narrator.ts#L190)

***

### outputFilename

> **outputFilename**: `Function`

Function to generate output filenames based on the document ID.
If undefined, filenames are generated using the document ID by default.
Example function signature: `(docId: string) => string`.

#### Defined in

[Narrator.ts:223](https://github.com/edspencer/narrator-ai/blob/f6b5712122157487bf68a395c25655c7779e9bca/packages/narrator-ai/src/Narrator.ts#L223)

***

### parallel

> **parallel**: `number` = `1`

Number of parallel processes to use when running `generateMulti`.
Defaults to 1 if not provided.

#### Defined in

[Narrator.ts:184](https://github.com/edspencer/narrator-ai/blob/f6b5712122157487bf68a395c25655c7779e9bca/packages/narrator-ai/src/Narrator.ts#L184)

***

### temperature

> **temperature**: `any`

Temperature for the model generation.
Controls the randomness of the generated output, where a higher value results in more varied responses.
If undefined, the default temperature is used.

#### Defined in

[Narrator.ts:210](https://github.com/edspencer/narrator-ai/blob/f6b5712122157487bf68a395c25655c7779e9bca/packages/narrator-ai/src/Narrator.ts#L210)

***

### trainer

> **trainer**: [`Trainer`](../interfaces/Trainer.md)

Trainer instance responsible for evaluating generated examples.
Used to classify examples as good or bad based on feedback or custom logic.

#### Defined in

[Narrator.ts:235](https://github.com/edspencer/narrator-ai/blob/f6b5712122157487bf68a395c25655c7779e9bca/packages/narrator-ai/src/Narrator.ts#L235)

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

[Narrator.ts:288](https://github.com/edspencer/narrator-ai/blob/f6b5712122157487bf68a395c25655c7779e9bca/packages/narrator-ai/src/Narrator.ts#L288)

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

[Narrator.ts:494](https://github.com/edspencer/narrator-ai/blob/f6b5712122157487bf68a395c25655c7779e9bca/packages/narrator-ai/src/Narrator.ts#L494)

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

[Narrator.ts:504](https://github.com/edspencer/narrator-ai/blob/f6b5712122157487bf68a395c25655c7779e9bca/packages/narrator-ai/src/Narrator.ts#L504)

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

[Narrator.ts:466](https://github.com/edspencer/narrator-ai/blob/f6b5712122157487bf68a395c25655c7779e9bca/packages/narrator-ai/src/Narrator.ts#L466)

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

[Narrator.ts:372](https://github.com/edspencer/narrator-ai/blob/f6b5712122157487bf68a395c25655c7779e9bca/packages/narrator-ai/src/Narrator.ts#L372)

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

[Narrator.ts:450](https://github.com/edspencer/narrator-ai/blob/f6b5712122157487bf68a395c25655c7779e9bca/packages/narrator-ai/src/Narrator.ts#L450)

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

[Narrator.ts:402](https://github.com/edspencer/narrator-ai/blob/f6b5712122157487bf68a395c25655c7779e9bca/packages/narrator-ai/src/Narrator.ts#L402)

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

[Narrator.ts:344](https://github.com/edspencer/narrator-ai/blob/f6b5712122157487bf68a395c25655c7779e9bca/packages/narrator-ai/src/Narrator.ts#L344)

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

[Narrator.ts:270](https://github.com/edspencer/narrator-ai/blob/f6b5712122157487bf68a395c25655c7779e9bca/packages/narrator-ai/src/Narrator.ts#L270)
