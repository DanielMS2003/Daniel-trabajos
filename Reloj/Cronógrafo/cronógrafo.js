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
    let timer;
    let isRunning = false;

    function updateTime() {
        sec++;
        if (sec == 60) {
            min++;
            sec = 0;
        }
        if (min == 60) {
            hours++;
            min = 0;
        }
        console.log(hours, min, sec);
        m.redraw();
    }

    function startTimer() {
        if (isRunning) {
            clearInterval(timer);
            isRunning = false;
            m.redraw();
        } else {
            timer = setInterval(updateTime, 1000);
            isRunning = true;
            m.redraw();
        }
    }

    function reset() {
        hours = 0;
        min = 0;
        sec = 0;
        clearInterval(timer);
        isRunning = false;
        m.redraw();
    }

    return {
    view: () => m("div", { style: "display:flex;flex-direction:column;align-items:center;" }, [
        m("div", { style: "display:flex;flex-direction:row;gap:6px;" }, [
            m(Digit, { digit: Math.floor(hours / 10) }),
            m(Digit, { digit: hours % 10 }),
            m("div", { style: "font-size: 200px; color: black; margin-top: 85px;" }, ":"),
            m(Digit, { digit: Math.floor(min / 10) }),
            m(Digit, { digit: min % 10 }),
            m("div", { style: "font-size: 200px; color: black; margin-top: 85px;" }, ":"),
            m(Digit, { digit: Math.floor(sec / 10) }),
            m(Digit, { digit: sec % 10 }),
        ]),
        m("div", { style: "display:flex;flex-direction:row;gap:6px;margin-top:20px;" }, [
            m("button", { onclick: startTimer }, isRunning ? "Pausar" : "Comenzar"),
            m("button", { onclick: reset }, "Reiniciar"),
        ]),
    ]),
};
}

function Display() {
    let digit=4

    setInterval(()=>{digit=(digit+1)%10;m.redraw()},1000)
    return {
        view:()=>{
            return m("div",{style:"display:flex;flex-direction:row;gap:6px;"},[
                m(Digit,{digit:0,color:"red"}),
                m(Digit,{digit:1}),
                m(Digit,{digit:2}),
                m(Digit,{digit:3,color:"red"}),
                m(Digit,{digit:4}),
                m(Digit,{digit:5}),
                m(Digit,{digit:6}),
                m(Digit,{digit:7,color:"red"}),
                m(Digit,{digit:8}),
                m(Digit,{digit:9}),
                m(Digit,{digit:digit})
            ])    
        }
    }
}

export { Clock, }
