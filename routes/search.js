var express         = require('express');
var router          = express.Router();
var request         = require('request');
var searchHandler   = require('./handler/searchHandler.js');
var ObjectId        = require('mongoskin').ObjectID;
var elasticSearchHandler = require('./handler/elasticSearchHandler.js');
const config        = require('./conf/conf.json');
const collectionArtist  = config.database.collection_artist;
const collectionAlbum   = config.database.collection_album;
const collectionSong    = config.database.collection_song;
//==========================================================================================================================\\
//===========================WEBSERVICE REST POUR L'AFFICHAGE DU LISTING DES ARTISTES/ALBUMS/SONGS==========================\\
//==========================================================================================================================\\
//GET LISTING DES ARTISTES ALBUMS ET MUSIQUES EN FONCTION DE OU DES LETTRES 
router.get('/categorie/:nomCategorie/lettre/:lettre/page/:numPage', function (req, res, next) {
    var tObjectRequest,limit,skip,tParamToFind;
    var nomCategorie =  req.params.nomCategorie.toLowerCase(),lettre = req.params.lettre, numPage = req.params.numPage, db = req.db, numPageTest = parseInt(numPage);
    //Si le numéro de page est un entier supérieur a 0 et qu'il y a moins de 3 lettres dans :lettre
    if(Number.isInteger(numPageTest) && numPageTest>=0 && lettre.length<=2 ){
        limit = config.request.limit;
        skip = numPage*limit;
        tParamToFind = searchHandler.optimizeFind(lettre);
    }
    else{
        nomCategorie = "default";
    }
    switch(nomCategorie) {
        case "artists":
            tObjectRequest = searchHandler.constructData("name", tParamToFind);
            var start = Date.now();
            //Nombre de requete necessaire a faire avant d'envoyer la réponse
            var nbRequestDatabase = 2, nbRequestDone=0;
            var objArtist = {};
            db.collection(collectionArtist).find({$or:tObjectRequest},{"name":1}).skip(skip).limit(limit).toArray(function(err,artists){
                if (err) throw err;
                objArtist.artists = artists;
                objArtist.limit = limit;
                nbRequestDone+=1;
                console.log("artist_data= "+nbRequestDone);
                console.log("Benchmark count artist : "+ (Date.now()-start));
                if(nbRequestDone == nbRequestDatabase) {
                    res.send(JSON.stringify(objArtist));
                }
            });
            db.collection('artist').find({$or:tObjectRequest}).count(function(err, count) {
                if (err) throw err;
                nbRequestDone+=1;
                console.log("artist_count = "+nbRequestDone);
                objArtist.nbcount = count;
                if(nbRequestDone == nbRequestDatabase){
                    res.send(JSON.stringify(objArtist));
                }
            });
            break;
        case "albums":
            tObjectRequest = searchHandler.constructData("titre",tParamToFind);
            var start = Date.now();
            db.collection(collectionAlbum).aggregate([{"$match": { $or: tObjectRequest }}, {"$skip" :  skip},{"$limit" : limit},{$project : { "titleAlbum" : "$titre" ,"name":1}}
            ],function(err, albums) {
                if (err) throw err;
//                db.collection('album').find({ $or: tObjectRequest }).count(function(err, count) {
                    if (err) throw err;
                    var objAlbum = {};
                    objAlbum.albums = albums;
                    objAlbum.nbcount = "count";
                    objAlbum.limit = limit;
                    console.log("Benchmark count albums : "+(Date.now()-start));
                    res.send(JSON.stringify(objAlbum));
//                });
            });
            break;
        case "songs":
            tObjectRequest = searchHandler.constructData("titre",tParamToFind);
            var start = Date.now();
            db.collection(collectionSong).aggregate([{"$match": { $or: tObjectRequest }},{"$skip" :  skip}, {"$limit" : limit}, {$project : { "albumTitre" : 1 ,"name":1,"titleSong":"$titre"}}
            ],function(err, songs) {
                if (err) throw err;
                //Le count sur des millions de data est long ~250ms
                var objSongs = {};
                objSongs.songs = songs;
                objSongs.limit = limit;
                objSongs.nbcount = "count";
                console.log("Benchmark count songs : "+(Date.now()-start));
                res.send(JSON.stringify(objSongs));
            });
            // db.collection('song').find({ $or: tObjectRequest }).count(function(err, count) {
            //     if (err) throw err;
            //     nbRequestDone+=1;
            //     console.log("song_COUNT= "+nbRequestDone);
            //     objSongs.nbcount = count;
            //     if(nbRequestDone == nbRequestDatabase){
            //         console.log("Benchmark count songs : "+(Date.now()-start));
            //         res.send(JSON.stringify(objSongs));
            //     }
            // });
            break;
        default:
                res.status(404).send([{error:config.http.error.global_404}]);
            break;
    }
});

