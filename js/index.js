'use strict'

import { PlayerDOM } from "./player_dom.js";

const player_dom = new PlayerDOM('player', 'hidden_player');
await player_dom.start('hidden_player');
// console.log(player_dom.player.player.playVideo())

const content = document.querySelector('.content');

setTimeout(() => {
    const [ r, g, b ] = player_dom.main_color
    const [ r1, g1, b1 ] = mixColors([r, g, b], [22,22,22]);
    
    content.style.background = `
      linear-gradient(
        180deg,
        rgb(${r}, ${g}, ${b}) 0%,
        rgb(${r1}, ${g1}, ${b1}) 50%,
        rgb(${22}, ${22}, ${22}) 100%
      )
    `;
}, 1000)


function mixColors(c1, c2) {
  return [
    Math.round((c1[0] + c2[0]) / 2),
    Math.round((c1[1] + c2[1]) / 2),
    Math.round((c1[2] + c2[2]) / 2)
  ];
}