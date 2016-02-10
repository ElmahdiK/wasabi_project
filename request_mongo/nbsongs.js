db.getCollection('artist').aggregate([ 
                {"$match": {"albums.songs.titre": {$exists : true}}},
                // De-normalize le tableau pour s�p�rarer les documents
                {"$unwind": "$albums"},
                {"$unwind": "$albums.songs"},
                {"$match": {"albums.songs.titre": {$exists : true}}},
                {"$project" : { "albums.songs.titre" : 1,"name":1}},
            ])