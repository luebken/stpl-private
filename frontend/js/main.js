
// main function called at index.html
function main() {
  toggleDataVisible(false)
  hookEventListeners()

  // start with express if nothing valid is present
  if (!/.*\/component\/(.*)\/(.*)/.exec(window.location.hash)) {
    history.pushState({}, null, '#!/component/npm/express')
  }
  queryData()
}

function queryData() {

  document.getElementById('header').innerHTML = '... loading ...'
  document.getElementById('output').innerHTML = ''
  toggleDataVisible(false)


  var ecosystem = ""
  var name = ""
  var componentRequest = /.*\/component\/(.*)\/(.*)/.exec(window.location.hash)
  if (componentRequest) {
    ecosystem = componentRequest[1]
    name = componentRequest[2]
  } else {
    var stackRequestRegEx = /.*\/stack\/(.*)\/(.*)\/(.*)/
    var stackRequest = stackRequestRegEx.exec(window.location.hash)
    if (stackRequest) {
      provider = componentRequest[1]
      repo = componentRequest[2]
      project = componentRequest[2]
      console.log('Not supported')
      console.log('Would look at https://raw.githubusercontent.com/' + repo + '/' + project + '/master/package.json')
    }

    window.alert("Sorry I don't know what to get.\nLets start with something I know. ;-)");
    history.pushState({}, null, '#!/component/npm/express')
    queryData()
    return
  }
  const variables = { 'name': name, 'ecosystem': ecosystem }

  console.log('query for: ', variables)

  gqlQuery(query, variables, true).then(respObject => {
    toggleDataVisible(true)

    // header
    document.getElementById('header').innerHTML = 'npm/' + respObject.npms.collected.metadata.name

    // overview
    document.getElementById('overview-content-name').innerHTML = respObject.npms.collected.metadata.name
    document.getElementById('overview-content-description').innerHTML = respObject.npms.collected.metadata.description
    document.getElementById('overview-content-version').innerHTML = respObject.npms.collected.metadata.version
    var keywords = respObject.npms.collected.metadata.keywords
    var keywords_html = ""
    for (var i in keywords) {
      keywords_html += '<span class="label label-default">' + keywords[i] + '</span> '
    }
    document.getElementById('overview-content-keywords').innerHTML = keywords_html
    document.getElementById('overview-content-homepage').innerHTML = '<a href="' + respObject.npms.collected.metadata.links.homepage + '">' + respObject.npms.collected.metadata.links.homepage + ' </>'
    document.getElementById('overview-content-repository').innerHTML = '<a href="' + respObject.npms.collected.metadata.links.repository + '">' + respObject.npms.collected.metadata.links.repository + ' </>'
    document.getElementById('overview-content-license').innerHTML = respObject.npms.collected.metadata.license

    // dependencies
    var dependencies = respObject.npms.collected.metadata.dependencies
    var dependencies_html = ''
    if (dependencies.length > 0) {
      dependencies_html = '<dl class="dl-horizontal">'
      for (var i in dependencies) {
        dependencies_html += '<dt> <a href="http://i.stpl.io/#!/component/npm/' + dependencies[i].name + '">' + dependencies[i].name + ' </a> </dt> '
        dependencies_html += '<dd>' + dependencies[i].version + '</dd> '
      }
      dependencies_html += '</dl>'
    } else {
      dependencies_html = 'No dependencies'
    }

    document.getElementById('overview-content-dependencies').innerHTML = dependencies_html

    // security
    if (respObject.snyk) {
      var converter = new showdown.Converter()
      converter.setOption('headerLevelStart', '3');
      readmeHtml = converter.makeHtml(respObject.snyk.readme)
      document.getElementById('security-content').innerHTML = readmeHtml
    } else {
      document.getElementById('security-content').innerHTML = "No security information found for " + respObject.npms.collected.metadata.name
    }

    // quality
    document.getElementById('quality-content-carefulness').innerHTML = respObject.npms.evaluation.quality.carefulness
    document.getElementById('quality-content-tests').innerHTML = respObject.npms.evaluation.quality.tests
    document.getElementById('quality-content-health').innerHTML = respObject.npms.evaluation.quality.health
    document.getElementById('quality-content-branding').innerHTML = respObject.npms.evaluation.quality.branding

    var ctx = document.getElementById("myChart");
    var myChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Carefulness'],
        datasets: [{
          label: 'Carefulness',
          data: [respObject.npms.evaluation.quality.carefulness, 1 - respObject.npms.evaluation.quality.carefulness],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(0, 0, 0, 0.0)'
          ],
          borderColor: [
            'rgba(255, 159, 64, 1)',
            'rgba(0, 0, 0, 0.0)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: false
      }
    });

    // debug
    document.getElementById('output').innerHTML = JSON.stringify(respObject, null, 2)
  }).catch(err => {
    toggleDataVisible(false)

    document.getElementById('output').innerHTML = 'Component not cached. Looking for it right now. Please give me a sec.'
    console.log('Sad days: ' + err)
    setTimeout(function () { queryData() }, 2000)
  })
}

function hookEventListeners() {

  window.onhashchange = function () {
    queryData()
  }

  document.getElementById('buttonTestEndpoint').addEventListener('click', () => {
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

}


function toggleDataVisible(visible) {
  if (visible) {
    $(".data-available").css({
      display: "block",
    })
    $(".no-data").css({
      display: "none",
    })
  } else {
    $(".data-available").css({
      display: "none",
    })
    $(".no-data").css({
      display: "block",
    })
  }
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
}`

