# Type Alias: GenerationTask

> **GenerationTask**: `object`

## Type declaration

### docId

> **docId**: `string`

The unique identifier for the document.

### prompt

> **prompt**: `string`

The text prompt to pass to the model. This should be the full text of the task,
including any content you want it to create narration for.

### suffix?

> `optional` **suffix**: `string`

Optional suffix to pass to the model. Can be used to remind it what the task is
if the prompt is long.

## Defined in

[types.ts:1](https://github.com/edspencer/narrator-ai/blob/f6b5712122157487bf68a395c25655c7779e9bca/packages/narrator-ai/src/types.ts#L1)