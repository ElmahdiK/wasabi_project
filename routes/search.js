var express         = require('express');
var router          = express.Router();
var db              = require('mongoskin').db('mongodb://localhost:27017/wasabi');
var ObjectId        = require('mongoskin').ObjectID;

/* GET search pages. */
router.get('/categorie/:nomCategorie/lettre/:lettre', function (req, res,next) {
    var nomCategorie= req.params.nomCategorie.toLowerCase();
    var lettre = req.params.lettre;
    console.log("Dedans search");
    console.log("lettre = "+lettre+" nomCategorie = "+nomCategorie);
    var regLetter = new RegExp('^'+lettre,'i');
    switch(nomCategorie) {
        case "artist":
            var debut = Date.now();
            db.collection('artist').find({"name": regLetter},{"name":1,"_id":1}).limit(200).toArray(function(err,result){
                var fin = Date.now();
                console.log(fin-debut);
                if (err) throw err;
                res.send(JSON.stringify(result));
            });
            break;
        case "album":
            db.collection('artist').aggregate([       
                //on recherche les documents ayant des albums avec un titre commençant par regLetter
                {"$match": {"albums.titre": regLetter}},
                // De-normalize le tableau pour sépérarer les documents
                { "$unwind": "$albums"},
                {"$match": {"albums.titre": regLetter}},
//                {"$sort" : {"albums.titre" : 1} },
                {"$limit" : 200},  
                // On affiche seulement le titre contenu dans album
                {$project : { "titleAlbum" : "$albums.titre" ,"name":1}}
            ],function(err, result) {
                res.send(JSON.stringify(result));
            })
            break;
        case "songs":
            db.collection('artist').aggregate([ 
                {"$match": {"albums.songs.titre": regLetter}},
                // De-normalize le tableau pour sépérarer les documents
                {"$unwind": "$albums"},
                {"$unwind": "$albums.songs"},
                {"$match": {"albums.songs.titre": regLetter}},
//                {"$sort" : {'albums.songs.titre' : 1} },
                {"$limit" : 200},
                {"$project" : { "titleSong" : "$albums.songs.titre","name":1}},
            ],function(err, result) {
                res.send(JSON.stringify(result));
            })
            break;
        default:
            break;
    }
});

//Utiliser pour l'affichage d'un artiste
router.get('/artist/:artistName/:_id', function (req, res) {
    var artistName= req.params.artistName;
    var _id = req.params._id;
    console.log("Affichage de la page de l'artiste "+artistName+" _id = "+_id);

    db.collection('artist').find({"_id": ObjectId(_id)}).toArray(function(err,result){
        if (err) throw err;
        console.log(result[0]);
        res.send(JSON.stringify(result[0]));
    });
});
//Utiliser pour l'affichage d'un album
router.get('/artist/:artistName/albums/:albumsName/:_id', function (req, res) {
    var albumsName= req.params.albumsName;
    var artistName = req.params.artistName;
    var _id = req.params._id;
    console.log("Artist : "+artistName+" Affichage de la page de l'album "+albumsName+" _id = "+_id);
    db.collection('artist').find({"_id": ObjectId(_id)}).toArray(function(err,result){
        if (err) throw err;
        console.log(result[0]);
        res.send(JSON.stringify(result[0]));
    });
});

//Utiliser pour l'affichage d'une chanson
router.get('/artist/:artistName/songs/:songsName/:_id', function (req, res) {
    var songsName = req.params.songsName;
    var artistName = req.params.artistName;
    var _id = req.params._id;
    console.log("Affichage de la page de la musique "+songsName +" _id = "+_id);
    db.collection('artist').find({"_id": ObjectId(_id)}).toArray(function(err,result){
        if (err) throw err;
        console.log(result[0]);
        res.send(JSON.stringify(result[0]));
    });
});


//Utiliser pour récupérer les infos d'un album (situé dans la page-artist.html) avant de le modifier
router.get('/artist/:artistName/albums/:albumsName/:_id/modify', function (req, res) {
    var albumsName= req.params.albumsName;
    var artistName = req.params.artistName;
    var _id = req.params._id;
    console.log("L'utilisateur veut modifier l'album "+albumsName+" de l'artiste "+artistName+" _id = "+_id);
    db.collection('artist').aggregate([       
               {"$match": {"_id":ObjectId(_id)}},      
                {"$unwind": "$albums"},
                {"$match": {"albums.titre": albumsName}}
            ],function(err, result) {
                if (err) throw err;
                console.log(result[0]);
                res.send(JSON.stringify(result[0]));
            });
});

//permet de chercher des artistes via la barre de recherche
router.get('/artist/:artistName', function (req, res) {
    var artistName = req.params.artistName;
    var regLetter = new RegExp('^'+artistName,'i');
    console.log("L'utilisateur recherche un artiste commancant par les lettres: "+artistName);
    db.collection('artist').find({"name": regLetter},{"name":1}).limit(10).toArray(function(err,result){
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});


router.put('/artist/:artistName/albums/:albumsName/:_id/update/album/:oldNameAlbum', function (req, res) {
    var album = req.body;
    var _id = req.params._id;
    var oldNameAlbum= req.params.oldNameAlbum;
    console.log(album);
    console.log("Mise à jour de l'album "+ album.titre+" _id = "+_id); 
    db.collection('artist').update(
        {
            _id: ObjectId(_id),
            "albums.titre": oldNameAlbum,
        }, 
        {
            '$set':{
                "albums.$.titre":album.titre,
                "albums.$.dateSortie":album.dateSortie,
                "albums.$.songs":album.songs,
            }
        }, 
        function(err, result) {
            if (err) throw err;
            if (result){
                console.log('Updated!');
            } 
        });
    
});



module.exports = router;