export type RateLimiter = {
  increment: (id: string) => Promise<{
    success: boolean;
    totalHits: number;
    limitHits: number;
    msToExpire: number;
  }>;
};
