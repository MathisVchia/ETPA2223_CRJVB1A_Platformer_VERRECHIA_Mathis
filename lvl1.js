export class lvl1 extends Phaser.Scene {

    constructor() {
        super("lvl1");
    }

    preload() {
        this.load.spritesheet('nikko', 'assets/characters/nikko.png',
            { frameWidth: 128, frameHeight: 256 });
        this.load.spritesheet('renard', 'assets/characters/renard.png',
            { frameWidth: 128, frameHeight: 128 });

        this.load.image('tileset', 'assets/objects/tileset.png');
        this.load.tilemapTiledJSON('map1', 'assets/maps/V1Lvl1.json');

    }

    create() {
        this.player;

        this.map1 = this.add.tilemap('map1');
        this.tileset = this.map1.addTilesetImage('tileset', 'tileset');
        this.plateformes = this.map1.createLayer('Calque de Tuiles 1', this.tileset);

        this.plateformes.setCollisionByProperty({ estSolid: true });

        this.player = this.physics.add.sprite(72, 2288, 'nikko');
        this.player.setCollideWorldBounds(true);

        this.renard = this.physics.add.sprite(700, 2400, 'renard');
        this.physics.add.existing(this.renard);
        this.renard.setCollideWorldBounds(true);

        this.physics.add.collider(this.player, this.plateformes);
        this.physics.add.collider(this.renard, this.plateformes);

        this.physics.add.overlap(this.player, this.renard, this.recrute.bind(this));
        this.interactButton = this.input.keyboard.addKey('E');

        this.cursors = this.input.keyboard.createCursorKeys();

        this.physics.world.setBounds(0, 0, 3840, 3840);
        this.cameras.main.setBounds(0, 0, 12800, 12800);
        this.cameras.main.startFollow(this.player);

    }

    update() {


        if ((this.cursors.left.isDown)) {
            this.player.setVelocityX(-260);
            if (this.cursors.up.isDown) {
                this.player.setVelocityY(-400);
            }
        }
        else if ((this.cursors.right.isDown)) {
            this.player.setVelocityX(260);
            if (this.cursors.up.isDown) {
                this.player.setVelocityY(-400);
            }
        }
        else if ((this.cursors.up.isDown)) {
            this.player.setVelocityY(-400);
        }
        if (this.player.body.onFloor()) {
            if (this.cursors.left.isUp && this.cursors.right.isUp) {
                this.player.setVelocityX(0);
            }
        }

        if (this.interactButton.isDown) {
            this.recrute();
            console.log("recrute")
        }

        if (this.renard.followingPlayer) {
            this.renard.body.velocity.x = this.player.body.velocity.x;
            this.renard.body.velocity.y = this.player.body.velocity.y;
          }

    }


    recrute() {
        const distance = Phaser.Math.Between(this.player.x,this.renard.x);
        console.log(distance)

        if (distance < 44000) {
            this.renard.followingPlayer = true;
        }
    }
    
}
