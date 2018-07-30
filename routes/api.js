var mongoose = require('mongoose');
var passport = require('passport');
var config = require('../config/database');
require('../config/passport')(passport);
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();
var Usuario = require("../models/Usuario");
var Perfil = require("../models/Perfil");
var Evento = require("../models/Evento");
var Participacao = require("../models/Participacao");

router.post('/cadastrarUsuario', function(req, res) {
	
  if (!req.body.username || !req.body.password || !req.body.email || !req.body.photoUpload) {
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
	  id_Perfil: req.body.id_Perfil  
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
          var token = jwt.sign(usuario.toJSON(), config.secret);
          res.json({success: true, token: 'JWT ' + token});
        } else {
          res.status(401).send({success: false, msg: 'Autenticação falhou. Senha Errada.'});
        }
      });
    }
  });
});


router.post('/cadastrarPerfil', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
	if (!req.body.exhibitor || !req.body.organizer || !req.body.planType) {
    res.json({success: false, msg: 'Erro... Campos Obrigatórios não preenchidos'});
  } else {
    var novoPerfil = new Perfil({
      exhibitor: req.body.exhibitor,
      organizer: req.body.organizer,
      planType: req.body.planType,
      subscriptionDate: req.body.subscriptionDate
    });

    novoPerfil.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Erro ao Inserir Perfil'});
      }
      res.json({success: true, msg: 'Perfil inserido com Sucesso'});
    });
  }
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});


router.get('/getAllPerfis', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    Perfil.find(function (err, perfil) {
      if (err) return next(err);
      res.json(perfil);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.post('/getPerfil', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
	Perfil.findById(req.body.id, function (err, perfil) {
     if (err) return next(err);
      res.json(perfil);
	} );
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
      placement: req.body.placement,
      logoUpload: req.body.logoUpload,
      planUpload: req.body.planUpload,
	  id_Usuario: req.body.id_Usuario
    });

    novoEvento.save(function(err) {
      if (err) {
        return res.json({success: false, msg: err + 'Erro ao Inserir Evento'});
      }
      res.json({success: true, msg: 'Evento inserido com Sucesso'});
    });
  }
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});



router.get('/getAllEventos', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    Evento.find(function (err, evento) {
      if (err) return next(err);
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
      res.json(evento);
	} );
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.post('/cadastrarParticipacao', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
	if (!req.body.id_Usuario || !req.body.id_Evento) {
    res.json({success: false, msg: 'Erro... Campos Obrigatórios não preenchidos'});
  } else {
    var novoParticipacao = new Participacao({
      id_Usuario: req.body.id_Usuario,
      id_Evento: req.body.id_Evento,

    });

    novoParticipacao.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Erro ao Inserir Participacao'});
      }
      res.json({success: true, msg: 'Participacao inserido com Sucesso'});
    });
  }
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});


router.get('/getAllParticipacoes', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
    Participacao.find(function (err, participacao) {
      if (err) return next(err);
      res.json(participacao);
    });
  } else {
    return res.status(403).send({success: false, msg: 'Unauthorized.'});
  }
});

router.post('/getParticipacao', passport.authenticate('jwt', { session: false}), function(req, res) {
  var token = getToken(req.headers);
  if (token) {
	Participacao.findById(req.body.id, function (err, participacao) {
     if (err) return next(err);
      res.json(participacao);
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