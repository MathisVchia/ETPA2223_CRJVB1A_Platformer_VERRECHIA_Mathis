// importation des différents calques

//import {menu as menu} from "./script_menu.js"

import { lvl1 as lvl1} from "/lvl1.js"



var config = {
    type: Phaser.AUTO,
    width: 1920, height: 1080,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y : 600 },
        debug: true
    }},
    pixelArt:true,
    input:{gamepad:true},
    scene: [lvl1],
        
};

new Phaser.Game(config);