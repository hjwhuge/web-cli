const axios = require('axios')
const download = require('download-git-repo')

const BASE_PACKAGE_JSON = {
  name: '',
  version: '0.0.0',
}

/**
 * 获取远端仓库版本号
 * @param {string} repo 仓库名
 */
const getRepoPackageJson = (repo) => {
  const url = `https://api.github.com/repos/hjwhuge/${repo}/contents/package.json`
  return axios(url)
    .then((response) => {
      const { status, data } = response
      if (status == 200) {
        const package = JSON.parse(
          Buffer.from(data.content, data.encoding).toString()
        )
        return package
      } else {
        return BASE_PACKAGE_JSON
      }
    })
    .catch(() => {
      return BASE_PACKAGE_JSON
    })
}

/**
 * 下载远程仓库
 * @param {string} repo 项目名
 * @param {string} target 存储路径
 */
const downloadRepo = (repo = '', target) => {
  const url = `direct:https://github.com/hjwhuge/${repo}/archive/master.zip`
  return new Promise(function (resolve, reject) {
    download(url, target, (err) => {
      if (err) {
        reject(err)
      } else {
        resolve(target)
      }
    })
  })
}

module.exports = {
  getRepoPackageJson,
  downloadRepo,
}
