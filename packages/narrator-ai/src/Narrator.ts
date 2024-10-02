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
  /** Directory to cache the generated data */
  cacheDir: string;
  /** Number of parallel processes (optional) */
  parallel?: number;
  /** Directory where generated outputs will be saved (optional) */
  outputDir?: string;
  /** Directory where example YAML files are stored (optional) */
  examplesDir?: string;
  /** Function to format examples (optional) */
  exampleTemplate?: Function;
  /** Temperature for the model generation (optional, default is 0.9) */
  temperature?: number;
  /** The model to use for text generation (optional) */
  model?: any;
  /** Function to generate output filenames (optional) */
  outputFilename?: Function;
  /** Custom logger instance (optional) */
  logger?: winston.Logger;
  /** Trainer instance to evaluate generated examples (optional) */
  trainer?: Trainer;
}

/**
 * Options for the generation process.
 */
export interface GenerateOptions {
  /** Temperature for the model generation (optional) */
  temperature?: number;
  /** The model to use for text generation (optional) */
  model?: any;
  /** Whether to save the generated content (optional) */
  save?: boolean;
  /** Limit for good examples (optional) */
  goodExamplesLimit?: number;
  /** Limit for bad examples (optional) */
  badExamplesLimit?: number;
  /** Whether the response should be streamed (optional) */
  stream?: boolean;
}

/**
 * Arguments for saving examples.
 */
export interface SaveExampleArgs {
  /** The document ID for the example */
  docId: string;
  /** Content of the example (optional) */
  content?: string;
  /** The verdict ("good" or "bad") */
  verdict: string;
  /** Reason for the verdict (optional) */
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
 *   cacheDir: "/tmp",
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
  cacheDir: string;
  parallel: number = 1;
  outputDir: string | undefined;
  examplesDir: string | undefined;
  exampleTemplate: Function;
  temperature: any;
  model: any;
  outputFilename: Function;
  logger: winston.Logger;
  trainer: Trainer;

  /**
   * Creates a new instance of the Narrator class.
   *
   * @param args - Arguments required to initialize the Narrator.
   */
  constructor({
    cacheDir,
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
    this.cacheDir = cacheDir;
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
    const { logger } = this;
    const content = (await this.generate(task)) as string;
    const answer = await this.trainer.evaluate(task, content);

    if (answer.choice === "save") {
      const { verdict, reason } = answer;
      const saveOutcome = await this.saveExample({ docId, verdict, content, reason });
      logger.info(saveOutcome ? "Saved example" : "Failed to save example");
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

      text.then((content) => {
        if (save) {
          const saveOutcome = this.saveNarration({ docId, content });
          logger.info(saveOutcome ? "Saved example" : "Failed to save example");
        }
      });

      return textStream;
    } else {
      const { text } = await generateText(llmParams);

      if (save) {
        const saveOutcome = await this.saveNarration({ docId, content: text });
        logger.info(saveOutcome ? "Saved example" : "Failed to save example");
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
   * @returns The narration content or false if an error occurs.
   */
  getNarration(docId: string) {
    const { logger } = this;

    if (!this.outputDir) {
      logger.error("No output directory set - please set outputDir when you create the Narrator instance");
      return false;
    }

    const filePath = path.join(this.outputDir, this.outputFilename(docId));

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

    existingExamples.push({ docId, content, reason });

    existingExamples = existingExamples.filter(
      (example: Example, index: number, self: Example[]) =>
        index === self.findIndex((t) => t.docId === example.docId && t.content === example.content)
    );

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
