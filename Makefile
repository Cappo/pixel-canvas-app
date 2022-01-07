install:
	npm install
build-packages:
	npm run build --workspaces
build-docker:
	docker-compose --profile all build
build: build-packages build-docker
start:
	docker-compose --profile all up
start-backend:
	docker-compose --profile backend up
start-data:
	docker-compose --profile data up
down:
	docker-compose --profile all down
clean:
	rm -rf db-cache redis-cache
create-canvas:
	curl -X POST -H "Content-Type: application/json" \
    -d '{"name": "Example Canvas", "width": 100, "height": 100}' \
    http://localhost:4000/canvas