# Rate Limit Express API

This repository contains an Express API with authentication and rate-limiting middleware. The rate-limiting middleware allows you to set limits for both routes protected by a unique UUID token and public routes limited by IP address. The application uses Redis to avoid statefulness, allowing for horizontal scalability. Redis's multi command is used to handle race conditions, ensuring atomic execution of commands.

## Features

- Rate limiting for protected routes based on UUID tokens.
- Rate limiting for public routes based on IP addresses.
- Redis integration for scalable and stateless architecture.
- Handling of race conditions using Redis's multi command.
- Customizable rate limits for tokens and IP addresses.

## Setup

1. Clone the repository to your local machine:

   ```bash
   git clone https://github.com/casantosmu/rate-limit-express.git
   cd rate-limit-express
   ```

2. Install the required dependencies:

   ```bash
   npm install
   ```

3. Set up the environment variables by creating a `.env` file in the root directory:

   ```env
   SERVER_PORT=3000
   UUID_AUTH_TOKEN="your-uuid-auth-token"
   REDIS_PORT=6379
   REDIS_HOST=redis
   RATE_LIMITER_TOKEN_LIMIT=200
   RATE_LIMITER_IP_LIMIT=100
   ```

## Usage

1. Run the application using npm:

   ```bash
   npm run dev
   ```

2. Access the API through `http://localhost:3000`.

3. The following routes are available:

   - Public Route (Rate-limited by IP): `GET /v1/public`
   - Protected Route (Rate-limited by UUID token): `GET /v1/protected`

## Docker Compose

If you prefer running the application using Docker, make sure you have Docker and Docker Compose installed.

```bash
docker-compose up
```

## Testing

Run tests using the following command:

```bash
npm test
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
