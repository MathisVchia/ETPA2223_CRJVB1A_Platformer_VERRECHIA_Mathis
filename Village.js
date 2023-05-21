export class Village extends Phaser.Scene {

    constructor() {
        super("Village");
    }

    preload() {
        this.load.spritesheet('nikko', 'assets/characters/nikko.png',
        {frameWidth : 128, frameHeight : 256});

        //this.load.spritesheet('ennemi', 'assets/objects/ennemi.png',
        //{frameWidth: 128, frameHeight : 128});


        this.load.image('tileset', 'assets/objects/tileset.png');
        this.load.image('magatama', 'assets/objects/magatama.png');
        this.load.tilemapTiledJSON('map3', 'assets/maps/Village.json');
        
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

        
        this.map3 = this.add.tilemap('map3');
        this.tileset = this.map3.addTilesetImage('tileset', 'tileset');
        this.plateformes3 = this.map3.createLayer('Plateformes', this.tileset);

        this.plateformes3.setCollisionByProperty({estSolid: true});

        this.magatama = this.add.image(55,105,'magatama').setScale(1).setScrollFactor(0);

        this.player = this.physics.add.sprite(640, 3832, 'nikko');
        this.player.setCollideWorldBounds(true);
        this.player.body.setGravityY(1600);


        this.physics.add.collider(this.player, this.plateformes3);
        //this.physics.add.collider(this.renard, this.plateformes);
        this.physics.add.collider(this.player, this.ennemi, this.recommencerNiveau, null, this);


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
        this.interactButton.on('down', this.openTextBlock, this);

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

            /*// Vérifie si l'action n'a pas encore été réalisée
            if (!this.actionExecuted && this.player.x >= 2742) {
                this.cinematic1()

            };
            */
        
            if (this.player.x < 256) {
                console.log ("TU VAS PARLER OUI?")
                this.openTextBlock();
                
              }
    }



    recommencerNiveau() {
        // Si le renard suit encore le joueur, le faire disparaitre
        if (this.renardIsFollowing) {
          this.renardIsFollowing = false;
          this.renard.disableBody(true, true);
        }
        
        // Recommencer le niveau "lvl1"
        this.scene.start("lvl1");
      }
      

    gainSaut() {
          // Vérifier si le double saut est activé
          if (this.doubleSautAutorise && !this.player.body.blocked.down) {
            // Vérifier si le joueur n'est pas en train de toucher le sol et la touche "cursors.up" est enfoncée
            if (this.cursors.space.isDown) {
              console.log("Saut effectué.");
      
              // Appliquer une vélocité vers le haut pour le double saut
              this.player.setVelocityY(-725);
              this.magatama.setVisible(false);
      
              this.doubleSautAutorise = false; // Désactiver le double saut
            }
          } else {
            console.log("Double saut déjà utilisé ou le joueur est au sol.");
          }
    }
/*
    cinematic1() {
        // Bloque les mouvements du joueur
        this.player.setImmovable(true);
    
        // Déplace la caméra vers les coordonnées spécifiées (4800, 3530) pendant 3 secondes
        this.cameras.main.pan(4800, 3530, 3000, 'Sine.easeInOut', false, () => {
            // Bloque les mouvements du joueur
            this.player.setImmovable(true);
                
            // Après quelques secondes, revient à la caméra sur le joueur et débloque ses mouvements
            this.time.delayedCall(5000, () => {
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
    */

    openTextBlock() {
        // Bloquer les mouvements du joueur
        this.player.setVelocity(0);
        this.player.setImmovable(true);
        
        // Créer le texte interactif
        const textBlock = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "Cliquez sur les phrases", {
          fontSize: '32px',
          fill: '#fff',
          backgroundColor: '#000',
          padding: {
            x: 20,
            y: 10
          }
        }).setOrigin(0.5).setInteractive();
        
        // Ajouter des événements de clic aux phrases du texte
        textBlock.on('pointerdown', () => {
          // Action à effectuer lorsque la première phrase est cliquée
          console.log("Phrase 1 cliquée.");
        });
        
        textBlock.on('pointerup', () => {
          // Action à effectuer lorsque la deuxième phrase est cliquée
          console.log("Phrase 2 cliquée.");
        });
        
        // Fonction pour débloquer les mouvements du joueur et supprimer le texte interactif
        const unblockPlayer = () => {
          // Débloquer les mouvements du joueur
          this.player.setImmovable(false);
          
          // Supprimer le texte interactif
          textBlock.destroy();
        };
        
        // Définir un délai de 5 secondes avant de débloquer les mouvements du joueur
        this.time.delayedCall(5000, unblockPlayer, [], this);
      }


}