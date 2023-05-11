export class lvl1 extends Phaser.Scene{
    
    constructor(){
        super("lvl1");
        this.camera;
    }

    preload(){
        this.load.spritesheet('nikko', 'assets/characters/nikko.png',
        {frameWidth : 128, frameHeight : 256});

        this.load.image('tileset', 'assets/objects/tileset.png');
        this.load.tilemapJSON('map1', 'assets/maps/V1Lvl1.json');
        
    }

    create(){
        this.player;

        this.map1 = this.add.tilemap('map1');
        this.tileset = this.map1.addTilesetImage('tileset', 'tileset');
        this.plateformes = this.map1.createLayer('plateformes', this.tileset);

        this.plateformes.setCollisionByProperty({estSolid: true});

        this.player = this.physics.add.sprite(1300, 100, 'nikko')*
        this.player.setCollideWorldBounds(true);

        this.physics.add.collider(this.player, this.plateformes);


        this.camera.startFollow(this.player);
            this.camera.setDeadzonne(100,100);
            this.camera.setBounds(0,0,3200,3200);
    
    }

    update(){
            // ajout des moyens de déplacement du personnage
        if ((cursors.left.isDown)){ //si la touche gauche est appuyée
            player.setVelocityX(-160); //alors vitesse négative en X
        
        if ((cursors.right.isDown)){ //sinon si la touche droite est appuyée
                player.setVelocityX(160); //alors vitesse positive en X
                player.anims.play('right', true); //et animation => droite
            }
            
        if ((cursors.up.isDown)){
            //si touche haut appuyée ET que le perso touche le sol
            player.setVelocityY(-200); //alors vitesse verticale négative
            //(on saute)
                
        }

        }
    }
}