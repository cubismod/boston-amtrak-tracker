FROM node:22.16.0@sha256:6a2972b55a5032ed961f5239c7a829c439fb54fc1d99ca5dccb2094860a47b97
COPY --from=ghcr.io/astral-sh/uv:0.7.12@sha256:4faec156e35a5f345d57804d8858c6ba1cf6352ce5f4bffc11b7fdebdef46a38 /uv /uvx /bin/

WORKDIR /app
ADD pyproject.toml uv.lock package.json yarn.lock  ./

RUN yarn && uv sync --frozen --no-cache

ADD . .

RUN yarn build

CMD ["yarn", "start"]
