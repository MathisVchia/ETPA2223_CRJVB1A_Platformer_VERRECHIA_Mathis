export class lvl1 extends Phaser.Scene {

    constructor() {
        super("lvl1");
        this.player = null;
        this.canMove = false; // Variable de contrôle pour activer les mouvements du joueur
    }

    preload() {
        //this.load.spritesheet('nikko', 'assets/characters/nikko.png',
        //{frameWidth : 128, frameHeight : 256});
        this.load.spritesheet('nikko', 'assets/characters/nikkoWalking.png',
            {frameWidth : 128, frameHeight : 256});
        this.load.spritesheet('nikkoL', 'assets/characters/nikkoWalkingL.png',
            {frameWidth : 128, frameHeight : 256});
        this.load.spritesheet('nikkoJump', 'assets/characters/nikkoJump.png',
            {frameWidth : 128, frameHeight : 256});
        //this.load.spritesheet('ennemi', 'assets/objects/ennemi.png',
        //{frameWidth: 128, frameHeight : 128});

        //background
        this.load.image('ciel', 'assets/bg/ciel1.png');
        this.load.image('ciel2', 'assets/bg/ciel2.png');
        this.load.image('fuji1', 'assets/bg/fuji1.png');
        this.load.image('fuji2', 'assets/bg/fuji2.png');
        this.load.image('mont1', 'assets/bg/mont1.png');
        this.load.image('mont2', 'assets/bg/mont2.png');

        this.load.image('tileset', 'assets/objects/tileset.png');
        this.load.image('tilesetDecors', 'assets/objects/tilesetDecors.png');
        this.load.image('magatama', 'assets/objects/magatama.png');
        this.load.audio('music', 'assets/objects/music.mp3');
        this.load.audio('boom', 'assets/objects/boom.mp3');
        this.load.audio('foot', 'assets/objects/foot.mp3');
        this.load.audio('jump', 'assets/objects/jump.mp3');
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
/*
        // affichage du background
        this.backgroundParallax1 = this.add.tileSprite(0,0,9600,5120, "ciel");
        this.backgroundParallax1.setOrigin(0,0);
        this.backgroundParallax1.setScrollFactor(1,1);
        this.backgroundParallax2 = this.add.tileSprite(5120,0,9600,5120, "ciel2");
        this.backgroundParallax2.setOrigin(0,0);
        this.backgroundParallax2.setScrollFactor(1,1);

        this.backgroundParallax3 = this.add.tileSprite(0,0,9600,5120, "fuji1");
        this.backgroundParallax3.setOrigin(0,0);
        this.backgroundParallax3.setScrollFactor(1,1);
        this.backgroundParallax4 = this.add.tileSprite(5120,0,9600,5120, "fuji2");
        this.backgroundParallax4.setOrigin(0,0);
        this.backgroundParallax4.setScrollFactor(1,1);

        this.backgroundParallax5 = this.add.tileSprite(0,0,9600,5120, "mont1");
        this.backgroundParallax5.setOrigin(0,0);
        this.backgroundParallax5.setScrollFactor(1,1);
        this.backgroundParallax6 = this.add.tileSprite(5120,0,9600,5120, "mont2");
        this.backgroundParallax6.setOrigin(0,0);
        this.backgroundParallax6.setScrollFactor(1,1);
*/


        // Load des maps/layers de maps    
        this.map1 = this.add.tilemap('map1');
        this.tileset = this.map1.addTilesetImage('tileset', 'tileset');
        this.tilesetDecors = this.map1.addTilesetImage('tilesetDecors', 'tilesetDecors');
        this.loin = this.map1.createLayer('loin', this.tilesetDecors);
        this.loin.setScrollFactor(0.995,1);
        this.fond = this.map1.createLayer('fond', this.tilesetDecors);
        this.decors = this.map1.createLayer('decors', this.tilesetDecors);
        this.temple = this.map1.createLayer('temple', this.tilesetDecors);
        this.plateformes = this.map1.createLayer('Plateformes', this.tileset);
        this.plateformes.setCollisionByProperty({estSolid: true});

        // Ajouter la musique et la jouer en boucle
        this.music = this.sound.add('music', { loop: true });
        this.music.play();
        this.music.setVolume(0.1);

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


        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('nikko', {start : 0 , end : 37}),
            frameRate: 32,
            repeat:-1
        });

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('nikkoL', {start : 0 , end : 37}),
            frameRate: 32,
            repeat:-1
        });

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('nikko', {start : 29 , end : 29}),
            frameRate: 32,
            repeat:-1
        });
        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('nikkoJump', {start : 0 , end : 37}),
            frameRate: 32,
            repeat:-1
        });


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
                this.player.anims.play('left', true);
                this.player.setVelocityX(-375);
                

            } else if (this.cursorsRight.isDown) {
                this.player.anims.play('right', true);
                this.player.setVelocityX(375);

            } else {
                this.player.setVelocityX(0);
                this.player.anims.play('idle', true);
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
        this.music.stop();
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
                this.music2 = this.sound.add('boom');
                this.music2.play();
                this.music2.setVolume(0.8);
                const shakeDuration = 800; // Durée du tremblement (en millisecondes)
                const shakeIntensity = 0.004; // Intensité du tremblement (en pixels)
    
                this.cameras.main.shake(shakeDuration, shakeIntensity);
            }
        };
    
        displayNextPhrase();
    }

}
    