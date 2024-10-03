import fs from "fs";
import winston from "winston";
import { Narrator } from "../Narrator";
import { Evaluation, Trainer } from "../Trainer";
import { generateText } from "ai";
import { GenerationTask } from "../types";

jest.mock("fs");
jest.mock("ai", () => ({
  generateText: jest.fn(),
}));

const logger = winston.createLogger({ silent: true });

describe("Narrator", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create an instance with default values", () => {
    const narrator = new Narrator({ outputDir: "/tmp" });
    expect(narrator.outputDir).toBe("/tmp");
    expect(narrator.parallel).toBe(1);
    expect(narrator.temperature).toBe(0.9);
  });

  it("should create an instance with provided values", () => {
    const narrator = new Narrator({
      parallel: 2,
      outputDir: "/output",
      examplesDir: "/examples",
      temperature: 0.7,
      logger,
    });
    expect(narrator.parallel).toBe(2);
    expect(narrator.outputDir).toBe("/output");
    expect(narrator.examplesDir).toBe("/examples");
    expect(narrator.temperature).toBe(0.7);
    expect(narrator.logger).toBe(logger);
  });

  describe("generate", () => {
    it("should fetch good examples for the task", async () => {
      // Arrange
      const narrator = new Narrator({ outputDir: "/tmp", examplesDir: "/examples", logger });
      const task = { docId: "doc1", prompt: "Write a story about a cat." };

      // Mock getExamplesForTask
      const goodExamples = [{ docId: "doc2", content: "Example content", verdict: "good" }];
      jest.spyOn(narrator, "getExamplesForTask").mockImplementation((task, verdict) => {
        if (verdict === "good") {
          return Promise.resolve(goodExamples);
        }
        return Promise.resolve([]);
      });

      // Mock generateText
      (generateText as jest.Mock).mockResolvedValue({ text: "Generated text" });

      // Act
      await narrator.generate(task);

      // Assert
      expect(narrator.getExamplesForTask).toHaveBeenCalledWith(task, "good", 5);
    });

    it("should fetch bad examples for the task", async () => {
      // Arrange
      const narrator = new Narrator({ outputDir: "/tmp", examplesDir: "/examples", logger });
      const task = { docId: "doc1", prompt: "Write a story about a cat." };

      // Mock getExamplesForTask
      const badExamples = [{ docId: "doc3", content: "Bad example content", verdict: "bad" }];
      jest.spyOn(narrator, "getExamplesForTask").mockImplementation((task, verdict) => {
        if (verdict === "bad") {
          return Promise.resolve(badExamples);
        }
        return Promise.resolve([]);
      });

      // Mock generateText
      (generateText as jest.Mock).mockResolvedValue({ text: "Generated text" });

      // Act
      await narrator.generate(task);

      // Assert
      expect(narrator.getExamplesForTask).toHaveBeenCalledWith(task, "bad", 5);
    });

    it("should pass in the correct temperature to the model", async () => {
      // Arrange
      const temperature = 0.7;
      const narrator = new Narrator({ outputDir: "/tmp", temperature, logger });
      const task = { docId: "doc1", prompt: "Write a story about a cat." };

      // Mock generateText
      (generateText as jest.Mock).mockResolvedValue({ text: "Generated text" });

      // Act
      await narrator.generate(task);

      // Assert
      expect(generateText).toHaveBeenCalledWith(
        expect.objectContaining({
          temperature,
        })
      );
    });
  });

  describe("saveNarration", () => {
    it("should save the generated content to the file system", () => {
      // Arrange
      const mkdirSyncSpy = jest.spyOn(fs, "mkdirSync").mockImplementation(() => "/tmp");
      const writeFileSyncSpy = jest.spyOn(fs, "writeFileSync").mockImplementation(() => {});
      const narrator = new Narrator({ outputDir: "/output", logger });
      const narration = { docId: "doc1", content: "Generated content" };

      // Act
      const result = narrator.saveNarration(narration);

      // Assert
      expect(mkdirSyncSpy).toHaveBeenCalled();
      expect(writeFileSyncSpy).toHaveBeenCalledWith(expect.any(String), "Generated content");
      expect(result).toBe(true);
    });

    it("should respect the outputDir option", () => {
      // Arrange
      const mkdirSyncSpy = jest.spyOn(fs, "mkdirSync").mockImplementation(() => "/tmp");
      const writeFileSyncSpy = jest.spyOn(fs, "writeFileSync").mockImplementation(() => {});
      const outputDir = "/custom/output";
      const narrator = new Narrator({ outputDir, logger });
      const narration = { docId: "doc1", content: "Generated content" };

      // Act
      const result = narrator.saveNarration(narration);

      // Assert
      expect(mkdirSyncSpy).toHaveBeenCalledWith(expect.stringContaining(outputDir), { recursive: true });
      expect(writeFileSyncSpy).toHaveBeenCalledWith(expect.stringContaining(outputDir), "Generated content");
      expect(result).toBe(true);
    });

    it("should respect the outputFilename option", () => {
      // Arrange
      const mkdirSyncSpy = jest.spyOn(fs, "mkdirSync").mockImplementation(() => "/tmp");
      const writeFileSyncSpy = jest.spyOn(fs, "writeFileSync").mockImplementation(() => {});
      const outputFilename = (docId: string) => `custom_${docId}.txt`;
      const narrator = new Narrator({ outputDir: "/output", outputFilename, logger });
      const narration = { docId: "doc1", content: "Generated content" };

      // Act
      const result = narrator.saveNarration(narration);

      // Assert
      expect(writeFileSyncSpy).toHaveBeenCalledWith(expect.stringContaining("custom_doc1.txt"), "Generated content");
      expect(result).toBe(true);
    });

    it("should return false and log an error if outputDir is not set", () => {
      // Arrange
      const logger = { error: jest.fn(), info: jest.fn(), debug: jest.fn() } as any;
      const narrator = new Narrator({ logger });
      const narration = { docId: "doc1", content: "Generated content" };

      // Act
      const result = narrator.saveNarration(narration);

      // Assert
      expect(logger.error).toHaveBeenCalledWith(
        "No output directory set - please set outputDir when you create the Narrator instance"
      );
      expect(result).toBe(false);
    });
  });

  describe("getNarration", () => {
    it("should fetch the generated content from the file system", () => {
      // Arrange
      jest.spyOn(fs, "readFileSync").mockImplementation(() => "Generated content 1");
      const narrator = new Narrator({ outputDir: "/output", logger });
      const docId = "doc1";

      // Act
      const content = narrator.getNarration(docId);

      // Assert
      expect(fs.readFileSync).toHaveBeenCalledWith(expect.stringContaining("doc1"), "utf-8");
      expect(content).toBe("Generated content 1");
    });

    it("should respect the outputDir option", () => {
      // Arrange
      jest.spyOn(fs, "readFileSync").mockImplementation(() => "Generated content 2");
      const outputDir = "/custom/output";
      const narrator = new Narrator({ outputDir, logger });
      const docId = "doc1";

      // Act
      narrator.getNarration(docId);

      // Assert
      expect(fs.readFileSync).toHaveBeenCalledWith(expect.stringContaining(outputDir), "utf-8");
    });

    it("should respect the outputFilename option", () => {
      // Arrange
      jest.spyOn(fs, "readFileSync").mockImplementation(() => "Generated content 3");
      const outputFilename = (docId: string) => `custom_${docId}.txt`;
      const narrator = new Narrator({ outputDir: "/output", outputFilename, logger });
      const docId = "doc1";

      // Act
      narrator.getNarration(docId);

      // Assert
      expect(fs.readFileSync).toHaveBeenCalledWith(expect.stringContaining("custom_doc1.txt"), "utf-8");
    });
  });

  describe("getExamplesForTask", () => {
    it("should fetch good examples", async () => {
      // Arrange
      const narrator = new Narrator({ examplesDir: "/examples", logger });
      const task = { docId: "group1/doc1", prompt: "Prompt text" };
      jest
        .spyOn(narrator, "readExampleYaml")
        .mockReturnValue([{ docId: "doc2", content: "Example content", verdict: "good" }]);

      // Act
      const examples = await narrator.getExamplesForTask(task, "good");

      // Assert
      expect(examples).toEqual([{ docId: "doc2", content: "Example content", verdict: "good" }]);
    });

    it("should fetch bad examples", async () => {
      // Arrange
      const narrator = new Narrator({ examplesDir: "/examples", logger });
      const task = { docId: "group1/doc1", prompt: "Prompt text" };
      jest
        .spyOn(narrator, "readExampleYaml")
        .mockReturnValue([{ docId: "doc3", content: "Bad example content", verdict: "bad" }]);

      // Act
      const examples = await narrator.getExamplesForTask(task, "bad");

      // Assert
      expect(examples).toEqual([{ docId: "doc3", content: "Bad example content", verdict: "good" }]);
    });

    it("should respect the limit passed by returning random examples", async () => {
      // Arrange
      const narrator = new Narrator({ examplesDir: "/examples", logger });
      const task = { docId: "group1/doc1", prompt: "Prompt text" };
      jest.spyOn(narrator, "readExampleYaml").mockReturnValue([
        { docId: "doc1", content: "Example 1", verdict: "good" },
        { docId: "doc2", content: "Example 2", verdict: "good" },
        { docId: "doc3", content: "Example 3", verdict: "good" },
        { docId: "doc4", content: "Example 4", verdict: "good" },
      ]);

      // Act
      const examples = await narrator.getExamplesForTask(task, "good", 2);

      // Assert
      expect(examples.length).toBe(2);
    });
  });

  describe("saveExample", () => {
    it("should save the example to the file system", async () => {
      // Arrange
      jest.spyOn(fs, "mkdirSync").mockImplementation(() => "/tmp");
      jest.spyOn(fs, "writeFileSync").mockImplementation(() => {});
      jest.spyOn(fs, "readFileSync").mockImplementation(() => "");
      const narrator = new Narrator({ examplesDir: "/examples", logger });
      const args = { docId: "group1/doc1", content: "Example content", verdict: "good", reason: "Good example" };

      // Act
      const result = await narrator.saveExample(args);

      // Assert
      expect(fs.mkdirSync).toHaveBeenCalledWith(expect.stringContaining("/examples/good"), { recursive: true });
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining("/examples/good/group1.yml"),
        expect.any(String)
      );
      expect(result).toBe(true);
    });

    it("should respect the examplesDir option", async () => {
      // Arrange
      jest.spyOn(fs, "mkdirSync").mockImplementation(() => "/tmp");
      jest.spyOn(fs, "writeFileSync").mockImplementation(() => {});
      const examplesDir = "/custom/examples";
      const narrator = new Narrator({ examplesDir, logger });
      const args = { docId: "group1/doc1", content: "Example content", verdict: "good", reason: "Good example" };

      // Act
      const result = await narrator.saveExample(args);

      // Assert
      expect(fs.mkdirSync).toHaveBeenCalledWith(expect.stringContaining(examplesDir + "/good"), { recursive: true });
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.stringContaining(examplesDir + "/good/group1.yml"),
        expect.any(String)
      );
      expect(result).toBe(true);
    });

    it("should get the content if not provided", async () => {
      // Arrange
      const narrator = new Narrator({ examplesDir: "/examples", outputDir: "/output", logger });
      jest.spyOn(narrator, "getNarration").mockReturnValue("Generated content");
      jest.spyOn(fs, "mkdirSync").mockImplementation(() => "/tmp");
      jest.spyOn(fs, "writeFileSync").mockImplementation(() => {});
      const args = { docId: "group1/doc1", verdict: "good", reason: "Good example" };

      // Act
      const result = await narrator.saveExample(args);

      // Assert
      expect(narrator.getNarration).toHaveBeenCalledWith("group1/doc1");
      expect(result).toBe(true);
    });

    it("should return false if the content was not provided and does not exist", async () => {
      // Arrange
      const logger = { error: jest.fn(), info: jest.fn(), debug: jest.fn() } as any;
      const narrator = new Narrator({ examplesDir: "/examples", logger, outputDir: "/output" });
      jest.spyOn(narrator, "getNarration").mockReturnValue(false);

      const args = { docId: "group1/doc1", verdict: "good", reason: "Good example" };

      // Act
      const result = await narrator.saveExample(args);

      // Assert
      expect(logger.error).toHaveBeenCalledWith("No narration found for group1/doc1");
      expect(result).toBe(false);
    });

    it("should de-duplicate examples", async () => {
      // Arrange
      jest.spyOn(fs, "mkdirSync").mockImplementation(() => "/tmp");
      const writeFileSyncSpy = jest.spyOn(fs, "writeFileSync").mockImplementation(() => {});
      const narrator = new Narrator({ examplesDir: "/examples", logger });
      jest
        .spyOn(narrator, "readExampleYaml")
        .mockReturnValue([{ docId: "group1/doc1", content: "Example content", reason: "Existing reason" }]);
      const args = { docId: "group1/doc1", content: "Example content", verdict: "good", reason: "New reason" };

      // Act
      const result = await narrator.saveExample(args);

      // Assert
      expect(writeFileSyncSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining("- docId: group1/doc1\n  content: Example content\n  reason: New reason")
      );
      expect(result).toBe(true);
    });
  });

  describe("Training", () => {
    let narrator: Narrator;
    let mockTrainer: Trainer;
    let mockLogger: winston.Logger;

    beforeEach(() => {
      mockTrainer = {
        evaluate: jest.fn(),
      };

      mockLogger = {
        info: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
        warn: jest.fn(),
      } as unknown as winston.Logger;

      narrator = new Narrator({
        trainer: mockTrainer,
        logger: mockLogger,
      });
    });

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should generate content and save example when evaluation is "save"', async () => {
      // Arrange
      const task: GenerationTask = { docId: "doc1", prompt: "Prompt text" };
      const generatedContent = "Generated content";

      // Mock narrator.generate to return generated content
      jest.spyOn(narrator, "generate").mockResolvedValue(generatedContent);

      // Mock trainer.evaluate to return a "save" choice with verdict and reason
      const evaluation: Evaluation = { choice: "save", verdict: "good", reason: "Well written" };
      (mockTrainer.evaluate as jest.Mock).mockResolvedValue(evaluation);

      // Mock saveExample
      jest.spyOn(narrator, "saveExample").mockResolvedValue(true);

      // Act
      await narrator.train(task);

      // Assert
      // Ensure generate was called
      expect(narrator.generate).toHaveBeenCalledWith(task);

      // Ensure trainer.evaluate was called
      expect(mockTrainer.evaluate).toHaveBeenCalledWith(task, generatedContent);

      // Ensure saveExample was called
      expect(narrator.saveExample).toHaveBeenCalledWith({
        docId: task.docId,
        verdict: evaluation.verdict,
        content: generatedContent,
        reason: evaluation.reason,
      });
    });

    it('should not save example when evaluation is "skip"', async () => {
      // Arrange
      const task: GenerationTask = { docId: "doc1", prompt: "Prompt text" };
      const generatedContent = "Generated content";

      // Mock narrator.generate to return generated content
      jest.spyOn(narrator, "generate").mockResolvedValue(generatedContent);

      // Mock trainer.evaluate to return a "skip" choice
      const evaluation: Evaluation = { choice: "skip" };
      (mockTrainer.evaluate as jest.Mock).mockResolvedValue(evaluation);

      // Mock saveExample
      const saveExampleSpy = jest.spyOn(narrator, "saveExample");

      // Act
      await narrator.train(task);

      // Assert
      // Ensure generate was called
      expect(narrator.generate).toHaveBeenCalledWith(task);

      // Ensure trainer.evaluate was called
      expect(mockTrainer.evaluate).toHaveBeenCalledWith(task, generatedContent);

      // Ensure saveExample was not called
      expect(saveExampleSpy).not.toHaveBeenCalled();
    });
  });
});
