import { useState } from "react"
import { JsTimer, TimerState } from "./JsTimer";
import { TimerCircle } from "./TimerCircle/TimerCircle";

export function Timer() {
    const [timerInputValue, setTimerInputValue] = useState('');
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [timerAmount, setTimerAmount] = useState<number|null>(null);
    const [timer, setTimer] = useState<JsTimer|null>(null);

    async function renderTimer() {
        while (timer && timer.state === TimerState.STARTED) {
            setTimeRemaining(timer.remaining);
            await nextAnimationFrame(5);
        }
        if (timer?.state === TimerState.DONE) {
            setTimeRemaining(timer.remaining);
        }
    }

    async function nextAnimationFrame(frames = 1) {
        while (frames > 0) {
            frames--;
            await new Promise((res) => requestAnimationFrame(res));
        }
    }

    return <>
        <input value={timerInputValue}
            onChange={(ev) => {
                setTimerInputValue(ev.target.value);
            }}
            onKeyUp={(ev) => {
                if (ev.key === 'Enter') {
                    const cleanInput = Number(timerInputValue);
                    setTimerInputValue('');
                    if (!isNaN(cleanInput)) {
                        const amount = cleanInput * 1000;
                        setTimer(new JsTimer(amount));
                        setTimeRemaining(amount);
                        setTimerAmount(amount);
                    }
                }
            }}
        />
        {timer ? <div>
            <button onClick={() => {
                if (timer.start()) {
                    renderTimer();
                }
            }}>Start</button>
            <button onClick={() => timer.stop()}>Stop</button>
        </div> : null}
        {timerAmount ? <>
            <TimerCircle amount={timerAmount} remaining={timeRemaining}/>
        </> : null}
    </>
}