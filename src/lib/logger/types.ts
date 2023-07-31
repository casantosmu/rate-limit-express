export type Logger = {
  info: (message: string, metadata?: unknown) => void;
  error: (message: string, metadata?: unknown) => void;
};
