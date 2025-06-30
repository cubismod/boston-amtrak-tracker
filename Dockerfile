FROM node:22.16.0@sha256:71bcbb3b215b3fa84b5b167585675072f4c270855e37a599803f1a58141a0716
COPY --from=ghcr.io/astral-sh/uv:0.7.17@sha256:68a26194ea8da0dbb014e8ae1d8ab08a469ee3ba0f4e2ac07b8bb66c0f8185c1 /uv /uvx /bin/

WORKDIR /app
ADD pyproject.toml uv.lock package.json yarn.lock  ./

RUN yarn && uv sync --frozen --no-cache

ADD . .

RUN yarn build

CMD ["yarn", "start"]
