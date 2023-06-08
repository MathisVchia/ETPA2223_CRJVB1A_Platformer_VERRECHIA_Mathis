export class lvl2 extends Phaser.Scene {

    constructor() {
        super("lvl2");
    }

    preload() {
        this.load.spritesheet('nikko', 'assets/characters/nikkoWalking.png',
            {frameWidth : 128, frameHeight : 256});
        this.load.spritesheet('nikkoL', 'assets/characters/nikkoWalkingL.png',
            {frameWidth : 128, frameHeight : 256});
        this.load.spritesheet('renard', 'assets/characters/renard.png',
            { frameWidth: 256, frameHeight: 128 });
        this.load.spritesheet('clef', 'assets/objects/clef.png',
            { frameWidth: 128, frameHeight: 128 });
        this.load.spritesheet('porte', 'assets/objects/porte.png',
            { frameWidth: 256, frameHeight: 768 });
        this.load.spritesheet('porteOuverte', 'assets/objects/porteOuverte.png',
            { frameWidth: 640, frameHeight: 768 });
        this.load.spritesheet('sanctuaire', 'assets/objects/sanctuaire.png',
            { frameWidth: 128, frameHeight: 128 });
        this.load.image('ennemiPetit', 'assets/characters/ennemiPetit.png');
        this.load.image('ennemiGrand', 'assets/characters/ennemiGrand.png');

        //background
        this.load.image('ciel', 'assets/bg/ciel1.png');
        this.load.image('ciel2', 'assets/bg/ciel2.png');
        this.load.image('fuji1', 'assets/bg/fuji1.png');
        this.load.image('fuji2', 'assets/bg/fuji2.png');
        this.load.image('mont1', 'assets/bg/mont1.png');
        this.load.image('mont2', 'assets/bg/mont2.png');

        this.load.image('tileset', 'assets/objects/tileset.png');
        this.load.image('tilesetDecors', 'assets/objects/tilesetDecors.png');
        this.load.image('0_maga', 'assets/objects/0_maga.png');
        this.load.image('1_maga', 'assets/objects/1_maga.png');
        this.load.image('2_maga', 'assets/objects/2_maga.png');
        this.load.image('3_maga', 'assets/objects/3_maga.png');
        this.load.image('4_maga', 'assets/objects/4_maga.png');
        this.load.image('5_maga', 'assets/objects/5_maga.png');
        this.load.audio('music', 'assets/objects/music.mp3');
        this.load.tilemapTiledJSON('map2', 'assets/maps/V1Lvl2.json');
    }

    create() {
        this.player;
        this.renard;
        this.clef;
        this.porte;
        this.sanctuaire;
        this.ennemi;
        this.magatama;
        this.renard = null;
        this.gameOver = false;
        this.hasKey = false;
        this.dbSaut = false;
        this.canClimb = false;
        this.actionExecuted = false;
        this.doubleJumpAvailable = false;
        this.debutJeu = false;

        this.nombreMagatama = 0;
        this.nombreSauvegarde = 0;

        //variable ennemis
        this.ennemisPetitGroup;
        this.ennemisGrandGroup;

        /*
        // affichage du background
        this.backgroundParallax1 = this.add.tileSprite(0,0,9600,5120, "ciel");
        this.backgroundParallax1.setOrigin(0,0);
        this.backgroundParallax1.setScrollFactor(1,1);
        this.backgroundParallax2 = this.add.tileSprite(5120,0,9600,5120, "ciel2");
        this.backgroundParallax2.setOrigin(0,0);
        this.backgroundParallax2.setScrollFactor(1,1);
        this.backgroundParallax3 = this.add.tileSprite(10240,0,9600,5120, "ciel2");
        this.backgroundParallax3.setOrigin(0,0);
        this.backgroundParallax3.setScrollFactor(1,1);

        this.backgroundParallax5 = this.add.tileSprite(0,0,9600,5120, "mont1");
        this.backgroundParallax5.setOrigin(0,0);
        this.backgroundParallax5.setScrollFactor(1,1);
        this.backgroundParallax6 = this.add.tileSprite(5120,0,9600,5120, "mont2");
        this.backgroundParallax6.setOrigin(0,0);
        this.backgroundParallax6.setScrollFactor(0.9 ,1);
        */

        this.map2 = this.add.tilemap('map2');
        this.tileset = this.map2.addTilesetImage('tileset', 'tileset');
        this.tilesetDecors = this.map2.addTilesetImage('tilesetDecors', 'tilesetDecors');
        this.loin = this.map2.createLayer('loin', this.tilesetDecors);
        this.loin.setScrollFactor(0.995,1);
        this.fond = this.map2.createLayer('fond', this.tilesetDecors);
        this.decors = this.map2.createLayer('decors', this.tilesetDecors);
        this.plateformes2 = this.map2.createLayer('plateformes', this.tileset);

        // Ajouter la musique et la jouer en boucle
        this.music = this.sound.add('music', { loop: true });
        this.music.play();
        this.music.setVolume(0.1);

        this.plateformes2.setCollisionByProperty({ estSolid: true });

        this.player = this.physics.add.sprite(112, 2544, 'nikko');
        this.player.setCollideWorldBounds(true);
        this.player.body.setGravityY(1650);

        this.renard = this.physics.add.sprite(4800, 3515, 'renard');
        this.renard.setCollideWorldBounds(true);

        this.clef = this.physics.add.sprite(7678, 4292, 'clef');
        this.clef.setCollideWorldBounds(true);

        this.sanctuaire = this.physics.add.sprite(14460, 3719, 'sanctuaire');
        this.sanctuaire.setCollideWorldBounds(true);
        this.sanctuaire.body.setImmovable(true);

        this.porte = this.physics.add.sprite(11848, 2559, 'porte');
        this.porte.setCollideWorldBounds(true);
        this.porte.body.setImmovable(true);

        this.magatamaImages = this.add.image(1000, 250, "0_maga").setScrollFactor(0);

        // TILED - load calque objet utilisés dans Tiled (pour des monstres, par exemple)
        this.ennemiPetit = this.physics.add.group();

        this.MobsPetit = this.map2.getObjectLayer('ennemiPetit');
        this.MobsPetit.objects.forEach(MobsPetit => {
            this.MobsPetit_create = this.physics.add.sprite(MobsPetit.x + 85, MobsPetit.y + 70, 'ennemiPetit');
            this.ennemiPetit.add(this.MobsPetit_create);
        });

        // TILED - load calque objet utilisés dans Tiled (pour des monstres, par exemple)
        this.ennemiGrand = this.physics.add.group();

        this.MobsGrand = this.map2.getObjectLayer('ennemiGrand');
        this.MobsGrand.objects.forEach(MobsGrand => {
            this.MobsGrand_create = this.physics.add.sprite(MobsGrand.x + 110, MobsGrand.y + 150, 'ennemiGrand');
            this.ennemiGrand.add(this.MobsGrand_create);
        });

        this.physics.add.collider(this.player, this.plateformes2);
        this.physics.add.collider(this.player, this.ennemiGrand, this.mort, null, this);
        this.physics.add.collider(this.player, this.ennemiPetit, this.mort, null, this);
        this.physics.add.collider(this.clef, this.plateformes2);
        this.physics.add.collider(this.renard, this.porte);

        // Créer le texte au-dessus du renard
        this.interactText = this.add.text(this.renard.x, this.renard.y - 150, 'E', { font: '24px Arial', fill: '#ffffff' });
        this.interactText.setOrigin(0.5);
        this.interactText.setVisible(false);

        // résolution de l'écran
        this.physics.world.setBounds(0, 0, 10000, 5000);
        // PLAYER - Collision entre le joueur et les limites du niveau
        this.player.setCollideWorldBounds(true);

        // création de la caméra
        // taille de la caméra
        this.cameras.main.setSize(1920, 1080);
        // faire en sorte que la caméra suive le personnage et qu'elle ne sorte pas de l'écran
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setDeadzone(100, 100);
        //this.cameras.main.setBounds(0,0,4160,3456);

        this.physics.add.overlap(this.player, this.renard, this.recrute.bind(this));
        this.interactButton = this.input.keyboard.addKey('E');

        this.cursors = this.input.keyboard.createCursorKeys();

        this.physics.world.setBounds(0, 0, 22000, 10000);
        this.cameras.main.setBounds(0, 0, 22800, 12800);
        this.cameras.main.startFollow(this.player);

        //this.cursors = this.input.keyboard.createCursorKeys();

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
            key: 'renard',
            frames: this.anims.generateFrameNumbers('renard', {start : 0 , end : 24}),
            frameRate: 32,
            repeat:-1
        });


        this.cursorsUp = this.input.keyboard.addKey('Z');
        this.cursorsLeft = this.input.keyboard.addKey('Q');
        this.cursorsRight = this.input.keyboard.addKey('D');
        this.cursorsDown = this.input.keyboard.addKey('S');
        this.interactButton = this.input.keyboard.addKey('E');
        this.SPACE = this.input.keyboard.addKey('SPACE');
        console.log(this.magatama);
    }

    update() {
        const isPlayerTouchingDoor = this.physics.overlap(this.player, this.door);

       // console.log(this.nombreMagatama);
        // ajout des moyens de déplacement du personnage
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
            //this.player.anims.play('jump', true);
        }

        //Ajouter les images
        if (this.nombreMagatama == 0){
            this.magatamaImages.setTexture("0_maga");
        }
        if (this.nombreMagatama == 1){
            this.magatamaImages.setTexture("1_maga");
        }
        if (this.nombreMagatama == 2){
            this.magatamaImages.setTexture("2_maga");
        }
        if (this.nombreMagatama == 3){
            this.magatamaImages.setTexture("3_maga");
        }
        if (this.nombreMagatama == 4){
            this.magatamaImages.setTexture("4_maga");
        }
        if (this.nombreMagatama == 5){
            this.magatamaImages.setTexture("5_maga");
        }

        const isPlayerTouchingRenard = this.physics.overlap(this.player, this.renard);
        if (isPlayerTouchingRenard) {
            this.interactText.setVisible(true);
        } else {
            this.interactText.setVisible(false);
        }
        

        // Vérifie si le joueur est proche du renard et si le bouton d'interaction a été pressé
        const distanceToRenard = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.renard.x, this.renard.y);
        if (distanceToRenard < 150 && this.interactButton.isDown && !this.renardIsFollowing) {
            this.recruterRenard();
            this.renardIsFollowing = true;
        }


        // Si le renard suit déjà le joueur, met à jour sa position pour qu'il reste derrière le joueur
        if (this.renardIsFollowing) {
            const targetX = this.player.x - 150;
            const targetY = this.player.y - 128;

            const deltaX = targetX - this.renard.x;
            const deltaY = targetY - this.renard.y;

            const speed = 240;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            if (distance > 1) {
                const moveX = (deltaX / distance) * speed;
                const moveY = (deltaY / distance) * speed;

                this.renard.setVelocity(moveX, moveY);
                this.renard.anims.play('renard', true);
            } else {
                this.renard.setVelocity(0, 0);
            }
        }

        // Ajoute un événement de clic pour donner l'ordre au renard de se rendre à un endroit précis avec la souris
        this.input.on('pointerdown', this.donnerOrdreRenard, this);
        //console.log(this.renard.y);

        // Ajout de la collision entre le renard et la clef
        this.physics.add.overlap(this.renard, this.clef, () => {
            console.log("ddjs")
            this.collectKey();
        });

        // Ajout collision entre joueur et la porte
        this.physics.add.collider(this.player, this.porte, () => {
            if (this.hasKey === true) {
                console.log("TU TOUCHE")
                this.openDoor();
            };
            });
        
        

        // Ajout collision joueur sanctuaire
        this.physics.add.overlap(this.player, this.sanctuaire, () => {
            if (this.renardIsFollowing) {
                // Détruit le renard actuel
                this.renard.destroy();
                console.log("SANCTUTU")
                this.nombreMagatama++;
                console.log(this.nombreMagatama);
                this.nombreSauvegarde++;
                this.debutJeu = true;

                const text = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "Texte à afficher", {
                    font: "24px Arial",
                    fill: "#ffffff"
                });
                text.setOrigin(0.5);

                this.time.delayedCall(5000, () => {
                    text.destroy(); // Supprime le texte après 5 secondes
                });


                // Ajoutez une fonction pour générer une position aléatoire autour du sanctuaire
                function getRandomPositionAroundSanctuaire() {
                    const offsetX = Phaser.Math.Between(-100, 100); // Offset horizontal aléatoire
                    const offsetY = Phaser.Math.Between(-100, 100); // Offset vertical aléatoire
                    const renardX = this.sanctuaire.x + offsetX;
                    const renardY = this.sanctuaire.y + offsetY;
                    return { x: renardX, y: renardY };
                }

                // Recrée le renard à une position aléatoire autour du sanctuaire
                const initialPosition = getRandomPositionAroundSanctuaire.call(this);
                this.renard = this.physics.add.sprite(initialPosition.x, initialPosition.y, 'renard');

                // Active les mouvements du renard pour qu'il flotte autour du sanctuaire
                this.renardIsFollowing = true;
                this.physics.add.collider(this.renard, this.sanctuaire, this.handleRenardSanctuaireCollision, null, this);

                // Crée un tween pour le mouvement fluide et aléatoire du renard
                this.renardTween = this.tweens.add({
                    targets: this.renard,
                    x: () => {
                        const position = getRandomPositionAroundSanctuaire.call(this);
                        return position.x;
                    },
                    y: () => {
                        const position = getRandomPositionAroundSanctuaire.call(this);
                        return position.y;
                    },
                    ease: 'Sine.easeInOut',
                    duration: 2000, // Durée de l'animation en millisecondes
                    yoyo: true,
                    repeat: -1 // Répétition infinie
                });

                // Réinitialise la variable renardIsFollowing
                this.renardIsFollowing = false;
            }
        });

        //console.log(this.doubleSautAutorise)
        if (this.nombreMagatama > 0) {
            this.gainSaut()
        };


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

        // Vérifie si l'action n'a pas encore été réalisée
        if (!this.actionExecuted && this.player.x >= 2742) {
            this.cinematic1()

        };

        if (this.player.x > 16930) {
            this.music.stop();
            this.changedLevelVillage();
        }
    }

    recruterRenard() {

        // Le reste du code de la fonction...

        // Vérifie si un renard existe déjà
        this.nombreRenardsLivrés++;
        if (this.renard) {
            // Détruit le renard actuel
            this.renard.destroy();
            console.log("CHELOU TOUT CA")
        }

        // Crée un nouveau sprite de renard derrière le joueur
        this.renard = this.physics.add.sprite(this.player.x - 150, this.player.y - 128, 'renard');
        //this.physics.add.collider(this.renard, this.plateformes);
        this.renard.body.setAllowGravity(false);


        // Ajoute un comportement de suivi du joueur
        this.renard.body.setCollideWorldBounds(true);
        this.renard.setBounce(0.2);

        // Met à jour la position du renard à chaque frame pour qu'il reste derrière le joueur
        this.update = () => {
            const targetX = this.player.x - 150;
            const targetY = this.player.y - 128;

            const deltaX = targetX - this.renard.x;
            const deltaY = targetY - this.renard.y;

            const speed = 200;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            if (distance > 1) {
                const moveX = (deltaX / distance) * speed;
                const moveY = (deltaY / distance) * speed;

                this.renard.setVelocity(moveX, moveY);
            } else {
                if (this.player.velocity == 0) {
                    this.renard.setVelocity(0, 0);
                    console.log("OK")
                };
            }
        }
    }

    donnerOrdreRenard(pointer) {
        if (this.renardIsFollowing) {
            // Arrête le renard et désactive le suivi du joueur
            this.renardIsFollowing = false;
            this.renard.setVelocity(0, 0);
            this.physics.moveTo(this.renard, pointer.worldX, pointer.worldY, 200);
            this.zoneA = pointer.worldX;
            this.zoneB = pointer.worldY;

            // Vérifie si le renard a atteint les coordonnées du pointer
            this.time.addEvent({
                delay: 100,
                callback: () => {
                    const distanceToPointer = Phaser.Math.Distance.Between(this.renard.x, this.renard.y, this.zoneA, this.zoneB);
                    if (distanceToPointer < 10) {
                        // Arrête le renard
                        this.renard.setVelocity(0, 0);
                        this.renardIsFollowing = true;
                        this.physics.moveTo(this.renard, this.player.x - 150, this.player.y - 128, 200);
                    }
                },
                loop: true
            });

            if (this.interactButton.isDown) {
                this.recrute();
                console.log("recrute")
            }

            if (this.renard.followingPlayer) {
                this.renard.body.velocity.x = this.player.body.velocity.x;
                this.renard.body.velocity.y = this.player.body.velocity.y;
            }

        }
    }


    recrute() {
        const distance = Phaser.Math.Between(this.player.x, this.renard.x);
        console.log(distance)

        if (distance < 44000) {
            this.renard.followingPlayer = true;
        }
    }

    collectKey() {
        // Détecter la collision entre le renard et la clef
        this.physics.add.overlap(this.renard, this.clef, () => {
            // Faire disparaître la clef
            this.clef.destroy();

            // Stocker la clef dans l'inventaire
            this.hasKey = true;
            console.log("TU AS LA CLEF");
        });
    }

    openDoor() {
        //Détecter si le joueur possède la clef
        console.log("SESAME OUVRE TOI")
        this.porte.setTexture("porteOuverte");
        this.hasKey = false;
    }

    recommencerNiveau() {
        // Si le renard suit encore le joueur, le faire disparaitre
        if (this.renardIsFollowing) {
            this.renardIsFollowing = false;
        }

        // Recommencer le niveau "lvl1"
        this.scene.start("lvl2");
    }


    gainSaut() {
        // Vérifier si le double saut est activé
        if ((this.nombreMagatama > 0) && !this.player.body.blocked.down) {
            // Vérifier si le joueur n'est pas en train de toucher le sol et la touche "cursors.up" est enfoncée
            if (Phaser.Input.Keyboard.JustDown(this.SPACE)) {
                //console.log("Saut effectué.");
                // Appliquer une vélocité vers le haut pour le double saut
                console.log("POUFPIF")
                this.player.setVelocityY(-725);
                this.nombreMagatama--;

            } else {
                //console.log("Double saut déjà utilisé ou le joueur est au sol.");
            }
        }
    }
    cinematic1() {
        // Bloque les mouvements du joueur
        this.player.setImmovable(true);
    
        // Coordonnées du point demandé
        const targetX = 4800;
        const targetY = 3530;
    
        // Déplace la caméra vers les coordonnées spécifiées pendant 3 secondes
        this.cameras.main.pan(targetX, targetY, 3000, 'Sine.easeInOut', false, () => {
    
            // Après quelques secondes, revient à la caméra sur le joueur et débloque ses mouvements
            this.time.delayedCall(7000, () => {
                // Fait revenir la caméra sur le joueur
                this.cameras.main.pan(this.player.x, this.player.y, 1000, 'Sine.easeInOut', false, () => {
                    // Débloque les mouvements du joueur
                    this.player.setImmovable(false);
    
                    // Met à jour la variable pour indiquer que l'action a été réalisée
                    this.actionExecuted = true;
                });
            });
        });
    }

    changedLevelVillage() {
        this.scene.start("Village", {
            nombreMagatama: this.nombreMagatama,
            nombreSauvegarde: this.nombreSauvegarde,
            debutJeu: this.debutJeu
        });
    }

    mort() {
        this.scene.restart();
    }

}

