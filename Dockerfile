FROM node:22.15.1@sha256:e558507eb799e3a76fcdaaee5e48dce1a00aebc85892128a9fca59f63bd49511
COPY --from=ghcr.io/astral-sh/uv:0.7.5@sha256:69e13c7ae3a7649cbe0c912ca8afe00656966622a13f2db2d7eef7bb01118ccf /uv /uvx /bin/

WORKDIR /app
ADD pyproject.toml uv.lock package.json yarn.lock  ./

RUN yarn && uv sync --frozen --no-cache

ADD . .

RUN yarn build

CMD ["yarn", "start"]
