1-
2-Lancer le serveur
	2.1 - node ./bin/www
3-http://localhost:3000/ (dans le navigateur)
4-Pour recuperer l'ensemble des paroles clicker sur le bouton EXTRACTION OF LYRICS
5-Pour recuperer les donnees relatives au texte et les enregistrer dans le local Storage clicker sur le bouton EXTRACTION OF BABEL'S DATA
6-Pour afficher les donnees clicker sur le bouton SHOW EXTRACTED INFORMATIONS
7-
8-


Architecture :

--bin/
----www
	#Permet de lancer l'application, li� avec le fichier package.json propri�t� start:"node ./bin/www"
--node_modules/
	#Contient les modules install�s dans node js. exemple :le module require('express') sera dans ce r�pertoire
--routes/
	#Contient la d�finition des routes support�es par l'application.
----conf/
------conf.json
	#Fichier de configuration permettant  de ne pas re�crire les donn�es redondante dans l'application
----handler/
------codesMetiers.js
	#Contient la logique applicative � appliquer lors de requ�tes sur les routes. 
--view/
	#Contientre les mod�les de vues (templates) servant � produire les pages html. 
--app.js
	#Permet de lancer l'application, li� avec le fichier package.json propri�t� main:"/lib/app.js"
--package.json
	#Fichier d�crivant l'application

--public/
----images
	#Les images du projet
----javascripts
	#Code javascript des pages html
----libraries
	#Les differentes libraries
----stylesheets
	#Code css des pages html