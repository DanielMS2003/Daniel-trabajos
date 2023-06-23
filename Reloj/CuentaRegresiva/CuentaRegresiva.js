function Digit() {
    let digit
    let wide
    let color

    return {
        view:(vnode)=>{
            digit=vnode.attrs.digit
            wide=vnode.attrs.wide || 15
            color=vnode.attrs.color  || "blue"
            let border=`${wide}px solid ${color}`
            return m("div",{style:"display:flex;flex-direction:column; width:100px;"},
                m("div", { style:{
                    width:"100px",
                    height:"120px",
                    ...([0,2,3,5,7,8,9].includes(digit) ? {"border-top": border} :{}),
                    ...([0,1,4,5,6,8,9].includes(digit) ? {"border-left": border} :{}),
                    ...([0,2,3,4,7,8,9].includes(digit) ? {"border-right": border} :{}),
                    ...([2,3,4,5,6,8,9].includes(digit) ? {"border-bottom": border} :{}),
                }}),
                m("div", { style:{
                    width:"100px",
                    height:"120px",
                    ...([0,1,2,6,8].includes(digit) ? {"border-left": border} :{}),
                    ...([0,3,4,5,6,7,8,9].includes(digit) ? {"border-right": border} :{}),
                    ...([0,2,3,5,6,8].includes(digit) ? {"border-bottom": border} :{}),
                }}),
            )
        }
    }
}

function Clock() {
    let hours = 0;
    let min = 0;
    let sec = 0;
    let targetTime;
    let timer;
    let isRunning = false;
    let isPaused = false;

    function toggleStartPause() {
        if (!isRunning) {
            startCountdown();
        } else if (isPaused) {
            resumeCountdown();
        } else {
            pauseCountdown();
        }
    }

    function startCountdown() {
        if (!isRunning && !isPaused) {
            hours = parseInt(document.getElementById("hours-input").value);
            min = parseInt(document.getElementById("minutes-input").value);
            sec = parseInt(document.getElementById("seconds-input").value);
            targetTime = new Date().getTime() + (hours * 60 * 60 * 1000) + (min * 60 * 1000) + (sec * 1000);
            clearInterval(timer);
            timer = setInterval(updateTime, 100);
            isRunning = true;
        } else if (isPaused) {
            targetTime = new Date().getTime() + remainingTime;
            clearInterval(timer);
            timer = setInterval(updateTime, 100);
            isPaused = false;
            isRunning = true;
        }
    }

    function updateTime() {
        let currentTime = new Date().getTime();
        let remainingTime = targetTime - currentTime;

        if (remainingTime <= 0) {
            clearInterval(timer);
            document.body.classList.add("explode");
            setTimeout(() => {
            document.body.classList.remove("explode");
            alert("Countdown has finished!");
            reset();
            }, 500);
            return;
        }

        let newHours = Math.floor(remainingTime / (1000 * 60 * 60));
        let newMin = Math.floor((remainingTime / (1000 * 60)) % 60);
        let newSec = Math.floor((remainingTime / 1000) % 60);

        let elapsedMs = currentTime % 1000;
        if (remainingTime >= 500 && (elapsedMs + remainingTime >= 1000)) {
            newSec = Math.ceil(newSec);
            if (newSec === 60) {
                newSec = 0;
                newMin++;
            }
            if (newMin === 60) {
                newMin = 0;
                newHours++;
            }
            console.log(hours, min, sec);
            m.redraw();
        }

        hours = newHours;
        min = newMin;
        sec = newSec;
        m.redraw();
    }

    function pauseCountdown() {
        clearInterval(timer);
        remainingTime = targetTime - new Date().getTime();
        isPaused = true;
        isRunning = false;
    }

    function resumeCountdown() {
        startCountdown();
    }

    function reset() {
        clearInterval(timer);
        isRunning = false;
        hours = 0;
        min = 0;
        sec = 0;
    }

    function setTime(newHours, newMin, newSec) {
        hours = newHours;
        min = newMin;
        sec = newSec;

        document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
        document.getElementById("minutes").innerText = min.toString().padStart(2, '0');
        document.getElementById("seconds").innerText = sec.toString().padStart(2, '0');
        
        let currentTime = new Date().getTime();
        let targetDate = new Date();
        targetDate.setHours(hours, min, sec, 0);
        targetTime = targetDate.getTime();
        let remainingTime = targetTime - currentTime;

        if (remainingTime < 0) {
            targetDate.setDate(targetDate.getDate() + 1);
            targetTime = targetDate.getTime();
            remainingTime = targetTime - currentTime;
        }

        isRunning = true;
        timer = setInterval(updateTime, 100);
    }

    function setTargetTime(t) {
        targetTime = t;
        m.redraw();
    }

    function startTimer() {
        isRunning = true;
        targetTime = new Date().getTime() + (hours * 60 * 60 * 1000) + (min * 60 * 1000) + (sec * 1000);

        updateTime();

        timer = setInterval(() => {
            updateTime();
            updateTitle();
        }, 1000);
    }

setTargetTime(new Date().getTime() + ((hours * 60 * 60) + (min * 60) + sec) * 1000);

return {
        view: () => {
            let hourList = [];
            for (let i = 0; i <= 99; i++) {
                hourList.push(i.toString());
            }
            let minSecList = [];
            for (let i = 0; i <= 59; i++) {
                minSecList.push(i.toString());
            }
            return m("div", [
            m("div", { style: "display:flex;flex-direction:row;margin-bottom:5px"}, [
                m("div", { style: "margin-left: 60px;" }, [
                m("label", { for: "hours-input" }, "Horas: "),
                m("select", { id: "hours-input" }, hourList.map(hour => m("option", { value: hour }, hour)))
                ]),
                m("div", { style: "margin-left: 180px;" }, [
                m("label", { for: "minutes-input" }, "Minutos: "),
                m("select", { id: "minutes-input" }, minSecList.map(minute => m("option", { value: minute }, minute)))
                ]),
                m("div", { style: "margin-left: 190px;" }, [
                m("label", { for: "seconds-input" }, "Segundos: "),
                m("select", { id: "seconds-input" }, minSecList.map(second => m("option", { value: second }, second)))
                ]),
                ]),
                m("div", {style: "display: flex;flex-direction:row;gap:8px;"}, [
                    m(Digit, {digit: Math.floor(hours / 10)}),
                    m(Digit, {digit: hours % 10}),
                    m("div", {style: "font-size: 200px;margin-top:85px"}, ":"),
                    m(Digit, {digit: Math.floor(min / 10)}),
                    m(Digit, {digit: min % 10}),
                    m("div", {style: "font-size: 200px;margin-top:85px"}, ":"),
                    m(Digit, {digit: Math.floor(sec / 10)}),
                    m(Digit, {digit: sec % 10}),
                ]),
                m("div", { style: "display:flex;flex-direction:row;gap:18px;margin-left:280px;margin-top:30px" }, [
                m("button", { onclick: toggleStartPause }, isRunning ? "Pausar" : "Comenzar"),
                m("button", { onclick: reset }, "Reiniciar"),
                ]),
            ])
        }
    }
}

export { Clock, }