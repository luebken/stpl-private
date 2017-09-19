prepare:
	cd stplui; npm install

localdev:
	cd stplui; npm start

build:
	cd stplui; npm run build

deploy:
	apex deploy --env-file env.json
	aws s3 sync --exclude *.map  stplui/build/ s3://i.stpl.io --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers

localserve:
	open http://localhost:8000
	cd stplui/build; python -m SimpleHTTPServer

changepassword:
	USERNAME=goern
	aws cognito-idp admin-initiate-auth --user-pool-id us-east-1_n9E1pHkMX --client-id 5mci9av5crotk4uqut7ol6tqr8 --auth-flow ADMIN_NO_SRP_AUTH --auth-parameters USERNAME=$USERNAME,PASSWORD=stplio
	SESSION=
	aws cognito-idp admin-respond-to-auth-challenge --user-pool-id us-east-1_n9E1pHkMX --client-id 5mci9av5crotk4uqut7ol6tqr8 --challenge-name NEW_PASSWORD_REQUIRED --challenge-responses NEW_PASSWORD=stplio,USERNAME=$USERNAME,userAttributes.name=$USERNAME --session $SESSION

