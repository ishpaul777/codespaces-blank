FROM golang:1.19-alpine AS build_base

RUN apk add --no-cache git

# Set the Current Working Directory inside the container
WORKDIR /tmp/tagore-server

# We want to populate the module cache based on the go.{mod,sum} files.
COPY . .
RUN ls -l

RUN go mod download

# Unit tests
# RUN CGO_ENABLED=0 go test -v

# Build the Go app
RUN go build -o ./out/tagore-server .

# Start fresh from a smaller image
FROM alpine:3.16
RUN apk add ca-certificates

COPY --from=build_base /tmp/tagore-server/out/tagore-server /app/tagore-server

# Run the binary program produced by `go install`
ENTRYPOINT ["/app/tagore-server"]
CMD ["serve"]