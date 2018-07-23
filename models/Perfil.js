var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PerfilSchema = new Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    index: true,
    required: true,
    auto: true,
  },
  exhibitor: {
    type: Boolean,
    required: true
  },
  organizer: {
    required: true,
	type: Boolean,
  },  
  planType: {
    type: String,
    required: true
  },
  subscriptionDate: {
    required: false,
	type: Date,
	default: Date.now
  }
});

module.exports = mongoose.model('Perfil', PerfilSchema);