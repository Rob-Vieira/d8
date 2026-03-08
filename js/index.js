'use strict'

import { PlayerDOM } from "./player_dom.js";

const loading = document.querySelector('.loading-box');
const imgs = document.querySelector('#imgs');
const player_box = document.querySelector('.player-box');
const year_el = document.querySelector('#year');
const mouth_el = document.querySelector('#mouth');
const day_el = document.querySelector('#day');
const hour_el = document.querySelector('#hour');
const minute_el = document.querySelector('#minute');
const second_el = document.querySelector('#second');
const start_date = new Date('2025-01-01T00:00:00')

const message_el = document.querySelector('.message');
const message_btn_el = document.querySelector('#message-btn');
const message_shadow_el = document.querySelector('.message-shadow');
let message_enabled = false;

const slide_box_el = document.querySelector('.slide-box');
const slide_img_el = document.querySelector('.slide-box img');
const slide_next_el = document.querySelector('#slide-next');
const slide_prev_el = document.querySelector('#slide-prev');
const slide_close_el = document.querySelector('#close-slide');
const slide_targets = document.querySelectorAll('[slide-target]')
let total_slides = 0;
let url_slides = '';
let current_slide = 1;

const player_dom = new PlayerDOM('player', (color) => {
    const [ r, g, b ] = color;
    const [ r1, g1, b1 ] = mixColors([r, g, b], [22,22,22]);

    player_box.style.background = `
      linear-gradient(
        180deg,
        rgb(${r}, ${g}, ${b}) 0%,
        rgb(${r1}, ${g1}, ${b1}) 50%,
        rgb(${22}, ${22}, ${22}) 100%
      )
    `;
});

await player_dom.start('hidden_player');
setInterval(updateCounter, 1000);
updateCounter();

message_btn_el.addEventListener('click', () => {
  if (message_enabled) {
    message_el.removeAttribute('style');
    message_enabled = false;
    message_shadow_el.style.display = 'block';
    message_btn_el.textContent = 'Mostrar mensagem';
  }
  else {
    message_el.setAttribute('style', 'max-height: unset;overflow-y: visable;')
    message_enabled = true;
    message_shadow_el.style.display = 'none'
    message_btn_el.textContent = 'Esconder mensagem';
  }
});

slide_targets.forEach((el) => {
  el.addEventListener('click', () => openSlide(el.getAttribute('slide-target')))
});

slide_close_el.addEventListener('click', () => {
  slide_box_el.classList.remove('open');
  document.body.classList.remove('no-scroll')
});

slide_next_el.addEventListener('click', () => {
  const next = current_slide + 1;

  if (next > total_slides) {
    current_slide = 1;
  }
  else {
    current_slide = next;
  }

  change_slide(current_slide);
});

slide_prev_el.addEventListener('click', () => {
  const prev = current_slide - 1;

  if (prev < 1) {
    current_slide = total_slides;
  }
  else {
    current_slide = prev;
  }

  change_slide(current_slide);
});

document.addEventListener('DOMContentLoaded', () => {
  loading.classList.remove('open');
  imgs.style.display = 'none';
  document.body.classList.remove('no-scroll')
});

function change_slide(slide) {
  slide_img_el.setAttribute('src', `${url_slides}${slide}.jpg`);
}

function openSlide(galery) {
  switch (galery) {
    case 'esp': {
      total_slides = 15;
      url_slides = 'images/galery/esp/'

      break;
    }
    case 'ale': {
      total_slides = 15;
      url_slides = 'images/galery/ale/'

      break;
    }
    case 'fav': {
      total_slides = 16;
      url_slides = 'images/galery/fav/'

      break;
    }
  }

  current_slide = 1;
  slide_img_el.setAttribute('src', `${url_slides}1.jpg`);
  slide_box_el.classList.add('open');
  document.body.classList.add('no-scroll')
}

function mixColors(c1, c2) {
  return [
    Math.round((c1[0] + c2[0]) / 2),
    Math.round((c1[1] + c2[1]) / 2),
    Math.round((c1[2] + c2[2]) / 2)
  ];
}

function updateCounter() {
  const now = new Date();

  let years = now.getFullYear() - start_date.getFullYear();
  let months = now.getMonth() - start_date.getMonth();
  let days = now.getDate() - start_date.getDate();
  let hours = now.getHours() - start_date.getHours();
  let minutes = now.getMinutes() - start_date.getMinutes();
  let seconds = now.getSeconds() - start_date.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes--;
  }

  if (minutes < 0) {
    minutes += 60;
    hours--;
  }

  if (hours < 0) {
    hours += 24;
    days--;
  }

  if (days < 0) {
    const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += lastMonth.getDate();
    months--;
  }

  if (months < 0) {
    months += 12;
    years--;
  }

  year_el.textContent = years;
  mouth_el.textContent = months;
  day_el.textContent = days;
  hour_el.textContent = hours;
  minute_el.textContent = minutes;
  second_el.textContent = seconds;
}