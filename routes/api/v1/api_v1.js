import express from 'express';
import RateLimit from 'express-rate-limit';
import config from '../../conf/conf';
import apiV1Controller from './api_v1.controller';
import request from 'request';
const router = express.Router();
import {
    ObjectId
} from 'mongoskin';
const COLLECTIONARTIST = config.database.collection_artist;
const COLLECTIONALBUM = config.database.collection_album;
const COLLECTIONSONG = config.database.collection_song;
const LIMIT = config.request.limit;


//==========================================================================================================================\\
//==========================================API REST POUR RECUPERER UN ALBUM PAR ID=========================================\\
//==========================================================================================================================\\
router.get('/album/id/:id', apiV1Controller.get_albumById);
/**
 * @api {get} api/v1/album/id/:id Album - Get an album document by id
 * @apiExample Example usage: 
 *      wasabi.i3s.unice.fr/api/v1/album/id/5714debe25ac0d8aee36b664
 * @apiVersion 1.0.0
 * @apiName GetAlbumById
 * @apiGroup Api/v1
 * 
 * @apiParam {Number} id album's id
 *
 * @apiSuccessExample Success-Response for an artist:
    HTTP/1.1 200 OK
    {
        "_id": "5714debe25ac0d8aee36b664",
        "name": "Metallica",
        "title": "Master Of Puppets",
        "publicationDate": "1986",
        "urlWikipedia": "http://en.wikipedia.org/wiki/Master_of_Puppets",
        "genre": "Thrash Metal",
        "length": "54:46",
        "urlAlbum": "http://lyrics.wikia.com/Metallica:Master_Of_Puppets_%281986%29",
        "urlITunes": "https://itunes.apple.com/us/album/id167353139?i=167353334",
        "urlAmazon": "http://www.amazon.com/exec/obidos/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=http%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB0012235Q6%2Fsr%3D8-1%2Fqid%3D1147400297%2Fref%3Dpd_bbs_1%3F%255Fencoding%3DUTF8",
        "urlGoEar": "http://goear.com/listen.php?v=c6e3d05",
        "urlSpotify": "https://play.spotify.com/track/4hOohf45f0JtxYKNsEAIOV",
        "urlAllmusic": "http://www.allmusic.com/song/mt0031988990",
        "urlMusicBrainz": "http://musicbrainz.org/recording/0f65985f-4ab2-4416-87eb-ccfd1ac4eb89"
        "id_artist": "56d93d84ce06f50c0fed8747"
    }
 * @apiError error The id is not valid.
 * @apiErrorExample Error-Response invalid ObjectId:
    HTTP/1.1 404 Not Found
    {
        "error": "You must type a valid ObjectId"
    }
 * @apiError error the database does not respond.
 * @apiErrorExample Error-Response internal error:
    HTTP/1.1 404 Not Found
    {
        "error": "An internal error occurred"
    }
 */


//==========================================================================================================================\\
//===========================API REST POUR RECUPERER LES MUSIQUES DE CHAQUE ALBUM DE CHAQUE ARTISTE=========================\\
//==========================================================================================================================\\
router.get('/artist_all/:start', apiV1Controller.get_artistAll);
/**
 * @api {get} api/v1/artist_all/:start All - Get songs of each albums of each artists
 * @apiExample Example usage: 
 *      wasabi.i3s.unice.fr/api/v1/artist_all/72000
 * @apiVersion 1.0.0
 * @apiName GetArtistsWithAlbumsAndSongs
 * @apiGroup Api/v1
 * @apiDescription This api return the first 200 artist documents 
 *                 for instance wasabi.i3s.unice.fr/api/v1/artist_all/72000 will return all artists between [72000 and 72200[ 
 *
 * @apiParam {Number} start Where we want to start the extraction, there are currently 77492 artists in our database .
 *
 * @apiSuccessExample Success-Response for an artist:
    HTTP/1.1 200 OK
    [{
        "_id": "56d93d84ce06f50c0fed8747",
        "name": "Metallica",
        "urlWikipedia": "http://en.wikipedia.org/wiki/Metallica",
        "urlOfficialWebsite": "http://www.metallica.com/",
        "urlFacebook": "http://www.facebook.com/metallica",
        "urlMySpace": "https://myspace.com/Metallica",
        "urlTwitter": "http://twitter.com/metallica",
        "locationInfo": ["United States", "California", "Los Angeles"],
        "urlWikia": "Metallica",
        "genres": ["Heavy Metal", "Thrash Metal"],
        "labels": ["Elektra", "Megaforce Records", "Mercury Records", "Warner Bros. Records"],
        "members": [{
            "id_member_musicbrainz": "118ba687-ad7f-4c28-9355-67e14b18baeb",
            "name": "Ron McGovney",
            "instruments": [
                "bass guitar"
            ],
            "begin": "1982",
            "end": "1982",
            "ended": true,
            "disambiguation": "",
            "type": "member of band"
        }],
        "urlAmazon": "http://www.amazon.com/asdf/e/B000APEBQY?tag=wikia-20",
        "urlITunes": "https://itunes.apple.com/us/artist/id3996865",
        "urlAllmusic": "http://www.allmusic.com/artist/mn0000446509",
        "urlDiscogs": "http://www.discogs.com/artist/18839",
        "urlMusicBrainz": "http://musicbrainz.org/artist/65f4f0c5-ef9e-490c-aee3-909e7ae6b2ab",
        "urlYouTube": "https://www.youtube.com/user/MetallicaTV",
        "urlSpotify": "https://play.spotify.com/artist/2ye2Wgw4gimLv2eAKyk1NB",
        "urlPureVolume": "http://www.purevolume.com/metallica",
        "urlRateYourMusic": "http://rateyourmusic.com/artist/metallica",
        "urlSoundCloud": "http://soundcloud.com/loureedmetallica",
        "id_artist_musicbrainz": "65f4f0c5-ef9e-490c-aee3-909e7ae6b2ab",
        "disambiguation": "",
        "type": "Group",
        "lifeSpan": {
            "ended": false,
            "begin": "1981-10",
            "end": ""
        },
        "location": {
            "id_city_musicbrainz": "1f40c6e1-47ba-4e35-996f-fe6ee5840e62",
            "country": "United States",
            "city": "Los Angeles"
        },
        "gender": "",
        "endArea": {
            "id": "",
            "name": "",
            "disambiguation": ""
        },
        "albums": [{
            "_id": "5714debe25ac0d8aee36b662",
            "name": "Metallica",
            "title": "Kill 'Em All",
            "publicationDate": "1983",
            "urlWikipedia": "http://en.wikipedia.org/wiki/Kill_%27Em_All",
            "genre": "Thrash Metal",
            "length": "51:14",
            "urlAlbum": "http://lyrics.wikia.com/Metallica:Kill_%27Em_All_%281983%29",
            "urlAmazon": "http://www.amazon.com/exec/obidos/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=http%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB000002H33%2Fsr%3D8-1%2Fqid%3D1147400297%2Fref%3Dpd_bbs_1%3F%255Fencoding%3DUTF8",
            "urlITunes": "https://itunes.apple.com/us/album/id278129100",
            "urlAllmusic": "http://www.allmusic.com/album/mw0000667490",
            "urlDiscogs": "http://www.discogs.com/release/367423",
            "urlMusicBrainz": "http://musicbrainz.org/release/fed37cfc-2a6d-4569-9ac0-501a7c7598eb",
            "urlSpotify": "https://play.spotify.com/album/41bTjcSaiEe4G40RVVHbux",
            "id_artist": "56d93d84ce06f50c0fed8747",
            "songs": [{
                "_id": "5714dedb25ac0d8aee4ad800",
                "position": 0,
                "title": "Hit The Lights",
                "urlSong": "http://lyrics.wikia.com/Metallica:Hit_The_Lights",
                "lyrics": "No life till leather, we&apos;re gonna kick some ass tonight We got the metal madness...",
                "urlWikipedia": "",
                "id_album": "5714debe25ac0d8aee36b662",
                "urlYouTube": "",
                "isClassic": false,
                "multitrack_path": "M Multitracks/Metallica - Hit The Lights",
                "urlITunes": "https://itunes.apple.com/us/album/id167352861?i=167352894",
                "urlAmazon": "http://www.amazon.com/exec/obidos/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=http%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB00122D6X8%2Fsr%3D8-1%2Fqid%3D1147400297%2Fref%3Dpd_bbs_1%3F%255Fencoding%3DUTF8",
                "urlGoEar": "http://goear.com/listen.php?v=41b192c",
                "urlSpotify": "https://play.spotify.com/track/4Pn6l1ZzsYFrx64h1gWTyy",
                "urlAllmusic": "http://www.allmusic.com/song/mt0034723664",
                "urlMusicBrainz": "http://musicbrainz.org/recording/8467f4e7-ef5b-458c-bbc5-6727d9f2252d"
            }, {
                "_id": "5714dedb25ac0d8aee4ad801",
                "position": 1,
                "title": "The Four Horsemen",
                "urlSong": "http://lyrics.wikia.com/Metallica:The_Four_Horsemen",
                "lyrics": "By the last breath, the fourth winds blow Better raise your ears...",
                "urlWikipedia": "http://en.wikipedia.org/wiki/The_Mechanix",
                "id_album": "5714debe25ac0d8aee36b662",
                "format": [],
                "genre": ["Thrash metal", "Speed metal"],
                "producer": ["Dave Mustaine"],
                "recordLabel": ["Combat Records"],
                "writer": [],
                "recorded": ["December 1984 – January 1985 at Indigo Ranch Studios in Malibu, California"],
                "abstract": "Killing Is My Business... and Business Is Good! is the debut studio album by American thrash metal band Megadeth. It was released on June 12, 1985...",
                "releaseDate": ["1985-06-12"],
                "runtime": ["1870.0"],
                "award": [],
                "subject": ["1985 debut albums", "Megadeth albums", "Combat Records albums"],
                "urlYouTube": "",
                "isClassic": false,
                "urlITunes": "https://itunes.apple.com/us/album/id167352861?i=167352995",
                "urlAmazon": "http://www.amazon.com/exec/obidos/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=http%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB00122D6ZG%2Fsr%3D8-1%2Fqid%3D1147400297%2Fref%3Dpd_bbs_1%3F%255Fencoding%3DUTF8",
                "urlGoEar": "http://goear.com/listen.php?v=2bc44cf",
                "urlAllmusic": "http://www.allmusic.com/song/mt0010502640",
                "urlMusicBrainz": "http://musicbrainz.org/recording/20826102-147b-4376-a1f3-72c25bfd43cd"
            }]
        }]
    }]
 * @apiError error isn't a number or is negative.
 * @apiErrorExample Error-Response:
    HTTP/1.1 404 Not Found
    {
        "error": "Page not found"
    }
 * @apiError error the database does not respond.
 * @apiErrorExample Error-Response internal error:
    HTTP/1.1 404 Not Found
    {
        "error": "An internal error occurred"
    }
 */


