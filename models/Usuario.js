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
   email: {
	   type: String,
	   required:true,
	   unique:true
   },
   photoUpload: {
    type: String,
    required: false
  },  
  id_Perfil:{
	type: mongoose.Schema.Types.ObjectId, ref: 'Perfil',
    required: false	
  }
});

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