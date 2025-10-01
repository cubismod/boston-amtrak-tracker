FROM node:22.20.0@sha256:2bb201f33898d2c0ce638505b426f4dd038cc00e5b2b4cbba17b069f0fff1496
COPY --from=ghcr.io/astral-sh/uv:0.8.22@sha256:9874eb7afe5ca16c363fe80b294fe700e460df29a55532bbfea234a0f12eddb1 /uv /uvx /bin/

WORKDIR /app
ADD pyproject.toml uv.lock package.json pnpm-lock.yaml ./

RUN npm install --global corepack@latest && corepack enable pnpm
RUN pnpm install && uv sync --frozen --no-cache

ADD . .

RUN pnpm run build:release

EXPOSE 3000
CMD ["pnpm", "run", "start"]
