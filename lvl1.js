export class lvl1 extends Phaser.Scene{
    
    constructor(){
        super("lvl1");
    }

    preload(){
        this.load.spritesheet('nikko', 'assets/characters/nikko.png',
        {frameWidth : 128, frameHeight : 256});
        this.load.spritesheet('renard', 'assets/characters/renard.png',
        {frameWidth: 128, frameHeight : 128});

        this.load.image('tileset', 'assets/objects/tileset.png');
        this.load.tilemapTiledJSON('map1', 'assets/maps/V1Lvl1.json');
        
    }

    create(){
        this.player;
        this.renard;

        this.map1 = this.add.tilemap('map1');
        this.tileset = this.map1.addTilesetImage('tileset', 'tileset');
        this.plateformes = this.map1.createLayer('Plateformes', this.tileset);

        this.plateformes.setCollisionByProperty({estSolid: true});

        this.player = this.physics.add.sprite(344, 3816, 'nikko');
        this.player.setCollideWorldBounds(true);

        this.renard = this.physics.add.sprite(644, 3816, 'renard');
        this.renard.setCollideWorldBounds(true);

        this.physics.add.collider(this.player, this.plateformes);
        this.physics.add.collider(this.renard, this.plateformes);


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

        this.cursors = this.input.keyboard.createCursorKeys();

        this.interactButton = this.input.keyboard.addKey('E');


    }

    update(){

        // ajout des moyens de déplacement du personnage
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-260);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(260);
        } else {
            this.player.setVelocityX(0);
        }
    
        // Saut
        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-600);
        }
        
        if (this.interactButton.isDown){
            this.recruterRenard();
            console.log ("lance fonction")
        }

              

    }
    recruterRenard() {
        // Vérifie si le joueur est assez proche du renard
        if (Phaser.Math.Distance.Between(this.player.x, this.player.y, this.renard.x, this.renard.y) < 500) {
          // Fait disparaître la renard actuelle
          if (this.renard) {
            this.renard.destroy();
          }
          // Crée un nouveau sprite de renard derrière le joueur
          this.renard = this.physics.add.sprite(this.player.x - 150, this.player.y - 128, 'renard');
          this.physics.add.collider(this.renard, this.plateformes);
          // Fait suivre le joueur au nouveau sprite de renard
          this.physics.add.collider(this.renard, this.player);
          // Ajoute un comportement de copie des mouvements du joueur
          this.renard.body.setCollideWorldBounds(true);
          this.renard.setBounce(0.2);
      
          // Met à jour la position et la vitesse du renard à chaque frame pour qu'il reste derrière le joueur
          this.update = () => {
            this.renard.setVelocity(this.player.body.velocity.x, this.player.body.velocity.y);
            const distanceX = this.renard.x - this.player.x;
            const distanceY = this.renard.y - this.player.y;
            if (distanceX > 150) {
              this.renard.setVelocityX(-150);
            } else if (distanceX < -150) {
              this.renard.setVelocityX(150);
            } else {
              this.renard.setVelocityX(0);
            }
            if (distanceY > 128) {
              this.renard.setVelocityY(-128);
            } else if (distanceY < -128) {
              this.renard.setVelocityY(128);
            } else {
              this.renard.setVelocityY(0);
            }
          };
        }
      }
}