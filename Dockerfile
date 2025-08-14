FROM node:22.18.0@sha256:58a260471ff760412efdd89afb30d1518f94295a7a7f5e62d3f6e436735d27f9
COPY --from=ghcr.io/astral-sh/uv:0.8.8@sha256:67b2bcccdc103d608727d1b577e58008ef810f751ed324715eb60b3f0c040d30 /uv /uvx /bin/

WORKDIR /app
ADD pyproject.toml uv.lock package.json yarn.lock  ./

RUN yarn && uv sync --frozen --no-cache

ADD . .

RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]
