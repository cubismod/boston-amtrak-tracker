FROM node:22.15.1@sha256:9853a1e3ddd87b28327124e6c2016815fb42f09aa62902dd5ca054363eafbd72
COPY --from=ghcr.io/astral-sh/uv:0.7.3@sha256:87a04222b228501907f487b338ca6fc1514a93369bfce6930eb06c8d576e58a4 /uv /uvx /bin/

WORKDIR /app
ADD pyproject.toml uv.lock package.json yarn.lock  ./

RUN yarn && uv sync --frozen --no-cache

ADD . .

RUN yarn build

CMD ["yarn", "start"]
