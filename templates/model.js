var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var {schemaName} = new Schema({fields}, { timestamps: true });

module.exports = mongoose.model('{modelName}', {schemaName});
