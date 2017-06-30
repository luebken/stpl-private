module.exports.resolveComponent = (context, args) => {
  console.log('In resolver for compenent type ', context)
  console.log(args)
  var testArticle = {
    name: 'lodash',
    ecosystem: 'npm',
    latest_release: '1.0.0',
    link: 'http://spiegel.de'
  }
  return testArticle
}
