#!/usr/bin/env node
const update = require('../lib/update')

;(async function () {
  await update()
  require('./command')
})()
