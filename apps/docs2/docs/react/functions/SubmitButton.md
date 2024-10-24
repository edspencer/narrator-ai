# Function: SubmitButton()

> **SubmitButton**(`props`): `Element`

SubmitButton component renders a button that triggers a submission action.
It displays a tooltip and an icon, and handles the submission state.

## Parameters

• **props**

The properties object.

• **props.action**: `Function`

The action function to be called on submission.

• **props.docId**: `string`

The document ID to be submitted.

• **props.icon**: `ReactNode`

The icon to be displayed on the button.

• **props.onSubmit?**: `Function`

Optional callback function to be called after submission.

• **props.tooltip**: `string`

The tooltip text to be displayed.

## Returns

`Element`

The rendered SubmitButton component.

## Defined in

[Narration.tsx:244](https://github.com/edspencer/narrator-ai/blob/a6eb3765f534f72fc19b7120983a9fa75cbc1995/packages/react/src/Narration.tsx#L244)
