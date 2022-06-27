const path = require('path')
const os = require('os')
const fs = require('fs')
const fse = require('fs-extra')
const semver = require('semver')
const loading = require('./loading')
const log = require('./log')
const git = require('./git')
const cache = require('./cache')

const templateConfigPath = path.resolve(
  os.homedir(),
  'web-cli',
  'template_config.json'
)

/**
 * 安装模板
 * @param {string} projectType 模板类型
 * @param {string} templateName 模板名称
 */
const install = async (projectType, templateName) => {
  if (!templateName) {
    log.error('模板名称为空，请重新选择')
    process.exit(1)
  }

  // 是否需要从远程下载模板
  let needDownloadTemplate = true

  // 读本地模板缓存数据
  const typeNameTemplate = `${projectType}-${templateName}-template`
  let allTemplateConfigCache = {}
  let templateConfigCache = {}
  if (fse.existsSync(templateConfigPath)) {
    allTemplateConfigCache = require(templateConfigPath)
    templateConfigCache =
      allTemplateConfigCache[`${projectType}-${templateName}`]

    if (templateConfigCache) {
      const cacheVersion = templateConfigCache.version

      // 获取远程版本号
      loading.show('检查模板是否更新...')
      const latestVersion = (await git.getRepoPackageJson(typeNameTemplate))
        .version
      loading.hidden()

      if (latestVersion && cacheVersion) {
        // 本地版本号低于 Git 上的版本号,更新模板
        if (semver.gt(latestVersion, cacheVersion)) {
          needDownloadTemplate = true
        } else {
          needDownloadTemplate = false
          log.info('模板不用更新，准备开始创建项目...')
        }
      } else {
        needDownloadTemplate = false
        log.info('请设置模板项目版本号（version）')
      }
    }
  }
  const templatePath = path.resolve(os.homedir(), 'web-cli', typeNameTemplate)

  if (needDownloadTemplate || !fse.existsSync(templatePath)) {
    loading.show(`开始${templateConfigCache ? '更新' : '下载'}模板...`)

    // 删除本地模板
    await fse.removeSync(templatePath)

    // 下载远程模板
    await git
      .downloadRepo(typeNameTemplate, templatePath)
      .then(() => {
        loading.hidden()
        log.success(
          `${
            templateConfigCache ? '更新' : '下载'
          }模板成功，准备开始创建项目...`
        )
      })
      .catch((err) => {
        loading.hidden()
        if (/404/.test(err)) {
          log.error('模板不存在，请重试')
        } else {
          log.error('下载模板失败，请重试')
        }
        process.exit(1)
      })

    // 判断模板文件夹是否存在
    if (fse.existsSync(templatePath)) {
      const templatePkgPath = `${templatePath}/package.json`

      // 读取 package.json 文件
      fs.readFile(templatePkgPath, 'utf8', (err, data) => {
        if (err) {
          log.error(`：${err}`)
          process.exit(1)
        }
        const package = JSON.parse(data)
        const version = package.version
        const templateConfig = {
          version,
          createdTime: templateConfigCache
            ? templateConfigCache.createdTime
            : new Date().getTime(),
          updatedTime: new Date().getTime(),
        }
        allTemplateConfigCache[`${projectType}-${templateName}`] =
          templateConfig

        // 更新配置缓存
        cache.setTemplateConfigCach(allTemplateConfigCache)
      })
    }
  }
  return
}

module.exports = install
