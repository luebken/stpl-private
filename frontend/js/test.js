
function testPage() {

  document.getElementById('buttonTestEndpoint').addEventListener('click', () => {
    console.log('buttonTestEndpoint')
    withToken().then(token => {
      return fetch(`${apiGPrefix}test`, {
        method: 'get',
        headers: new Headers({
          'Accept': 'application/json',
          'Authorization': token
        })
      })
    }).then(response => {
      if (response.status === 200) { return response.json() }
      console.log(response)
      throw new Error(`Bad status code ${response.status}`)
    }).then(respObject => {
      document.getElementById('output').innerHTML = JSON.stringify(respObject, null, 2)
    }).catch(err => {
      console.log('Sad days: ' + err)
    })
  })


  document.getElementById('buttonGetComponent').addEventListener('click', () => {
    var name = document.getElementById('inputGetComponent').value
    getComponentDataFor(name)
  })

  function getComponentDataFor(name) {
    document.getElementById('output').innerHTML = ''
    console.log('getComponent for ', name)
    const query = `
query ($name: String!){
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
      }
    }
  }
}`

    const variables = { 'name': name, ecosystem: 'npm' }

    gqlQuery(query, variables, true).then(respObject => {
      // overview
      document.getElementById('overview-content').innerHTML = ""
      document.getElementById('overview-content-name').innerHTML = respObject.npms.collected.metadata.name
      document.getElementById('overview-content-description').innerHTML = respObject.npms.collected.metadata.description

      // debug
      document.getElementById('output').innerHTML = JSON.stringify(respObject, null, 2)
    }).catch(err => {
      document.getElementById('output').innerHTML = 'Component not cached. Looking for it right now. Please give me a sec.'
      console.log('Sad days: ' + err)
      //setTimeout(function () { getComponentDataFor(name) }, 2000)
    })
  }
}
