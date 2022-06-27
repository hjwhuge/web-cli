const semver = require('semver')
const chalk = require('chalk')
const log = require('./log')
const git = require('./git')
const loading = require('./loading')

const package = require('../../package.json')
const { version, name } = package

/**
 * 检测脚手架版本
 */
const update = async () => {
  let latestVersion = '0.0.0'
  try {
    loading.show('正在检测最新版本...')
    latestVersion = (await git.getRepoPackageJson('web-cli')).version
  } catch (e) {
    log.error('请检查网络状态')
    return
  } finally {
    loading.hidden()
  }
  //  判断是否有新版本
  if (semver.gt(latestVersion, version)) {
    let title = chalk.bold.blue(`ysl v${version}`)
    let upgradeMessage = `New version available ${chalk.magenta(
      version
    )} → ${chalk.green(latestVersion)}`

    upgradeMessage += `\nRun ${chalk.yellow(`npm i -g ${name}`)} to update!`

    const upgradeBox = require('boxen')(upgradeMessage, {
      align: 'center',
      borderColor: 'green',
      dimBorder: true,
      padding: 1,
    })

    title += `\n${upgradeBox}\n`
    log(title)
  }
}

module.exports = update
