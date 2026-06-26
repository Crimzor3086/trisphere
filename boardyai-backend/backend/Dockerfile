# --- BUILD STAGE ---
FROM elixir:1.15-alpine AS builder

RUN apk add --no-cache build-essential git

WORKDIR /app

RUN mix local.hex --force && \
    mix local.rebar --force

ENV MIX_ENV=prod

COPY mix.exs mix.lock ./
RUN mix deps.get --only prod
RUN mix deps.compile

COPY config config
COPY lib lib
COPY priv priv
COPY rel rel

# Build the release
RUN mix release

# --- RUN STAGE ---
FROM alpine:3.18 AS runner

RUN apk add --no-cache libstdc++ openssl ncurses-libs postgresql-client

WORKDIR /app

ENV MIX_ENV=prod \
    PORT=4000

# Copy the compiled release binaries from builder stage
COPY --from=builder /app/_build/prod/rel/boardy ./

# Expose Phoenix port
EXPOSE 4000

# Run migrations and start the server release
CMD ["sh", "-c", "bin/migrate && bin/server"]
