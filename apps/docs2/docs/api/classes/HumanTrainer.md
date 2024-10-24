# Class: HumanTrainer

The `HumanTrainer` class implements the `Trainer` interface and provides
methods for allowing a human to evaluate the generated content as either good or
bad, with an optional reason. Expected input is from the console.

## Implements

- [`Trainer`](../interfaces/Trainer.md)

## Constructors

### new HumanTrainer()

> **new HumanTrainer**(`params`): [`HumanTrainer`](HumanTrainer.md)

#### Parameters

• **params** = `...`

• **params.logger**: `any`

#### Returns

[`HumanTrainer`](HumanTrainer.md)

#### Defined in

[Trainer.ts:33](https://github.com/edspencer/narrator-ai/blob/2638f4692e0fe7ed51a1a126401e7368094e9587/packages/narrator-ai/src/Trainer.ts#L33)

## Properties

### logger

> **logger**: `any`

The logger instance to use for logging.

#### Defined in

[Trainer.ts:31](https://github.com/edspencer/narrator-ai/blob/2638f4692e0fe7ed51a1a126401e7368094e9587/packages/narrator-ai/src/Trainer.ts#L31)

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

#### Implementation of

[`Trainer`](../interfaces/Trainer.md).[`evaluate`](../interfaces/Trainer.md#evaluate)

#### Defined in

[Trainer.ts:37](https://github.com/edspencer/narrator-ai/blob/2638f4692e0fe7ed51a1a126401e7368094e9587/packages/narrator-ai/src/Trainer.ts#L37)
