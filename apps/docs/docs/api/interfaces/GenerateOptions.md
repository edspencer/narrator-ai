# Interface: GenerateOptions

Options for the generation process.

## Properties

### badExamplesLimit?

> `optional` **badExamplesLimit**: `number`

The maximum number of "bad" examples to include in the prompt to guide the model on what to avoid.
These examples help steer the model away from undesired outputs.
(optional)

#### Defined in

[Narrator.ts:109](https://github.com/edspencer/narrator-ai/blob/a524b8822fae61097d8b11019e587b0b06c3350a/packages/narrator-ai/src/Narrator.ts#L109)

***

### goodExamplesLimit?

> `optional` **goodExamplesLimit**: `number`

The maximum number of "good" examples to include in the prompt for model guidance.
These examples help the model understand what the ideal output looks like.
(optional)

#### Defined in

[Narrator.ts:102](https://github.com/edspencer/narrator-ai/blob/a524b8822fae61097d8b11019e587b0b06c3350a/packages/narrator-ai/src/Narrator.ts#L102)

***

### model?

> `optional` **model**: `any`

The model to use for text generation, such as an OpenAI model instance.
This can be used to override the default model.
(optional)

#### Defined in

[Narrator.ts:89](https://github.com/edspencer/narrator-ai/blob/a524b8822fae61097d8b11019e587b0b06c3350a/packages/narrator-ai/src/Narrator.ts#L89)

***

### save?

> `optional` **save**: `boolean`

Whether the generated content should be saved automatically after the generation process completes.
(optional, default is false)

#### Defined in

[Narrator.ts:95](https://github.com/edspencer/narrator-ai/blob/a524b8822fae61097d8b11019e587b0b06c3350a/packages/narrator-ai/src/Narrator.ts#L95)

***

### stream?

> `optional` **stream**: `boolean`

Whether the response should be streamed incrementally, allowing partial results to be returned
before completion.
(optional, default is false)

#### Defined in

[Narrator.ts:116](https://github.com/edspencer/narrator-ai/blob/a524b8822fae61097d8b11019e587b0b06c3350a/packages/narrator-ai/src/Narrator.ts#L116)

***

### temperature?

> `optional` **temperature**: `number`

Temperature for the model generation. Controls the randomness of the generation process.
A higher temperature (closer to 1) will produce more random outputs, while a lower temperature
 (closer to 0) will generate more deterministic responses.
(optional, default is 0.9)

#### Defined in

[Narrator.ts:82](https://github.com/edspencer/narrator-ai/blob/a524b8822fae61097d8b11019e587b0b06c3350a/packages/narrator-ai/src/Narrator.ts#L82)
