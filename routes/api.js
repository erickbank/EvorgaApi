var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var Usuario = require("../models/Usuario");
var Evento = require("../models/Evento");

router.post('/cadastrarUsuario', function(req, res) {
	
  if (!req.body.username || !req.body.password || !req.body.email || !req.body.phone || !req.body.cellPhone) {
    res.json({success: false, msg: 'Erro... Campos Obrigatórios não preenchidos'});
  } else {
	  
 Usuario.findOne({
    username: req.body.username
  }, function(err, usuario) {
    if (err) throw err;
    if (!usuario) {
  var novoUsuario = new Usuario({
      username: req.body.username,
      password: req.body.password,
	  email:req.body.email,
	  photoUpload: req.body.photoUpload,
	  exhibitor: req.body.exhibitor,
	  organizer: req.body.organizer,
	  planType: req.body.planType,
	  subscriptionDate: req.body.subscriptionDate,
	  ramoExpositor: req.body.ramoExpositor,
	  name: req.body.name,
	  gender: req.body.gender,
	  birthDate: req.body.birthDate,
	  cpf: req.body.cpf,
	  phone: req.body.phone,
	  cellPhone: req.body.cellPhone
	  
    });
    novoUsuario.save(function(err) {
      if (err) {
        return res.json({success: false, msg: err });
      }
      res.json({success: true, msg: 'Usuario inserido com sucesso.'});
    });
    }else{
		res.json({success: false, msg: 'Usuario já existe'});
	} 
  });  
  }
});

