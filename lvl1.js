export class lvl1 extends Phaser.Scene {

    constructor() {
        super("lvl1");
        this.player = null;
        this.canMove = false; // Variable de contrôle pour activer les mouvements du joueur
    }

    preload() {
        this.load.spritesheet('nikko', 'assets/characters/nikko.png',
        {frameWidth : 128, frameHeight : 256});
        //this.load.spritesheet('ennemi', 'assets/objects/ennemi.png',
        //{frameWidth: 128, frameHeight : 128});


        this.load.image('tileset', 'assets/objects/tileset.png');
        this.load.image('tilesetDecors', 'assets/objects/tilesetDecors.png');
        this.load.image('magatama', 'assets/objects/magatama.png');
        this.load.tilemapTiledJSON('map1', 'assets/maps/V1Lvl1.json');
        
    }

    create() {

        //Creation des variables
        this.player; //var player
        this.sanctuaire;
        this.magatama;
        this.gameOver = false;
        this.dbSaut = false;
        this.canClimb = false;
        this.changeLevel = false;

        const startZoomX = 4988;
        const endZoomX = 7040;
        const startZoomValue = 1;
        const endZoomValue = 1.5;
        const halfwayZoomPercentage = 0.5; // Zoom pour faire un effet

        // Load des maps/layers de maps    
        this.map1 = this.add.tilemap('map1');
        this.tileset = this.map1.addTilesetImage('tileset', 'tileset');
        this.tilesetDecors = this.map1.addTilesetImage('tilesetDecors', 'tilesetDecors');
        this.loin = this.map1.createLayer('loin', this.tilesetDecors);
        this.fond = this.map1.createLayer('fond', this.tilesetDecors);
        this.decors = this.map1.createLayer('decors', this.tilesetDecors);
        this.temple = this.map1.createLayer('temple', this.tilesetDecors);
        this.plateformes = this.map1.createLayer('Plateformes', this.tileset);
        this.plateformes.setCollisionByProperty({estSolid: true});

        //Créa perso
        this.player = this.physics.add.sprite(340, 3074, 'nikko');
        this.player.setCollideWorldBounds(true);
        this.player.body.setGravityY(1600);
        this.physics.add.collider(this.player, this.plateformes);

         // Empêche le joueur de bouger initialement
         this.player.setImmovable(true);
         this.player.body.moves = false;
 
         // Appel de la fonction displayCinematicText après un délai de 500ms
         this.time.delayedCall(500, this.displayCinematicText, [], this);
 
         // Activation des mouvements du joueur après 15 secondes
         this.time.delayedCall(15000, () => {
             this.canMove = true;
             this.player.setImmovable(false);
             this.player.body.moves = true;
         }, [], this);

        // résolution de l'écran
        this.physics.world.setBounds(0, 0, 10000, 5000);
        // PLAYER - Collision entre le joueur et les limites du niveau
        this.player.setCollideWorldBounds(true);

        // création de la caméra
        // taille de la caméra
        this.cameras.main.setSize(1920,1080);
        // faire en sorte que la caméra suive le personnage et qu'elle ne sorte pas de l'écran
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setDeadzone(100,100);
        //this.cameras.main.setBounds(0,0,4160,3456);

        //Mapping des touches
        this.interactButton = this.input.keyboard.addKey('E');
        this.cursors = this.input.keyboard.createCursorKeys();

        this.physics.world.setBounds(0, 0, 22000, 10000);
        this.cameras.main.setBounds(0, 0, 22800, 12800);
        this.cameras.main.startFollow(this.player);

        //this.cursors = this.input.keyboard.createCursorKeys();

        this.cursorsUp = this.input.keyboard.addKey('Z');
        this.cursorsLeft = this.input.keyboard.addKey('Q')
        this.cursorsRight = this.input.keyboard.addKey('D')
        this.cursorsDown = this.input.keyboard.addKey('S')
        this.interactButton = this.input.keyboard.addKey('E');

    }

    update() {

        const isPlayerTouchingDoor = this.physics.overlap(this.player, this.door);
        
         // Vérifiez si les mouvements du joueur sont autorisés avant de les gérer
         if (this.canMove) {
            // Gérez les mouvements du joueur
            if (this.cursorsLeft.isDown) {
                this.player.setVelocityX(-400);

            } else if (this.cursorsRight.isDown) {
                this.player.setVelocityX(400);

            } else {
                this.player.setVelocityX(0);
            }
    
        // Saut
        if (this.cursorsUp.isDown && this.player.body.blocked.down){
            console.log("SAUTE")
            this.player.setVelocityY(-675);
        }

    }

         // Collision avec le mur à gauche
         if (this.player.body.blocked.left || this.player.body.touching.left) {
            this.canClimb = true;
        } else if (this.player.body.blocked.right || this.player.body.touching.right) {
            // Collision avec le mur à droite
            this.canClimb = true;
        } else {
            // Aucune collision
            this.canClimb = false;
        }
        //Pour faire en sorte de rebondir sur le mur
        if (this.canClimb) {
            if (this.cursorsUp.isDown && !this.dbSaut) {
                // Définir la vitesse de montée
                this.player.setVelocityY(-700);
        
                // Désactiver la possibilité de sauter à nouveau pendant 1 seconde
                this.dbSaut = true;
                this.time.delayedCall(1000, () => {
                    this.dbSaut = false;
                });
            }
        }

        this.displayMagatamaImage();
        
        // Passer a un autre lvl
        if ( this.player.x > 18800){
            this.changedLevel();
        }

        //Petit effet zoom bien sympathique
        if (this.player.x > 4988 && this.player.x < 7040) {
            const startZoomX = 4988;
            const endZoomX = 7040;
            const startZoomValue = 1;
            const endZoomValue = 0.75;
        
            const zoomPercentage = (this.player.x - startZoomX) / (endZoomX - startZoomX);
            const zoomValue = startZoomValue + (endZoomValue - startZoomValue) * zoomPercentage;
        
            this.cameras.main.setZoom(zoomValue);
        } else if (this.player.x >= 7040 && this.player.x < 17533) {
            this.cameras.main.setZoom(1); // Zoom fixe à 0.75 entre 7040 et 17533
        } else if (this.player.x >= 17533) {
            const startZoomX = 17533;
            const endZoomX = 22800;
            const startZoomValue = 1;
            const endZoomValue = 0.75;
        
            const zoomPercentage = (this.player.x - startZoomX) / (endZoomX - startZoomX);
            const zoomValue = startZoomValue + (endZoomValue - startZoomValue) * zoomPercentage;
        
            this.cameras.main.setZoom(zoomValue);
        } else {
            this.cameras.main.setZoom(1); // Réinitialise le zoom à la valeur par défaut
        }


        if (this.cinematicText) {
            this.cinematicText.setPosition(this.player.x, this.player.y - 178);
        }
        
    }

    

    changedLevel(){
        this.scene.start("lvl2");
    }

    displayMagatamaImage() {
        // Supprime les images de magatama existantes
        this.magatamaImages?.forEach((image) => image.destroy());
        this.magatamaImages = [];

        // Affiche l'image correspondante à nombreMagatama
        for (let i = 0; i < this.nombreMagatama; i++) {
            const magatamaImage = this.add
                .image(55 + i * 32, 105, `${i + 1}_maga`)
                .setScale(1)
                .setScrollFactor(0);
            this.magatamaImages.push(magatamaImage);
        }
    }

    displayCinematicText() {
        const phrases = [
            "Qu'est-ce que...",
            "Prêtre Asuma ? Il y a quelqu'un ?",
            "Je dois aller voir ce qu'il se passe..."
        ];
    
        let phraseIndex = 0;
    
        const displayNextPhrase = () => {
            if (phraseIndex >= phrases.length) {
                // Toutes les phrases ont été affichées, terminer la fonction
                return;
            }
    
            const currentPhrase = phrases[phraseIndex];
    
            // Création du texte
            this.cinematicText = this.add.text(this.player.x, this.player.y - 528, currentPhrase, {
                fontSize: "24px",
                fontFamily: "Arial",
                color: "#ffffff",
                backgroundColor: "#000000",
                padding: {
                    x: 16,
                    y: 8
                }
            }).setOrigin(0.5);
    
            // Animation du texte
            this.tweens.add({
                targets: this.cinematicText,
                y: this.player.y - 200,
                ease: 'Power1',
                duration: 8000,
                onComplete: () => {
                    this.cinematicText.destroy();
                    this.cinematicText = null;
                    phraseIndex++; // Passer à la phrase suivante
                    displayNextPhrase(); // Afficher la phrase suivante
                }
            });
    
            // Effet de tremblement de l'écran pour la première phrase seulement
            if (phraseIndex === 0) {
                const shakeDuration = 800; // Durée du tremblement (en millisecondes)
                const shakeIntensity = 0.004; // Intensité du tremblement (en pixels)
    
                this.cameras.main.shake(shakeDuration, shakeIntensity);
            }
        };
    
        displayNextPhrase();
    }

}
    