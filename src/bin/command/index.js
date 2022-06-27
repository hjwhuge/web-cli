const { Command } = require('commander')
const program = new Command()
const log = require('../../lib/log')
const init = require('./init')
const package = require('../../../package.json')

// 设置版本
program.version(package.version)
// usage,修改帮助信息的首行提示
program.name('ysl').usage('init [projectName]')

program
  // 配置命令
  .command('init [projectName]')
  .alias('create')
  .description('create a project')
  .action((projectName) => {
    init(projectName)
  })

// 具体实现待补充
// 列出支持的项目模板
program
  .command('list')
  .description('list all available project template')
  .action(() => {
    log.info('get project list')
  })
// 添加一个项目模板
program
  .command('add <templateName>')
  .description('add a project template')
  .action((templateName) => {
    log.info(templateName)
  })
// 删除一个项目模板
program
  .command('remove <templateName>')
  .description('remove a project template')
  .action((templateName) => {
    log.info(templateName)
  })
// 重写commander某些事件
// 待补充

// 把命令行参数传给commander解析
program.parse(process.argv)
