install:
	npm --prefix pixel-canvas-api install
	npm --prefix pixel-canvas-ui install
build-packages:
	npm --prefix pixel-canvas-api run build
	npm --prefix pixel-canvas-ui run build
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
	docker-compose down
clean:
	rm -rf db-cache redis-cache
create-canvas:
	curl -X POST -H "Content-Type: application/json" \
    -d '{"name": "Example Canvas", "width": 100, "height": 100}' \
    http://localhost:4000/canvas