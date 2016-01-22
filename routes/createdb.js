var express         = require('express');
var router          = express.Router();
var db              = require('mongoskin').db('mongodb://localhost:27017/wasabi');
var lyricsWikia     = require('./handler/lyricsWikia.js');




router.get('/test',function(req, res){
   
    var urlLyrics = 'http://lyrics.wikia.com/api.php?func=getArtist&artist=';
    var selectorLyrics = 'div.lyricbox';
    
    var objArtist ={
    "name" : "A Dead Silence",
    "urlWikia" : "A_Dead_Silence",
    "albums" : [ 
        {
            "titre" : "Other Songs",
            "dateSortie" : "",
            "urlAlbum" : "http://lyrics.wikia.com/A_Dead_Silence:Other_Songs",
            "songs" : [ 
                {
                    "titre" : "Heavy Mind",
                    "urlSong" : "http://lyrics.wikia.com/A_Dead_Silence:Heavy_Mind",
                    "lyrics" : ""
                }
            ]
        }
    ]
};
    var currSong = objArtist.albums[0].songs[0];
    console.log("Dans mon test");
    lyricsWikia.getAllLyricsOfArtists(urlLyrics,selectorLyrics,objArtist,currSong).then(function(objArtist){
        console.log("getAllLyricsOfArtists");
        console.log(objArtist.name);
//        db.collection('artist').insert(objArtist, function(err, result) {
//            if (err) throw err;
//            if (result) console.log('Added =>'+objArtist.name);
//        });  
    });
    
});

           
           
           
           
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! T dans le get A SUPPRIMER !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\\
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! T dans le get A SUPPRIMER !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\\
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! T dans le get A SUPPRIMER !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\\
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! T dans le get A SUPPRIMER !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\\
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! T dans le get A SUPPRIMER !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\\
        //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! T dans le get A SUPPRIMER !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\\
           
           
//Nous permet de créer une première arborescence en récupérerant toutes les lyrics d'un abum et tous les album d'un groupe

router.get('/',function(req, res){
    console.log("dedans /createdb");
    //req doit contenir le confidence,
    //Pour chaque lettre  sur wikia et chaque catégorie on récupére pour commencer les albums de 5 artistes ainsi que tous ses albums et musiques
    var alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    //les lyrics des albums de 10 artistes commencant par la lettre A
    //contient les liens des artistes de tout l'alphabet qui sont aussi les noms des répertoires sur le disque
    var urlArtists = 'http://lyrics.wikia.com/wiki/Category:Artists_';
    var selectorArtists = '#mw-pages>.mw-content-ltr>table a[href]';
    var attrArtists = 'href';//on récupérera dans allLinks les href du selector ci-dessus afin de créer les répertoires
    var removeStrHrefArtists = '/wiki/';
    
    var urlAlbums = 'http://lyrics.wikia.com/api.php?func=getArtist&artist=';
    var selectorAlbums = '.albums>li>a[href]:first-child';
    var attrAlbums = 'href';
    var removeStrHrefAlbums = 'http://lyrics.wikia.com/';
    
    var urlLyrics = 'http://lyrics.wikia.com/api.php?func=getArtist&artist=';
    var selectorLyrics = 'div.lyricbox';
//    var attrLyrics = 'href';
//    var removeStrLyrics= 'http://lyrics.wikia.com/';
    
    //on supprime la collection artist de la base de données pour la recréer
    db.collection('artist').drop();
    console.log("Base de données artist supprimée")
    //pour chaque categorie ex: http://lyrics.wikia.com/wiki/Category:Artists_A on récupére les artistes ici les artistes commencant par la lettre A
//    for(var i = 0, len = alphabet.length;i<len;i++){
        //Quand les artistes commencant par A sont récupérés (la requete ajax terminée) on entre dans le then
        lyricsWikia.getArtistFromCategorie(urlArtists+alphabet[0],selectorArtists,attrArtists,removeStrHrefArtists).then(function(valtLinks) {
            //valtLinks => liste des noms d'artistes commencant par la lettre A
            console.log("Dans promise de GET createdb");
            for(var j = 0;j < valtLinks.length ;j++){
                //On récupére les albums (musiques incluses) des artistes commencant par la lettre A
                lyricsWikia.getAlbumsFromArtists(urlAlbums,selectorAlbums,attrAlbums,removeStrHrefAlbums,valtLinks[j]).then(function(objArtist){
                    //lorsque la requete ajax pour récupérer les artistes est terminé on obtient un objet (voir ci-dessous la structure json)
                    //Nous allons maintenant ajouter dans chaque objet représentant l'artiste, les paroles des musiques

//                    for(var nbAlbums=0;nbAlbums<objArtist.albums.length;nbAlbums++){
//                        for(var nbLyrics=0;nbLyrics<objArtist.albums[nbAlbums].songs.length;nbLyrics++){
//                            //on récupérer l'objet correspondant a la chanson 
//                            //exemple : {"titre" : "Heavy Mind","urlSong" : "http://lyrics.wikia.com/A_Dead_Silence:Heavy_Mind"}   
//                            var currSong = objArtist.albums[nbAlbums].songs[nbLyrics];
                            lyricsWikia.getAllLyricsOfArtists(urlLyrics,selectorLyrics,objArtist).then(function(objArtist){
                                db.collection('artist').insert(objArtist, function(err, result) {
                                    if (err) throw err;
                                    if (result) console.log('Added =>'+objArtist.name);
                                });  
                            });
//                        }
//                    }
                });
            }
            console.log("fin de GET createdb");
            //db.collection('artist').createIndex( { "albums.songs": 1 } );
        }).catch(function() { 
            console.log("error Fin asynchrone");
        });
        
    //}
    
        
        
        
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({ status: "OK" }));
    res.end();
});

module.exports = router;




//{
//    "name" : "A Dead Silence",
//    "urlWikia" : "A_Dead_Silence",
//    "albums" : [ 
//        {
//            "titre" : "Catharsis",
//            "dateSortie" : "2012",
//            "urlAlbum" : "http://lyrics.wikia.com/A_Dead_Silence:Catharsis_%282012%29",
//            "songs" : [ 
//                {
//                    "titre" : "Calling Forth The Waves",
//                    "urlSong" : "http://lyrics.wikia.com/A_Dead_Silence:Calling_Forth_The_Waves",
//                    "lyrics" : "",
//                }, 
//                {
//                    "titre" : "Modern Transfigurement",
//                    "urlSong" : "http://lyrics.wikia.com/A_Dead_Silence:Modern_Transfigurement",
//                    "lyrics" : ""
//                }
//            ]
//        }, 
//        {
//            "titre" : "Other Songs",
//            "dateSortie" : "",
//            "urlAlbum" : "http://lyrics.wikia.com/A_Dead_Silence:Other_Songs",
//            "songs" : [ 
//                {
//                    "titre" : "Heavy Mind",
//                    "urlSong" : "http://lyrics.wikia.com/A_Dead_Silence:Heavy_Mind",
//                    "lyrics" : ""
//                }
//            ]
//        }
//    ]
//}