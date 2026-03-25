FROM node:24.14.1@sha256:bb20cf73b3ad7212834ec48e2174cdcb5775f6550510a5336b842ae32741ce6c
COPY --from=ghcr.io/astral-sh/uv:0.10.12@sha256:72ab0aeb448090480ccabb99fb5f52b0dc3c71923bffb5e2e26517a1c27b7fec /uv /uvx /bin/

WORKDIR /app
ADD pyproject.toml uv.lock package.json pnpm-lock.yaml ./

RUN npm install --global corepack@latest && corepack enable pnpm
RUN pnpm install && uv sync --frozen --no-cache

ADD . .

RUN pnpm run build:release

EXPOSE 3000
CMD ["pnpm", "run", "start"]