//==========================================================================================================================\\
//=====================API REST POUR RECUPERER LES MUSIQUES DE CHAQUE ALBUM D'UN ARTISTE PAR ID D'ARTIST====================\\
//==========================================================================================================================\\
router.get('/artist_all/id/:id', apiV1Controller.get_artistAllById);
/**
 * @api {get} api/v1/artist_all/id/:id All - Get songs of each albums of the artists having this id
 * @apiExample Example usage: 
 *      wasabi.i3s.unice.fr/api/v1/artist_all/id/56d93d84ce06f50c0fed8747
 * @apiVersion 1.0.0
 * @apiName GetArtistByIdWithAlbumsAndSongs
 * @apiGroup Api/v1

 * @apiParam {Number} id artist's id
 *
 * @apiSuccessExample Success-Response for an artist:
    HTTP/1.1 200 OK
    {
        "_id": "56d93d84ce06f50c0fed8747",
        "name": "Metallica",
        "urlWikipedia": "http://en.wikipedia.org/wiki/Metallica",
        "urlOfficialWebsite": "http://www.metallica.com/",
        "urlFacebook": "http://www.facebook.com/metallica",
        "urlMySpace": "https://myspace.com/Metallica",
        "urlTwitter": "http://twitter.com/metallica",
        "locationInfo": ["United States", "California", "Los Angeles"],
        "urlWikia": "Metallica",
        "genres": ["Heavy Metal", "Thrash Metal"],
        "labels": ["Elektra", "Megaforce Records", "Mercury Records", "Warner Bros. Records"],
        "members": [{
            "id_member_musicbrainz": "118ba687-ad7f-4c28-9355-67e14b18baeb",
            "name": "Ron McGovney",
            "instruments": [
                "bass guitar"
            ],
            "begin": "1982",
            "end": "1982",
            "ended": true,
            "disambiguation": "",
            "type": "member of band"
        }],
        "urlAmazon": "http://www.amazon.com/asdf/e/B000APEBQY?tag=wikia-20",
        "urlITunes": "https://itunes.apple.com/us/artist/id3996865",
        "urlAllmusic": "http://www.allmusic.com/artist/mn0000446509",
        "urlDiscogs": "http://www.discogs.com/artist/18839",
        "urlMusicBrainz": "http://musicbrainz.org/artist/65f4f0c5-ef9e-490c-aee3-909e7ae6b2ab",
        "urlYouTube": "https://www.youtube.com/user/MetallicaTV",
        "urlSpotify": "https://play.spotify.com/artist/2ye2Wgw4gimLv2eAKyk1NB",
        "urlPureVolume": "http://www.purevolume.com/metallica",
        "urlRateYourMusic": "http://rateyourmusic.com/artist/metallica",
        "urlSoundCloud": "http://soundcloud.com/loureedmetallica",
        "id_artist_musicbrainz": "65f4f0c5-ef9e-490c-aee3-909e7ae6b2ab",
        "disambiguation": "",
        "type": "Group",
        "lifeSpan": {
            "ended": false,
            "begin": "1981-10",
            "end": ""
        },
        "location": {
            "id_city_musicbrainz": "1f40c6e1-47ba-4e35-996f-fe6ee5840e62",
            "country": "United States",
            "city": "Los Angeles"
        },
        "gender": "",
        "endArea": {
            "id": "",
            "name": "",
            "disambiguation": ""
        },
        "albums": [{
            "_id": "5714debe25ac0d8aee36b662",
            "name": "Metallica",
            "title": "Kill 'Em All",
            "publicationDate": "1983",
            "urlWikipedia": "http://en.wikipedia.org/wiki/Kill_%27Em_All",
            "genre": "Thrash Metal",
            "length": "51:14",
            "urlAlbum": "http://lyrics.wikia.com/Metallica:Kill_%27Em_All_%281983%29",
            "id_artist": "56d93d84ce06f50c0fed8747",
            "urlAmazon": "http://www.amazon.com/exec/obidos/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=http%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB000002H33%2Fsr%3D8-1%2Fqid%3D1147400297%2Fref%3Dpd_bbs_1%3F%255Fencoding%3DUTF8",
            "urlITunes": "https://itunes.apple.com/us/album/id278129100",
            "urlAllmusic": "http://www.allmusic.com/album/mw0000667490",
            "urlDiscogs": "http://www.discogs.com/release/367423",
            "urlMusicBrainz": "http://musicbrainz.org/release/fed37cfc-2a6d-4569-9ac0-501a7c7598eb",
            "urlSpotify": "https://play.spotify.com/album/41bTjcSaiEe4G40RVVHbux",
            "songs": [{
                "_id": "5714dedb25ac0d8aee4ad800",
                "position": 0,
                "title": "Hit The Lights",
                "urlSong": "http://lyrics.wikia.com/Metallica:Hit_The_Lights",
                "lyrics": "No life till leather, we&apos;re gonna kick some ass tonight We got the metal madness...",
                "urlWikipedia": "",
                "id_album": "5714debe25ac0d8aee36b662",
                "urlYouTube": "",
                "isClassic": false,
                "multitrack_path": "M Multitracks/Metallica - Hit The Lights",
                "urlITunes": "https://itunes.apple.com/us/album/id167352861?i=167352894",
                "urlAmazon": "http://www.amazon.com/exec/obidos/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=http%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB00122D6X8%2Fsr%3D8-1%2Fqid%3D1147400297%2Fref%3Dpd_bbs_1%3F%255Fencoding%3DUTF8",
                "urlGoEar": "http://goear.com/listen.php?v=41b192c",
                "urlSpotify": "https://play.spotify.com/track/4Pn6l1ZzsYFrx64h1gWTyy",
                "urlAllmusic": "http://www.allmusic.com/song/mt0034723664",
                "urlMusicBrainz": "http://musicbrainz.org/recording/8467f4e7-ef5b-458c-bbc5-6727d9f2252d"
            }, {
                "_id": "5714dedb25ac0d8aee4ad801",
                "position": 1,
                "title": "The Four Horsemen",
                "urlSong": "http://lyrics.wikia.com/Metallica:The_Four_Horsemen",
                "lyrics": "By the last breath, the fourth winds blow Better raise your ears...",
                "urlWikipedia": "http://en.wikipedia.org/wiki/The_Mechanix",
                "id_album": "5714debe25ac0d8aee36b662",
                "format": [],
                "genre": ["Thrash metal", "Speed metal"],
                "producer": ["Dave Mustaine"],
                "recordLabel": ["Combat Records"],
                "writer": [],
                "recorded": ["December 1984 – January 1985 at Indigo Ranch Studios in Malibu, California"],
                "abstract": "Killing Is My Business... and Business Is Good! is the debut studio album by American thrash metal band Megadeth. It was released on June 12, 1985...",
                "releaseDate": ["1985-06-12"],
                "runtime": ["1870.0"],
                "award": [],
                "subject": ["1985 debut albums", "Megadeth albums", "Combat Records albums"],
                "urlYouTube": "",
                "isClassic": false,
                "urlITunes": "https://itunes.apple.com/us/album/id167352861?i=167352995",
                "urlAmazon": "http://www.amazon.com/exec/obidos/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=http%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB00122D6ZG%2Fsr%3D8-1%2Fqid%3D1147400297%2Fref%3Dpd_bbs_1%3F%255Fencoding%3DUTF8",
                "urlGoEar": "http://goear.com/listen.php?v=2bc44cf",
                "urlAllmusic": "http://www.allmusic.com/song/mt0010502640",
                "urlMusicBrainz": "http://musicbrainz.org/recording/20826102-147b-4376-a1f3-72c25bfd43cd"
            }]
        }]
    }
 * @apiError error The id is not valid.
 * @apiErrorExample Error-Response invalid ObjectId:
    HTTP/1.1 404 Not Found
    {
        "error": "You must type a valid ObjectId"
    }
 * @apiError error the database does not respond.
 * @apiErrorExample Error-Response internal error:
    HTTP/1.1 404 Not Found
    {
        "error": "An internal error occurred"
    }
 */


