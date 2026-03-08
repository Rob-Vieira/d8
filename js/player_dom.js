import { Player } from './player.js'
import { getColorSync } from 'https://unpkg.com/colorthief@3/dist/index.js';

export class PlayerDOM {
    /**
     * @type { Element }
     */
    previous_el

    /**
     * @type { Element }
     */
    next_el

    /**
     * @type { Element }
     */
    play_el

    /**
     * @type { Element }
     */
    thumb_el

    /**
     * @type { Element }
     */
    alternate_el

    /**
     * @type { Element }
     */
    loop_el

    /**
     * @type { Element }
     */
    name_el

    /**
     * @type { Element }
     */
    author_el

    /**
     * @type { Element }
     */
    title_el

    /**
     * @type { Element }
     */
    total_time_el

    /**
     * @type { Element }
     */
    current_time_el

    /**
     * @type { Element }
     */
    time_target_el
    /**
     * @type { Element }
     */
    active_bar_el

    /**
     * @type { Player }
     */
    player

    /**
     * @type { number[] }
     */
    main_color

    /**
     * @param { string } player_id
     * @param { string } hidden_player_id
     */
    constructor(player_id, hidden_player_id) {
        this.previous_el = document.querySelector(`#${player_id} .previous`);
        this.next_el = document.querySelector(`#${player_id} .next`);
        this.play_el = document.querySelector(`#${player_id} .play`);
        this.thumb_el = document.querySelector(`#${player_id} .thumb`);
        this.alternate_el = document.querySelector(`#${player_id} .alternate`);
        this.loop_el = document.querySelector(`#${player_id} .loop`);
        this.name_el = document.querySelector(`#${player_id} .name`);
        this.author_el = document.querySelector(`#${player_id} .author`);
        this.title_el = document.querySelector(`#${player_id} .title`);
        this.total_time_el = document.querySelector(`#${player_id} .total-time`);
        this.current_time_el = document.querySelector(`#${player_id} .current-time`);
        this.time_target_el = document.querySelector(`#${player_id} .time-target`);
        this.active_bar_el = document.querySelector(`#${player_id} .active-bar`);

        // this.start(hidden_player_id);
    }

    /**
     * @param {string} player_id 
     */
    async start(player_id) {
        await new Promise(resolve => {
            if (window.YT && YT.Player) {
                resolve();
            } else {
                window.onYouTubeIframeAPIReady = resolve;
            }
        });

        this.player = new Player({
            element_id: player_id,
            on_playing_handle: this.on_playing_handle.bind(this)
        });

        this.current_time_el.textContent = '0:00';
        this.total_time_el.textContent = '0:00';

        this.sync_view();

        this.add_events();
    }

    add_events() {
        this.previous_el.addEventListener('click', () => { this.change_music(false) });
        this.next_el.addEventListener('click', () => { this.change_music(true) });
        this.play_el.addEventListener('click', () => { this.play_pause() });
        this.alternate_el.addEventListener('click', () => { this.change_alternate() });
        this.loop_el.addEventListener('click', () => { this.change_loop() });

        this.thumb_el.addEventListener('load', () => { this.get_color() });
    }

    get_color() {
        const color = getColorSync(this.thumb_el);
        this.main_color = color.array();
    }

    /**
     * @param { boolean } to_next 
     */
    change_music(to_next) {
        if (to_next) {
            this.player.next();
        }
        else {
            this.player.previous();
        }

        this.sync_view();
    }

    play_pause() {
        if (this.player.paused) {
            this.player.play()
            this.play_el.classList.add('playing');
        }
        else {
            this.player.pause()
            this.play_el.classList.remove('playing');
        }
    }

    change_loop() {
        this.player.change_loop();

        switch (this.player.loop) {
            case 'on': {
                this.loop_el.classList.add('on');
                this.loop_el.classList.remove('one');

                break;
            }
            case 'one': {
                this.loop_el.classList.add('one');
                this.loop_el.classList.remove('on');

                break;
            }
            case 'off':
            default: {
                this.loop_el.classList.remove('on');
                this.loop_el.classList.remove('one');

                break
            }
        }
    }

    change_alternate() {
        this.player.alternate();

        if (this.player.alternated) {
            this.alternate_el.classList.add('on');
        }
        else {
            this.alternate_el.classList.remove('on');
        }
    }

    sync_view() {
        // const image_url = this.player.get_current_image();
        const music = this.player.get_current_music();

        this.thumb_el.setAttribute('src', `./images/playlist/${music.image}`);
        this.name_el.textContent = music.name;
        this.author_el.textContent = music.author;

        if (this.name_el.scrollWidth > this.title_el.clientWidth) {
            this.name_el.classList.add('scrolling');
        }
        else {
            this.name_el.classList.remove('scrolling');
        }
    }

    on_playing_handle(percent, current, total) {
        this.time_target_el.style.left = `${percent}%`;
        this.active_bar_el.style.width = `${percent}%`;

        this.current_time_el.textContent = this.format_time(current);
        this.total_time_el.textContent = this.format_time(total);
    }

    format_time(seconds) {
        if (!seconds) return '0:00'

        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);

        return `${m}:${s.toString().padStart('2', '0')}`;
    }
}