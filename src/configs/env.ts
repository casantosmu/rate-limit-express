import z from "zod";

const envSchema = z
  .object({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    SERVER_PORT: z.coerce.number().default(8000),
  })
  .transform(({ SERVER_PORT }) => ({
    serverPort: SERVER_PORT,
  }));

export const env = envSchema.parse(process.env);