//==========================================================================================================================\\
//====================API REST POUR RECUPERER LES MUSIQUES DE CHAQUE ALBUM D'UN ARTISTE PAR NOM D'ARTISTE===================\\
//==========================================================================================================================\\
router.get('/artist_all/name/:name', apiV1Controller.get_artistAllByName);
/**
 * @api {get} api/v1/artist_all/name/:name All - Get songs of each albums of the artists having this name
 * @apiExample Example usage: 
 *      wasabi.i3s.unice.fr/api/v1/artist_all/name/Metallica
 * @apiVersion 1.0.0
 * @apiName GetArtistByNameWithAlbumsAndSongs
 * @apiGroup Api/v1

 * @apiParam {String} name artist's name
 *
 * @apiSuccessExample Success-Response for an artist:
    HTTP/1.1 200 OK
    {
        "_id": "56d93d84ce06f50c0fed8747",
        "name": "Metallica",
        "urlWikipedia": "http://en.wikipedia.org/wiki/Metallica",
        "urlOfficialWebsite": "http://www.metallica.com/",
        "urlFacebook": "http://www.facebook.com/metallica",
        "urlMySpace": "https://myspace.com/Metallica",
        "urlTwitter": "http://twitter.com/metallica",
        "locationInfo": ["United States", "California", "Los Angeles"],
        "urlWikia": "Metallica",
        "genres": ["Heavy Metal", "Thrash Metal"],
        "labels": ["Elektra", "Megaforce Records", "Mercury Records", "Warner Bros. Records"],
        "members": [{
            "id_member_musicbrainz": "118ba687-ad7f-4c28-9355-67e14b18baeb",
            "name": "Ron McGovney",
            "instruments": [
                "bass guitar"
            ],
            "begin": "1982",
            "end": "1982",
            "ended": true,
            "disambiguation": "",
            "type": "member of band"
        }],
        "urlAmazon": "http://www.amazon.com/asdf/e/B000APEBQY?tag=wikia-20",
        "urlITunes": "https://itunes.apple.com/us/artist/id3996865",
        "urlAllmusic": "http://www.allmusic.com/artist/mn0000446509",
        "urlDiscogs": "http://www.discogs.com/artist/18839",
        "urlMusicBrainz": "http://musicbrainz.org/artist/65f4f0c5-ef9e-490c-aee3-909e7ae6b2ab",
        "urlYouTube": "https://www.youtube.com/user/MetallicaTV",
        "urlSpotify": "https://play.spotify.com/artist/2ye2Wgw4gimLv2eAKyk1NB",
        "urlPureVolume": "http://www.purevolume.com/metallica",
        "urlRateYourMusic": "http://rateyourmusic.com/artist/metallica",
        "urlSoundCloud": "http://soundcloud.com/loureedmetallica",
        "id_artist_musicbrainz": "65f4f0c5-ef9e-490c-aee3-909e7ae6b2ab",
        "disambiguation": "",
        "type": "Group",
        "lifeSpan": {
            "ended": false,
            "begin": "1981-10",
            "end": ""
        },
        "location": {
            "id_city_musicbrainz": "1f40c6e1-47ba-4e35-996f-fe6ee5840e62",
            "country": "United States",
            "city": "Los Angeles"
        },
        "gender": "",
        "endArea": {
            "id": "",
            "name": "",
            "disambiguation": ""
        },
        "albums": [{
            "_id": "5714debe25ac0d8aee36b662",
            "name": "Metallica",
            "title": "Kill 'Em All",
            "publicationDate": "1983",
            "urlWikipedia": "http://en.wikipedia.org/wiki/Kill_%27Em_All",
            "genre": "Thrash Metal",
            "length": "51:14",
            "urlAlbum": "http://lyrics.wikia.com/Metallica:Kill_%27Em_All_%281983%29",
            "id_artist": "56d93d84ce06f50c0fed8747",
            "urlAmazon": "http://www.amazon.com/exec/obidos/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=http%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB000002H33%2Fsr%3D8-1%2Fqid%3D1147400297%2Fref%3Dpd_bbs_1%3F%255Fencoding%3DUTF8",
            "urlITunes": "https://itunes.apple.com/us/album/id278129100",
            "urlAllmusic": "http://www.allmusic.com/album/mw0000667490",
            "urlDiscogs": "http://www.discogs.com/release/367423",
            "urlMusicBrainz": "http://musicbrainz.org/release/fed37cfc-2a6d-4569-9ac0-501a7c7598eb",
            "urlSpotify": "https://play.spotify.com/album/41bTjcSaiEe4G40RVVHbux",
            "songs": [{
                "_id": "5714dedb25ac0d8aee4ad800",
                "position": 0,
                "title": "Hit The Lights",
                "urlSong": "http://lyrics.wikia.com/Metallica:Hit_The_Lights",
                "lyrics": "No life till leather, we&apos;re gonna kick some ass tonight We got the metal madness...",
                "urlWikipedia": "",
                "id_album": "5714debe25ac0d8aee36b662",
                "urlYouTube": "",
                "isClassic": false,
                "multitrack_path": "M Multitracks/Metallica - Hit The Lights",
                "urlITunes": "https://itunes.apple.com/us/album/id167352861?i=167352894",
                "urlAmazon": "http://www.amazon.com/exec/obidos/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=http%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB00122D6X8%2Fsr%3D8-1%2Fqid%3D1147400297%2Fref%3Dpd_bbs_1%3F%255Fencoding%3DUTF8",
                "urlGoEar": "http://goear.com/listen.php?v=41b192c",
                "urlSpotify": "https://play.spotify.com/track/4Pn6l1ZzsYFrx64h1gWTyy",
                "urlAllmusic": "http://www.allmusic.com/song/mt0034723664",
                "urlMusicBrainz": "http://musicbrainz.org/recording/8467f4e7-ef5b-458c-bbc5-6727d9f2252d"
            }, {
                "_id": "5714dedb25ac0d8aee4ad801",
                "position": 1,
                "title": "The Four Horsemen",
                "urlSong": "http://lyrics.wikia.com/Metallica:The_Four_Horsemen",
                "lyrics": "By the last breath, the fourth winds blow Better raise your ears...",
                "urlWikipedia": "http://en.wikipedia.org/wiki/The_Mechanix",
                "id_album": "5714debe25ac0d8aee36b662",
                "format": [],
                "genre": ["Thrash metal", "Speed metal"],
                "producer": ["Dave Mustaine"],
                "recordLabel": ["Combat Records"],
                "writer": [],
                "recorded": ["December 1984 – January 1985 at Indigo Ranch Studios in Malibu, California"],
                "abstract": "Killing Is My Business... and Business Is Good! is the debut studio album by American thrash metal band Megadeth. It was released on June 12, 1985...",
                "releaseDate": ["1985-06-12"],
                "runtime": ["1870.0"],
                "award": [],
                "subject": ["1985 debut albums", "Megadeth albums", "Combat Records albums"],
                "urlYouTube": "",
                "isClassic": false,
                "urlITunes": "https://itunes.apple.com/us/album/id167352861?i=167352995",
                "urlAmazon": "http://www.amazon.com/exec/obidos/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=http%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB00122D6ZG%2Fsr%3D8-1%2Fqid%3D1147400297%2Fref%3Dpd_bbs_1%3F%255Fencoding%3DUTF8",
                "urlGoEar": "http://goear.com/listen.php?v=2bc44cf",
                "urlAllmusic": "http://www.allmusic.com/song/mt0010502640",
                "urlMusicBrainz": "http://musicbrainz.org/recording/20826102-147b-4376-a1f3-72c25bfd43cd"
            }]
        }]
    }
 * @apiError error The id is not valid.
 * @apiErrorExample Error-Response invalid ObjectId:
    HTTP/1.1 404 Not Found
    {
        "error": "You must type a valid ObjectId"
    }
 * @apiError error the database does not respond.
 * @apiErrorExample Error-Response internal error:
    HTTP/1.1 404 Not Found
    {
        "error": "An internal error occurred"
    }
 */


