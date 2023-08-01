export type RateLimiter = {
  increment: (id: string) => Promise<{
    success: boolean;
    limitHits: number;
    msToExpire: number;
  }>;
};
