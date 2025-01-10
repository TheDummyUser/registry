GO = go
BINARY_NAME = myapp
MAIN_GO_FILE = ./cmd/main.go
# Default target to build the binary
.PHONY: all
all: build
# Build the Go application
.PHONY: build
build:
	$(GO) build -o $(BINARY_NAME) $(MAIN_GO_FILE)
# Run the Go application
.PHONY: run
run: build
	./$(BINARY_NAME)
# Clean up the binary files
.PHONY: clean
clean:
	rm -f $(BINARY_NAME)
# Run tests
.PHONY: test
test:
	$(GO) test ./...
# Format the code (optional)
.PHONY: fmt
fmt:
	$(GO) fmt ./...
# Lint the code (optional, requires golangci-lint installed)
.PHONY: lint
lint:
	golangci-lint run
