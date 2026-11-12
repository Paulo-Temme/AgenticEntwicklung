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

build:
	npm run build

e2e:
	npx playwright test

trace:
	node scripts/trace.mjs

stats:
	node scripts/stats.mjs

.PHONY: setup lint typecheck test coverage check build e2e trace stats
