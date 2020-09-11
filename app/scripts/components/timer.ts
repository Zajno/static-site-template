import Component from 'app/core/component';
import { setTimeoutAsync } from 'app/utils/timeoutAsync';
import GSAP from 'gsap';

const pad = (n: number) => (n || 0).toString().padStart(2, '0');

export class TimerComponent extends Component {

    private _cancelation: () => void = null;

    protected doSetup(): void | Promise<void> {
        GSAP.set(this.element, { autoAlpha: 0 });
    }

    private renderTimer = (totalMs: number, diffMs: number) => {
        const dt = totalMs - diffMs;

        const min = Math.trunc(dt / 1000 / 60);
        const sec = Math.trunc(dt / 1000) % 60;
        const ms = Math.min(Math.round((dt % 1000) / 10), 99);

        const str = `${pad(min)}:${pad(sec)}.${pad(ms)}`;
        this.element.textContent = str;
    }

    public prepare(seconds: number) {
        this.renderTimer(seconds * 1000, 0);
    }

    public async start(seconds: number, delay = 1000, useAnimation = true): Promise<void> {
        if (useAnimation) {
            GSAP.to(this.element, { autoAlpha: 1, duration: 1 });
        }

        await setTimeoutAsync(delay);

        const startTime = new Date().getTime();

        const interval = setInterval(() => this.renderTimer(seconds * 1000, new Date().getTime() - startTime), 1000 / 25);

        try {
            await setTimeoutAsync(seconds * 1000, cb => {
                this._cancelation = cb;
            });
        } catch (err) {
            if (err !== 'canceled') {
                throw err;
            }
        }

        if (useAnimation) {
            GSAP.to(this.element, { autoAlpha: 0, duration: 1 });
        }

        this.element.textContent = '00:00.00';

        this._cancelation = null;
        clearInterval(interval);
    }

    public cancel() {
        if (this._cancelation) {
            this._cancelation();
        }
    }
}
