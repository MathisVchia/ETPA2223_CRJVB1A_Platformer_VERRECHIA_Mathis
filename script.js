// importation des différents calques

import {Menu as Menu} from "./Menu.js"

import { lvl1 as lvl1} from "./lvl1.js"

import { lvl2 as lvl2} from "./lvl2.js"

import { lvl3 as lvl3} from "./lvl3.js"

import { lvl4 as lvl4} from "./lvl4.js"

import {Village as Village} from "./Village.js"

var config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        width: 1920,
        height: 1080,
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            tileBias: 128
    }},
    pixelArt:false,
    input:{gamepad:true},
    scene: [Menu, lvl1, lvl2, Village, lvl3, lvl4],     
    };
    
new Phaser.Game(config);