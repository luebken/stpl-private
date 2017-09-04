prepare:
	cd stplui; npm install

build:
	cd stplui; npm run build

deploy:
	apex deploy --env-file env.json
	aws s3 sync stplui/build/ s3://i.stpl.io --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers

localdev:
	cd stplui; npm start

localserve:
	open http://localhost:8000
	cd stplui/build; python -m SimpleHTTPServer
