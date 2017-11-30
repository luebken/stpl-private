* structured logging:
 - log json via console.log(JSON.stringify(coreResult))
 - filter via: {$.source = npms}
 - http://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/FilterAndPatternSyntax.html

 changepassword:
	USERNAME=demo
	aws cognito-idp admin-initiate-auth --user-pool-id us-east-1_n9E1pHkMX --client-id 5mci9av5crotk4uqut7ol6tqr8 --auth-flow ADMIN_NO_SRP_AUTH --auth-parameters USERNAME=$USERNAME,PASSWORD=demodemo
	
    SESSION=
	aws cognito-idp admin-respond-to-auth-challenge --user-pool-id us-east-1_n9E1pHkMX --client-id 5mci9av5crotk4uqut7ol6tqr8 --challenge-name NEW_PASSWORD_REQUIRED --challenge-responses NEW_PASSWORD=demodemo,USERNAME=$USERNAME,userAttributes.name=$USERNAME --session $SESSION

