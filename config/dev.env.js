'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  OPEN_PROXY:false,
  API_URL:'"https://www.easy-mock.com/mock/5c6a25ab218aad2259a06bc7/example"'
})
