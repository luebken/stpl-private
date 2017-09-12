prepare:
	cd stplui; npm install

localdev:
	cd stplui; npm start

build:
	cd stplui; npm run build

deploy: build
	apex deploy --env-file env.json
	aws s3 sync --exclude *.map  stplui/build/ s3://i.stpl.io --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers

localserve:
	open http://localhost:8000
	cd stplui/build; python -m SimpleHTTPServer