//==========================================================================================================================\\
//==============================WEBSERVICE REST POUR LA NAVIGATION ENTRE CATEGORIES (SUBJCET)===============================\\
//==========================================================================================================================\\
//GET CATEGORY PAR NOM DE CATEGORY ET PAR COLLECTION
router.get('/category/:collection/:categoryName',function(req,res){
    var db = req.db;
    var collection= req.params.collection;
    if(collection !== collectionArtist && collection !==collectionAlbum && collection !==collectionSong){
        return res.status(404).send([{error:config.http.error.global_404}]);
    }
    var limit = config.request.limit;
    var categoryName= req.params.categoryName;
    db.collection(collection).find({subject:categoryName},{name:1,titre:1,albumTitre:1}).sort({titre:1}).limit(limit).toArray(function(err,objs){
        res.send(JSON.stringify(objs));
    })
});

//==========================================================================================================================\\
//====================================WEBSERVICE REST POUR LA NAVIGATION ENTRE PRODUCER=====================================\\
//==========================================================================================================================\\
//GET PRODUCER PAR NOM DE PRODUCER
//Peut évoluer en /producer/:collection/:producerName avec :collection = artist/album/song si un artist ou un album a des producer
router.get('/producer/:producerName',function(req,res){
    var db = req.db;
    // var collection= req.params.collection;
    // if(collection !== collectionArtist && collection !==collectionAlbum && collection !==collectionSong){
    //     return res.status(404).send([{error:config.http.error.global_404}]);
    // }
    var limit = config.request.limit, producerName= req.params.producerName;
    db.collection(collectionSong).find({producer:producerName},{name:1,titre:1,albumTitre:1}).sort({titre:1}).limit(limit).toArray(function(err,objs){
        res.send(JSON.stringify(objs));
    })
});

