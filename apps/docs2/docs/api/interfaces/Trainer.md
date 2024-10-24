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

[Trainer.ts:19](https://github.com/edspencer/narrator-ai/blob/a6eb3765f534f72fc19b7120983a9fa75cbc1995/packages/narrator-ai/src/Trainer.ts#L19)
