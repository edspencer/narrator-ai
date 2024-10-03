import readline from "readline";

import { GenerationTask } from "./types";
import { defaultTrainerLogger } from "./logger";

export type Verdict = "good" | "bad";
export type Evaluation = { choice: "save"; verdict: Verdict; reason?: string } | { choice: "skip" };

export interface Trainer {
  evaluate(task: GenerationTask, content: string): Promise<Evaluation>;
}

export class HumanTrainer implements Trainer {
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
