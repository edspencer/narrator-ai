# Interface: NarrationContextType

Interface representing the content and operations for narration.

## Properties

### getContent()

> **getContent**: (`id`) => `string`

Retrieves the content associated with the given ID. This could be the already-
generated content, or it could be new content streaming in.

#### Parameters

• **id**: `string`

The unique identifier for the content.

#### Returns

`string`

The content as a string.

#### Defined in

[Context.tsx:24](https://github.com/edspencer/narrator-ai/blob/a524b8822fae61097d8b11019e587b0b06c3350a/packages/react/src/Context.tsx#L24)

***

### isLoading()

> **isLoading**: (`id`) => `boolean`

Checks if the content associated with the given ID is currently loading.

#### Parameters

• **id**: `string`

The unique identifier for the content.

#### Returns

`boolean`

A boolean indicating whether the content is loading.

#### Defined in

[Context.tsx:40](https://github.com/edspencer/narrator-ai/blob/a524b8822fae61097d8b11019e587b0b06c3350a/packages/react/src/Context.tsx#L40)

***

### regenerateContent()

> **regenerateContent**: (`id`) => `Promise`\<`void`\>

Regenerates the content associated with the given ID.

#### Parameters

• **id**: `string`

The unique identifier for the content.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the content has been regenerated.

#### Defined in

[Context.tsx:32](https://github.com/edspencer/narrator-ai/blob/a524b8822fae61097d8b11019e587b0b06c3350a/packages/react/src/Context.tsx#L32)

***

### saveExample()?

> `optional` **saveExample**: (`example`) => `Promise`\<`boolean`\>

Saves an example content.

#### Parameters

• **example**: `any`

The example content to be saved.

#### Returns

`Promise`\<`boolean`\>

A promise that resolves to a boolean indicating whether the save was successful.

#### Defined in

[Context.tsx:48](https://github.com/edspencer/narrator-ai/blob/a524b8822fae61097d8b11019e587b0b06c3350a/packages/react/src/Context.tsx#L48)
