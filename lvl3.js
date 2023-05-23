export class lvl3 extends Phaser.Scene {

    constructor() {
        super("lvl3");
    }

    preload() {
        this.load.spritesheet('nikko', 'assets/characters/nikko.png',
        {frameWidth : 128, frameHeight : 256});
        this.load.spritesheet('renard', 'assets/characters/renard.png',
        {frameWidth: 128, frameHeight : 128});
        this.load.spritesheet('clef', 'assets/objects/clef.png',
        {frameWidth: 128, frameHeight : 128});
        this.load.spritesheet('porte', 'assets/objects/porte.png',
        {frameWidth: 128, frameHeight : 128});
        this.load.spritesheet('sanctuaire', 'assets/objects/sanctuaire.png',
        {frameWidth: 128, frameHeight : 128});
        this.load.spritesheet('ennemi', 'assets/objects/ennemi.png',
        {frameWidth: 128, frameHeight : 128});


        this.load.image('tileset', 'assets/objects/tileset.png');
        this.load.image('magatama', 'assets/objects/magatama.png');
        this.load.tilemapTiledJSON('map4', 'assets/maps/V1Lvl3.json');
        
        
    }

    create() {
        console.log("lvl3");
        this.player;
        this.renard;
        this.clef;
        this.porte;
        this.sanctuaire;
        this.magatama;
        this.renard = null;
        this.gameOver = false;
        this.hasKey = false;
        this.dbSaut = false;
        this.canClimb = false;
        this.actionExecuted = false;
        this.magatama = null;
        
        this.map4 = this.add.tilemap('map4');
        this.tileset = this.map4.addTilesetImage('tileset', 'tileset');
        this.plateformes4 = this.map4.createLayer('Plateformes', this.tileset);
        this.ennemi = this.map4.createLayer('ennemi', this.tileset);

        this.plateformes4.setCollisionByProperty({estSolid: true});

        this.sanctuaire = this.physics.add.sprite(14460, 3708, 'sanctuaire');
        this.sanctuaire.setCollideWorldBounds(true);
        this.sanctuaire.body.setImmovable(true);
        
        this.player = this.physics.add.sprite(15848, 3448, 'nikko');
        this.player.setCollideWorldBounds(true);
        this.player.body.setGravityY(1600);
        
        this.renard = this.physics.add.sprite(4800, 3530, 'renard');
        this.renard.setCollideWorldBounds(true);

        this.clef = this.physics.add.sprite(7678, 4292, 'clef');
        this.clef.setCollideWorldBounds(true);

        this.porte = this.physics.add.sprite(11848, 2812, 'porte');
        this.porte.setCollideWorldBounds(true);
        this.porte.body.setImmovable(true);

        

        this.physics.add.collider(this.player, this.plateformes4);;
        this.physics.add.collider(this.clef, this.plateformes4);
        this.physics.add.collider(this.renard, this.porte);
        this.physics.add.collider(this.player, this.ennemi, this.recommencerNiveau, null, this);

        this.physics.add.overlap(this.player, this.sanctuaire, () => {
            if (this.renardIsFollowing) {
                this.magatama = this.add.image(55, 105, 'magatama').setScale(1).setScrollFactor(0);
            };
        });


        // résolution de l'écran
        this.physics.world.setBounds(0, 0, 10000, 5000);
        // PLAYER - Collision entre le joueur et les limites du niveau
        this.player.setCollideWorldBounds(true);

        //this.detectionZone = this.physics.add.sprite(this.player.x, this.player.y, null);
        //this.detectionZone.setSize(128, 256); // Ajustez la taille selon les dimensions des blocs
        //this.detectionZone.setOffset(0, -128); // Ajustez l'offset selon la position de la zone devant le joueur
        //this.detectionZone.setGravityY (0);

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

        //this.cursors = this.input.keyboard.createCursorKeys();

        this.cursorsUp = this.input.keyboard.addKey('Z');
        this.cursorsLeft = this.input.keyboard.addKey('Q')
        this.cursorsRight = this.input.keyboard.addKey('D')
        this.cursorsDown = this.input.keyboard.addKey('S')
        this.interactButton = this.input.keyboard.addKey('E');


    }

    update() {

        const isPlayerTouchingDoor = this.physics.overlap(this.player, this.door);
        
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
            this.player.setVelocityY(-675);
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

         // Ajout de la collision entre le renard et la clef
         this.physics.add.overlap(this.renard, this.clef, () => {
            console.log("ddjs")
            this.collectKey();
        });

        // Ajout collision entre joueur et la porte
        this.physics.add.collider(this.player, this.porte, () =>{
            if (this.hasKey === true){
                console.log ("TU TOUCHE")
                this.openDoor();
            };
            if (this.hasKey === false) {
                const delay = 3000; // Temps d'affichage en millisecondes
            
                const text = this.add.text(800, 3916, "Vous avez besoin d'une clé pour ouvrir la porte.", {
                    font: "24px Arial",
                    fill: "#ffffff"
                });
                text.setOrigin(0.5);
            
                this.time.delayedCall(delay, () => {
                    text.destroy(); // Supprime le texte après le délai spécifié
                });
            }
        });

            // Ajout collision joueur sanctuaire
        this.physics.add.overlap(this.player, this.sanctuaire, () => {
            if (this.renardIsFollowing) {
                // Détruit le renard actuel
                this.renard.destroy();

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
                this.doubleSautAutorise = true;
                
            }
        });

        console.log (this.doubleSautAutorise)
        if (this.doubleSautAutorise === true){
            this.gainSaut()
        };

        // Mettre à jour la position de la zone de détection devant le joueur
        //this.detectionZone.x = this.player.x + 64;
        //this.detectionZone.y = this.player.y;

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
            //if (!this.actionExecuted && this.player.x >= 2742) {
                //this.cinematic1()

            //};

        if ( this.player.x > 16930){
            this.changedLevelVillage();
        }
        if (this.player.x < 200){
            this.scene.start("lvl4");
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
    this.porte.destroy();
    this.hasKey = false;
    }

    recommencerNiveau() {
        // Si le renard suit encore le joueur, le faire disparaitre
        if (this.renardIsFollowing) {
          this.renardIsFollowing = false;
          this.renard.disableBody(true, true);
        }
        
        // Recommencer le niveau "lvl1"
        this.scene.start("lvl3");
      }
      

    gainSaut() {
          // Vérifier si le double saut est activé
          if (this.doubleJumpAvailable && this.doubleSautAutorise && !this.player.body.blocked.down) {
            // Vérifier si le joueur n'est pas en train de toucher le sol et la touche "cursors.up" est enfoncée
            if (this.cursors.space.isDown) {
              console.log("Saut effectué.");
      
              // Appliquer une vélocité vers le haut pour le double saut
              this.player.setVelocityY(-725);
              this.magatama.setVisible(false);
              this.doubleJumpAvailable = false;
              this.doubleJumpCooldown = true;
                
          } else {
            console.log("Double saut déjà utilisé ou le joueur est au sol.");
          }
    }
}

    //changedLevelVillage(){
        //this.scene.start("Village");
    //}
}
