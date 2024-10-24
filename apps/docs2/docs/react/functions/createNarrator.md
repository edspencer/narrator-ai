# Function: createNarrator()

> **createNarrator**(`params`): (`__namedParameters`) => `Element`

Creates a Narrator component that provides narration context to its children.

To take advantage of the content regeneration and training buttons present in the Narration UI,
we need to wrap our UI in a Narrator context, which provides the functionality to regenerate/train
when we click the buttons. The easiest way to do that is via `createNarrator`.

Example:

In a file somewhere in your project:

```tsx
import {saveExample, regenerateNarration} from './actions/Narrator';
import {createNarrator} from '@narrator-ai/react';

const NarratorProvider = createNarrator({
  actions: {
    saveExample,
    regenerateNarration,
  }
});

export default NarratorProvider;
```

In your layout file:
```tsx
import NarratorProvider from './NarratorProvider';

function Layout({children}) {
 return (
    <NarratorProvider>
      {children}
    </NarratorProvider>
  );
}
```

## Parameters

• **params**: [`CreateNarratorProps`](../type-aliases/CreateNarratorProps.md) = `{}`

## Returns

`Function`

A React functional component that wraps its children with a NarrationProvider.

### Parameters

• **\_\_namedParameters**

• **\_\_namedParameters.children**: `ReactNode`

### Returns

`Element`

## Defined in

[Provider.tsx:55](https://github.com/edspencer/narrator-ai/blob/2638f4692e0fe7ed51a1a126401e7368094e9587/packages/react/src/Provider.tsx#L55)