//Une API pour tester si la ram est suffisante pour éxecuter l'api api/artist_all
router.get('/api_test/artist_all', (req, res) => {
    var start = 0;
    (function callRequest(start) {
        request('http://localhost/api/artist_all/' + start, (error, response, artists) => {
            var artists = JSON.parse(artists);
            start += LIMIT;
            if (!error && response.statusCode == 200) {
                if (artists.length != 200) {
                    console.log("C'est fini");
                    return true;
                } else {
                    callRequest(start)
                }
            } else {
                console.log("error = " + error);
                return false;
            }
        });
    })(start);
    res.json(config.http.valid.send_message_ok);
})
//==========================================================================================================================\\
//=========================================API REST POUR RECUPERER UN ARTISTE PAR ID========================================\\
//==========================================================================================================================\\
/**
 * @api {get} api/v1/artist/id/:id Artist - Get an artist document by id
 * @apiExample Example usage: 
 *      wasabi.i3s.unice.fr/api/v1/artist/id/56d93d84ce06f50c0fed8747
 * @apiVersion 1.0.0
 * @apiName GetArtistById
 * @apiGroup Api/v1
 * 
 * @apiParam {Number} id artist's id
 *
 * @apiSuccessExample Success-Response for an artist:
    HTTP/1.1 200 OK
    {
        "_id": "56d93d84ce06f50c0fed8747",
        "name": "Metallica",
        "urlWikipedia": "http://en.wikipedia.org/wiki/Metallica",
        "urlOfficialWebsite": "http://www.metallica.com/",
        "urlFacebook": "http://www.facebook.com/metallica",
        "urlMySpace": "https://myspace.com/Metallica",
        "urlTwitter": "http://twitter.com/metallica",
        "locationInfo": ["United States", "California", "Los Angeles"],
        "urlWikia": "Metallica",
        "genres": ["Heavy Metal", "Thrash Metal"],
        "labels": ["Elektra", "Megaforce Records", "Mercury Records", "Warner Bros. Records"],
        "members": [{
            "id_member_musicbrainz": "118ba687-ad7f-4c28-9355-67e14b18baeb",
            "name": "Ron McGovney",
            "instruments": [
                "bass guitar"
            ],
            "begin": "1982",
            "end": "1982",
            "ended": true,
            "disambiguation": "",
            "type": "member of band"
        }],
        "urlAmazon": "http://www.amazon.com/asdf/e/B000APEBQY?tag=wikia-20",
        "urlITunes": "https://itunes.apple.com/us/artist/id3996865",
        "urlAllmusic": "http://www.allmusic.com/artist/mn0000446509",
        "urlDiscogs": "http://www.discogs.com/artist/18839",
        "urlMusicBrainz": "http://musicbrainz.org/artist/65f4f0c5-ef9e-490c-aee3-909e7ae6b2ab",
        "urlYouTube": "https://www.youtube.com/user/MetallicaTV",
        "urlSpotify": "https://play.spotify.com/artist/2ye2Wgw4gimLv2eAKyk1NB",
        "urlPureVolume": "http://www.purevolume.com/metallica",
        "urlRateYourMusic": "http://rateyourmusic.com/artist/metallica",
        "urlSoundCloud": "http://soundcloud.com/loureedmetallica",
        "id_artist_musicbrainz": "65f4f0c5-ef9e-490c-aee3-909e7ae6b2ab",
        "disambiguation": "",
        "type": "Group",
        "lifeSpan": {
            "ended": false,
            "begin": "1981-10",
            "end": ""
        },
        "location": {
            "id_city_musicbrainz": "1f40c6e1-47ba-4e35-996f-fe6ee5840e62",
            "country": "United States",
            "city": "Los Angeles"
        },
        "gender": "",
        "endArea": {
            "id": "",
            "name": "",
            "disambiguation": ""
        }
    }
 * @apiError error The id is not valid.
 * @apiErrorExample Error-Response invalid ObjectId:
    HTTP/1.1 404 Not Found
    {
        "error": "You must type a valid ObjectId"
    }
 * @apiError error the database does not respond.
 * @apiErrorExample Error-Response internal error:
    HTTP/1.1 404 Not Found
    {
        "error": "An internal error occurred"
    }
 */
