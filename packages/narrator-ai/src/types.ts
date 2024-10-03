export type GenerationTask = {
  docId: string;
  prompt: string;
  suffix?: string;
};

export type Example = {
  docId: string;
  content: string;
  reason?: string;
  verdict: string;
};

export type Narration = {
  docId: string;
  content: string;
};
