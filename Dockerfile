FROM node:22.17.1@sha256:e515259afd26f60db74957c62203c93d45760f2ba864d94accfa2edfc1ac17cf
COPY --from=ghcr.io/astral-sh/uv:0.8.0@sha256:5778d479c0fd7995fedd44614570f38a9d849256851f2786c451c220d7bd8ccd /uv /uvx /bin/

WORKDIR /app
ADD pyproject.toml uv.lock package.json yarn.lock  ./

RUN yarn && uv sync --frozen --no-cache

ADD . .

RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]
