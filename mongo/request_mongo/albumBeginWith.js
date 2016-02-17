db.getCollection('artist').aggregate([ 
                {"$match": {"albums.titre": /^a/i}},
                // De-normalize le tableau pour s�p�rarer les documents
                {"$unwind": "$albums"},
                {"$match": {"albums.titre": /^a/i}},
                {"$project" : { "albumName" : "$albums.titre","name":1}},
            ])