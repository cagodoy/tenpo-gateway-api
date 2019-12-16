#
# SO variables
#
# GITHUB_USER
# GITHUB_TOKEN
# JWT_SECRET
#

#
# Internal variables
#
VERSION := $$(cat package.json | grep version | sed 's/"/ /g' | awk {'print $$3'})
SVC=tenpo-gateway-api
PORT=5000
GITHUB_REGISTRY_URL=docker.pkg.github.com/$(GITHUB_USER)/$(SVC)

AUTH_HOST=0.0.0.0
AUTH_PORT=5010

RESTAURANTS_HOST=0.00.0
RESTAURANTS_PORT=5030

version v:
	@echo $(VERSION)

prepare pre:
	@echo "[prepare] preparing..."
	@npm install
	@npm install copyfiles -g
	@cp -r ../../lib/src-js/clients ../../lib/src-js/promisify ./src
	@cp -r ../../lib/proto .

clean c:
	@echo "[clean] cleaning..."
	@rm -rf dist || true

typescript ts: clean
	@echo "[typescript] Transpiling code..."
	@node_modules/typescript/bin/tsc
	@copyfiles -u 1 src/**/*.graphql dist

copy-dependencies cd: 
	@echo "[copy-dependencies] Copying code..."
	@copyfiles -u 1 src/**/*.graphql dist

run r: typescript copy-dependencies
	@echo "[running] Running service..."
	@PORT=$(PORT) AUTH_HOST=$(AUTH_HOST) AUTH_PORT=$(AUTH_PORT) RESTAURANTS_HOST=$(RESTAURANTS_HOST) RESTAURANTS_PORT=$(RESTAURANTS_PORT) npm start

docker d:
	@echo "[docker] Building image..."
	@docker build -t $(SVC):$(VERSION) .
	
docker-login dl:
	@echo "[docker] Login to docker..."
	@docker login docker.pkg.github.com -u $(GITHUB_USER) -p $(GITHUB_TOKEN)

push p: docker docker-login
	@echo "[docker] pushing $(GITHUB_REGISTRY_URL)/$(SVC):$(VERSION)"
	@docker tag $(SVC):$(VERSION) $(GITHUB_REGISTRY_URL)/$(SVC):$(VERSION)
	@docker push $(GITHUB_REGISTRY_URL)/$(SVC):$(VERSION)

compose co: typescript
	@echo "[docker-compose] Running docker-compose..."
	@docker-compose build
	@docker-compose up

stop s: 
	@echo "[docker-compose] Stopping docker-compose..."
	@docker-compose down

.PHONY: version v prepare pre clean c typescript ts copy-dependencies cd run r docker d docker-login dl push p compose co stop s
