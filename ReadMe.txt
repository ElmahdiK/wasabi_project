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
		#Une collection artist contenant des documents repr�sentant un artiste avec ses albums et ses musiques, il faudra donc lancer :
		#1- le fichier findSameDocument.js afin de trouver les documents en double (ayant le m�me nom d'artist) dans la base de donn�es
			#Il y aura toujours des documents en double dans la base de donn�es une fois celle-ci cr�e
			#car lors de l'extraction  sur le site de lyrics wikia certains artistes �taient pr�sent 2 fois
			#Supprimer alors un des deux documents apparaissant en double
		#2- le fichier constructBDAfterCreate.js dans mongodb afin de cr�er : une collection artist sans albums, une colelction song et album ainsi que leurs index



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