//==========================================================================================================================\\
//===================================WEBSERVICE REST POUR LA NAVIGATION ENTRE RECORDLABEL===================================\\
//==========================================================================================================================\\
//GET RECORDLABEL PAR NOM DE RECORDLABEL
//Peut évoluer en /recordlabel/:collection/:recordLabelName avec :collection = artist/album/song si un artiste ou un album a des recordLabel
router.get('/recordlabel/:recordLabelName',function(req,res){
    var db = req.db;
    // var collection= req.params.collection;
    // if(collection !== collectionArtist && collection !==collectionAlbum && collection !==collectionSong){
    //     return res.status(404).send([{error:config.http.error.global_404}]);
    // }
    var limit = config.request.limit, recordLabelName= req.params.recordLabelName;
    db.collection(collectionSong).find({recordLabel:recordLabelName},{name:1,titre:1,albumTitre:1}).sort({titre:1}).limit(limit).toArray(function(err,objs){
        res.send(JSON.stringify(objs));
    })
});
//==========================================================================================================================\\
//=====================================WEBSERVICE REST POUR LA NAVIGATION ENTRE GENRE=======================================\\
//==========================================================================================================================\\
//GET RECORDLABEL PAR NOM DE RECORDLABEL
//Peut évoluer en /recordlabel/:collection/:genreName avec :collection = album/song si un album a des Genre
router.get('/genre/:genreName',function(req,res){
    var db = req.db;
    // var collection= req.params.collection;
    // if(collection !== collectionArtist && collection !==collectionAlbum && collection !==collectionSong){
    //     return res.status(404).send([{error:config.http.error.global_404}]);
    // }
    var limit = config.request.limit, genreName= req.params.genreName;
    db.collection(collectionSong).find({genre:genreName},{name:1,titre:1,albumTitre:1}).sort({titre:1}).limit(limit).toArray(function(err,objs){
        res.send(JSON.stringify(objs));
    })
});
//==========================================================================================================================\\
//====================================WEBSERVICE REST POUR LA NAVIGATION ENTRE RECORDED=====================================\\
//==========================================================================================================================\\
//GET RECORDED PAR NOM DE RECORDED
router.get('/recorded/:recordedName',function(req,res){
    var db = req.db, limit = config.request.limit, recordedName= req.params.recordedName;
    db.collection(collectionSong).find({recorded:recordedName},{name:1,titre:1,albumTitre:1}).sort({titre:1}).limit(limit).toArray(function(err,objs){
        res.send(JSON.stringify(objs));
    })
});
//==========================================================================================================================\\
//=====================================WEBSERVICE REST POUR LA NAVIGATION ENTRE AWARD=======================================\\
//==========================================================================================================================\\
//GET AWARD PAR NOM DE AWARD
router.get('/award/:awardName',function(req,res){
    var db = req.db, limit = config.request.limit, awardName= req.params.awardName;
    db.collection(collectionSong).find({award:awardName},{name:1,titre:1,albumTitre:1}).sort({titre:1}).limit(limit).toArray(function(err,objs){
        res.send(JSON.stringify(objs));
    })
});
//==========================================================================================================================\\
//=====================================WEBSERVICE REST POUR LA NAVIGATION ENTRE WRITER======================================\\
//==========================================================================================================================\\
//GET WRITER PAR NOM DE WRITER
router.get('/writer/:writerName',function(req,res){
    var db = req.db, limit = config.request.limit, writerName= req.params.writerName;
    db.collection(collectionSong).find({writer:writerName},{name:1,titre:1,albumTitre:1}).sort({titre:1}).limit(limit).toArray(function(err,objs){
        res.send(JSON.stringify(objs));
    })
});
//==========================================================================================================================\\
//=====================================WEBSERVICE REST POUR LA NAVIGATION ENTRE FORMAT======================================\\
//==========================================================================================================================\\
//GET FORMAT PAR NOM DE FORMAT
router.get('/format/:formatName',function(req,res){
    var db = req.db, limit = config.request.limit, formatName= req.params.formatName;
    db.collection(collectionSong).find({format:formatName},{name:1,titre:1,albumTitre:1}).sort({titre:1}).limit(limit).toArray(function(err,objs){
        res.send(JSON.stringify(objs));
    })
});
//==========================================================================================================================\\
//====================WEBSERVICE REST POUR COMPTER LE NOMBRE D'OCCURENCE DE DOCUMENT DANS UNE COLLECTION ===================\\
//==========================================================================================================================\\
router.get('/count/:collection/:lettre', function (req, res) {
    var db = req.db, collection= req.params.collection,lettre= req.params.lettre, tParamToFind, fieldCollection, tObjectRequest;
    if(collection == "Artists"){
        collection = collectionArtist;
        fieldCollection = "name";
    }else if(collection == "Albums"){
        collection = collectionAlbum;
        fieldCollection = "titre";
    }else if(collection == "Songs"){
        collection = collectionSong;
        fieldCollection = "titre";
    }
    if(collection !== collectionArtist && collection !==collectionAlbum && collection !==collectionSong || lettre.length>2){
        return res.status(404).send([{error:config.http.error.global_404}]);
    }
    tParamToFind = searchHandler.optimizeFind(lettre);
    tObjectRequest = searchHandler.constructData(fieldCollection, tParamToFind);
    db.collection(collection).count({$or:tObjectRequest},function(err, countfield) {
        if(err){
            console.log(err);
            return res.status(404).send([{error:config.http.error.global_404}]);
        }
        var dbcount = {count:countfield};
        res.send(JSON.stringify(dbcount));
    });
});
//==========================================================================================================================\\
//================WEBSERVICE REST POUR COMPTER LE NOMBRE D'OCCURENCE D'UN ATTRIBUT DANS UNE COLLECTION DONNEE===============\\
//==========================================================================================================================\\
router.get('/count/:collection/:fieldName/:fieldValue', function (req, res) {
    var db = req.db, collection= req.params.collection, fieldName= req.params.fieldName, fieldValue= req.params.fieldValue;
    if(collection !== collectionArtist && collection !==collectionAlbum && collection !==collectionSong){
        return res.status(404).send([{error:config.http.error.global_404}]);
    }
    var query = {};
    query[fieldName] = fieldValue;
    db.collection(collection).count(query,function(err, countfield) {
        if(err){
            console.log(err);
            return res.status(404).send([{error:config.http.error.global_404}]);
        }
        var dbcount = {count:countfield};
        res.send(JSON.stringify(dbcount));
    });
});
//==========================================================================================================================\\
//============================WEBSERVICE REST POUR L'AFFICHAGE DU NOMBRE D'ARTISTES/ALBUMS/SONGS============================\\
//==========================================================================================================================\\
//GET PERMET D'OBTENIR LE NOMBRE D'ARTISTES/ALBUMS/SONGS
router.get('/dbinfo', function (req, res) {
    var db = req.db;
    db.collection(collectionArtist).count(function(err, count) {
        var dbinfo = {};
        dbinfo.nbArtist = count;
        db.collection(collectionAlbum).count(function(err, count) {
            dbinfo.nbAlbum = count;
            db.collection(collectionSong).count(function(err, count) {
                dbinfo.nbSong = count;
                res.send(JSON.stringify(dbinfo));
            });
        });
    });
});
//==========================================================================================================================\\
//=======================================WEBSERVICE REST POUR LA GESTION DES ARTISTES=======================================\\
//==========================================================================================================================\\
//GET ARTIST PAR NOM D'ARTISTE (UN NOM D'ARTISTE EST UNIQUE -> REGLE DE LYRICS WIKIA LORS DE L'EXTRACTION DES DONNEES)
router.get('/artist/:artistName', function (req, res) {
    var db = req.db;
    var artistName= req.params.artistName;
    var start = Date.now();
    db.collection(collectionArtist).findOne({name:artistName},{"urlWikia":0,wordCount:0}, function(err, artist) {
        if (artist===null) { return res.status(404).send([{error:config.http.error.artist_404}]);}
        db.collection(collectionAlbum).find({id_artist:artist._id},{"urlWikipedia":0,"genres":0,"urlAlbum":0,"wordCount":0,"rdf":0}).sort( { "dateSortie": -1} ).toArray(function(err,albums){
            var nbAlbum = albums.length;
            var cnt = 0;
            //On construit le tableau albums afin d'y ajouter les infos des albums
            artist.albums = albums;
            for(var i = 0;i<albums.length;i++){
                (function(album){
                    db.collection(collectionSong).find({"id_album":album._id},{"position":1,"titre":1}).sort( { "position": 1} ).toArray(function(err,songs){
                        if (err) throw err;
                        //On construit le tableau songs afin d'y ajouter les infos des musiques
                        album.songs = songs;
                        cnt++;
                        if(nbAlbum == cnt) {
                            // console.log(Date.now() - start);
                            res.send(JSON.stringify(artist)); }
                    });
                })(artist.albums[i]);
            }
        })
    });
});
//==========================================================================================================================\\
//========================================WEBSERVICE REST POUR LA GESTION DES ALBUMS========================================\\
//==========================================================================================================================\\
//GET ALBUM PAR NOM D'ARTISTE ET TITRE D'ALBUM
//FIXME /!\ UN ARTIST PEUT AVOIR PLUSIEURS FOIS UN MEME TITRE D'ALBUM /!\ ERREUR A CORRIGER
router.get('/artist/:artistName/album/:albumName', function (req, res) {
    var db = req.db;
    var albumName= req.params.albumName;
    var artistName = req.params.artistName;
    var start = Date.now();
    db.collection(collectionArtist).findOne({name:artistName},{"urlAlbum":0,"wordCount":0}, function(err, artist) {
        if (artist==null) { return res.status(404).send([{error:config.http.error.artist_404}]);}
        //!\ UN ARTIST PEUT AVOIR PLUSIEURS FOIS UN MEME TITRE D'ALBUM /!\ ERREUR A CORRIGER
        db.collection(collectionAlbum).findOne({$and:[{"titre":albumName},{"id_artist":artist._id}]},{"urlAlbum":0,"wordCount":0}, function(err, album) {
            if (album==null) {   return res.status(404).send([{error:config.http.error.album_404}]); } 
            db.collection(collectionSong).find({"id_album":album._id},{"position":1,"titre":1}).toArray(function(err,song){
                album.songs = song;
                artist.albums = album;
                console.log(Date.now() - start);
                res.send(JSON.stringify(artist));

            });
        });
        
    });
});

