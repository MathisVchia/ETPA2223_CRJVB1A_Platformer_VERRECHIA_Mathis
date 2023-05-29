export class lvl4 extends Phaser.Scene {

    constructor() {
        super("lvl4");
    }

    init(data) {
        this.nombreMagatama = data.nombreMagatama;
        this.nombreSauvegarde = data.nombreSauvegarde;
      }

    preload() {
        this.load.spritesheet('nikko', 'assets/characters/nikko.png',
        {frameWidth: 128, frameHeight : 256});
        this.load.spritesheet('renard', 'assets/characters/renard.png',
        {frameWidth: 128, frameHeight : 128});
        this.load.spritesheet('enfant', 'assets/characters/enfant.png',
        {frameWidth: 128, frameHeight : 256});
        this.load.spritesheet('enfantSuivi', 'assets/characters/enfantSuivi.png',
        {frameWidth: 256, frameHeight : 256});
        this.load.spritesheet('clef', 'assets/objects/clef.png',
        {frameWidth: 128, frameHeight : 128});
        this.load.spritesheet('porte', 'assets/objects/porte.png',
        {frameWidth: 128, frameHeight : 128});
        this.load.spritesheet('sanctuaire', 'assets/objects/sanctuaire.png',
        {frameWidth: 128, frameHeight : 128});
        this.load.spritesheet('ennemi', 'assets/objects/ennemi.png',
        {frameWidth: 128, frameHeight : 128});
        this.load.image('sauvegarde', 'assets/objects/sauvegarde.png');


        this.load.image('tileset', 'assets/objects/tileset.png');
        this.load.image('0_maga', 'assets/objects/0_maga.png');
        this.load.image('1_maga', 'assets/objects/1_maga.png');
        this.load.image('2_maga', 'assets/objects/2_maga.png');
        this.load.image('3_maga', 'assets/objects/3_maga.png');
        this.load.image('4_maga', 'assets/objects/4_maga.png');
        this.load.image('5_maga', 'assets/objects/5_maga.png');
        this.load.tilemapTiledJSON('map5', 'assets/maps/V1Lvl4.json');
        
        
    }

    create() {
        this.player;
        this.renard;
        this.sanctuaire;
        this.magatama;
        this.renard = null;
        this.gameOver = false;
        this.dbSaut = false;
        this.canClimb = false;
        this.actionExecuted = false;
        this.magatama = null;
        this.gainDash = false;
        
        this.map5 = this.add.tilemap('map5');
        this.tileset = this.map5.addTilesetImage('tileset', 'tileset');
        this.plateformes5 = this.map5.createLayer('Plateformes', this.tileset);
        this.ennemi = this.map5.createLayer('ennemi', this.tileset);

        this.plateformes5.setCollisionByProperty({estSolid: true});

        this.sanctuaire = this.physics.add.sprite(5118, 3582, 'sanctuaire');
        this.sanctuaire.setCollideWorldBounds(true);
        this.sanctuaire.body.setImmovable(true);
        
        //this.player = this.physics.add.sprite(15612, 2366, 'nikko');
        this.player = this.physics.add.sprite(800, 3454, 'nikko');
        this.player.setCollideWorldBounds(true);
        this.player.body.setGravityY(1600);

        this.enfant = this.physics.add.sprite(768, 3582, 'enfant');
        this.enfant.setCollideWorldBounds(true);
        
        this.renard = this.physics.add.sprite(11136, 2688, 'renard');
        this.renard.setCollideWorldBounds(true);
        
        this.sauvegarde = this.physics.add.sprite(12928, 2936, 'sauvegarde');
        this.sauvegarde.setCollideWorldBounds(true);
        this.sauvegarde.body.setImmovable(true);

        this.sauvegarde2 = this.physics.add.sprite(1022, 3458, 'sauvegarde');
        this.sauvegarde2.setCollideWorldBounds(true);
        this.sauvegarde2.body.setImmovable(true);

        /*this.sauvegarde = this.physics.add.sprite(1792, 4344, 'sauvegarde');
        this.sauvegarde.setCollideWorldBounds(true);
        this.sauvegarde.body.setImmovable(true);
*/
        this.magatamaImages = [];
        this.displayMagatamaImage();

        this.physics.add.collider(this.player, this.plateformes5);
        this.physics.add.collider(this.player, this.ennemi, this.recommencerNiveau, null, this);

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

        this.physics.add.overlap(this.player, this.renard, this.recrute.bind(this));
        this.interactButton = this.input.keyboard.addKey('E');

        this.cursors = this.input.keyboard.createCursorKeys();

        this.physics.world.setBounds(0, 0, 22000, 10000);
        this.cameras.main.setBounds(0, 0, 22800, 12800);
        this.cameras.main.startFollow(this.player);

        this.cursorsUp = this.input.keyboard.addKey('Z');
        this.cursorsLeft = this.input.keyboard.addKey('Q')
        this.cursorsRight = this.input.keyboard.addKey('D')
        this.cursorsDown = this.input.keyboard.addKey('S')
        this.interactButton = this.input.keyboard.addKey('E');
        this.dashButton = this.input.keyboard.addKey('SHIFT');

    }

    update() {

        const isPlayerTouchingDoor = this.physics.overlap(this.player, this.door);
        console.log("le nombre de magatama :", this.nombreMagatama, "et le nombre sauvegarde", this.nombreSauvegarde);
        // ajout des moyens de déplacement du personnage
        if (this.cursorsLeft.isDown) {
            this.player.setVelocityX(-260);
        } else if (this.cursorsRight.isDown) {
            this.player.setVelocityX(260);
        } else {
            this.player.setVelocityX(0);
        }
    
        // Saut
        if (this.cursorsUp.isDown && this.player.body.blocked.down){
            console.log("SAUTE")
            this.player.setVelocityY(-1675);
        }

        // Dash (2eme Meca)
        if(this.dashButton.isDown){
            this.dash();
            
        }

        //Vérifie si le joueur est proche de 'lenfant et si le bouton d'interaction a été pressé
        const distanceToEnfant = Phaser.Math.Distance.Between(this.player.x, this.player.y, this.enfant.x, this.enfant.y);
        if (distanceToEnfant < 150 && this.interactButton.isDown){
            this.gainDash = true;
            this.suivreEnfant();
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
            } else {
                this.renard.setVelocity(0, 0);
            }
        }
    
        // Ajoute un événement de clic pour donner l'ordre au renard de se rendre à un endroit précis avec la souris
        this.input.on('pointerdown', this.donnerOrdreRenard, this);
        //console.log(this.renard.y);


        this.physics.add.overlap(this.player, this.sauvegarde, () => {
            console.log("save")
            this.recupSave();
        });

        this.physics.add.overlap(this.player, this.sauvegarde2, () => {
            console.log("save")
            this.recupSave();
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
                this.displayMagatamaImage();

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

        console.log (this.doubleSautAutorise)
        if (this.nombreMagatama > 0){
                this.displayMagatamaImage();
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

        if (this.player.x > 15810){
            this.scene.start("lvl3", {
                nombreMagatama : this.nombreMagatama,
                nombreSauvegarde : this.nombreSauvegarde,
                gainDash : this.gainDash
            });
        
        }
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

    recruterRenard() {
        // Vérifie si un renard existe déjà
        if (this.renard) {
            // Détruit le renard actuel
            this.renard.destroy();
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
                if (this.player.velocity == 0){
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
            this.physics.moveTo(this.renard,pointer.worldX,pointer.worldY,200);
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
        const distance = Phaser.Math.Between(this.player.x,this.renard.x);
        console.log(distance)

        if (distance < 44000) {
            this.renard.followingPlayer = true;
        }
    }

    recommencerNiveau() {
        // Si le renard suit encore le joueur, le faire disparaitre
        if (this.renardIsFollowing) {
          this.renardIsFollowing = false;
          this.renard.disableBody(true, true);
        }
        
        // Recommencer le niveau "lvl1"
        this.scene.start("lvl4");
      }
      

      gainSaut() {
        // Vérifier si le double saut est activé
      if ((this.nombreMagatama > 0) && !this.player.body.blocked.down) {
          // Vérifier si le joueur n'est pas en train de toucher le sol et la touche "cursors.up" est enfoncée
          if (this.cursors.space.isDown) {
            console.log("Saut effectué.");
            // Appliquer une vélocité vers le haut pour le double saut
            this.player.setVelocityY(-725);
            this.nombreMagatama--;
              
        } else {
          console.log("Double saut déjà utilisé ou le joueur est au sol.");
        }
      }
    } 

    recupSave(){
        this.nombreMagatama = this.nombreSauvegarde;
    }

    dash() {

        if (this.gainDash = true){
        
            // Calculate the target position based on the player's current position and direction
            let targetX;
            if (this.cursorsLeft.isDown) {
                targetX = this.player.x - 400;
                this.nombreMagatama--;
            }
            else if (this.cursorsRight.isDown){
                targetX = this.player.x + 400;
                this.nombreMagatama--;
            }
            else{targetX = this.player.x}
            const targetY = this.player.y;
            this.gainDash = false;
            // Disable player controls during the dash
            this.player.setVelocity(0, 0);
        
            // Create a tween to move the player to the target position quickly
            this.tweens.add({
            targets: this.player,
            x: targetX,
            y: targetY,
            ease: 'Linear',
            duration: 200, // Adjust the duration as needed
            onComplete: () => {
                // Re-enable player controls and show the player sprite
                this.player.enableBody(true, this.player.x, this.player.y);
            }
            });
        //};
      }

    //changedLevelVillage(){
        //this.scene.start("Village");
    }

    suivreEnfant() {
        this.player.setTexture('enfantSuivi');
    }
}

