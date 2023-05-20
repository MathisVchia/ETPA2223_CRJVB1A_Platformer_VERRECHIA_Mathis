// importation des différents calques

//import {menu as menu} from "./script_menu.js"

//import { lvl1 as lvl1} from "/lvl1.js"

import { lvl2 as lvl2} from "/lvl2.js"

import {Village as Village} from "/Village.js"


var config = {
    type: Phaser.AUTO,
    width: 1920, height: 1080,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            tileBias: 128
    }},
    pixelArt:true,
    input:{gamepad:true},
    scene: [/*lvl1, */lvl2, Village],     
    };
    
new Phaser.Game(config);