router.put('/editarUsuario', passport.authenticate('jwt', { session: false}), function(req, res){
  var token = getToken(req.headers);
  if (token) {
    Usuario.findById(req.body.id, function (err, usuario) {
      if (err) return next(err);
	  if (req.body.username) usuario.username = req.body.username
	  if (req.body.password) usuario.password = req.body.password
	  if (req.body.email) usuario.email = req.body.email
	  if (req.body.photoUpload) usuario.photoUpload = req.body.photoUpload
	  if (req.body.exhibitor) usuario.exhibitor = req.body.exhibitor
	  if (req.body.organizer) usuario.organizer = req.body.organizer
	  if (req.body.planType) usuario.planType = req.body.planType
	  if (req.body.subscriptionDate) usuario.subscriptionDate = req.body.subscriptionDate
	  if (req.body.ramoExpositor) usuario.ramoExpositor = req.body.ramoExpositor
	  if (req.body.name) usuario.name = req.body.name
	  if (req.body.gender) usuario.gender = req.body.gender
	  if (req.body.birthDate) usuario.birthDate = req.body.birthDate
	  if (req.body.cpf) usuario.cpf = req.body.cpf
	  if (req.body.phone) usuario.phone = req.body.phone
	  if (req.body.cellPhone) usuario.cellPhone = req.body.cellPhone
	  if (req.body.convites) usuario.convites = req.body.convites
	  
      usuario.save(function(err) {
        if (err) {
          return res.json({success: false, msg: err });
        }
        res.json({success: true, msg: 'Usuario alterado com sucesso.'});
      });
    });  
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.post('/deletarUsuario', passport.authenticate('jwt', { session: false}), function(req, res){
  var token = getToken(req.headers);
  if (token) {
    Usuario.findOneAndRemove({ _id: req.body.id}, function (err) {
      if (err) return next(err);
	  res.json({success: true, msg: 'Usuario removido com sucesso.'});
    });  
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.get('/getAllUsuarios', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    Usuario.find(function (err, usuarios) {
      if (err) return next(err);
      res.json(usuarios);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.post('/getUsuario', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
	Usuario.findById(req.body.id, function (err, usuario) {
     if (err) return next(err);
      res.json(usuario);
	} );
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.put('/participarEvento', passport.authenticate('jwt', { session: false}), function(req, res){
  var token = getToken(req.headers);
  if (token) {
   Usuario.findByIdAndUpdate(
   { _id: req.body.id }, 
   { $push: { events: req.body.eventId  } },
  function (error) {
        if (error) {
         	res.json({success: false, msg: error});
        } else {
           	res.json({success: true, msg: 'Usuário inserido no evento'});
        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.put('/removerParticipacaoEvento', passport.authenticate('jwt', { session: false}), function(req, res){
  var token = getToken(req.headers);
  if (token) {
   Usuario.findByIdAndUpdate(
   { _id: req.body.id }, 
   { $pull: { events: req.body.eventId  } },
  function (error) {
        if (error) {
         	res.json({success: false, msg: error});
        } else {
           	res.json({success: true, msg: 'Usuário removido do evento'});
        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.post('/logar', function(req, res) {
  Usuario.findOne({
    username: req.body.username
  }, function(err, usuario) {
    if (err) throw err;

    if (!usuario) {
      res.status(401).send({success: false, msg: 'Autenticação falhou. Usuário nao encontrado.'});
    } else {
      usuario.comparePassword(req.body.password, function (err, isMatch) {
        if (isMatch && !err) {
		  var user = new Usuario();
		  user._id = usuario._id;
          var token = jwt.sign( user.toJSON(), config.secret);
          res.json({success: true, token: 'JWT ' + token, user: usuario});
        } else {
          res.status(401).send({success: false, msg: 'Autenticação falhou. Senha Errada.'});
        }
      });
    }
  });
});

router.put('/criarPlanta', passport.authenticate('jwt', { session: false}), function(req, res){
  var token = getToken(req.headers);
  if (token) {
   Evento.findByIdAndUpdate(
   { _id: req.body.id }, 
   { $push: { spaces: req.body.spaces } },
  function (error) {
        if (error) {
         	res.json({success: false, msg: error});
        } else {
           	res.json({success: true, msg: 'Planta inserida com sucesso'});
        }
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});


router.post('/cadastrarEvento', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
	if (!req.body.name || !req.body.startDate || !req.body.endDate) {
    res.json({success: false, msg: 'Erro... Campos Obrigatórios não preenchidos'});
  } else {
    var novoEvento = new Evento({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      startDate: req.body.startDate,
	  endDate: req.body.endDate,
      address: req.body.address,
	  neighborhood: req.body.neighborhood,
	  number: req.body.number,
	  addressDetail: req.body.addressDetail,
	  city: req.body.city,
	  logoUpload: req.body.logoUpload,
      planUpload: req.body.planUpload,
	  state: req.body.state,
	  country: req.body.country,
	  zipCode: req.body.zipCode,
	  planSize: req.body.planSize,
	  spaces: req.body.spaces,
	  organizerCellPhone: req.body.organizerCellPhone,
	  organizerEmail: req.body.organizerEmail
    });

    novoEvento.save(function(err) {
      if (err) {
        return res.json({success: false, msg: err + 'Erro ao Inserir Evento'});
      }
      res.json({success: true, msg: 'Evento inserido com Sucesso', eventId: novoEvento._id });
    });
  }
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.put('/editarEvento', passport.authenticate('jwt', { session: false}), function(req, res){
  var token = getToken(req.headers);
  if (token) {
    Evento.findById(req.body.id, function (err, evento) {
      if (err) return next(err);
	  if (req.body.name) evento.name = req.body.name
	  if (req.body.description) evento.description = req.body.description
	  if (req.body.category) evento.category = req.body.category
	  if (req.body.startDate) evento.startDate = req.body.startDate
	  if (req.body.endDate) evento.endDate = req.body.endDate
	  if (req.body.address) evento.address = req.body.adress
	  if (req.body.neighborhood) evento.neighborhood = req.body.neighborhood
	  if (req.body.number) evento.number = req.body.number
	  if (req.body.addressDetail) evento.addressDetail = req.body.addressDetail
	  if (req.body.city) evento.city = req.body.city
	  if (req.body.state) evento.state = req.body.state
	  if (req.body.country) evento.country = req.body.country
	  if (req.body.zipCode) evento.zipCode = req.body.zipCode
	  if (req.body.logoUpload) evento.logoUpload = req.body.logoUpload
	  if (req.body.planUpload) evento.planUpload = req.body.planUpload
	  if (req.body.planSize) evento.planSize = req.body.planSize
	  if (req.body.spaces) evento.spaces = req.body.spaces
	  if (req.body.toDoList) evento.toDoList = req.body.toDoList
	  if (req.body.feedBacks) evento.feedBacks = req.body.feedBacks
	  if (req.body.objList) evento.objList = req.body.objList
	  if (req.body.organizerCellPhone) evento.organizerCellPhone = req.body.organizerCellPhone
	  if (req.body.organizerEmail) evento.organizerEmail = req.body.organizerEmail
	  
	  
      evento.save(function(err) {
        if (err) {
          return res.json({success: false, msg: err });
        }
        res.json({success: true, msg: 'Evento alterado com sucesso.'});
      });
    });  
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.post('/deletarEvento', passport.authenticate('jwt', { session: false}), function(req, res){
  var token = getToken(req.headers);
  if (token) {
    Evento.findOneAndRemove({ _id: req.body.id}, function (err) {
      if (err) return next(err);
	  res.json({success: true, msg: 'Evento removido com sucesso.'});
    });  
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.get('/getAllEventos', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    Evento.find(function (err, evento) {
      if (err) return next(err);
	  evento.map((objeto,i) => {
		 if (objeto.feedBacks && objeto.feedBacks.length > 0 ) {
		 var total = 0;
		 var qtd = 0;
		 objeto.feedBacks.map((obj,i) => {
			 if(obj != null) {
			 total += Number(obj.rating)
			 qtd++
			 }
		 });
		 var media = total/qtd
		 objeto.rating = parseInt(media);
	 }
	  })
      res.json(evento);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.post('/getEvento', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
	Evento.findById(req.body.id, function (err, evento) {
     if (err) return next(err);
	 	 if (evento.feedBacks && evento.feedBacks.length > 0 ) {
		 var total = 0;
		 var qtd = 0;
		 evento.feedBacks.map((objeto,i) => {
			 if(objeto.rating) {
			 total += Number(objeto.rating)
			 qtd++
			 }
		 });
		 var media = total/qtd
		 evento.rating = parseInt(media);
		  res.json(evento)
	 }else{
		 res.json(evento)
	 }
;
	} );
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};


module.exports = router;