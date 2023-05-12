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

    update() {
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
    
            const speed = 200;
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
        console.log(this.renard.y);
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
                this.renard.setVelocity(0, 0);
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

    }
}
}