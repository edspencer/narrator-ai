import { StreamableValue } from "ai/rsc";

export function isStreamableValue(response: any): response is StreamableValue {
  return (
    response &&
    typeof response === "object" &&
    "type" in response &&
    response.type.toString() === "Symbol(ui.streamable.value)"
  );
}

export function isStreamableUI(response: any): boolean {
  return (
    response &&
    typeof response === "object" &&
    "type" in response &&
    response.type.toString() === "Symbol(react.suspense)"
  );
}

export function getResponseType(response: any) {
  if (typeof response === "string") {
    return "string";
  } else if (isStreamableValue(response)) {
    return "stream";
  } else if (isStreamableUI(response)) {
    return "ui";
  }
}
