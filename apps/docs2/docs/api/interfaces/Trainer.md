# Interface: Trainer

Interface representing a Trainer that evaluates a generation task.

## Methods

### evaluate()

> **evaluate**(`task`, `content`): `Promise`\<[`Evaluation`](../type-aliases/Evaluation.md)\>

Evaluate a generation task and return an evaluation.

#### Parameters

• **task**: [`GenerationTask`](../type-aliases/GenerationTask.md)

The generation task to evaluate.

• **content**: `string`

The generated content.

#### Returns

`Promise`\<[`Evaluation`](../type-aliases/Evaluation.md)\>

The evaluation of the generated content.

#### Defined in

[Trainer.ts:19](https://github.com/edspencer/narrator-ai/blob/2638f4692e0fe7ed51a1a126401e7368094e9587/packages/narrator-ai/src/Trainer.ts#L19)
