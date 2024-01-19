// jobService.js

// Data Access Layer
const ModelService = require('./modelService')

// Services
const OutputService = require('./outputService.js')
const outputService = OutputService()

// Database Model
const db = require('../model/index')
const Job = db.job

const Qrack = require('./Qrack.js')
const QrackWASM = require('./Qrack.wasm')

const qrack = Qrack({
  locateFile: () => {
    return QrackWASM
  }
})

class JobService extends ModelService {
  constructor () {
    super(Job)
  }

  async sanitize (job) {
    return {
      id: job.id,
      userId: job.userId,
      status: job.status
    }
  }

  async get (jobId) {
    const job = await this.getByPk(jobId)
    if (!job) {
      return { success: false, error: 'Job ID not found.' }
    }

    return { success: true, body: user }
  }

  async getSanitized (userId) {
    const job = await this.getByPk(jobId)
    if (!job) {
      return { success: false, error: 'Job ID not found.' }
    }
    return { success: true, body: await this.sanitize(job) }
  }

  async validateCreatRequest (reqBody) {
    if (!reqBody.program) {
      return { success: false, message: 'Job creation request must contain the "program" parameter.' }
    }
    if (!Array.isArray(reqBody.program)) {
      return { success: false, message: 'Job creation request "program" parameter must be an array.' }
    }
    return { success: true }
  }

  async invalid_argument_error(job) {
    job.jobStatusTypeId = 2
    job.statusMessage = 'All simulator IDs and quantum neuron IDs should be specified as names in output space of job.'
    await job.save()
  }

  async create (reqBody, userId) {
    const validationResult = await this.validateCreateRequest(reqBody)
    if (!validationResult.success) {
      return validationResult
    }

    let job = await this.SequelizeServiceInstance.new()
    job.userId = userId
    // Job status 3: RUNNING
    job.jobStatusTypeId = 3

    const result = await this.create(job)
    if (!result.success) {
      return result
    }

    job = result.body
    await job.save()

    const p = reqBody.program
    let tmp = null
    qrack.then(async (core) => {
      for (i in p) {
        switch (i.name) {
          case 'init_general':
            tmp = core.init_general(...i.parameters)
            await outputService.createOrUpdate(job.id, i.output, tmp, 1)
            break;
          case 'init_stabilizer':
            tmp = core.init_stabilizer(...i.parameters)
            await outputService.createOrUpdate(job.id, i.output, tmp, 1)
            break;
          case 'init_qbdd':
            tmp = core.init_qbdd(...i.parameters)
            await outputService.createOrUpdate(job.id, i.output, tmp, 1)
            break;
          case 'init_clone':
            tmp = await outputService.getByJobIdAndName(job.id, i.parameters[0])
            if (!tmp) {
              await this.invalid_argument_error(job)
              return;
            }
            await outputService.createOrUpdate(job.id, i.output, core.init_clone(tmp), 1)
            break;
          default:
            break;
        }
      }

      // Job status 1: SUCCESS
      job.jobStatusTypeId = 1
      job.statusMessage = 'Job completed fully and normally.'
      await job.save()
    }).error(async (e) => {
      // Job status 2: FAILURE
      job.jobStatusTypeId = 2
      job.statusMessage = e.toString()
      await job.save()
    })

    return { success: true, body: await this.sanitize(job) }
  }

  async delete (jobId) {
    const job = await this.getByPk(jobId)
    if (!job) {
      return { success: false, error: 'Job ID not found.' }
    }

    await job.destroy()

    return { success: true, body: this.sanitize(job) }
  }
}

module.exports = JobService
