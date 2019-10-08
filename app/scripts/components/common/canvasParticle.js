import logger from 'logger';

/** @typedef {Object} ParticleSettings
 * @property {number[]} scale
 * @property {number} baseSpeed
 * @property {number} particleSizeX
 * @property {number} particleSizeY
 * @property {number=} floatAmplitude
 * @property {number} canvasWidth
 * @property {number} canvasHeight
 * @property {number} mouseX
 * @property {number} mouseY
 * @property {number} mouseParallaxCoef
 */

export default class Particle {

    /** @param {ParticleSettings} settings */
    constructor(settings) {
        this.scale = settings.scale[Math.floor(Math.random() * settings.scale.length)];
        this.speed = settings.baseSpeed * this.scale;
        this.width = settings.particleSizeX * this.scale;
        this.height = settings.particleSizeY * this.scale;

        /** @type {ParticleSettings} */
        this.settings = settings;
        this.initializePosition();

        this.doPrepareDraw = context => this.prepareDraw(context);
    }

    initializePosition() {
        this.x = 0;
        this.y = 0;
    }

    update(deltaTime) {
        this._prevDeltaTime = deltaTime;
        // this._float(deltaTime);
    }

    /** @param {CanvasRenderingContext2D} context */
    draw(context) {
        this.doPrepareDraw(context);
    }

    // will be called before first draw. Override it (and call super!) to make some initialization
    /** @param {CanvasRenderingContext2D} context */
    prepareDraw(context) {
        this.doPrepareDraw = () => { };
    }
}

export class FloatingParticle extends Particle {

    /** @param {ParticleSettings} settings */
    constructor(settings) {
        super(settings);

        this.dy = 0;
        this.floatAmplitude = Math.random() * (this.settings.floatAmplitude || 0);
    }

    initializePosition() {
        this.x = this.getInitialXCoords();
        this.y = this.getInitialYCoords();
        this.baseX = this.x;
        this.baseY = this.y;
    }

    // Override me!
    getInitialXCoords() {
        return Math.floor(Math.random() * (this.settings.canvasWidth - this.settings.particleSizeX * 2));
    }

    // Override me!
    getInitialYCoords() {
        return Math.floor((this.settings.canvasHeight / 2) - (this.height * Math.random()));
    }

    update(deltaTime) {
        this._float(deltaTime);

        super.update(deltaTime);
    }

    // Just an example of particle floating
    _float(deltaTime) {
        this.dy += this.speed * deltaTime;
        let offsetY = Math.sin(this.dy) * this.floatAmplitude;
        let offsetX = 0;

        offsetY += this.settings.mouseY * this.width * this.settings.mouseParallaxCoef;
        offsetX += this.settings.mouseX * this.width * this.settings.mouseParallaxCoef;

        this.y = this.baseY + offsetY;
        this.x = this.baseX + offsetX;
    }
}