//PUT ALBUM PAR ID D'ABUM ET DE MUSIQUE
router.put('/artist/:artistName/album/:albumName', function (req, res) {
    var db = req.db;
    var albumBody = req.body;
    var albumTitre = albumBody.titre.trim();
    //FUTURE Si un album n'a pas encore d'attribut songs. Peut se produire lors de l'ajout d'un album
    for(var j=0;j<albumBody.songs.length;j++){
        //On change le titre de l'album contenu dans les documents musiques
        albumBody.songs[j].albumTitre = albumTitre;
        albumBody.songs[j].titre = albumBody.songs[j].titre.trim();
        var idSong = albumBody.songs[j]._id;
        // On supprime l'id car mongodb lance un avertissement si ce champ n'est pas supprimé (_id est immutable pas d'update possible)
        delete albumBody.songs[j]._id;
        delete albumBody.songs[j].id_album;
        db.collection(collectionSong).update( { _id: new ObjectId(idSong) },{ $set: albumBody.songs[j] } );
    }
    console.log(albumBody.songs);
    //On supprime le champ songs car il n'éxiste pas dans la collection album
    delete albumBody.songs;     //FUTURE Si un album n'a pas encore d'attribut songs. Peut se produire lors de l'ajout d'un album
    var idAlbum = albumBody._id;
    // On supprime l'id car mongodb lance un avertissement si ce champ n'est pas supprimé (_id est immutable pas d'update possible)
    delete albumBody._id;
    delete albumBody.id_artist;
    db.collection(collectionAlbum).update( { _id: new ObjectId(idAlbum) },{ $set: albumBody } );
    res.send("OK");
});

