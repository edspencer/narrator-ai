// Trainer.test.ts

import winston from "winston";
import { HumanTrainer, Evaluation } from "../Trainer";
import { LLMTask } from "../types";
import readline from "readline";

jest.mock("readline");

describe("HumanTrainer", () => {
  let trainer: HumanTrainer;
  let mockReadlineInterface: any;
  let questionMock: jest.Mock;
  let closeMock: jest.Mock;

  beforeEach(() => {
    trainer = new HumanTrainer({ logger: winston.createLogger({ silent: true }) });
    questionMock = jest.fn();
    closeMock = jest.fn();
    mockReadlineInterface = {
      question: questionMock,
      close: closeMock,
    };

    (readline.createInterface as jest.Mock).mockReturnValue(mockReadlineInterface);

    // Mock console.log to prevent cluttering test output
    jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return verdict "good" when user inputs "g" and provides a reason', async () => {
    // Arrange
    const task: LLMTask = { docId: "doc1", prompt: "Prompt text" };
    const content = "Generated content";

    // Simulate user input: 'g' for the first question, 'some reason' for the second
    questionMock.mockImplementationOnce((prompt, callback) => {
      callback("g");
    });
    questionMock.mockImplementationOnce((prompt, callback) => {
      callback("some reason");
    });

    // Act
    const evaluation = await trainer.evaluate(task, content);

    // Assert
    expect(evaluation).toEqual({
      choice: "save",
      verdict: "good",
      reason: "some reason",
    });
    expect(questionMock).toHaveBeenCalledTimes(2);
  });

  it('should return verdict "bad" when user inputs "b" and provides a reason', async () => {
    // Arrange
    const task: LLMTask = { docId: "doc1", prompt: "Prompt text" };
    const content = "Generated content";

    // Simulate user input: 'b' for the first question, 'some reason' for the second
    questionMock.mockImplementationOnce((prompt, callback) => {
      callback("b");
    });
    questionMock.mockImplementationOnce((prompt, callback) => {
      callback("some reason");
    });

    // Act
    const evaluation = await trainer.evaluate(task, content);

    // Assert
    expect(evaluation).toEqual({
      choice: "save",
      verdict: "bad",
      reason: "some reason",
    });
    expect(questionMock).toHaveBeenCalledTimes(2);
  });

  it('should return choice "skip" when user inputs "s"', async () => {
    // Arrange
    const task: LLMTask = { docId: "doc1", prompt: "Prompt text" };
    const content = "Generated content";

    // Simulate user input: 's' for the first question
    questionMock.mockImplementationOnce((prompt, callback) => {
      callback("s");
    });

    // Act
    const evaluation = await trainer.evaluate(task, content);

    // Assert
    expect(evaluation).toEqual({
      choice: "skip",
    });
    expect(questionMock).toHaveBeenCalledTimes(1);
  });

  it('should return undefined reason when user inputs "g" and skips reason', async () => {
    // Arrange
    const task: LLMTask = { docId: "doc1", prompt: "Prompt text" };
    const content = "Generated content";

    // Simulate user input: 'g' for the first question, '' (empty string) for the second
    questionMock.mockImplementationOnce((prompt, callback) => {
      callback("g");
    });
    questionMock.mockImplementationOnce((prompt, callback) => {
      callback("");
    });

    // Act
    const evaluation = await trainer.evaluate(task, content);

    // Assert
    expect(evaluation).toEqual({
      choice: "save",
      verdict: "good",
      reason: undefined,
    });
    expect(questionMock).toHaveBeenCalledTimes(2);
  });

  it('should return undefined reason when user inputs "b" and skips reason', async () => {
    // Arrange
    const task: LLMTask = { docId: "doc1", prompt: "Prompt text" };
    const content = "Generated content";

    // Simulate user input: 'b' for the first question, '' (empty string) for the second
    questionMock.mockImplementationOnce((prompt, callback) => {
      callback("b");
    });
    questionMock.mockImplementationOnce((prompt, callback) => {
      callback("");
    });

    // Act
    const evaluation = await trainer.evaluate(task, content);

    // Assert
    expect(evaluation).toEqual({
      choice: "save",
      verdict: "bad",
      reason: undefined,
    });
    expect(questionMock).toHaveBeenCalledTimes(2);
  });
});
