module.exports = function(app) {
	var Schema = require('mongoose');
	var contato = Schema.Schema({
		nome: String
		, email: String
	});
	
	var usuario = Schema.Schema({
		nome: {type: String, required: true}
		, email: {type: String, required: true
				 , index: {unique: true}}
		, contatos: [contato]
	});
	
	return Schema.model('usuarios', usuario);
};