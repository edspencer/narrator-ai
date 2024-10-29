export type GenerationTask = {
  /**
   * The unique identifier for the document.
   * @type {string}
   */
  docId: string;

  /**
   * The text prompt to pass to the model. This should be the full text of the task,
   * including any content you want it to create narration for.
   * @type {string}
   */
  prompt: string;

  /**
   * Optional suffix to pass to the model. Can be used to remind it what the task is
   * if the prompt is long.
   * @type {string}
   */
  suffix?: string;
};

/**
 * Represents an example with associated metadata.
 */
export type Example = {
  /**
   * The unique identifier for the document.
   * @type {string}
   */
  docId: string;

  /**
   * The content of the example.
   * @type {string}
   */
  content: string;

  /**
   * An optional reason associated with the example.
   * @type {string}
   */
  reason?: string;

  /**
   * The verdict or conclusion for the example.
   * @type {string}
   */
  verdict: string;
};

/**
 * Represents a narration with a document identifier and its content.
 */
export type Narration = {
  /**
   * The unique identifier for the document.
   * @type {string}
   */
  docId: string;

  /**
   * The content of the narration.
   * @type {string}
   */
  content: string;
};
