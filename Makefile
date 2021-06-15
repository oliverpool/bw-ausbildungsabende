node_modules:
	yarn --frozen-lockfile

dev: node_modules
	yarn dev

upgrade:
	yarn upgrade
