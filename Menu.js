export class Menu extends Phaser.Scene {
    constructor() {
        super("Menu");
    }

    preload() {
        // Préchargement des ressources nécessaires, comme les images et les sons
    }

    create() {
        // Création de l'objet fond qui prend l'intégralité de l'écran
        const fond = this.add.rectangle(0, 0, this.game.config.width, this.game.config.height, 0x000000);
        fond.setOrigin(0);

        // Création de l'objet bouton
        const bouton = this.add.text(this.game.config.width / 2, this.game.config.height / 2, "Appuyez pour jouer", {
            fontSize: "32px",
            color: "#ffffff",
        });
        bouton.setOrigin(0.5);
        bouton.setInteractive();

        // Lorsqu'on appuie sur le bouton, on lance le jeu
        bouton.on("pointerdown", () => {
            this.scene.start("Village");
        });
    }

    update() {
        // Mise à jour du menu principal (si nécessaire)
    }
}

