import logger from 'app/logger';

import LazyLoadComponent, { LazyLoadConfig } from 'app/components/lazy/lazyLoadComponent';

import Particle, { ParticleSettings } from './canvasParticle';

type CanvasSettings = ParticleSettings & {
    canvas: HTMLCanvasElement;
};

export default abstract class Canvas extends LazyLoadComponent<LazyLoadConfig & CanvasSettings> {

    protected canvas: HTMLCanvasElement;
    protected context: CanvasRenderingContext2D & {
        mozImageSmoothingEnabled?: boolean,
        webkitImageSmoothingEnabled?: true,
        msImageSmoothingEnabled?: true,
    };

    private particles: Particle[] = [];

    private isPlaying = false;
    private startTime = null;
    private drawTimer = null;
    private renderingAllowed = false;

    constructor (config: CanvasSettings) {
        super({
            ...config,
            el: config.canvas,
            register: true,
        });

        this.canvas = this._config.canvas;
        this.context = this.canvas && this.canvas.getContext('2d');

        if (this.context) {
            // force enable antialiasing
            this.context.mozImageSmoothingEnabled = true;
            this.context.webkitImageSmoothingEnabled = true;
            this.context.msImageSmoothingEnabled = true;
            this.context.imageSmoothingEnabled = true;
            this.context.imageSmoothingQuality = 'high';
        }
    }

    async doSetup() {
        if (this.canvas) {
            this.setCanvasSize(false);
            this.fillParticles();
        }

        await super.doSetup();
    }

    _doLoading() {
        this.renderingAllowed = true;
        TweenLite.fromTo(this.canvas, 1.5, { autoAlpha: 0 }, { autoAlpha: 1, delay: 1 });
        this.renderOnce();
        return Promise.resolve();
    }

    play(delay: number) {
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

    protected abstract fillParticles(): void;

    renderOnce() {
        if (this.isPlaying || !this.renderingAllowed)
            return;

        window.requestAnimationFrame(this.drawCanvas.bind(this));
    }

    setCanvasSize(udpateParticles = true) {
        if (!this.canvas) {
            return;
        }

        const parent = this.canvas.parentElement;

        this.canvas.width = parent.offsetWidth;
        this.canvas.height = parent.offsetHeight;
        this._config.canvasWidth = this.canvas.width;
        this._config.canvasHeight = this.canvas.height;

        if (udpateParticles) {
            this.particles.forEach((p) => {
                p.initializePosition();
            });
        }
    }

    animationWorker = (timeStamp: number) => {
        this.drawCanvas(timeStamp);
        this.enqueueAnimation();
    }

    enqueueAnimation() {
        if (this.isPlaying) {
            window.requestAnimationFrame(this.animationWorker);
        }
    }

    drawCanvas(timeStamp: number) {
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
