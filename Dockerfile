FROM node:24.13.1@sha256:00e9195ebd49985a6da8921f419978d85dfe354589755192dc090425ce4da2f7
COPY --from=ghcr.io/astral-sh/uv:0.10.4@sha256:4cac394b6b72846f8a85a7a0e577c6d61d4e17fe2ccee65d9451a8b3c9efb4ac /uv /uvx /bin/

WORKDIR /app
ADD pyproject.toml uv.lock package.json pnpm-lock.yaml ./

RUN npm install --global corepack@latest && corepack enable pnpm
RUN pnpm install && uv sync --frozen --no-cache

ADD . .

RUN pnpm run build:release

EXPOSE 3000
CMD ["pnpm", "run", "start"]
