import fs from "fs";
import path from "path";
import YAML from "yaml";
import winston from "winston";
import { generateText, streamText } from "ai";
import { openai } from "@ai-sdk/openai";
import { defaultNarratorLogger, defaultTrainerLogger } from "./logger";
import { GenerationTask, Example, Narration } from "./types";
import { HumanTrainer, Trainer } from "./Trainer";

/**
 * Represents the arguments required to create a Narrator instance.
 */
export interface NarratorArgs {
  /**
   * Directory where generated outputs will be saved.
   * (optional)
   */
  outputDir?: string;

  /**
   * Directory where example YAML files are stored.
   * (optional)
   */
  examplesDir?: string;

  /**
   * Function to format examples.
   * Takes an example object and returns a formatted string.
   * (optional)
   */
  exampleTemplate?: (example: Example) => string;

  /**
   * Temperature for the model generation. Controls randomness in generation.
   * A value closer to 1 results in more randomness, closer to 0 results in more deterministic output.
   * (optional, default is 0.9)
   */
  temperature?: number;

  /**
   * The model to use for text generation, e.g., a model from the OpenAI API.
   * (optional, default is openai("gpt-4o"))
   */
  model?: any;

  /**
   * Function to generate output filenames based on the document ID.
   * (optional, default generates filenames from the docId)
   */
  outputFilename?: (docId: string) => string;

  /**
   * Custom logger instance for logging (e.g., Winston logger).
   * (optional, default is `defaultNarratorLogger`)
   */
  logger?: winston.Logger;

  /**
   * Trainer instance responsible for evaluating generated examples.
   * (optional, default is an instance of `HumanTrainer`)
   */
  trainer?: Trainer;

  /**
   * Number of parallel processes to use when running generateMulti.
   * (optional, default is 1)
   */
  parallel?: number;
}

/**
 * Options for the generation process.
 */
export interface GenerateOptions {
  /**
   * Temperature for the model generation. Controls the randomness of the generation process.
   * A higher temperature (closer to 1) will produce more random outputs, while a lower temperature
   *  (closer to 0) will generate more deterministic responses.
   * (optional, default is 0.9)
   */
  temperature?: number;

  /**
   * The model to use for text generation, such as an OpenAI model instance.
   * This can be used to override the default model.
   * (optional)
   */
  model?: any;

  /**
   * Whether the generated content should be saved automatically after the generation process completes.
   * (optional, default is false)
   */
  save?: boolean;

  /**
   * The maximum number of "good" examples to include in the prompt for model guidance.
   * These examples help the model understand what the ideal output looks like.
   * (optional)
   */
  goodExamplesLimit?: number;

  /**
   * The maximum number of "bad" examples to include in the prompt to guide the model on what to avoid.
   * These examples help steer the model away from undesired outputs.
   * (optional)
   */
  badExamplesLimit?: number;

  /**
   * Whether the response should be streamed incrementally, allowing partial results to be returned
   * before completion.
   * (optional, default is false)
   */
  stream?: boolean;
}

/**
 * Arguments for saving examples.
 */
export interface SaveExampleArgs {
  /**
   * The document ID for the example. This ID is used to identify the document being evaluated.
   */
  docId: string;

  /**
   * The content of the example being saved.
   * If not provided, it defaults to the generated content associated with the document ID.
   * (optional)
   */
  content?: string;

  /**
   * The verdict for the example, indicating whether the example is classified as "good" or "bad".
   * This verdict is used to categorize the example.
   */
  verdict: string;

  /**
   * The reason for assigning the verdict. This provides context or justification for why
   * the example was marked as "good" or "bad".
   * (optional)
   */
  reason?: string;
}

const defaultTemperature = 0.9;
const defaultExampleTemplate = (example: Example) => `
<example>
  <content>${example.content}</content>
  <reason>${example.reason || "No reason given"}</reason>
</example>`;

const examplesForKey = (examplesDir: string, key: string) => path.join(examplesDir, key + ".yml");
const examplesByVerdict = (examplesDir: string, key: string, verdict: string) =>
  examplesForKey(examplesDir, verdict + "/" + key);

/**
 * A class responsible for generating content using a model,
 * training on examples, and saving the results.
 *
 * Example usage:
 * ```typescript
 * const narrator = new Narrator({
 *   outputDir: "./output",
 *   examplesDir: "./examples",
 * });
 *
 * const task: GenerationTask = {
 *   docId: "example1",
 *   prompt: "Generate a summary for this document",
 * };
 *
 * await narrator.train(task);
 * ```
 */
export class Narrator {
  /**
   * Number of parallel processes to use when running `generateMulti`.
   * Defaults to 1 if not provided.
   */
  parallel: number = 1;

  /**
   * Directory where generated outputs will be saved.
   * If undefined, outputs will not be saved automatically.
   */
  outputDir: string | undefined;

  /**
   * Directory where example YAML files are stored.
   * Used for fetching good and bad examples to guide model generation.
   */
  examplesDir: string | undefined;

