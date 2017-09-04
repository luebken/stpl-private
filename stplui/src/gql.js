import {
  WithToken,
} from "./cognito-utils";

export const apiGPrefix = 'https://0m4mv2f1y8.execute-api.us-east-1.amazonaws.com/dev/'

export function GqlQuery(variables, authenticated) {
  var target = `${apiGPrefix}readgql`
  if (authenticated) { target = `${apiGPrefix}gql` }
  return WithToken().then(token => {
    return fetch(target, {
      method: 'post',
      mode: 'cors',
      body: JSON.stringify({ query: query, variables: variables }),
      headers: new Headers({
        'Accept': 'application/json',
        'Authorization': token
      })
    })
  }).then(response => {
    if (response.status === 200) { return response.json() }

    console.log(response)
    throw `Bad status code ${response.status} `
  }).catch(err => {
    console.log('Sad days: ' + err)
    return
  })
}

const query = `
query ($name: String!){
  main(name: $name) {
    name
    ecosystem
    repository
  }
  librariesio(name: $name) {
    name
    platform
    description
    homepage
    normalized_licenses
    rank
    latest_release_published_at
    latest_release_number
    keywords
  }
  versioneye(name: $name) {
    name
    language
    description
    version
  }
  npms(name: $name) {
    collected {
      metadata {
        name
        description
        version
        keywords
        links {
          homepage
          repository
        }
        license
        dependencies {
          name
          version
        }
      }
    }
    evaluation {
      quality {
        carefulness
        tests
        health
        branding
      }
    }
  }
  snyk(name: $name) {
    readme
  }
  daviddm(name: $name) {
    status
    deps {
      name
      required
      stable
      latest
      status
    }
  }
}`

