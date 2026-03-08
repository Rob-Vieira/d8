import { musics } from "./musics.js";

export class Player {
    /**
     * @type {string}
     */
    element_id = '';

    /**
     * @type {{ code: string, name: string, author: string, image: string }[]}
     */
    musics = [];

    /**
     * @type {number}
     */
    current_music_index = 0;

    /**
     * @type {number}
     */
    last_music_index = 0;

    /**
     * @type {boolean}
     */
    paused = true;

    /**
     * @type {boolean}
     */
    alternated = false;

    /**
     * @type { 'off' | 'on' | 'one' }
     */
    loop = 'off';

    /**
     * @type { (percent: number, current, total) => void }
     */
    on_playing_handle;

    /**
     * @type {number}
     */
    on_playing_interval_id

    /**
     * @param {{ element_id: string, on_playing_handle: (percent: number, current, total) => void }} props 
     */
    constructor({ element_id, on_playing_handle }) {
        element_id = element_id || '';

        if (!element_id) throw Error('O ID do elemento HTML do player e ao menos um código de vídeo são obrigatórios.');

        this.on_playing_handle = on_playing_handle;

        this.musics = [...musics];
        this.current_music_index = 0;
        this.last_music_index = this.musics.length - 1;

        this.player = new YT.Player(element_id, {
            height: '0',
            width: '0',
            videoId: this.musics[0].code,
            events: {
                onStateChange: this.on_state_change.bind(this)
            },
            host: "https://www.youtube.com",
            playerVars: {
                origin: window.location.origin,
                enablejsapi: 1,
                playsinline: 1
            },
        });


    }

    replay() {
        this.player.seekTo(0);
        this.play();
    }

    play() {
        this.player.playVideo();
        this.paused = false;

        if (!this.on_playing_interval_id) {
            this.add_on_playing();
        }
    }

    pause() {
        this.player.pauseVideo();
        this.paused = true;

        this.remove_on_playing();
    }

    next() {
        let next_music = this.current_music_index + 1;

        this.current_music_index = next_music > this.last_music_index ? 0 : next_music;

        this.change_video(this.current_music_index);
        this.on_playing();
    }

    previous() {
        let previous_music = this.current_music_index - 1;

        this.current_music_index = previous_music < 0 ? this.last_music_index : previous_music;

        this.change_video(this.current_music_index);
        this.on_playing()
    }

    change_loop() {
        switch (this.loop) {
            case 'off': {
                this.loop = 'on';

                break;
            }
            case 'on': {
                this.loop = 'one';

                break;
            }
            case 'one': {
                this.loop = 'off';

                break;
            }
        }
    }

    alternate() {
        const current_music = this.get_current_music();

        if (!this.alternated) {

            this.alternated = true;

            for (let i = this.last_music_index; i > 0; i--) {
                const r = Math.floor(Math.random() * (i + 1));
                [this.musics[i], this.musics[r]] = [this.musics[r], this.musics[i]];
            }

            const index = this.musics.indexOf(current_music);

            if (index != -1) {
                delete this.musics[index];
                this.musics.unshift(current_music);
                this.current_music_index = 0;
            }

        }
        else {
            this.alternated = false;
            this.musics = [...musics];

            const index = this.musics.indexOf(current_music);

            if (index != -1) {
                this.current_music_index = index;
            }
        }

        console.log(this.musics)
        console.log(musics)
    }

    /**
     * Troca o vídeo tocando no player.
     * @param {number} music_index
     */
    change_video(music_index) {
        const music = this.musics[music_index];

        if (this.paused) {
            this.player.cueVideoById(music.code);
        }
        else {
            this.player.loadVideoById(music.code);
        }
    }

    get_current_image() {
        return `https://img.youtube.com/vi/${this.musics[this.current_music_index].code}/maxresdefault.jpg`
    }

    get_current_music() {
        return this.musics[this.current_music_index];
    }

    on_state_change(event) {
        if (event.data == YT.PlayerState.ENDED) {
            const is_last = this.current_music_index == this.last_music_index;

            switch (this.loop) {
                case 'on': {
                    this.next();

                    break
                }
                case 'one': {
                    this.replay();

                    break
                }
                case 'off':
                default: {
                    if (!is_last) this.next();

                    break
                }
            }
        }
    }

    on_playing() {
        const current = this.player.getCurrentTime();
        const total = this.player.getDuration();

        this.on_playing_handle((current / total) * 100, current, total);
    }

    add_on_playing() {
        this.on_playing_interval_id = setInterval(() => this.on_playing(), 100);
    }

    remove_on_playing() {
        clearInterval(this.on_playing_interval_id);
        this.on_playing_interval_id = undefined;
    }
}