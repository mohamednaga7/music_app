import type { Song } from '@/types/Song';
import { defineStore } from 'pinia';
import { Howl } from 'howler';
import { formatTime } from '@/includes/helper';

export const usePlayerStore = defineStore('player', {
  state: (): {
    current_song: Song | null;
    sound: Howl | null;
    seek?: string;
    duration?: string;
    playerProgress: string;
  } => ({
    current_song: null,
    sound: null,
    seek: '00:00',
    duration: '00:00',
    playerProgress: '0%',
  }),
  actions: {
    async newSong(song: Song) {
      if (this.sound instanceof Howl) {
        if (song.docId === this.current_song?.docId) {
          return this.toggleAudio();
        }
        this.sound.unload();
      }
      this.current_song = song;
      this.sound = new Howl({
        src: [song.url],
        html5: true,
      });

      this.sound.play();

      this.sound.on('play', () => {
        requestAnimationFrame(this.progress);
      });
    },
    progress() {
      if (this.sound) {
        this.seek = formatTime(this.sound.seek());
        this.duration = formatTime(this.sound.duration());

        this.playerProgress = `${
          (this.sound.seek() / this.sound.duration()) * 100
        }%`;

        if (this.sound.playing()) {
          requestAnimationFrame(this.progress);
        }
      }
    },
    updateSeek(event: any) {
      if (!this.sound?.playing) {
        return;
      }

      const { x, width } = event.currentTarget.getBoundingClientRect();
      const clickX = event.clientX - x;
      const percentage = clickX / width;
      const seconds = this.sound.duration() * percentage;

      this.sound.seek(seconds);
      this.sound.once('seek', this.progress);
    },
    async toggleAudio() {
      if (!this.sound?.playing) {
        return;
      }
      if (this.sound.playing()) {
        this.sound.pause();
      } else {
        this.sound.play();
      }
    },
  },
  getters: {
    playing: (state) => {
      if (state.sound?.playing()) {
        return state.sound.playing();
      }
      return false;
    },
  },
});
