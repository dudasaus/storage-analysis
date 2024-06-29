export enum TimerState {
    STOPPED,
    STARTED,
    DONE
}

export class JsTimer {
    state = TimerState.STOPPED
    private lastTime: number | null = null;
    remaining: number = 0;

    constructor(readonly total: number) {
        this.remaining = total;
    }

    start(): boolean {
        if (this.state === TimerState.STARTED || this.state === TimerState.DONE) return false;
        this.state = TimerState.STARTED;

        this.timerLoop();


        return true;
    }

    private async timerLoop() {
        while (this.state === TimerState.STARTED) {
            if (this.lastTime === null) {
                this.lastTime = performance.now();
            } else {
                const currentTime = performance.now();
                const diff = currentTime - this.lastTime;
                this.remaining = this.remaining - diff
                this.lastTime = currentTime;
                if (this.remaining <= 0) {
                    this.done();
                }
            }
            await new Promise((res) => {
                requestAnimationFrame(res);
            })
        }
    }

    stop() {
        if (this.state === TimerState.STARTED) {
            this.state = TimerState.STOPPED;
            this.lastTime = null;
        }
    }

    done() {
        if (this.state === TimerState.DONE) return;
        this.remaining = 0;
        this.state = TimerState.DONE;
        const utterance = new SpeechSynthesisUtterance('Time is up');
        window.speechSynthesis.speak(utterance);
    }
}