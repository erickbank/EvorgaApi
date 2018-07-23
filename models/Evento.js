var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var EventoSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    index: true,
    required: true,
    auto: true,
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  category: {
    type: String,
    required: false
  },
  startDate: {
    required: true,
	type: Date
  },
  endDate: {
	required: true,
	type: Date
  },
  placement:{
	type: String,
    required: false
  },
  logoUpload: {
    type: String,
    required: false
  },
   planUpload: {
    type: String,
    required: false
  },
   id_Usuario:{
	type: mongoose.Schema.Types.ObjectId, ref: 'Usuario',
    required: false	
  }
});

module.exports = mongoose.model('Evento', EventoSchema);