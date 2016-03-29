require('babel-register')

const config = require('../../config')
const debug = require('debug')('aisai:bin:watch')

debug('Create webpack compiler.')
const compiler = require('webpack')(require('../../webpack.config'))

compiler.watch({}, function (err, stats) {
  const jsonStats = stats.toJson()

  console.log(stats.toString(config.compiler_stats))

  if (err) {
    debug('Webpack compiler encountered a fatal error.', err)
  } else if (jsonStats.errors.length > 0) {
    debug('Webpack compiler encountered errors.')
    console.log(jsonStats.errors)
  } else if (jsonStats.warnings.length > 0) {
    debug('Webpack compiler encountered warnings.')
  } else {
    debug('No errors or warnings encountered.')
    debug(`Webpack watch completed at ${new Date()}.`)
  }
})
