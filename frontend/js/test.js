
function testPage () {
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

  function getComponentDataFor (name) {
    document.getElementById('output').innerHTML = ''
    console.log('getComponent for ', name)
    const query = `
query ($name: String!){
  component(name: $name) {
    name
    ecosystem
    latest_release
    link
  }
}`

    const variables = { 'name': name, ecosystem: 'npm' }

    gqlQuery(query, variables, true).then(respObject => {
      document.getElementById('output').innerHTML = JSON.stringify(respObject, null, 2)
    }).catch(err => {
      document.getElementById('output').innerHTML = 'Component not cached. Looking for it right now. Please give me a sec.'
      console.log('Sad days: ' + err)
      setTimeout(function () { getComponentDataFor(name) }, 2000)
    })
  }
}
