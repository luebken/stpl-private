
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
    console.log('getComponent for ', name)
    const getComponentQuery = `
{
  component(name: "${name}") {
    name
    ecosystem
    latest_release
    link
  }
}`
    console.log('getComponentQuery ', getComponentQuery)

    gqlQuery(getComponentQuery, {}, true).then(respObject => {
      document.getElementById('output').innerHTML = JSON.stringify(respObject, null, 2)
    }).catch(err => {
      console.log('Sad days: ' + err)
    })
  })
}