router.get('/artist/id/:id', apiV1Controller.get_artistById);
//==========================================================================================================================\\
//=========================================API REST POUR RECUPERER UN ARTISTE PAR NOM D'ARTISTE========================================\\
//==========================================================================================================================\\
/**
 * @api {get} api/v1/artist/name/:artistName Artist - Get an artist document by artistName
 * @apiExample Example usage: 
 *      wasabi.i3s.unice.fr/api/v1/artist/name/Metallica
 * @apiVersion 1.0.0
 * @apiName GetArtistByArtistName
 * @apiGroup Api/v1
 * 
 * @apiParam {String} artistName artist's name
 *
 * @apiSuccessExample Success-Response for an artist:
    HTTP/1.1 200 OK
    {
        "_id": "56d93d84ce06f50c0fed8747",
        "name": "Metallica",
        "urlWikipedia": "http://en.wikipedia.org/wiki/Metallica",
        "urlOfficialWebsite": "http://www.metallica.com/",
        "urlFacebook": "http://www.facebook.com/metallica",
        "urlMySpace": "https://myspace.com/Metallica",
        "urlTwitter": "http://twitter.com/metallica",
        "locationInfo": ["United States", "California", "Los Angeles"],
        "urlWikia": "Metallica",
        "genres": ["Heavy Metal", "Thrash Metal"],
        "labels": ["Elektra", "Megaforce Records", "Mercury Records", "Warner Bros. Records"],
        "members": [{
            "id_member_musicbrainz": "118ba687-ad7f-4c28-9355-67e14b18baeb",
            "name": "Ron McGovney",
            "instruments": [
                "bass guitar"
            ],
            "begin": "1982",
            "end": "1982",
            "ended": true,
            "disambiguation": "",
            "type": "member of band"
        }],
        "urlAmazon": "http://www.amazon.com/asdf/e/B000APEBQY?tag=wikia-20",
        "urlITunes": "https://itunes.apple.com/us/artist/id3996865",
        "urlAllmusic": "http://www.allmusic.com/artist/mn0000446509",
        "urlDiscogs": "http://www.discogs.com/artist/18839",
        "urlMusicBrainz": "http://musicbrainz.org/artist/65f4f0c5-ef9e-490c-aee3-909e7ae6b2ab",
        "urlYouTube": "https://www.youtube.com/user/MetallicaTV",
        "urlSpotify": "https://play.spotify.com/artist/2ye2Wgw4gimLv2eAKyk1NB",
        "urlPureVolume": "http://www.purevolume.com/metallica",
        "urlRateYourMusic": "http://rateyourmusic.com/artist/metallica",
        "urlSoundCloud": "http://soundcloud.com/loureedmetallica",
        "id_artist_musicbrainz": "65f4f0c5-ef9e-490c-aee3-909e7ae6b2ab",
        "disambiguation": "",
        "type": "Group",
        "lifeSpan": {
            "ended": false,
            "begin": "1981-10",
            "end": ""
        },
        "location": {
            "id_city_musicbrainz": "1f40c6e1-47ba-4e35-996f-fe6ee5840e62",
            "country": "United States",
            "city": "Los Angeles"
        },
        "gender": "",
        "endArea": {
            "id": "",
            "name": "",
            "disambiguation": ""
        }
    }
 * @apiError error the database does not respond.
 * @apiErrorExample Error-Response internal error:
    HTTP/1.1 404 Not Found
    {
        "error": "An internal error occurred"
    }
 */
router.get('/artist/name/:artistName', apiV1Controller.get_artistByName);

//==========================================================================================================================\\
//=========================================API REST POUR RECUPERER UNE MUSIQUE PAR ID=======================================\\
//==========================================================================================================================\\
/**
 * @api {get} api/v1/song/id/:id Song - Get a song document by id
 * @apiExample Example usage: 
 *      wasabi.i3s.unice.fr/api/v1/song/id/5714dedb25ac0d8aee4ad810
 * @apiVersion 1.0.0
 * @apiName GetSongById
 * @apiGroup Api/v1
 * 
 * @apiParam {Number} id song's id
 *
 * @apiSuccessExample Success-Response for an artist:
    HTTP/1.1 200 OK
    {
        "_id": "5714dedb25ac0d8aee4ad810",
        "name": "Metallica",
        "position": 2,
        "albumTitle": "Ride The Lightning",
        "lengthAlbum": "47:26",
        "publicationDateAlbum": "1984",
        "title": "For Whom The Bell Tolls",
        "urlSong": "http://lyrics.wikia.com/Metallica:For_Whom_The_Bell_Tolls",
        "lyrics": "Make his fight on the hill in the early day Constant chill deep inside...",
        "urlWikipedia": "http://en.wikipedia.org/wiki/For_Whom_the_Bell_Tolls_(Metallica_song)",
        "id_album": "5714debe25ac0d8aee36b663",
        "format": [],
        "genre": ["Heavy metal music"],
        "producer": ["Metallica", "Flemming Rasmussen"],
        "recordLabel": ["Elektra Records"],
        "writer": ["James Hetfield", "Lars Ulrich", "Cliff Burton"],
        "recorded": ["--02-20"],
        "abstract": "\"For Whom the Bell Tolls\" is a song by American thrash metal band Metallica...", 
        "releaseDate": ["1985-08-31"],
        "runtime": ["310.0"],
        "award": [],
        "subject": ["Songs written by James Hetfield", "1985 singles", "Songs written by Lars Ulrich", "Elektra Records singles", "Metallica songs", "1984 songs", "Anti-war songs", "Songs written by Cliff Burton"],
        "urlYouTube": "",
        "isClassic": false,
        "multitrack_path": "M Multitracks/Metallica - For Whom The Bell Tolls",
        "urlITunes": "https://itunes.apple.com/us/album/id167353139?i=167353334",
        "urlAmazon": "http://www.amazon.com/exec/obidos/redirect?link_code=ur2&tag=wikia-20&camp=1789&creative=9325&path=http%3A%2F%2Fwww.amazon.com%2Fgp%2Fproduct%2FB0012235Q6%2Fsr%3D8-1%2Fqid%3D1147400297%2Fref%3Dpd_bbs_1%3F%255Fencoding%3DUTF8",
        "urlGoEar": "http://goear.com/listen.php?v=c6e3d05",
        "urlSpotify": "https://play.spotify.com/track/4hOohf45f0JtxYKNsEAIOV",
        "urlAllmusic": "http://www.allmusic.com/song/mt0031988990",
        "urlMusicBrainz": "http://musicbrainz.org/recording/0f65985f-4ab2-4416-87eb-ccfd1ac4eb89"
    }
 * @apiError error The id is not valid.
 * @apiErrorExample Error-Response invalid ObjectId:
    HTTP/1.1 404 Not Found
    {
        "error": "You must type a valid ObjectId"
    }
 * @apiError error the database does not respond.
 * @apiErrorExample Error-Response internal error:
    HTTP/1.1 404 Not Found
    {
        "error": "An internal error occurred"
    }
 */
