// importation des différents calques

//import {menu as menu} from "./script_menu.js"

import {lvl1 as lvl1} from "./script_lvl1.js"



var config = {
    type: Phaser.AUTO,
    width: 4160, height: 3456,
    physics: {
        default: 'arcade',
        arcade: {
        debug: true
    }},
    pixelArt:true,
    input:{gamepad:true},
    scene: [menu,lvl1],
        
};

new Phaser.Game(config);