node_modules:
	yarn --frozen-lockfile

install:
	yarn --frozen-lockfile

dev: node_modules
	yarn dev

dev-dpsg: node_modules
	BRANDING=dpsg yarn dev


upgrade:
	yarn upgrade

host=pfadfrwqhf-user@ssh.cluster026.hosting.ovh.net

build:
	yarn run build

build-dpsg:
	BRANDING=dpsg yarn run build

tsc:
	yarn run tsc

staging: build
	rsync -avh --chmod=ugo=rwX dist/ $(host):subdomain/bw/ausbildung --delete-after

staging-dpsg: build-dpsg
	rsync -avh --chmod=ugo=rwX dist/ $(host):subdomain/dpsg/grustu --delete-after

tagnow:
	@git diff-index --quiet HEAD || (echo "git tree is not clean:" && git status --short && exit 1)
	git tag $$(date '+%Y-%m-%d_%H%M%S')
