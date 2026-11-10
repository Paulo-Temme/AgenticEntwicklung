setup:
	npm ci

lint:
	npx eslint .

typecheck:
	npx tsc --noEmit

test:
	npx vitest run

coverage:
	npx vitest run --coverage

check: lint typecheck test

.PHONY: setup lint typecheck test coverage check
