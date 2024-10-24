# Interface: NarratorArgs

Represents the arguments required to create a Narrator instance.

## Properties

### examplesDir?

> `optional` **examplesDir**: `string`

Directory where example YAML files are stored.
(optional)

#### Defined in

[Narrator.ts:25](https://github.com/edspencer/narrator-ai/blob/9728cb1b3e5041eeff1a44d2ebffcca474165895/packages/narrator-ai/src/Narrator.ts#L25)

***

### exampleTemplate()?

> `optional` **exampleTemplate**: (`example`) => `string`

Function to format examples.
Takes an example object and returns a formatted string.
(optional)

#### Parameters

• **example**: [`Example`](../type-aliases/Example.md)

#### Returns

`string`

#### Defined in

[Narrator.ts:32](https://github.com/edspencer/narrator-ai/blob/9728cb1b3e5041eeff1a44d2ebffcca474165895/packages/narrator-ai/src/Narrator.ts#L32)

***

### logger?

> `optional` **logger**: `Logger`

Custom logger instance for logging (e.g., Winston logger).
(optional, default is `defaultNarratorLogger`)

#### Defined in

[Narrator.ts:57](https://github.com/edspencer/narrator-ai/blob/9728cb1b3e5041eeff1a44d2ebffcca474165895/packages/narrator-ai/src/Narrator.ts#L57)

***

### model?

> `optional` **model**: `any`

The model to use for text generation, e.g., a model from the OpenAI API.
(optional, default is openai("gpt-4o"))

#### Defined in

[Narrator.ts:45](https://github.com/edspencer/narrator-ai/blob/9728cb1b3e5041eeff1a44d2ebffcca474165895/packages/narrator-ai/src/Narrator.ts#L45)

***

### outputDir?

> `optional` **outputDir**: `string`

Directory where generated outputs will be saved.
(optional)

#### Defined in

[Narrator.ts:19](https://github.com/edspencer/narrator-ai/blob/9728cb1b3e5041eeff1a44d2ebffcca474165895/packages/narrator-ai/src/Narrator.ts#L19)

***

### outputFilename()?

> `optional` **outputFilename**: (`docId`) => `string`

Function to generate output filenames based on the document ID.
(optional, default generates filenames from the docId)

#### Parameters

• **docId**: `string`

#### Returns

`string`

#### Defined in

[Narrator.ts:51](https://github.com/edspencer/narrator-ai/blob/9728cb1b3e5041eeff1a44d2ebffcca474165895/packages/narrator-ai/src/Narrator.ts#L51)

***

### parallel?

> `optional` **parallel**: `number`

Number of parallel processes to use when running generateMulti.
(optional, default is 1)

#### Defined in

[Narrator.ts:69](https://github.com/edspencer/narrator-ai/blob/9728cb1b3e5041eeff1a44d2ebffcca474165895/packages/narrator-ai/src/Narrator.ts#L69)

***

### temperature?

> `optional` **temperature**: `number`

Temperature for the model generation. Controls randomness in generation.
A value closer to 1 results in more randomness, closer to 0 results in more deterministic output.
(optional, default is 0.9)

#### Defined in

[Narrator.ts:39](https://github.com/edspencer/narrator-ai/blob/9728cb1b3e5041eeff1a44d2ebffcca474165895/packages/narrator-ai/src/Narrator.ts#L39)

***

### trainer?

> `optional` **trainer**: [`Trainer`](Trainer.md)

Trainer instance responsible for evaluating generated examples.
(optional, default is an instance of `HumanTrainer`)

#### Defined in

[Narrator.ts:63](https://github.com/edspencer/narrator-ai/blob/9728cb1b3e5041eeff1a44d2ebffcca474165895/packages/narrator-ai/src/Narrator.ts#L63)
