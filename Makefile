# RentBasket Website — standardised commands
# Reference: AGENTS.md Quick Start / Lecture 02 Environment subsystem

.PHONY: setup dev test check build deploy lint typecheck e2e design-check

setup:
	npm ci
	@[ -f .env.local ] || cp .env.example .env.local
	@echo "✅ Setup complete. Run 'make dev' to start."

dev:
	npx vite --port 8080

test:
	npm run test

lint:
	npm run lint

typecheck:
	npx tsc --noEmit

build:
	npm run build

check:
	@bash scripts/verify.sh

# Design-only verification: Layer 1 + visual snapshot (skips unit tests)
design-check:
	@bash scripts/verify.sh --layer 1
	@bash scripts/verify.sh --layer 3 --scope design

deploy:
	@bash -c 'bash scripts/verify.sh && npm run deploy || (echo "ERROR: make check must pass before deploy" && exit 1)'

e2e:
	@bash scripts/verify.sh --layer 3
