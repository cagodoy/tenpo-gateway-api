#
# SO variables
#
# DOCKER_USER
# DOCKER_PASS
# JWT_SECRET
#

#
# Internal variables
#
VERSION := $$(cat package.json | grep version | sed 's/"/ /g' | awk {'print $$3'})
SVC=tenpo-gateway-api
PORT=5000
REGISTRY_URL=$(DOCKER_USER)

AUTH_HOST=localhost
AUTH_PORT=5010

RESTAURANTS_HOST=localhost
RESTAURANTS_PORT=5030

HISTORY_HOST=localhost
HISTORY_PORT=5040

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
	@PORT=$(PORT) AUTH_HOST=$(AUTH_HOST) AUTH_PORT=$(AUTH_PORT) RESTAURANTS_HOST=$(RESTAURANTS_HOST) RESTAURANTS_PORT=$(RESTAURANTS_PORT) HISTORY_HOST=$(HISTORY_HOST) HISTORY_PORT=$(HISTORY_PORT) npm start

docker d: typescript copy-dependencies
	@echo "[docker] Building image..."
	@docker build -t $(SVC):$(VERSION) .
	
docker-login dl:
	@echo "[docker] Login to docker..."
	@docker login -u $(DOCKER_USER) -p $(DOCKER_PASS)

push p: docker docker-login
	@echo "[docker] pushing $(REGISTRY_URL)/$(SVC):$(VERSION)"
	@docker tag $(SVC):$(VERSION) $(REGISTRY_URL)/$(SVC):$(VERSION)
	@docker push $(REGISTRY_URL)/$(SVC):$(VERSION)

compose co: typescript
	@echo "[docker-compose] Running docker-compose..."
	@docker-compose build
	@docker-compose up

stop s: 
	@echo "[docker-compose] Stopping docker-compose..."
	@docker-compose down

.PHONY: version v prepare pre clean c typescript ts copy-dependencies cd run r docker d docker-login dl push p compose co stop s
