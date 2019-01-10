const articleModel = require ('./models/article.model');
const userModel = require ('./models/user.model');

var express = require('express');
var app = express();
var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/cms2mundos', function(err,db){
    if(err){
        console.log("erro de conexão");
    }else{
        app.listen(3000, function () {
            console.log('Example app listening on port 3000!');
          });
    }
});

app.get('/', function (req, res, next) {
    articleModel.find({}, function(err, data){
        if(err){
            console.log("erro ao consultar o banco");
        }else{
            res.render('index.ejs', {array: data});
        }
    });
});

app.get('/publication', function (req, res, next) {
    res.render('publication.ejs', {error: null});
});

app.get('/signin', function (req, res, next) {
    res.render('signin.ejs');
});

app.get('/signup', function (req, res, next) {
    res.render('signup.ejs', {error: null});
});

app.get('/view/:id', function (req, res, next) {
    articleModel.findOne({
        _id: req.params.id
    }, function(err,data){
        if(err){
            console.log("erro ao mostrar artigo");
            res.render('/', {error: err});
        }else{
            res.render('article.ejs', {article: data});
        }
    })
    
});

app.get('/edit/:id', function (req, res, next) {
    articleModel.findOne({
        _id: req.params.id
    }, function(err,data){
        if(err){
            console.log("erro ao mostrar artigo");
            res.render('/', {error: err});
        }else{
            res.render('edit.ejs', {article: data});
        }
    })
    
});

app.post('/signup', function (req,res,next){
    let name = req.body.nameUser;
    let email = req.body.emailUser;
    let password = req.body.passwordUser;
    let confirmPassword = req.body.passwordConfirmUser;
    let error = {
        name: '',
        email: '',
        password: ''
    };

    if(name == null || name.length > 40){
        error.name = "Nome precisa ser preenchido";
    }
    if(email == null){
        error.email = "O e-mail precisa ser preenchido";
    }
    if(password == null){
        error.password = "A senha precisa ser preenchida";
    }
    if(password != confirmPassword){
        error.password = "As senhas precisam ser iguais";
    }if(error.name || error.password || error.email){
        res.render('signup.ejs', {error: error});
    }else{
        userModel.create({
            name: name,
            email: email,
            password: password
        }, function(err,data){
            console.log("err", err);
            console.log("data", data);
            if(err){
                console.log("erro ao inserir usuário no banco", err);
                res.render('signup.ejs',{error: err});
            }else{
                res.redirect('/signin');
            }
        });
    }

});

app.post('/publication', function (req, res, next) {
    let title = req.body.txttitle;
    let articleText = req.body.txttextarea;
    let error = {
        title: '',
        article: ''
    }
   
    if(title.length < 3 || title.length > 50){
        error.title = "Títutlo incorreto";
    }
    if(articleText == "" || articleText.length == "0"){
        error.article = "O artigo não pode estar vazio";
    }
    if(error.title || error.article){
        res.render('publication.ejs', {error: error});
    }else{
        articleModel.create({
            title: title,
            article: articleText
        }, function(err,data){
            console.log("err", err);
            console.log("data", data);
            if(err){
                console.log("erro ao inserir no banco");
                res.render('publication.ejs',{error: err});
            }else{
                res.redirect('/');
            }
        });        
    }
   
});

app.post('/edit/:id', function (req, res, next) {
    let id = req.params.id;
    let title = req.body.txttitle;
    let articleText = req.body.txttextarea;
    let error = {
        title: '',
        article: ''
    }
   
    if(title.length < 3 || title.length > 50){
        error.title = "Títutlo incorreto";
    }
    if(articleText == "" || articleText.length == "0"){
        error.article = "O artigo não pode estar vazio";
    }
    if(error.title || error.article){
        res.render('edit.ejs', {error: error});
    }else{
        articleModel.update({_id:id},{
            title: title,
            article: articleText
        }, function(err,data){
            console.log("err", err);
            console.log("data", data);
            if(err){
                console.log("erro ao inserir no banco");
                res.render('edit.ejs',{error: err});
            }else{
                res.redirect('/view/'+id);
            }
        });        
    }
   
});

app.post('/delete/:id', function (req, res, next) {
    let id = req.params.id;
    console.log(id);
    articleModel.deleteOne({_id:id}, function(err){
        console.log(id);
        if(err){
            console.log("Não foi possível deletar o artigo");
        }
        res.send(200);
    });
    
});