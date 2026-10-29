FROM node:26.13.0@sha256:6d2c7d5d074bf72f81ddc252b4fbb5d625bc028eeda49cb4b8c2ff8eda1ee617
COPY --from=ghcr.io/astral-sh/uv:0.12.21@sha256:a7aed3216253ee804de3e2d8afa5073baa1a177335345d43845cd4165e43b711 /uv /uvx /bin/

WORKDIR /app
ADD pyproject.toml uv.lock package.json pnpm-lock.yaml ./

RUN npm install --global corepack@latest && corepack enable pnpm
RUN pnpm install && uv sync --frozen --no-cache

ADD . .

RUN pnpm run build:release

EXPOSE 3000
CMD ["pnpm", "run", "start"]
