FROM node:22.15.1@sha256:e558507eb799e3a76fcdaaee5e48dce1a00aebc85892128a9fca59f63bd49511
COPY --from=ghcr.io/astral-sh/uv:0.7.9@sha256:563b73ab264117698521303e361fb781a0b421058661b4055750b6c822262d1e /uv /uvx /bin/

WORKDIR /app
ADD pyproject.toml uv.lock package.json yarn.lock  ./

RUN yarn && uv sync --frozen --no-cache

ADD . .

RUN yarn build

CMD ["yarn", "start"]