//==========================================================================================================================\\
//=======================================WEBSERVICE REST POUR LA GESTION DES MUSIQUES=======================================\\
//==========================================================================================================================\\
//GET SONG PAR NOM D'ARTISTE TITRE D'ALBUM ET TITRE DE MUSIQUE
router.get('/artist/:artistName/album/:albumName/song/:songName', function (req, res) {
    var db = req.db;
    var artistName = req.params.artistName;
    var albumName = req.params.albumName;
    var songName = req.params.songName;
    var start = Date.now();
    db.collection(collectionArtist).findOne({name:artistName},{"_id":1,"name":1}, function(err, artist) {
        if (artist == null) { return res.status(404).sendFile([{error:config.http.error.artist_404}]);}
        db.collection(collectionAlbum).findOne({$and:[{"id_artist":artist._id},{"titre":albumName}]},{"_id":1,"titre":1}, function(err, album) {
            if (album == null) {  return res.status(404).sendFile([{error:config.http.error.album_404}]); }
            db.collection(collectionSong).findOne({$and:[{"id_album":album._id},{"titre":songName}]},{"urlSong":0,"wordCount":0},function(err, song) {
                if (song == null) { return res.status(404).send([{error:config.http.error.song_404}]);}
                album.songs = song;
                artist.albums = album;
                console.log(Date.now() - start);
                res.send(JSON.stringify(artist));
            });
        });
        
    });
});
//GET SONG PAR ID D'ARTISTE,ALBUM,MUSIQUE
router.get('/artist_id/:artistId/album_id/:albumId/song_id/:songId', function (req, res) {
    var db = req.db;
    var artistId = req.params.artistId;
    var albumId = req.params.albumId;
    var songId = req.params.songId;
    var start = Date.now();
    db.collection(collectionArtist).findOne({_id:ObjectId(artistId)},{"_id":1,"name":1}, function(err, artist) {
        if (artist == null) { return res.status(404).sendFile([{error:config.http.error.artist_404}]);}
        db.collection(collectionAlbum).findOne({"_id":ObjectId(albumId)},{"_id":1,"titre":1}, function(err, album) {
            if (album == null) {  return res.status(404).sendFile([{error:config.http.error.album_404}]); }
            db.collection(collectionSong).findOne({"_id":ObjectId(songId)},{"urlSong":0,"wordCount":0},function(err, song) {
                if (song == null) { return res.status(404).send([{error:config.http.error.song_404}]);}
                album.songs = song;
                artist.albums = album;
                console.log(Date.now() - start);
                res.send(JSON.stringify(artist));
            });
        });
    });
});
//PUT SONG OBJECT
router.put('/artist/:artistName/album/:albumName/song/:songName',function(req,res){
    var db = req.db;
    var songBody = req.body;
    console.log(songBody);
    // req.params.artistName.replace(/\\n|\\r|\\r\\n|(<((?!br)[^>]+)>)/ig,"").trim();

    //On récupére l'id de la musique afin de modifier l'objet en base de données
    var idSong = songBody._id;
    //!\ Il faut supprimer les attributs qui sont de type objectId dans notre base car songBody les récupéres en string
    delete songBody.id_album;
    delete songBody._id;
    db.collection(collectionSong).update( { _id: ObjectId(idSong) },{ $set: songBody } );
    res.send("OK");
});

