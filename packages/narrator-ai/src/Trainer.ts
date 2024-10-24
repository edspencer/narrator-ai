import readline from "readline";

import { GenerationTask } from "./types";
import { defaultTrainerLogger } from "./logger";

export type Verdict = "good" | "bad";
export type Evaluation = { choice: "save"; verdict: Verdict; reason?: string } | { choice: "skip" };

/**
 * Interface representing a Trainer that evaluates a generation task.
 */
export interface Trainer {
  /**
   * Evaluate a generation task and return an evaluation.
   * @param task The generation task to evaluate.
   * @param content The generated content.
   * @returns The evaluation of the generated content.
   */
  evaluate(task: GenerationTask, content: string): Promise<Evaluation>;
}

/**
 * The `HumanTrainer` class implements the `Trainer` interface and provides
 * methods for allowing a human to evaluate the generated content as either good or
 * bad, with an optional reason. Expected input is from the console.
 */
export class HumanTrainer implements Trainer {
  /**
   * The logger instance to use for logging.
   */
  logger: any;

  constructor(params: { logger: any } = { logger: defaultTrainerLogger }) {
    this.logger = params.logger;
  }

  async evaluate(task: GenerationTask, content: string): Promise<Evaluation> {
    // this.logger.info(`Proposed content for ${task.docId}:\n`);
    this.logger.info(content);
    this.logger.info("\n");

    return await this.getExampleVerdict();
  }

  private getExampleVerdict(): Promise<Evaluation> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      rl.question("Save as [g]ood example, save as [b]ad example, or [s]kip (g/b/s): ", async (answer) => {
        rl.close();
        let verdict;

        if (answer === "g" || answer === "b") {
          verdict = (answer === "g" ? "good" : "bad") as Verdict;
          const reason = await this.getVerdictReason();
          return resolve({ verdict, reason: reason === "" ? undefined : reason, choice: "save" });
        }

        return resolve({ choice: "skip" });
      });
    });
  }

  private getVerdictReason(): Promise<string> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve) => {
      rl.question("Reasoning (optional, Enter to skip): ", (reason) => {
        rl.close();
        console.log("\n");
        resolve(reason);
      });
    });
  }
}
