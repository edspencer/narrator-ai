# Function: useNarration()

> **useNarration**(): [`NarrationContextType`](../interfaces/NarrationContextType.md)

Custom hook that provides access to the narration context. This provides
access to functions like `isLoading`, `saveExample`, and `regenerate`.

This hook must be used within a `NarrationProvider`. If it is used outside
of a `NarrationProvider`, it will throw an error.

## Returns

[`NarrationContextType`](../interfaces/NarrationContextType.md)

The narration context.

## Throws

If the hook is used outside of a `NarrationProvider`.

## Defined in

[useNarration.tsx:15](https://github.com/edspencer/narrator-ai/blob/2638f4692e0fe7ed51a1a126401e7368094e9587/packages/react/src/useNarration.tsx#L15)
