# Stpl - Your Apps. Your Stacks.

 * http://i.stpl.io
 * https://0m4mv2f1y8.execute-api.us-east-1.amazonaws.com/dev/component/npm/express

## Develop

### Prerequisites

Get an API Key at: https://libraries.io/account and https://www.versioneye.com/settings/api

create an env.json:

    {
        "LIBRARIES_IO_API_KEY": "TODO",
        "VERSIONEYE_API_KEY": "TODO"
    }


Install aws tools, apex.

    $ make deploy

## TODOs

[] each component anaylsis kicksoff analysis for dependencies. display tree of dependencies.
  
Ï
## Ideas
https://knsv.github.io/mermaid/#links-between-nodes

[] client notification:
  * https://serverless.com/blog/serverless-notifications-on-aws/

## Component data cached
```mermaid
sequenceDiagram
    gql-->>s3: /gql/component/express
    s3-->>gql: 200 / data
```

## Component data missubg

```mermaid
sequenceDiagram
    gql-->>s3: /gql/component/express
    activate s3
    s3--x SNS: Pub: MissingComponentEvent
    s3-->>gql: 404
    deactivate s3
    SNS--x QueryLibIO: Sub: MissingComponentEvent
    activate QueryLibIO
    QueryLibIO-->>libraries.io: GET
    libraries.io-->>QueryLibIO: 200 / data
    QueryLibIO-->>s3: PUT
    deactivate QueryLibIO
    gql-->>s3: /gql/component/express
    activate s3
    s3-->>gql: 200 / data
    deactivate s3
```


```mermaid
%% comment
graph LR
  user[fa:fa-user user]
  comp[GET /component]
  qlibio[query librariesio]
  qveye[query versioneye]
  s3[get s3]

  user-.->comp
  comp-->s3
  s3-->qlibio
  s3-->qveye
```

### Functional:

Datasources: snyk, blackduck, npmjs dependencies, https://api.npms.io/v2/package/express https://npms.io/about https://api-docs.npms.io/ nodesecurity.io https://codeclimate.com/
https://api.nodesecurity.io/check/express/4.9.8
### Non-Functional:
usejsdoc.org
use graphql
 - have stable subtree
 - have an unstable subtree (alpha) e.g. librariesio, versionexe


## Architectural lessons learned

* Send events not messages (See talk from Paul Johnston)
* Error handling !!!
* Throttle requests ? 

## Snyk

* cd snyk
* clone repo https://github.com/snyk/vulnerabilitydb
* delete all but data and license
* aws s3 sync data/ s3://vulnerabilitydb


https://runkit.com/home


