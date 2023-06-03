export class Menu extends Phaser.Scene {
    constructor() {
        super("Menu");
    }

    preload() {
        // Préchargement des ressources nécessaires, comme les images et les sons
        this.load.image('menu', 'assets/objects/EcranDemarrage.png');
        this.load.image('play', 'assets/characters/toucheDemarrage.png');
        this.load.image('playClic', 'assets/characters/toucheDemarrageClic.png');
        this.load.image('light', 'assets/effects/light.png');
    }

    create() {
        // Récupérer les dimensions de l'écran
        const screenWidth = this.cameras.main.width;
        const screenHeight = this.cameras.main.height;

        // Ajouter l'image du menu avec une taille proportionnelle à l'écran
        this.add.image(screenWidth / 2, screenHeight / 2, 'menu').setScale(screenWidth / 1920, screenHeight / 1080);

        // Ajouter le bouton play avec une taille proportionnelle à l'écran
        this.boutonPlay = this.add.image(screenWidth / 2, screenHeight / 1.2, 'play').setScale(screenWidth / 1920, screenHeight / 1080).setInteractive();

        // Gérer l'événement de survol du bouton
        this.boutonPlay.on('pointerover', () => {
            this.boutonPlay.setTexture('playClic');
        });

        // Gérer l'événement de sortie du survol du bouton
        this.boutonPlay.on('pointerout', () => {
            this.boutonPlay.setTexture('play');
        });

        // Gérer l'événement de clic sur le bouton
        this.boutonPlay.on('pointerup', () => {
            this.letsBegin();
        });
    }

    update() {
        // Mise à jour du menu principal (si nécessaire)
    }

    letsBegin() {
        this.scene.start("lvl2");
    }
}