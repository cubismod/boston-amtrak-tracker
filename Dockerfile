FROM node:22.17.1@sha256:37ff334612f77d8f999c10af8797727b731629c26f2e83caa6af390998bdc49c
COPY --from=ghcr.io/astral-sh/uv:0.8.4@sha256:40775a79214294fb51d097c9117592f193bcfdfc634f4daa0e169ee965b10ef0 /uv /uvx /bin/

WORKDIR /app
ADD pyproject.toml uv.lock package.json yarn.lock  ./

RUN yarn && uv sync --frozen --no-cache

ADD . .

RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]
