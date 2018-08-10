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
  adress:{
	type: String,
    required: true
  },
  neighborhood:{
	type: String,
    required: true
  },
  number:{
	type: int,
    required: true
  },
  addressDetail:{
	type: String,
    required: false
  },
  city:{
	type: String,
    required: true
  },
  state:{
	type: String,
    required: true
  },
  country:{
	type: String,
    required: true
  },
  zipCode:{
	type: String,
    required: true
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