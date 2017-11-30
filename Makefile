.DEFAULT_GOAL := help

ui-install: ## Install the reactapps dependencies.
	cd stplui; npm install

ui-localstart: ## Starts the reactapp.
	cd stplui; npm start

ui-build: ## Builds the reactapp.
	cd stplui; npm run build

localserve: ## Serves the ui build locally.
	open http://localhost:8000
	cd stplui/build; python -m SimpleHTTPServer

build: ## Builds the functions.
	cd functions/gql; npm install

deploy: ## Deploys the UI and the functions.
	@apex deploy --set LIBRARIES_IO_API_KEY=$(LIBRARIES_IO_API_KEY) --set VERSIONEYE_API_KEY=$(VERSIONEYE_API_KEY)
	aws s3 sync --exclude *.map  stplui/build/ s3://i.stpl.io --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers

help: ##Shows help message
	@echo "Available make commands:"
	@grep -E '^[0-9a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'