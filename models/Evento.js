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
  address:{
	type: String,
    required: true
  },
  neighborhood:{
	type: String,
    required: true
  },
  number:{
	type: Number,
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
    planSize:{
	type: String,
    required: false	
   },
   spaces:[
    {
 	 idExpositor: mongoose.Schema.Types.ObjectId ,
     ocuppied: Boolean,
     price: Number,
     description: String	 
    }
   ]
});

module.exports = mongoose.model('Evento', EventoSchema);