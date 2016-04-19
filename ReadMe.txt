1-
2-Lancer le serveur
	2.1 - cd C:/Users/user/Documents/wasabi_project
	2.2 - node bin/www
	2.3 - le serveur est maintenant lanc� sur http://localhost (dans le navigateur)
3 - 
4-Pour recuperer l'ensemble des paroles clicker sur le bouton EXTRACTION OF LYRICS
5-Pour recuperer les donnees relatives au texte et les enregistrer dans le local Storage clicker sur le bouton EXTRACTION OF BABEL'S DATA
6-Pour afficher les donnees clicker sur le bouton SHOW EXTRACTED INFORMATIONS
7-
8-


Architecture :

--bin/
----www
	#Permet de lancer l'application



--mongo/
----backup_mongo/
	#Contient les dumps de l'application
	#Le dump courant s'appel "dump", les anciens dumps : "dump_old_X" le dump_old_1 sera plus ancien que le dump_old_2
	#Cr�er un dump de la base de donn�es : 
		#assurez-vous que mongodb est actif -> commande mongod en console ayant �t� effectu�
		#rendez-vous dans le r�pertoire des dumps en ligne de commande 
		#changer le nom du dossier appel� "dump" pour l'appeler "dump_old_x+1" 
		#lancer la commande mongodump, un dossier dump sera cr�e 
----backup_mongo/
	#contient des requ�tes utiles
	#si la base de donn�es est recr�e de z�ro elle contiendra:
		#Une collection artist contenant des documents repr�sentant un artiste avec leurs albums et leurs musiques, il faudra donc lancer :
			#1- le fichier FindSameDocument.js dans mongo afin de trouver les documents en double (ayant le m�me nom d'artist) dans la base de donn�es
				#Il y aura toujours des documents en double dans la base de donn�es une fois celle-ci cr�e 
				#car lors de l'extraction  sur le site de lyrics wikia certains artistes �taient pr�sents plusieurs fois
				#Supprimer alors un des deux documents apparaissant en double
			#2- le fichier ConstructBDAfterCreate.js dans mongodb afin de cr�er : 
				#-une collection artist contenant uniquement les informations relatives � l'artiste (sans le champs album)
				#-une collection album contenant les informations relatives � l'album
				#-une collection song contenant les informations relatives � la musique
				#-Les index des collections artist, album et song
			#3- le fichier WordCount_Artist.js faisant le word count des lyrics pour chaque artist (~3 heures d'�xecution)(afin de voir les termes les plus utilis�s par un artiste)
			#4- le fichier WordCount_Album.js faisant le word count des lyrics pour chaque album (~10 heures d'�xecution) (afin de voir les termes les plus utilis�s dans un album)
			#5- le fichier WordCount_Song.js faisant le word count des lyrics pour chaque song (afin de voir les termes les plus utilis�s dans une musique)
			#6- le fichier RefArtistInSong.js permettant d'ajouter une r�f�rence d'artiste dans un document album(~2 minutes)
			#7- le fichier RefAlbumInSong.js permettant dajouter une r�f�rence d'album dans un document song(~20 minutes)
			#8- le fichier CreateSearchField.js permettant de cr�er le champs sur lequel sera effectu�e la recherche (~10 minutes)

--node_modules/
	#Contient les modules install�s dans node js. exemple :le module require('express') sera dans ce r�pertoire



--public/
----bower-components/
	#Composant t�l�charg� afin de les utiliser dans l'application
----img/
	#Les images du projet
----javascripts/
	#Code javascript des pages html
----my_components/
	#Composant cr�e pour �tre utilis� dans l'application
----stylesheets/
	#Code css des pages html



--routes/
	#Contient la d�finition des routes support�es par l'application. C'est ici que se situe la partie REST
----conf/
------conf.json
	#Fichier de configuration permettant  de ne pas re�crire les donn�es redondante dans l'application
----handler/
------xxxx.js
	#Contient la logique applicative � appliquer lors de requ�tes sur les routes. 



--app.js
	#C'est le fichier qui sera appel� par la commande node bin/www. C'est ici qu'on appellera les nouvelles routes de l'application et 
        #qu'on configurera certaines parties de l'application



--package.json
	#Fichier d�crivant l'application