router.get('/song/id/:id', apiV1Controller.get_songById);
//==========================================================================================================================\\
//======================================API REST POUR RECUPERER LES MUSIQUES 200 PAR 200====================================\\
//==========================================================================================================================\\
/**
 * @api {get} api/v1/song_all/:start Song - Get songs
 * @apiExample Example usage: 
 *      wasabi.i3s.unice.fr/api/v1/song_all/300
 *      wasabi.i3s.unice.fr/api/v1/song_all/300?project=_id,lyrics,title,name,language_detect
 *      wasabi.i3s.unice.fr/api/v1/song_all/500?project=lyrics
 * @apiVersion 1.0.0
 * @apiName GetSongs
 * @apiGroup Api/v1
 * 
 * @apiParam {Number} start start the extraction from :start and return the 200 first documents
 * @apiParam {Number} project field(s) to retrieve
 * 
 * @apiError error the database does not respond.
 * @apiErrorExample Error-Response internal error:
    HTTP/1.1 404 Not Found
    {
        "error": "An internal error occurred"
    }
 */
router.get('/song_all/:start', apiV1Controller.get_songAll);


//==========================================================================================================================\\
//====================================API REST POUR RECUPERER UN ARTISTE PAR NOM DE MEMBRE==================================\\
//==========================================================================================================================\\
/**
 * @api {get} api/v1/member/name/:memberName Artist - Get an artist document by memberName
 * @apiExample Example usage: 
 *      wasabi.i3s.unice.fr/api/v1/member/name/Adrian%20Smith
 * @apiVersion 1.0.0
 * @apiName GetArtistByMemberName
 * @apiGroup Api/v1
 * 
 * @apiParam {String} memberName member's name
 *
 * @apiSuccessExample Success-Response for an artist:
    HTTP/1.1 200 OK
    {
        "_id": "56d8432453a7ddfc01f96c1f",
        "name": "Iron Maiden",
        "urlWikipedia": "http://en.wikipedia.org/wiki/Iron_Maiden",
        "urlOfficialWebsite": "http://www.ironmaiden.com/",
        "urlFacebook": "https://www.facebook.com/ironmaiden",
        "urlMySpace": "https://myspace.com/ironmaiden",
        "urlTwitter": "https://twitter.com/ironmaiden",
        "locationInfo": ["England", "London"],
        "urlWikia": "Iron_Maiden",
        "genres": ["Heavy Metal"],
        "labels": ["Atlantic Records", "EMI", "Elektra", "Epic Records"],
        "members": [{
            "id_member_musicbrainz": "118ba687-ad7f-4c28-9355-67e14b18baeb",
            "name": "Ron McGovney",
            "instruments": [
                "bass guitar"
            ],
            "begin": "1982",
            "end": "1982",
            "ended": true,
            "disambiguation": "",
            "type": "member of band"
        }],
        "urlAmazon": "http://www.amazon.com/asdf/e/B000APEBQY?tag=wikia-20",
        "urlITunes": "https://itunes.apple.com/us/artist/id3996865",
        "urlAllmusic": "http://www.allmusic.com/artist/mn0000446509",
        "urlDiscogs": "http://www.discogs.com/artist/18839",
        "urlMusicBrainz": "http://musicbrainz.org/artist/65f4f0c5-ef9e-490c-aee3-909e7ae6b2ab",
        "urlYouTube": "https://www.youtube.com/user/MetallicaTV",
        "urlSpotify": "https://play.spotify.com/artist/2ye2Wgw4gimLv2eAKyk1NB",
        "urlPureVolume": "http://www.purevolume.com/metallica",
        "urlRateYourMusic": "http://rateyourmusic.com/artist/metallica",
        "urlSoundCloud": "http://soundcloud.com/loureedmetallica",
        "id_artist_musicbrainz": "65f4f0c5-ef9e-490c-aee3-909e7ae6b2ab",
        "disambiguation": "",
        "type": "Group",
        "lifeSpan": {
            "ended": false,
            "begin": "1981-10",
            "end": ""
        },
        "location": {
            "id_city_musicbrainz": "1f40c6e1-47ba-4e35-996f-fe6ee5840e62",
            "country": "United States",
            "city": "Los Angeles"
        },
        "gender": "",
        "endArea": {
            "id": "",
            "name": "",
            "disambiguation": ""
        }
    }
 * @apiError error the database does not respond.
 * @apiErrorExample Error-Response internal error:
    HTTP/1.1 404 Not Found
    {
        "error": "An internal error occurred"
    }
 */
router.get('/member/name/:memberName', apiV1Controller.get_memberByName);

