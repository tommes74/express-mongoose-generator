var mongoose 			= require('mongoose');
var mongoosePaginate 	= require('mongoose-paginate');
var mongoosastic		= require("mongoosastic");
var Schema   = mongoose.Schema;

var {schemaName} = new Schema({fields}, { timestamps: true });

{schemaName}.plugin(mongoosePaginate);

{schemaName}.post('save', function(doc) {
	console.log('%s has been saved', doc);
});

{schemaName}.plugin(mongoosastic,{  
	host:"elasticsearch",
	port: 9200,
	protocol: "http",
	curlDebug: false
}); 

module.exports = mongoose.model('{modelName}', {schemaName});