  /**
   * Function to format examples.
   * This function is applied to examples before they are used in prompts.
   * Example function signature: `(example: Example) => string`.
   */
  exampleTemplate: Function;

  /**
   * Temperature for the model generation.
   * Controls the randomness of the generated output, where a higher value results in more varied responses.
   * If undefined, the default temperature is used.
   */
  temperature: any;

  /**
   * The model used for text generation, such as an instance of OpenAI's GPT models.
   * If undefined, a default model (e.g., `openai("gpt-4o")`) will be used.
   */
  model: any;

  /**
   * Function to generate output filenames based on the document ID.
   * If undefined, filenames are generated using the document ID by default.
   * Example function signature: `(docId: string) => string`.
   */
  outputFilename: Function;

  /**
   * Custom logger instance for logging (e.g., a Winston logger).
   * If undefined, a default logger will be used.
   */
  logger: winston.Logger;

  /**
   * Trainer instance responsible for evaluating generated examples.
   * Used to classify examples as good or bad based on feedback or custom logic.
   */
  trainer: Trainer;

  /**
   * Creates a new instance of the Narrator class.
   *
   * @param {Object} args - The argument object.
   * @param {number} [args.parallel] - Number of parallel processes to use when running generateMulti (optional).
   * @param {string} [args.outputDir] - Directory where generated outputs will be saved (optional).
   * @param {Function} [args.outputFilename] - Function to generate the output filename based on the document ID (optional).
   * @param {string} [args.examplesDir] - Directory where example YAML files are stored (optional).
   * @param {Function} [args.exampleTemplate=defaultExampleTemplate] - Function to format examples (optional, default is `defaultExampleTemplate`).
   * @param {number} [args.temperature=0.9] - Temperature for the model generation (optional, default is 0.9).
   * @param {any} [args.model=openai("gpt-4o")] - The model to use for text generation (optional, default is `openai("gpt-4o")`).
   * @param {winston.Logger} [args.logger=defaultNarratorLogger] - Custom logger instance (optional, default is `defaultNarratorLogger`).
   * @param {Trainer} [args.trainer=new HumanTrainer()] - Trainer instance to evaluate generated examples (optional, default is a new instance of `HumanTrainer`).
   */
  constructor({
    parallel,
    outputDir,
    outputFilename,
    examplesDir,
    exampleTemplate = defaultExampleTemplate,
    temperature = defaultTemperature,
    model,
    logger,
    trainer,
  }: NarratorArgs) {
    this.parallel = parallel || this.parallel;
    this.outputDir = outputDir;
    this.outputFilename = outputFilename || ((docId: string) => docId);
    this.examplesDir = examplesDir;
    this.exampleTemplate = exampleTemplate || defaultExampleTemplate;
    this.temperature = temperature;
    this.model = model || openai("gpt-4o");
    this.logger = logger || defaultNarratorLogger;
    this.trainer = trainer || new HumanTrainer({ logger: defaultTrainerLogger });
  }

  /**
   * Trains the Narrator using a task and evaluates the result.
   * If the result is marked for saving, it will be saved.
   *
   * @param task - The generation task to be processed.
   */
  async train(task: GenerationTask) {
    const { docId } = task;
    const content = (await this.generate(task)) as string;
    const answer = await this.trainer.evaluate(task, content);

    if (answer.choice === "save") {
      const { verdict, reason } = answer;
      return await this.saveExample({ docId, verdict, content, reason });
    }
  }

  /**
   * Generates content for the provided task based on the given options.
   *
   * @param task - The task containing the prompt and document ID.
   * @param options - Optional settings for generation (temperature, model, etc.).
   * @returns The generated text content.
   */
  async generate(task: GenerationTask, options: GenerateOptions = {}) {
    const { prompt, suffix, docId } = task;
    const { save, goodExamplesLimit = 5, badExamplesLimit = 5, stream } = options;
    const { logger } = this;

    logger.info(`Generating content for ${docId}...\n`);

    const promptElements = [prompt];

    const goodExamples = await this.getExamplesForTask(task, "good", goodExamplesLimit);
    const badExamples = await this.getExamplesForTask(task, "bad", badExamplesLimit);

    if (goodExamples.length) {
      promptElements.push("Here are a few examples of what your response should look like:");
      promptElements.push(goodExamples.map((example) => this.exampleTemplate(example)).join("\n"));
    }

    if (badExamples.length) {
      promptElements.push("Here are a few examples of what your response should not look like:");
      promptElements.push(badExamples.map((example) => this.exampleTemplate(example)).join("\n"));
    }

    if (suffix) {
      promptElements.push(suffix);
    }

    const { model, temperature } = this;
    const llmParams = { model, temperature, prompt: promptElements.join("\n\n") };

    if (stream) {
      const { textStream, text } = await streamText(llmParams);

      if (save) {
        text.then((content) => {
          this.saveNarration({ docId, content });
        });
      }

      return textStream;
    } else {
      const { text } = await generateText(llmParams);

      if (save) {
        this.saveNarration({ docId, content: text });
      }

      return text;
    }
  }

