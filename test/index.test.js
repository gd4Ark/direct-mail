require('dotenv').config()
const directMail = require('../src/index')

describe('SingleSendMail', () => {
  let singleConfig = {}

  beforeEach(() => {
    singleConfig = {
      AccountName: 'test@mail.4ark.me',
      FromAlias: '邮件昵称',
      ToAddress: 'gd4ark@gmail.com',
      Subject: '邮件标题',
      HtmlBody: '<html>HtmlBody from SingleSendMail</html>'
    }
  })

  test('send success', done => {
    directMail.single(singleConfig).then(resp => {
      let { status } = resp
      expect(status).toBe(200)
      done()
    })
  })

  test('params required', done => {
    directMail.single().catch(err => {
      // console.log('params required:', err)
      expect(err instanceof Error).toBe(true)
      done()
    })
  })

  test('send fail', done => {
    delete singleConfig.HtmlBody
    directMail.single(singleConfig).catch(err => {
      // console.log(err)
      expect(err.response.status).toBe(400)
      done()
    })
  })
})

describe('BatchSendMail', () => {
  let batchConfig = {
    AccountName: 'test@mail.4ark.me',
    ReceiversName: 'defaultReceivers',
    TemplateName: 'test-tpl'
  }

  test('send success', done => {
    directMail.batch(batchConfig).then(resp => {
      let { status } = resp
      expect(status).toBe(200)
      done()
    })
  })

  test('params required', done => {
    directMail.batch().catch(err => {
      // console.log('params required:', err)
      expect(err instanceof Error).toBe(true)
      done()
    })
  })
})

describe('SendMail', () => {
  let singleConfig = {
    AccountName: 'test@mail.4ark.me',
    FromAlias: '邮件昵称',
    ToAddress: 'gd4ark@gmail.com',
    Subject: '邮件标题',
    HtmlBody: '<html>HtmlBody from SingleSendMail</html>'
  }
  let batchConfig = {
    AccountName: 'test@mail.4ark.me',
    ReceiversName: 'defaultReceivers',
    TemplateName: 'test-tpl'
  }

  test('single send success', done => {
    directMail({
      action: 'single',
      config: singleConfig
    }).then(resp => {
      let { status } = resp
      expect(status).toBe(200)
      done()
    })
  })

  test('batch send success', done => {
    directMail({
      action: 'batch',
      config: batchConfig
    }).then(resp => {
      let { status } = resp
      expect(status).toBe(200)
      done()
    })
  })

  test('not matching action', done => {
    directMail({
      action: 'bar',
      config: batchConfig
    }).catch(err => {
      // console.log(err)
      expect(err.toString()).toBe('Error: No matching action')
      done()
    })
  })
})
