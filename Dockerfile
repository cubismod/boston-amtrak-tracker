FROM node:22.20.0@sha256:915acd9e9b885ead0c620e27e37c81b74c226e0e1c8177f37a60217b6eabb0d7
COPY --from=ghcr.io/astral-sh/uv:0.9.4@sha256:c4089b0085cf4d38e38d5cdaa5e57752c1878a6f41f2e3a3a234dc5f23942cb4 /uv /uvx /bin/

WORKDIR /app
ADD pyproject.toml uv.lock package.json pnpm-lock.yaml ./

RUN npm install --global corepack@latest && corepack enable pnpm
RUN pnpm install && uv sync --frozen --no-cache

ADD . .

RUN pnpm run build:release

EXPOSE 3000
CMD ["pnpm", "run", "start"]
