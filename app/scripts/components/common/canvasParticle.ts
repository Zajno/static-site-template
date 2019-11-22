import logger from 'app/logger';

export type ParticleSettings = {
    scale: number[];
    baseSpeed: number;
    particleSizeX: number;
    particleSizeY: number;
    floatAmplitude?: number;
    canvasWidth: number;
    canvasHeight: number;
    mouseX: number;
    mouseY: number;
    mouseParallaxCoef: number;
};

export default class Particle {

    protected scale: number;
    protected speed: number;
    protected width: number;
    protected height: number;

    protected x: number;
    protected y: number;

    protected _prevDeltaTime = 0;

    private doPrepareDraw: (ctx: CanvasRenderingContext2D) => void;

    constructor(protected readonly settings: ParticleSettings) {
        this.scale = settings.scale[Math.floor(Math.random() * settings.scale.length)];
        this.speed = settings.baseSpeed * this.scale;
        this.width = settings.particleSizeX * this.scale;
        this.height = settings.particleSizeY * this.scale;

        this.initializePosition();

        this.doPrepareDraw = ctx => this.prepareDraw(ctx);
    }

    initializePosition() {
        this.x = 0;
        this.y = 0;
    }

    update(deltaTime: number) {
        this._prevDeltaTime = deltaTime;
    }

    draw(context: CanvasRenderingContext2D) {
        this.doPrepareDraw(context);
    }

    // will be called before first draw. Override it (and call super!) to make some initialization
    protected prepareDraw(context: CanvasRenderingContext2D) {
        this.doPrepareDraw = () => { /* no-op */ };
    }
}

export class FloatingParticle extends Particle {
    private baseX: number;
    private baseY: number;

    private dy = 0;
    private floatAmplitude: number;

    /** @param {} settings */
    constructor(settings: ParticleSettings) {
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

    update(deltaTime: number) {
        this._float(deltaTime);

        super.update(deltaTime);
    }

    // Just an example of particle floating
    private _float(deltaTime: number) {
        this.dy += this.speed * deltaTime;
        let offsetY = Math.sin(this.dy) * this.floatAmplitude;
        let offsetX = 0;

        offsetY += this.settings.mouseY * this.width * this.settings.mouseParallaxCoef;
        offsetX += this.settings.mouseX * this.width * this.settings.mouseParallaxCoef;

        this.y = this.baseY + offsetY;
        this.x = this.baseX + offsetX;
    }
}
