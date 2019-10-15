const crypto = require('crypto')
const axios = require('axios')

function directMail({ action = 'single', config = {}} = {}) {
  const actions = {
    single: SingleSendMail,
    batch: BatchSendMail
  }
  return new Promise((resolve, reject) => {
    if (actions[action]) {
      const call = actions[action]
      return call(config)
        .then(resolve)
        .catch(reject)
    }
    reject(new Error('No matching action'))
  })
}

function SingleSendMail(config = {}) {
  return handleSendMail({
    config: Object.assign(config, {
      Action: 'SingleSendMail'
    }),
    required: ['AccessKeyId', 'AccessKeySecret', 'AccountName', 'ToAddress']
  })
}

function BatchSendMail(config = {}) {
  return handleSendMail({
    config: Object.assign(config, {
      Action: 'BatchSendMail'
    }),
    required: [
      'AccessKeyId',
      'AccessKeySecret',
      'AccountName',
      'TemplateName',
      'ReceiversName'
    ]
  })
}

function handleSendMail({ config, required = [] }) {
  config = mergeDefaultConfig(config)

  const errorMsg = verifyRequired(config, required)

  return new Promise((resolve, reject) => {
    if (errorMsg.length) {
      return reject(new Error(errorMsg.join(', ')))
    }
    const params = getParams(config)
    const { AccessKeySecret } = config
    const signature = getSignature({
      params,
      AccessKeySecret
    })

    request({ signature, params })
      .then(resolve)
      .catch(reject)
  })
}

function getDefaultConfig() {
  const defaultKeys = {
    AccessKeyId: process.env.ACCESS_KEY_ID,
    AccessKeySecret: process.env.ACCESS_KEY_SECRET
  }
  return defaultKeys
}

function mergeDefaultConfig(config, defaultConfig = null) {
  defaultConfig = defaultConfig || getDefaultConfig()
  Object.keys(defaultConfig).forEach(key => {
    if (!config[key]) {
      config[key] = defaultConfig[key]
    }
  })
  return config
}

function verifyRequired(config = {}, keys = []) {
  return keys
    .filter(key => !config[key])
    .map(key => {
      return `${key} required`
    })
}

function getParams(config) {
  const defaultConfig = {
    Format: 'JSON',
    RegionId: 'cn-hangzhou',
    Version: '2015-11-23',
    SignatureMethod: 'HMAC-SHA1',
    Timestamp: new Date().toISOString(),
    SignatureVersion: '1.0',
    SignatureNonce: Date.now(),
    ReplyToAddress: true,
    AddressType: 1
  }

  const params = {
    ...config,
    ...defaultConfig
  }

  return Object.keys(params)
    .map(param => {
      const value = params[param]
      return `${encodeURIComponent(param)}=${encodeURIComponent(value)}`
    })
    .sort()
}

function getSignature({ params, AccessKeySecret }) {
  const signStr = 'POST&%2F&' + encodeURIComponent(params.join('&'))

  const sign = crypto
    .createHmac('sha1', AccessKeySecret + '&')
    .update(signStr)
    .digest('base64')

  return encodeURIComponent(sign)
}

function request({ signature, params }) {
  const URL = 'https://dm.aliyuncs.com/'
  return axios({
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    url: URL,
    data: ['Signature=' + signature].concat(params).join('&')
  })
}

directMail.single = SingleSendMail
directMail.batch = BatchSendMail

module.exports = directMail
