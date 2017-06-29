# Stpl

 * http://i.stpl.io
 * https://0m4mv2f1y8.execute-api.us-east-1.amazonaws.com/dev/component/npm/express

## Deploy
supply an env.json:
    {
        "LIBRARIES_IO_API_KEY": "TODO",
        "VERSIONEYE_API_KEY": "TODO"
    }


    $ apex deploy --env-file env.json

    $ aws s3 cp frontend/index.html s3://i.stpl.io --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers


## Ideas

### Functional:

Datasources: snyk, blackduck

### Non-Functional:
usejsdoc.org