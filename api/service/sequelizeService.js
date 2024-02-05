// sequelizeService.js

class SequelizeService {
  constructor (Collection) {
    this.Collection = Collection
  }

  async new () {
    return this.Collection.build({})
  }

  async create (data) {
    return await data.save()
  }

  async findByPk (key) {
    return this.Collection.findByPk(key)
  }

  async findOrCreate (keyValuePair, defaults) {
    return this.Collection.findOrCreate({ where: keyValuePair, defaults })
  }

  async findOne (keyValuePair) {
    const result = await this.Collection.findOne({ where: keyValuePair })
    if (result) {
      return result.dataValues
    }
    return null
  }

  async findOneEager (keyValuePair) {
    const result = await this.Collection.findOne({ where: keyValuePair, include: [{ all: true }] })
    if (result) {
      return result.dataValues
    }
    return null
  }

  async findAll (keyValuePair) {
    return await this.Collection.findAll({ where: keyValuePair })
  }

  async findAllEager (keyValuePair) {
    return await this.Collection.findAll({ where: keyValuePair, include: [{ all: true }] })
  }

  async projectAll (attributes) {
    return await this.Collection.findAll({ attributes })
  }

  async findAndProject (keyValuePair, attributes) {
    return await this.Collection.findAll({ where: keyValuePair, attributes })
  }

  async findAndSort (keyValuePair, sortValues, startIndex, count) {
    return await this.Collection.findAll({ where: keyValuePair, order: sortValues, offset: startIndex, limit: count })
  }

  async distinctAll (attribute) {
    return await this.Collection.aggregate(attribute, 'DISTINCT', { plain: false })
  }
}

module.exports = SequelizeService