//==========================================================================================================================\\
//=============================================WEBSERVICE REST POUR LA RECHERCHE============================================\\
//==========================================================================================================================\\
//permet de chercher des artistes via la barre de recherche
//FUTURE voir la configuration
router.get('/fulltext/:searchText', function (req, res) {
    var searchText = elasticSearchHandler.escapeElasticSearch(req.params.searchText);
    var maxinfo = config.request.limit_search_bar;
    var start = Date.now();
    var maxinfoselected = maxinfo/2; // nombre d'élements devant apparaitre dans l'autocomplétion de recherche
    var queryArtist =   { "query": { "query_string" : {"default_field": "name","query": searchText}},"size": maxinfo};
    var querySong =     { "query": { "query_string" : {"query": searchText,"fields":["titre^4","name^2","albumTitre"]}},"size": maxinfo};
    searchHandler.fullTextQuery(req,maxinfo,queryArtist,querySong,maxinfoselected).then(function(resp) {
        console.log("                       fulltext fullTextQuery time ="+ (Date.now() - start));
        res.send(resp);
    }).catch(function(err) {
        res.send(err);
    });
});
router.get('/more/:searchText', function (req, res) {
    var searchText = elasticSearchHandler.escapeElasticSearch(req.params.searchText);
    var maxinfo = config.request.limit; //200 élements doivent apparaitre dans l'autocomplétion de recherche
    var maxinfoselected = maxinfo/2;
    var queryArtist =   { "query": { "query_string" : {"default_field": "name","query": searchText}},"size": maxinfo};
    var querySong =     { "query": { "query_string" : {"query": searchText,"fields":["titre^4","name^2","albumTitre"]}},"size": maxinfo};
    var start = Date.now();
    searchHandler.fullTextQuery(req,maxinfo,queryArtist,querySong,maxinfoselected).then(function(resp) {
        console.log("                       fulltext fullTextQuery time ="+ (Date.now() - start));
        res.send(resp);
    }).catch(function(err) {
        res.send(err);
    });
});


module.exports = router;