/**
 * @api {get} api/v1/animux_all/:start Song - Get songs with an animux field
 * @apiExample Example usage: 
 *      wasabi.i3s.unice.fr/api/v1/animux_all/340
 * @apiVersion 1.0.0
 * @apiName GetSongsWithAnAnimuxField
 * @apiGroup Api/v1
 * @apiDescription This api return the first 200 songs documents for instance wasabi.i3s.unice.fr/api/v1/animux_all/120 will return all songs between [120 and 320[ 
 *                 <br>The field "animux_path" (String) is deprecated. Use the new field "animux_paths" (Array of String) instead.
 *
 * @apiParam {Number} start Where we want to start the extraction.
 *
 * @apiSuccessExample Success-Response for an artist:
    HTTP/1.1 200 OK
[{
    "_id": "5714dec325ac0d8aee38270d",
    "name": "ABBA",
    "position": 5,
    "lengthAlbum": "41:33",
    "urlSong": "http://lyrics.wikia.com/ABBA:Does_Your_Mother_Know",
    "lyrics": "You&apos;re so hot, teasing me So you&apos;re blue but I can&apos;t take a...",
    "urlWikipedia": "http://en.wikipedia.org/wiki/Does_Your_Mother_Know",
    "id_album": "5714debb25ac0d8aee34d9a0",
    "format": [
        "Single (music)"
    ],
    "genre": [
        "Disco",
        "Pop music",
        "Rock music"
    ],
    "producer": [
        "Benny Andersson",
        "Björn Ulvaeus"
    ],
    "recordLabel": [
        "Polar Music",
        "Epic Records"
    ],
    "writer": [
        "Björn Ulvaeus",
        "Benny Andersson"
    ],
    "recorded": [
        "--02-06"
    ],
    "abstract": "\"Does Your Mother Know\", (working title: \"I Can Do It\"), is a s",
    "releaseDate": [],
    "runtime": [
        "195.0"
    ],
    "award": [],
    "subject": [
        "European Hot 100 Singles number-one singles",
        "Polar Music singles"
    ],
    "isClassic": false,
    "title": "Does Your Mother Know",
    "publicationDateAlbum": "1979",
    "albumTitle": "Voulez-Vous",
    "deezer_mapping": [
        [
            1108951,
            "search-exact"
        ],
        [
            1108951,
            "youtubefgpt"
        ],
        [
            1113425,
            "youtubefgpt"
        ]
    ],
    "id_song_deezer": "1108951",
    "isrc": "SEAYD7901060",
    "length": "195",
    "explicitLyrics": false,
    "rank": "24",
    "bpm": "",
    "gain": "",
    "preview": "http://cdn-preview-a.deezer.com/stream/a28567a82ea0ad7668f138bdade4917c-7.mp3",
    "availableCountries": [],
    "publicationDate": "2008-12-08",
    "urlMusicBrainz": "",
    "urlPandora": "",
    "urlITunes": "",
    "urlSpotify": "",
    "urlYouTube": "WkL7Fkigfn8",
    "urlAmazon": "",
    "urlHypeMachine": "",
    "urlAllmusic": "",
    "urlGoEar": "",
    "urlLastFm": "",
    "multitrack_path": "",
    "multitrack_file": "",
    "language": "",
    "begin": "",
    "disambiguation": "",
    "end": "",
    "id_song_musicbrainz": "",
    "animux_path": "./mongo/animux/A/ABBA/Does Your Mother Know_Animux.txt",
    "animux_content": "#ARTIST:ABBA\n#TITLE:Does Your Mother Know\n#MP3:ABBA - Does Your Mother K..."
},{
    ANOTHER SONG OBJECT
}]
 * @apiError error isn't a number or is negative.
 * @apiErrorExample Error-Response:
    HTTP/1.1 404 Not Found
    {
        "error": "Page not found"
    }
 * @apiError error the database does not respond.
 * @apiErrorExample Error-Response internal error:
    HTTP/1.1 404 Not Found
    {
        "error": "An internal error occurred"
    }
 */

router.get('/animux_all/:start', apiV1Controller.get_animuxAll);


/**
 * @api {get} api/v1/artist/:fields/popularity Artist - Get fields by popularity
 * @apiExample Example usage: 
 *      wasabi.i3s.unice.fr/api/v1/artist/genres/popularity
 *      wasabi.i3s.unice.fr/api/v1/artist/genres/popularity?skip=2
 *      wasabi.i3s.unice.fr/api/v1/artist/genres/popularity?limit=10
 *      wasabi.i3s.unice.fr/api/v1/artist/genres/popularity?skip=2&limit=10
 * @apiVersion 1.0.0
 * @apiName GetArtistFieldsByPopularity
 * @apiGroup Api/v1

 * @apiParam {Number} fields {genres,labels,city,country,instrument}
 * @apiParam {Number} skip default = 0
 * @apiParam {Number} limit default = 20
 * @apiParam {Number} order default = 0
 * @apiSuccessExample Success-Response for an artist:
    HTTP/1.1 200 OK
    [
        {
            "_id": "Rock",
            "sum": 2161
        },
        {
            "_id": "Pop",
            "sum": 1856
            },
        {
            "_id": "Folk",
            "sum": 961
        }
    ]
 * @apiError error the database does not respond.
 * @apiErrorExample Error-Response internal error:
    HTTP/1.1 404 Not Found
    {
        "error": "An internal error occurred"
    }
 */
router.get('/artist/genres/popularity', apiV1Controller.get_artistGenresByPopularity);
router.get('/artist/labels/popularity', apiV1Controller.get_artistLabelsByPopularity);
router.get('/artist/city/popularity', apiV1Controller.get_artistCityByPopularity);
router.get('/artist/country/popularity', apiV1Controller.get_artistCountryByPopularity);
router.get('/artist/instrument/popularity', apiV1Controller.get_artistInstrumentByPropularity);

/**
 * @api {get} api/v1/artist/member/count/band Artist - Get members with the most bands
 * @apiExample Example usage: 
 *      wasabi.i3s.unice.fr/api/v1/artist/member/count/band
 *      wasabi.i3s.unice.fr/api/v1/artist/member/count/band?skip=2
 *      wasabi.i3s.unice.fr/api/v1/artist/member/count/band?limit=10
 *      wasabi.i3s.unice.fr/api/v1/artist/member/count/band?skip=2&limit=10
 * @apiVersion 1.0.0
 * @apiName GetArtistMemberWithMostBand
 * @apiGroup Api/v1

 * @apiParam {Number} skip default = 0
 * @apiParam {Number} limit default = 20
 * @apiSuccessExample Success-Response for an artist:
    HTTP/1.1 200 OK
    [
        {
            "_id": "8f8446bd-03f9-44a2-851f-2e2a29346bff",
            "sum": 21,
            "membername": "David Schmitt"
        },
        {
            "_id": "1ba97964-8d70-4b33-a361-d1a4ed222672",
            "sum": 20,
            "membername": "Josh Freese"
        },
        {
            "_id": "9f90d963-deca-4b74-ac3d-ae143e94d9e5",
            "sum": 17,
            "membername": "Nightswim"
        },
            {
            "_id": "ecb41014-1d7a-4987-a107-df49b2d8d77c",
            "sum": 14,
            "membername": "Chris Connelly"
        }
    ]
 * @apiError error the database does not respond.
 * @apiErrorExample Error-Response internal error:
    HTTP/1.1 404 Not Found
    {
        "error": "An internal error occurred"
    }
 */
router.get('/artist/member/count/band', apiV1Controller.get_artistMemberWithMostGroup);


/**
 * @api {get} api/v1/artist/count/album Artist - Get artist with the most albums
 * @apiExample Example usage: 
 *      wasabi.i3s.unice.fr/api/v1/artist/count/album
 *      wasabi.i3s.unice.fr/api/v1/artist/count/album?skip=2
 *      wasabi.i3s.unice.fr/api/v1/artist/count/album?limit=10
 *      wasabi.i3s.unice.fr/api/v1/artist/count/album?skip=2&limit=10
 * @apiVersion 1.0.0
 * @apiName GetArtistWithMostAlbum
 * @apiGroup Api/v1

 * @apiParam {Number} skip default = 0
 * @apiParam {Number} limit default = 20
 * @apiSuccessExample Success-Response for an artist:
    HTTP/1.1 200 OK
    [
        {
            "_id": "8f8446bd-03f9-44a2-851f-2e2a29346bff",
            "sum": 21,
            "membername": "David Schmitt"
        },
        {
            "_id": "1ba97964-8d70-4b33-a361-d1a4ed222672",
            "sum": 20,
            "membername": "Josh Freese"
        },
        {
            "_id": "9f90d963-deca-4b74-ac3d-ae143e94d9e5",
            "sum": 17,
            "membername": "Nightswim"
        },
        {
            "_id": "ecb41014-1d7a-4987-a107-df49b2d8d77c",
            "sum": 14,
            "membername": "Chris Connelly"
        }
    ]
 * @apiError error the database does not respond.
 * @apiErrorExample Error-Response internal error:
    HTTP/1.1 404 Not Found
    {
        "error": "An internal error occurred"
    }
 */
