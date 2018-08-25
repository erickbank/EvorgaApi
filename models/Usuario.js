var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

var UsuarioSchema = new Schema({
  _id:{  
    type: mongoose.Schema.Types.ObjectId,
    index: true,
    required: true,
    auto: true,
    },
  username: {
        type: String,
        unique: true,
        required: true
    },
  password: {
        type: String,
        required: true
    },
	name:{
	  type: String,
	  required: false
	},
	gender:{
		type: String,
		required: false
	},
	birthDate:{
		type: Date,
		required: false
	},
	cpf:{
		type: String,
		required: false
	},
    email: {
	   type: String,
	   required:true,
	   unique:true
   },
    photoUpload: {
    type: String,
    required: false
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
  },
  ramoExpositor: {
    type: String,
    required: false
  },
  phone:{
	  type: String,
	  required: false
  },
  cellPhone: {
	  type: String,
	  required: false
  },
 events: {
	 type: Array,
	 default: []
 }
  
})

UsuarioSchema.pre('save', function (next) {
    var usuario = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(usuario.password, salt, null, function (err, hash) {
                if (err) {
                    return next(err);
                }
                usuario.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

UsuarioSchema.methods.comparePassword = function (passw, cb) {
    bcrypt.compare(passw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('Usuario', UsuarioSchema);