  /**
   * Saves the generated narration to the output directory.
   *
   * @param narration - The narration object containing document ID and content.
   * @returns A boolean indicating success or failure of the save operation.
   */
  saveNarration({ docId, content }: Narration) {
    const { logger } = this;

    if (!this.outputDir) {
      logger.error("No output directory set - please set outputDir when you create the Narrator instance");
      return false;
    }

    const savePath = path.join(this.outputDir, this.outputFilename(docId));

    try {
      fs.mkdirSync(path.dirname(savePath), { recursive: true });
      fs.writeFileSync(savePath, content);

      logger.info(`Saved narration for ${docId}`);
      return true;
    } catch (e) {
      logger.error("error saving narration", e);
      return false;
    }
  }

  /**
   * Retrieves previously saved narration by document ID.
   *
   * @param docId - The document ID of the narration.
   * @returns The narration content or false if the content is not found or could not be read.
   */
  getNarration(docId: string): string | false {
    const { logger } = this;

    if (!this.outputDir) {
      logger.error("No output directory set - please set outputDir when you create the Narrator instance");
      return false;
    }

    const filePath = path.join(this.outputDir, this.outputFilename(docId));

    if (!fs.existsSync(filePath)) {
      logger.debug(`No narration found for ${docId}`);
      return false;
    }

    try {
      logger.debug(`Reading narration from ${filePath}`);
      return fs.readFileSync(filePath, "utf-8");
    } catch (e) {
      logger.error("error reading narration", e);
      return false;
    }
  }

  /**
   * Saves the evaluation result as an example for future reference.
   *
   * @param args - The arguments for saving the example (document ID, content, etc.).
   * @returns A boolean indicating success or failure of the save operation.
   */
  async saveExample({ docId, content, verdict, reason }: SaveExampleArgs): Promise<boolean> {
    const exampleKey = this.getExampleGroup(docId);
    const verdictDir = verdict === "good" ? "good" : "bad";
    const { logger } = this;

    if (!this.examplesDir || !exampleKey) {
      return false;
    }

    if (!content && this.outputDir) {
      const narration = this.getNarration(docId);
      if (!narration) {
        logger.error(`No narration found for ${docId}`);
        return false;
      } else {
        content = narration;
      }
    }

    const exampleSaveDir = path.join(this.examplesDir, verdictDir);
    const examplesSavePath = examplesForKey(exampleSaveDir, exampleKey);
    let existingExamples = this.readExampleYaml(examplesSavePath) || [];

    // if this id/content pair already exists, remove it so we can overwrite
    existingExamples = existingExamples.filter(
      (example: Example) => example.docId !== docId && example.content !== content
    );

    existingExamples.push({ docId, content, reason });

    try {
      fs.mkdirSync(exampleSaveDir, { recursive: true });
      fs.writeFileSync(examplesSavePath, YAML.stringify(existingExamples));
      logger.info(`Saved example for ${docId} with verdict ${verdict}`);
    } catch (e) {
      logger.error("error saving example", e);
      return false;
    }

    return true;
  }

  /**
   * Reads a YAML file and parses its contents.
   *
   * @param filename - The path to the YAML file.
   * @returns The parsed YAML content or an empty array in case of an error.
   */
  readExampleYaml(filename: string) {
    try {
      return YAML.parse(fs.readFileSync(filename, "utf-8"));
    } catch (e) {
      return [];
    }
  }

  /**
   * Retrieves examples for a specific task based on the verdict (good or bad).
   *
   * @param task - The generation task for which examples are retrieved.
   * @param verdict - The type of examples to retrieve ("good" or "bad").
   * @param limit - The maximum number of examples to retrieve (optional).
   * @returns An array of examples.
   */
  async getExamplesForTask(task: GenerationTask, verdict: string, limit?: number): Promise<Example[]> {
    if (!this.examplesDir) {
      return [];
    }

    const examplesKey = this.getExampleGroup(task.docId);

    if (examplesKey) {
      const examples = this.readExampleYaml(examplesByVerdict(this.examplesDir, examplesKey, verdict)).map(
        (example: Example) => ({ ...example, verdict: "good" })
      );

      if (limit) {
        return examples.sort(() => 0.5 - Math.random()).slice(0, limit);
      }

      return examples;
    } else {
      return [];
    }
  }

  /**
   * Extracts the first part of a document ID, representing the example group.
   *
   * @param docId - The document ID.
   * @returns The group key.
   */
  getExampleGroup(docId?: string) {
    return docId?.split("/")[0];
  }

  /**
   * Extracts the key from a document ID.
   *
   * @param docId - The document ID.
   * @returns The extracted key.
   */
  getExampleKey(docId: string) {
    const splits = docId.split("/");
    return splits[splits.length - 1];
  }
}
