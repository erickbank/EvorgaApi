var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PaticipacaoSchema = new Schema({
   _id: {
    type: mongoose.Schema.Types.ObjectId,
    index: true,
    required: true,
    auto: true,
  },
   id_Usuario:{
	type: mongoose.Schema.Types.ObjectId, ref: 'Usuario',
    required: true	
  },
   id_Evento:{
	type: mongoose.Schema.Types.ObjectId, ref: 'Evento',
    required: true	
  }
});

module.exports = mongoose.model('Participacao', PaticipacaoSchema);