db.getCollection('artist').aggregate([ 
                {"$match": {"$and":[ {"name":"Aerosmith"},{"albums.titre":"Aerosmith"},{"albums.songs.titre":"Write Me A Letter"}]}   },
                // De-normalize le tableau pour s�p�rarer les documents
                {"$unwind": "$albums"},
                {"$unwind": "$albums.songs"},
                {"$match": {"$and":[ {"name":"Aerosmith"},{"albums.titre":"Aerosmith"},{"albums.songs.titre":"Write Me A Letter"}]}   },
            ])