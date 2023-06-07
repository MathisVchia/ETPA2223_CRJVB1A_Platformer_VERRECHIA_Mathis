export class Village extends Phaser.Scene {

    constructor() {
        super("Village");
    }

    init(data) {
      this.nombreMagatama = data.nombreMagatama;
      this.nombreSauvegarde = data.nombreSauvegarde;
      this.gainDash = data.gainDash;
      this.enfantAvecPlayer = data.enfantAvecPlayer;
      this.debutJeu = data.debutJeu;
    }

    preload() {
        this.load.spritesheet('nikko', 'assets/characters/nikko.png',
        {frameWidth : 128, frameHeight : 256});
        this.load.spritesheet('enfantSuivi', 'assets/characters/enfant.png',
        {frameWidth : 256, frameHeight : 256});
        this.load.spritesheet('pnj', 'assets/characters/pnj.png',
        {frameWidth : 128, frameHeight : 256});

        this.load.image('tileset', 'assets/objects/tileset.png');
        this.load.image('1_maga', 'assets/objects/1_maga.png');
        this.load.image('2_maga', 'assets/objects/2_maga.png');
        this.load.image('3_maga', 'assets/objects/3_maga.png');
        this.load.image('4_maga', 'assets/objects/4_maga.png');
        this.load.image('5_maga', 'assets/objects/5_maga.png');
        this.load.tilemapTiledJSON('map3', 'assets/maps/Village.json');
        
    }

    create() {
        this.player;
        this.renard;
        this.ennemi;
        this.renard = null;
        this.gameOver = false;
        this.dbSaut = false;
        this.canClimb = false;
        this.actionExecuted = false;
        this.montrer = false;
        this.seekChild = false;
        this.pnjApproached = false;
        this.activeText = false;
        
        this.map3 = this.add.tilemap('map3');
        this.tileset = this.map3.addTilesetImage('tileset', 'tileset');
        this.plateformes3 = this.map3.createLayer('Plateformes', this.tileset);

        this.plateformes3.setCollisionByProperty({estSolid: true});

      if(this.enfantAvecPlayer == true){
        console.log("Les 2 Sprites en meme temps")
        this.player = this.physics.add.sprite(640, 3832, 'enfantSuivi');
        this.player.setCollideWorldBounds(true);
        this.player.body.setGravityY(1600);
      }

      if(this.debutJeu == true){
        console.log("Juste Nikko")
        this.player = this.physics.add.sprite(640, 3832, 'nikko');
        this.player.setCollideWorldBounds(true);
        this.player.body.setGravityY(1600);
      }

        this.pnj = this.physics.add.sprite(3964, 3584, 'pnj');
        this.pnj.setCollideWorldBounds(true);
        this.pnj.body.setGravityY(1600);


        this.physics.add.collider(this.player, this.plateformes3);
        this.physics.add.collider(this.pnj, this.plateformes3);
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

        this.physics.world.setBounds(0, 0, 22000, 10000);
        this.cameras.main.setBounds(0, 0, 22800, 12800);
        this.cameras.main.startFollow(this.player);

        this.interactButton = this.input.keyboard.addKey('E');
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursorsUp = this.input.keyboard.addKey('Z');
        this.cursorsLeft = this.input.keyboard.addKey('Q')
        this.cursorsRight = this.input.keyboard.addKey('D')
        this.cursorsDown = this.input.keyboard.addKey('S')
        this.interactButton = this.input.keyboard.addKey('E');
        this.SPACE = this.input.keyboard.addKey('SPACE');

    }

    update() {

        const isPlayerTouchingDoor = this.physics.overlap(this.player, this.door);
        
        // ajout des moyens de déplacement du personnage
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
            if (this.debutJeu == true && this.player.x >= 1920) {
                console.log("Voyage Voyage, plus loin que la nuit et le jour")
                // Bloquer les mouvements du joueur
                this.player.setVelocity(0);
                this.cinematic2()

            };
            
        
            if (this.player.x < 256 && !this.activeText) {
                this.activeText = true;
                console.log ("TU VAS PARLER OUI?")
                this.openTextBlock();
                
            }


          if (Phaser.Math.Distance.Between(this.player.x, this.player.y, this.pnj.x, this.pnj.y) < 250) {
              // Le joueur s'approche du PNJ
              this.pnjApproached = true;
          } else {
              // Le joueur s'éloigne du PNJ
              this.pnjApproached = false;
          }
      
          // Afficher le "E" au-dessus de la tête du PNJ lorsque le joueur s'approche
          if (this.pnjApproached) {
              this.showInteractIcon();
          } else {
              this.hideInteractIcon();
          }

          if (this.pnjApproached) {
            if (this.interactButton.isDown){
              this.openTextBlock1();
              this.seekChild = true;
            }
          }

}   

    gainSaut() {
          // Vérifier si le double saut est activé
          if (this.doubleSautAutorise && !this.player.body.blocked.down) {
            // Vérifier si le joueur n'est pas en train de toucher le sol et la touche "cursors.up" est enfoncée
            if (Phaser.Input.Keyboard.JustDown(this.SPACE)) {
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

    cinematic2() {
      // Déplace la caméra vers les coordonnées spécifiées (4800, 3530) pendant 3 secondes
      this.cameras.main.pan(this.pnj.x, this.pnj.y, 3000, 'Sine.easeInOut', false, () => {
          // Bloquer les mouvements du joueur
          this.player.setImmovable(true);
  
          // Affichage du texte sous le PNJ
          const text = this.add.text(this.pnj.x + 1720, this.pnj.y - 158, "Mon fils ? Quelqu'un a vu mon fils ?", {
              font: "24px Arial",
              fill: "#ffffff",
              backgroundColor: "#000000"
          }).setOrigin(0.5);
  
          // Animation de disparition du texte après 2 secondes
          this.tweens.add({
              targets: text,
              alpha: 1,
              duration: 2000,
              delay: 1000,
              onComplete: () => {
                  // Détruire le texte après 2 secondes supplémentaires
                  this.time.delayedCall(2000, () => {
                      text.destroy();
                  });
              }
          });
      });
  
      // Après quelques secondes, revient à la caméra sur le joueur et débloque ses mouvements
      this.time.delayedCall(5000, () => {
          // Fait revenir la caméra sur le joueur
          this.cameras.main.pan(this.player.x, this.player.y, 1000, 'Sine.easeInOut', false, () => {
              // Débloque les mouvements du joueur
              this.player.setImmovable(false);
  
              // Met à jour la variable pour indiquer que l'action a été réalisée
              this.debutJeu = false;
          });
      });
  }
   

    openTextBlock() {
        // Bloquer les mouvements du joueur
         this.player.setVelocity(0);
        
        // Créer le texte interactif
         console.log ("BLABLABLA")
         const bouton = this.add.text(this.player.x +1, this.player.y -300, "Vers le Sanctuaire", {
           fontSize: "32px",
           color: "#ffffff",
       });
       bouton.setOrigin(0.5);
       bouton.setInteractive();

       // Lorsqu'on appuie sur le bouton, on lance le jeu
       console.log("Est ce que tu m'entends hého")
       bouton.on("pointerdown", () => {
           this.scene.start("lvl2");
       });

       // Créer le texte interactif
         console.log ("BLABLABLA")
         const bouton2 = this.add.text(bouton.x, bouton.y +100, "Vers la Forêt", {
           fontSize: "32px",
           color: "#ffffff",
       });
       bouton2.setOrigin(0.5);
       bouton2.setInteractive();

       // Lorsqu'on appuie sur le bouton, on lance le jeu
       console.log("Est ce que tu me sens hého")
       bouton2.on("pointerdown", () => {
          this.scene.start("lvl3", {
            nombreMagatama : this.nombreMagatama,
            nombreSauvegarde : this.nombreSauvegarde,
            seekChild : this.seekChild
        });
       });

       console.log (bouton);
        
  
      }


      cinematic3() {

        // Déplace la caméra vers les coordonnées spécifiées (4800, 3530) pendant 3 secondes
        this.cameras.main.pan(640, 3832, 3000, 'Sine.easeInOut', false, () => {
            // Bloque les mouvements du joueur
            this.player.setImmovable(true);

             // Après quelques secondes, revient à la caméra sur le joueur et débloque ses mouvements
             this.time.delayedCall(2000, () => {
                // Fait revenir la caméra sur le joueur
                this.cameras.main.pan(this.player.x, this.player.y, 1000, 'Sine.easeInOut', false, () => {
                  // Débloque les mouvements du joueur
                  this.player.setImmovable(false);
                  this.montrer = false;

                });
            });
        });


      }

    showInteractIcon() {
      if (!this.interactIcon) {
          this.interactIcon = this.add.text(this.pnj.x, this.pnj.y - 200, "E", {
              fontSize: "32px",
              color: "#ffffff",
          });
          this.interactIcon.setOrigin(0.5);
      }
    }
  
    hideInteractIcon() {
      if (this.interactIcon) {
          this.interactIcon.destroy();
          this.interactIcon = null;
      }
    }

    openTextBlock1() {
      // Bloquer les mouvements du joueur
      this.player.setVelocity(0);
  
      // Créer le texte interactif
      const text1 = this.add.text(this.pnj.x, this.pnj.y - 250, "Mon fils... Depuis le tremblement de terre il n'est pas revenu !", {
          fontSize: "24px",
          color: "#ffffff",
          backgroundColor: "#000000"
      });
      text1.setOrigin(0.5);
  
      const text2 = this.add.text(this.pnj.x, this.pnj.y - 300, "S'il vous plaît, il est tout seul dans la forêt derrière-vous, allez le sauver, pitié !", {
          fontSize: "24px",
          color: "#ffffff",
          backgroundColor: "#000000"
      });
      text2.setOrigin(0.5);
  
      // Animation de disparition du texte après 2 secondes
      this.tweens.add({
          targets: [text1, text2],
          alpha: 1,
          duration: 3000,
          delay: 1000,
          onComplete: () => {
              // Détruire le texte après 2 secondes supplémentaires
              this.time.delayedCall(2000, () => {
                  text1.destroy();
                  text2.destroy();
                  // Débloquer les mouvements du joueur
                  this.player.setVelocity(0);
              });
          }
      });
  }
}