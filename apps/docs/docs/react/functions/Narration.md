# Function: Narration()

> **Narration**(`props`): `ReactElement`

The `Narration` component is responsible for rendering a narration section with various interactive elements.
It displays a title, optional sparkle link, and action buttons for regenerating narration and providing feedback.

The actual content of the Narration should be provided as a child element. See the intro docs for more information
on how to generate Narration content and examples of how to retrieve it for display.

Simple usage:
```tsx
const NarrationPage = () => {
  return (
    <Narration id="narration-id" title="Narration Title">
      <p>This is the content of the narration.</p>
    </Narration>
  );
}
```

With sparkle link and actions:
```tsx
const NarrationPage = () => {
  return (
    <Narration
      id="narration-id"
      title="Narration Title"
      sparkleLink="https://example.com"
      sparkleText="Learn more"
      showActions={true}
    >
        <p>This is the content of the narration.</p>
    </Narration>
  );
}
```

## Parameters

• **props**: `PropsWithChildren`\<[`NarrationProps`](../interfaces/NarrationProps.md)\>

## Returns

`ReactElement`

## Defined in

[Narration.tsx:86](https://github.com/edspencer/narrator-ai/blob/a524b8822fae61097d8b11019e587b0b06c3350a/packages/react/src/Narration.tsx#L86)
