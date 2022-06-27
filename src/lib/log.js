const chalk = require('chalk')

const log = console.log

log.info = (content) => {
  log(chalk.cyan(content))
}

log.success = (content) => {
  log(chalk.green(content))
}

log.error = (content) => {
  log(chalk.red(content))
}

log.warn = (content) => {
  log(chalk.yellow(content))
}

log.test = (content) => {
  log(chalk.blue(content))
}

module.exports = log
