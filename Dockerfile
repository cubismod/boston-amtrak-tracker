FROM node:22.17.1@sha256:37ff334612f77d8f999c10af8797727b731629c26f2e83caa6af390998bdc49c
COPY --from=ghcr.io/astral-sh/uv:0.8.3@sha256:ef11ed817e6a5385c02cd49fdcc99c23d02426088252a8eace6b6e6a2a511f36 /uv /uvx /bin/

WORKDIR /app
ADD pyproject.toml uv.lock package.json yarn.lock  ./

RUN yarn && uv sync --frozen --no-cache

ADD . .

RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]
