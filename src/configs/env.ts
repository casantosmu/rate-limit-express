import z from "zod";

const envSchema = z
  .object({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    SERVER_PORT: z.coerce.number().default(8000),
    // eslint-disable-next-line @typescript-eslint/naming-convention
    UUID_AUTH_TOKEN: z.string().uuid(),
  })
  .transform(({ SERVER_PORT, UUID_AUTH_TOKEN }) => ({
    serverPort: SERVER_PORT,
    uuidAuthToken: UUID_AUTH_TOKEN,
  }));

export const env = envSchema.parse(process.env);
