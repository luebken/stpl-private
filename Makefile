deploy:
	apex deploy --env-file env.json
	aws s3 sync frontend/ s3://i.stpl.io --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers

localserve:
	open http://localhost:8000
	cd frontend; python -m SimpleHTTPServer