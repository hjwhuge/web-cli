const inquirer = require('inquirer')
const projectTemplateConfig = require('./configs/project_template_config')
const validUtil = require('./valid')

const { validName } = validUtil

module.exports = async function answer(projectName) {
  const promptConfig = [
    {
      type: 'list',
      name: 'project_type',
      message: '请选择项目类型: ',
      choices: projectTemplateConfig.projectTypes,
    },
    {
      type: 'list',
      name: 'template_name',
      message: '请选择项目的模板: ',
      choices: function (val) {
        const project_type = val.project_type
        return projectTemplateConfig[`${project_type}Templates`]
      },
    },
  ]
  // 如果没传 projectName，则让用户输入
  if (!projectName) {
    const projectName = {
      type: 'input',
      name: 'project_name',
      message: '请输入项目名',
      validate: (val) => {
        if (!val) {
          return '项目名不能为空'
        } else if (!validName(val)) {
          return '项目名必须是由小写字母、数字或-_组成，且必须以字母开头'
        }
        return true
      },
    }
    promptConfig.unshift(projectName)
  }
  return await inquirer.prompt(promptConfig)
}
