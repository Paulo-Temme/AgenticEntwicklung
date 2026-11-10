setup:
	npm ci

lint:
	npx eslint .

typecheck:
	npx tsc --noEmit

test:
	npx vitest run --passWithNoTests

coverage:
	npx vitest run --coverage --passWithNoTests

check: lint typecheck test

.PHONY: setup lint typecheck test coverage check
