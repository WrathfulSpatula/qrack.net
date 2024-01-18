// outputModel.js

'use strict'

module.exports = function (sequelize, DataTypes) {
  const Model = sequelize.define('outputeType', {
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {})
  Model.associate = function (db) {
    db.outputType.hasMany(db.output)
    db.output.belongsTo(db.outputType)
  }
  return Model
}
