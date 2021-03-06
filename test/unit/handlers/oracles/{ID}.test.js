'use strict'

const Test = require('ava')
const Hapi = require('@hapi/hapi')
const HapiOpenAPI = require('hapi-openapi')
const Path = require('path')
const Mockgen = require('../../../util/mockgen.js')
const helper = require('../../../util/helper')
const Sinon = require('sinon')
const oracle = require('../../../../src/domain/oracle')
const Logger = require('@mojaloop/central-services-shared').Logger
const initServer = require('../../../../src/server').initialize
const getPort = require('get-port')
const Db = require('../../../../src/lib/db')
const Migrator = require('../../../../src/lib/migrator')

let sandbox
let server

Test.before(async () => {
  sandbox = Sinon.createSandbox()
  sandbox.stub(Db, 'connect').returns(Promise.resolve({}))
  sandbox.stub(Migrator, 'migrate').returns(Promise.resolve({}))
  server = await initServer(await getPort(), false)
})

Test.after(async () => {
  await server.stop()
  sandbox.restore()
})

/**
 * summary: Update Oracle
 * description: The HTTP request PUT /oracles/{ID} is used to update information in the server regarding the provided oracle. This request should be used for individual update of Oracle information.
 * parameters: body, ID, content-length, content-type, date
 * produces: application/json
 * responses: 204, 400, 401, 403, 404, 405, 406, 501, 503
 */
Test.serial('test OraclePut put operation', async function (t) {
  try {
    const requests = new Promise((resolve, reject) => {
      Mockgen(false).requests({
        path: '/oracles/{ID}',
        operation: 'put'
      }, function (error, mock) {
        return error ? reject(error) : resolve(mock)
      })
    })

    const mock = await requests

    t.pass(mock)
    t.pass(mock.request)
    // Get the resolved path from mock request
    // Mock request Path templates({}) are resolved using path parameters
    const options = {
      method: 'put',
      url: mock.request.path,
      headers: helper.defaultAdminHeaders()
    }
    if (mock.request.body) {
      // Send the request body
      options.payload = mock.request.body
    } else if (mock.request.formData) {
      // Send the request form data
      options.payload = mock.request.formData
      // Set the Content-Type as application/x-www-form-urlencoded
      options.headers = options.headers || {}
      options.headers = helper.defaultAdminHeaders()
    }
    // If headers are present, set the headers.
    if (mock.request.headers && mock.request.headers.length > 0) {
      options.headers = mock.request.headers
    }
    sandbox.stub(oracle, 'updateOracle').returns(Promise.resolve({}))
    const response = await server.inject(options)
    t.is(response.statusCode, 204, 'Ok response status')
    oracle.updateOracle.restore()
  } catch (e) {
    Logger.error(`testing error ${e}`)
    t.fail()
  }
})

/**
 * summary: Delete Oracle
 * description: The HTTP request DELETE /oracles/{ID} is used to delete information in the server regarding the provided oracle.
 * parameters: accept, ID, content-type, date
 * produces: application/json
 * responses: 204, 400, 401, 403, 404, 405, 406, 501, 503
 */
Test.serial('test OracleDelete delete operation', async function (t) {
  try {
    const requests = new Promise((resolve, reject) => {
      Mockgen(false).requests({
        path: '/oracles/{ID}',
        operation: 'delete'
      }, function (error, mock) {
        return error ? reject(error) : resolve(mock)
      })
    })

    const mock = await requests

    t.pass(mock)
    t.pass(mock.request)
    // Get the resolved path from mock request
    // Mock request Path templates({}) are resolved using path parameters
    const options = {
      method: 'delete',
      url: '' + mock.request.path,
      headers: helper.defaultAdminHeaders()
    }
    if (mock.request.body) {
      // Send the request body
      options.payload = mock.request.body
    } else if (mock.request.formData) {
      // Send the request form data
      options.payload = mock.request.formData
      // Set the Content-Type as application/x-www-form-urlencoded
      options.headers = options.headers || {}
      options.headers = helper.defaultAdminHeaders()
    }
    // If headers are present, set the headers.
    if (mock.request.headers && mock.request.headers.length > 0) {
      options.headers = mock.request.headers
    }
    sandbox.stub(oracle, 'deleteOracle').returns(Promise.resolve({}))
    const response = await server.inject(options)
    t.is(response.statusCode, 204, 'Ok response status')
    oracle.deleteOracle.restore()
  } catch (e) {
    Logger.error(`testing error ${e}`)
    t.fail()
  }
})
