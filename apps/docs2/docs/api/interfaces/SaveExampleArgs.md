# Interface: SaveExampleArgs

Arguments for saving examples.

## Properties

### content?

> `optional` **content**: `string`

The content of the example being saved.
If not provided, it defaults to the generated content associated with the document ID.
(optional)

#### Defined in

[Narrator.ts:133](https://github.com/edspencer/narrator-ai/blob/2638f4692e0fe7ed51a1a126401e7368094e9587/packages/narrator-ai/src/Narrator.ts#L133)

***

### docId

> **docId**: `string`

The document ID for the example. This ID is used to identify the document being evaluated.

#### Defined in

[Narrator.ts:126](https://github.com/edspencer/narrator-ai/blob/2638f4692e0fe7ed51a1a126401e7368094e9587/packages/narrator-ai/src/Narrator.ts#L126)

***

### reason?

> `optional` **reason**: `string`

The reason for assigning the verdict. This provides context or justification for why
the example was marked as "good" or "bad".
(optional)

#### Defined in

[Narrator.ts:146](https://github.com/edspencer/narrator-ai/blob/2638f4692e0fe7ed51a1a126401e7368094e9587/packages/narrator-ai/src/Narrator.ts#L146)

***

### verdict

> **verdict**: `string`

The verdict for the example, indicating whether the example is classified as "good" or "bad".
This verdict is used to categorize the example.

#### Defined in

[Narrator.ts:139](https://github.com/edspencer/narrator-ai/blob/2638f4692e0fe7ed51a1a126401e7368094e9587/packages/narrator-ai/src/Narrator.ts#L139)
