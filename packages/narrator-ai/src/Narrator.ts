import fs from "fs";
import path from "path";
import YAML from "yaml";
import winston from "winston";

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { defaultNarratorLogger, defaultTrainerLogger } from "./logger";

import { LLMTask, Example, Narration } from "./types";
import { HumanTrainer, Trainer } from "./Trainer";

export interface NarratorArgs {
  cacheDir: string;
  parallel?: number;
  outputDir?: string;
  examplesDir?: string;
  exampleTemplate?: Function;
  temperature?: number;
  model?: any;
  outputFilename?: Function;
  logger?: winston.Logger;
  trainer?: Trainer;
}

export interface GenerateOptions {
  temperature?: number;
  model?: any;
  save?: boolean;
  goodExamplesLimit?: number;
  badExamplesLimit?: number;
  stream?: boolean;
}

export interface SaveExampleArgs {
  docId: string;
  content?: string;
  verdict: string;
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

    this.trainer =
      trainer ||
      new HumanTrainer({
        logger: defaultTrainerLogger,
      });
  }

  async train(task: LLMTask) {
    const { docId } = task;
    const { logger } = this;

    const content = await this.generate(task);
    const answer = await this.trainer.evaluate(task, content);

    if (answer.choice === "save") {
      const { verdict, reason } = answer;
      const saveOutcome = await this.saveExample({ docId, verdict, content, reason });

      logger.info(saveOutcome ? "Saved example" : "Failed to save example");
    }
  }

  async generate(task: LLMTask, options: GenerateOptions = {}) {
    const { prompt, suffix, docId } = task;
    const { save, goodExamplesLimit = 5, badExamplesLimit = 5 } = options;
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

    const llmParams = {
      model,
      temperature,
      prompt: promptElements.join("\n\n"),
    };

    const { text } = await generateText(llmParams);

    if (save) {
      const saveOutcome = await this.saveNarration({ docId, content: text });

      logger.info(saveOutcome ? "Saved example" : "Failed to save example");
    }

    return text;
  }

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

  async saveExample({ docId, content, verdict, reason }: SaveExampleArgs): Promise<boolean> {
    const exampleKey = this.getExampleGroup(docId);
    const verdictDir = verdict === "good" ? "good" : "bad";
    const { logger } = this;

    if (!this.examplesDir || !exampleKey) {
      return false;
    }

    //get the content if it's not provided
    if (!content && this.outputDir) {
      const narration = this.getNarration(docId);

      if (!narration) {
        logger.error(`No narration found for ${docId}`);
        return false;
      } else {
        content = narration;
      }
    }

    //read the existing yaml
    const exampleSaveDir = path.join(this.examplesDir, verdictDir);
    const examplesSavePath = examplesForKey(exampleSaveDir, exampleKey);
    let existingExamples = this.readExampleYaml(examplesSavePath) || [];

    existingExamples.push({ docId, content, reason });

    //dedupe the existingExamples by docId and content
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

  readExampleYaml(filename: string) {
    try {
      return YAML.parse(fs.readFileSync(filename, "utf-8"));
    } catch (e) {
      return [];
    }
  }

  async getExamplesForTask(task: LLMTask, verdict: string, limit?: number): Promise<Example[]> {
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

  getExampleGroup(docId?: string) {
    return docId?.split("/")[0];
  }

  getExampleKey(docId: string) {
    const splits = docId.split("/");

    return splits[splits.length - 1];
  }
}
