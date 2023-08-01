import z from "zod";

const envSchema = z
  .object({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    SERVER_PORT: z.coerce.number().default(8000),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    UUID_AUTH_TOKEN: z.string().uuid(),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    REDIS_PORT: z.coerce.number(),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    REDIS_HOST: z.string(),
  })
  .transform(({ SERVER_PORT, UUID_AUTH_TOKEN, REDIS_PORT, REDIS_HOST }) => ({
    serverPort: SERVER_PORT,
    uuidAuthToken: UUID_AUTH_TOKEN,
    redisPort: REDIS_PORT,
    redisHost: REDIS_HOST,
  }));

export const env = envSchema.parse(process.env);