router.get('/artist/count/album', apiV1Controller.get_artistWithMostAlbum);
// router.get('/song/producer/popularity', apiV1Controller.get_songProducerByPropularity);
/**
 * @api {get} api/v1/song/lyrics/language/popularity Song - Get stats about lyrics languages
 * @apiExample Example usage: 
 *      wasabi.i3s.unice.fr/api/v1/song/lyrics/language/popularity
 * 
 * @apiVersion 1.0.0
 * @apiName GetStatsLang
 * @apiGroup Api/v1

 * @apiSuccessExample Success-Response for an artist:
    HTTP/1.1 200 OK
    [
        {
            "_id": "english",
            "sum": 1314052
        },
        {
            "_id": "spanish",
            "sum": 109569
        },
        {
            "_id": "german",
            "sum": 56075
        },
        {
            "_id": "french",
            "sum": 54824
        },
        {
            "_id": "italian",
            "sum": 50376
        }
    ]
 * @apiError error the database does not respond.
 * @apiErrorExample Error-Response internal error:
    HTTP/1.1 404 Not Found
    {
        "error": "An internal error occurred"
    }
 */
router.get('/song/lyrics/language/popularity', apiV1Controller.get_lyricsLanguageByPopularity);
/**
 * @api {get} api/v1/_stats/artist/count _stats - Get the number of occurrences of each fields in the artist collection
 * @apiExample Example usage: 
 *      wasabi.i3s.unice.fr/api/v1/_stats/artist/count
 * @apiVersion 1.0.0
 * @apiName GetStatsArtist
 * @apiGroup Api/v1
 *
 * @apiSuccessExample Success-Response for an artist:
    HTTP/1.1 200 OK
    [
        {
            "_id": "_id",
            "value": 77492
        },{
            "_id": "abstract",
            "value": 34373
        },{
            "_id": "animux_path",
            "value": 4847
        },{
            "_id": "deezerFans",
            "value": 52472
        }, {
            ...
        }
    ]
 * @apiError error the database does not respond.
 * @apiErrorExample Error-Response internal error:
    HTTP/1.1 404 Not Found
    {
        "error": "An internal error occurred"
    }
 */
router.get('/_stats/artist/count', apiV1Controller.get_statsArtistCount);
/**
 * @api {get} api/v1/_stats/album/count _stats - Get the number of occurrences of each fields in the album collection
 * @apiExample Example usage: 
 *      wasabi.i3s.unice.fr/api/v1/_stats/album/count
 * @apiVersion 1.0.0
 * @apiName GetStatsAlbum
 * @apiGroup Api/v1
 *
 * @apiSuccessExample Success-Response for an artist:
    HTTP/1.1 200 OK
    [
        {
            "_id": "_id",
            "value": 208743
        },{
            "_id": "barcode",
            "value": 29504
        },{
            "_id": "country",
            "value": 53734
        },{
            "_id": "cover",
            "value": 155410
        }, {
            ...
        }
    ]
 * @apiError error the database does not respond.
 * @apiErrorExample Error-Response internal error:
    HTTP/1.1 404 Not Found
    {
        "error": "An internal error occurred"
    }
 */
router.get('/_stats/album/count', apiV1Controller.get_statsAlbumCount);

/**
 * @api {get} api/v1/_stats/song/count _stats - Get the number of occurrences of each fields in the song collection
 * @apiExample Example usage: 
 *      wasabi.i3s.unice.fr/api/v1/_stats/song/count
 * @apiVersion 1.0.0
 * @apiName GetStatsSong
 * @apiGroup Api/v1
 *
 * @apiSuccessExample Success-Response for an artist:
    HTTP/1.1 200 OK
    [
        {
            "_id": "_id",
            "value": 2099287
        },{
            "_id": "abstract",
            "value": 72587
        },{
            "_id": "albumTitle",
            "value": 2099266
        },{
            "_id": "animux_content",
            "value": 22187
        }, {
            ...
        }
    ]
 * @apiError error the database does not respond.
 * @apiErrorExample Error-Response internal error:
    HTTP/1.1 404 Not Found
    {
        "error": "An internal error occurred"
    }
 */
router.get('/_stats/song/count', apiV1Controller.get_statsSongCount);

router.get('/artist/count/song', apiV1Controller.get_artistWithMostSong);

//==========================================================================================================================\\
//=========================================API REST POUR RECUPERER LA VERSION RDF D'UN ARTIST=======================================\\
//==========================================================================================================================\\
/**
 * @api {get} api/v1/get_rdf/:artistname Artist - Get rdf version of an artist
 * @apiExample Example usage: 
 *      wasabi.i3s.unice.fr/api/v1/get_rdf/Michael%20Jackson
 * @apiVersion 1.0.0
 * @apiName get_rdf
 * @apiGroup Api/v1
 * 
 * @apiParam {String} artistname Artist's name
 *
 * @apiSuccessExample Success-Response for an artist:
    HTTP/1.1 200 OK
    {
        "@context": {
            "mo": "http://purl.org/ontology/mo/",
            "dc": "http://purl.org/dc/elements/1.1/",
            "xsd": "http://www.w3.org/2001/XMLSchema#",
            "tl": "http://purl.org/NET/c4dm/timeline.owl#",
            "event": "http://purl.org/NET/c4dm/event.owl#",
            "foaf": "http://xmlns.com/foaf/0.1/",
            "rdfs": "http://www.w3.org/2000/01/rdf-schema#"
        },
        "rdf:type": "mo:MusicArtist",
        "foaf:name": "Michael Jackson",
        "foaf:homepage": "http://www.michaeljackson.com",
        "mo:activity_start": "1958-08-29",
        "mo:activity_end": "2009-06-25",
        "mo:Genre": [
            "Pop",
            "Soul",
            "Rock",
            "Disco",
            "New Jack Swing"
        ],
        "mo:discogs": "http://www.discogs.com/artist/15885",
        "mo:musicbrainz": "http://musicbrainz.org/artist/f27ec8db-af05-4f36-916e-3d57f91ecf5e",
        "mo:myspace": "https://myspace.com/michaeljackson",
        "mo:wikipedia": "http://en.wikipedia.org/wiki/Michael_Jackson",
        "mo:image": "http://api.deezer.com/artist/259/image",
        "vocab:alias": [
            "J.Jackson",
            "Jacko",
            "Jackson",
            "Jackson, Michael Joe",
            "Jaxson",
            "Just Michael",
            "M J",
            ...
        ],
        "mo:label": [
            "MJJ Music",
            "Steeltown Records",
            "Sony Music Entertainment",
            "Epic Records",
            "Legacy Recordings",
            "Motown"
        ],
        "mo:origin": [
            "United States",
            "Indiana",
            "Gary"
        ]
    }
 * @apiError error the database does not respond.
 * @apiErrorExample Error-Response internal error:
    HTTP/1.1 404 Not Found
    {
        "error": "An internal error occurred"
    }
 */
router.get('/get_rdf/:artistname', apiV1Controller.get_rdf);

export default router;