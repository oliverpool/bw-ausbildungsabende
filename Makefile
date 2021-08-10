node_modules:
	yarn --frozen-lockfile

install:
	yarn --frozen-lockfile

dev: node_modules
	yarn dev

upgrade:
	yarn upgrade

host=pfadfrwqhf-user@ssh.cluster026.hosting.ovh.net

build:
	yarn run build

tsc-:
	-yarn run tsc

tsc:
	yarn run tsc

staging: tsc- build
	rsync -avh dist/ $(host):subdomain/dev/bw --delete-after

tagnow:
	@git diff-index --quiet HEAD || (echo "git tree is not clean:" && git status --short && exit 1)
	git tag $$(date '+%Y-%m-%d_%H%M%S')
