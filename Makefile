install:
	npm --prefix pixel-canvas-api install
	npm --prefix pixel-canvas-ui install
build-packages:
	npm --prefix pixel-canvas-api run build
	npm --prefix pixel-canvas-ui run build
build-docker:
	docker-compose build
build: build-packages build-docker
start:
	docker-compose up
down:
	docker-compose down