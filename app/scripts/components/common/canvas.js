import logger from 'logger';

import LazyLoadComponent from 'components/lazy/lazyLoadComponent';
import TweenLite from 'gsap/TweenLite';

import Particle from './canvasParticle';

/** @typedef {(import "./canvasParticle").ParticleSettings} ParticleSettings */

/** @typedef {Object} CanvasBaseSettings
 * @property {HTMLCanvasElement} canvas
 */

 /** @typedef {CanvasBaseSettings & ParticleSettings} CanvasSettings */

export default class Canvas extends LazyLoadComponent {
    /** @param {CanvasSettings} settings */
    constructor(settings) {
        super({
            register: true,
            el: settings.canvas,
        });

        this.settings = settings;
        this.canvas = this.settings.canvas;

        /** @type {CanvasRenderingContext2D} */
        this.context = this.canvas && this.canvas.getContext('2d');

        // force enable antialiasing
        this.context.mozImageSmoothingEnabled = true;
        this.context.webkitImageSmoothingEnabled = true;
        this.context.msImageSmoothingEnabled = true;
        this.context.imageSmoothingEnabled = true;
        this.context.imageSmoothingQuality = 'high';

        /** @type {Particle[]} */
        this.particles = [];

        this.isPlaying = false;
        this.animationWorker = this.animationWorker.bind(this);
        this.startTime = null;
        this.drawTimer = null;
        this.renderingAllowed = false;
    }

    _doLoading() {
        this.renderingAllowed = true;
        TweenLite.fromTo(this.canvas, 1.5, { autoAlpha: 0 }, { autoAlpha: 1, delay: 1 });
        this.renderOnce();
        return Promise.resolve();
    }

    play(delay) {
        if (this.isPlaying) {
            return;
        }

        this.isPlaying = true;

        this.startTime = performance.now();
        this.enqueueAnimation();
    }

    pause() {
        this.isPlaying = false;
    }

    setup() {
        if (!this.canvas)
            return;

        this.setCanvasSize(false);

        this._fillParticles(this.particles);
    }

    /** @abstract */
    _fillParticles() {
        this.particles = [];

        // override me!
    }

    renderOnce() {
        if (this.isPlaying || !this.renderingAllowed)
            return;

        window.requestAnimationFrame(this.drawCanvas.bind(this));
    }

    setCanvasSize(udpateParticles = true) {
        if (!this.canvas) {
            return;
        }

        this.canvas.width = this.canvas.parentNode.offsetWidth;
        this.canvas.height = this.canvas.parentNode.offsetHeight;
        this.settings.canvasWidth = this.canvas.width;
        this.settings.canvasHeight = this.canvas.height;

        if (udpateParticles) {
            this.particles.forEach((p) => {
                p.initializePosition();
            });
        }
    }

    animationWorker(timeStamp) {
        this.drawCanvas(timeStamp);
        this.enqueueAnimation();
    }

    enqueueAnimation() {
        if (this.isPlaying)
            window.requestAnimationFrame(this.animationWorker);
    }

    drawCanvas(timeStamp) {
        if (!this.renderingAllowed)
            return;

        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const deltaTime = timeStamp - this.startTime;
        this.startTime = timeStamp;

        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            p.update(deltaTime);
            p.draw(this.context);
        }
    }

}
