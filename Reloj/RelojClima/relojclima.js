function Digit() {
    let digit
    let wide
    let color

    return {
        view: (vnode) => {
            digit = vnode.attrs.digit
            wide = vnode.attrs.wide || 15
            color = vnode.attrs.color || "white"
            let border = `${wide}px solid ${color}`
            return m("div", { style: "display:flex; flex-direction:column; width:79px;" },
                m("div", {
                    style: {
                        width: "70px",
                        height: "70px",
                        ...([0, 2, 3, 5, 7, 8, 9].includes(digit) ? { "border-top": border } : {}),
                        ...([0, 1, 4, 5, 6, 8, 9].includes(digit) ? { "border-left": border } : {}),
                        ...([0, 2, 3, 4, 7, 8, 9].includes(digit) ? { "border-right": border } : {}),
                        ...([2, 3, 4, 5, 6, 8, 9].includes(digit) ? { "border-bottom": border } : {}),
                    }
                }),
                m("div", {
                    style: {
                        width: "70px",
                        height: "70px",
                        ...([0, 1, 2, 6, 8].includes(digit) ? { "border-left": border } : {}),
                        ...([0, 3, 4, 5, 6, 7, 8, 9].includes(digit) ? { "border-right": border } : {}),
                        ...([0, 2, 3, 5, 6, 8].includes(digit) ? { "border-bottom": border } : {}),
                    }
                }),
            )
        }
    }
}

function getCurrentDate() {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const monthName = monthNames[currentDate.getMonth()];
    const dayOfWeekNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const dayOfWeekName = dayOfWeekNames[currentDate.getDay()];
    const day = currentDate.getDate();
    const dateString = `Hoy es ${dayOfWeekName}, ${day} de ${monthName} de ${year}`;
    return dateString;
}

function Clock() {
    let hours = 0;
    let min = 0;
    let sec = 0;
    let intervalId = null;
    let weather = {};

    let timezone = "Europe/Madrid";
    let TIME_API = `https://worldtimeapi.org/api/timezone/${timezone}`;

    let city = "Valencia";
    let WEATHER_API = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=es&appid=34da5500bcbefe05da5c9fe2e726ef86`;

    function getWeather() {
        return fetch(WEATHER_API)
            .then(response => response.json())
            .then(data => {
                return {
                    description: data.weather[0].description,
                    city: data.name,
                    country: data.sys.country,
                    lat: data.coord.lat,
                    lon: data.coord.lon,
                    max: data.main.temp_max,
                    min: data.main.temp_min,
                    speed: data.wind.speed,
                    deg: data.wind.deg,
                    term: data.main.feels_like,
                    atmos: data.main.pressure,
                }
            })
            .catch(error => {
                console.error('Error:', error);
                return {};
            });
    }

    function setTime() {
        fetch(TIME_API)
            .then(response => response.json())
            .then(data => {
                const now = new Date(data.datetime);
                hours = now.getHours();
                min = now.getMinutes();
                sec = now.getSeconds();
                return fetch(WEATHER_API);
            })
            .then(response => response.json())
            .then(data => {
                weather = {
                    description: data.weather[0].description,
                    city: data.name,
                    country: data.sys.country,
                    lat: data.coord.lat,
                    lon: data.coord.lon,
                    max: data.main.temp_max,
                    min: data.main.temp_min,
                    speed: data.wind.speed,
                    deg: data.wind.deg,
                    term: data.main.feels_like,
                    atmos: data.main.pressure,
                };
                m.redraw();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }
    setTime();

    function startClock() {
        intervalId = setInterval(() => {
            setTime();
            sec++;
            if (sec > 59) {
                min++;
                sec = 0;
            }
            if (min > 59) {
                hours++;
                min = 0;
            }
            console.log(hours, min, sec);
            m.redraw();
        }, 1000);
    }

    startClock();

    function updateWeather() {
        const newCity = prompt("Ingresa una nueva ciudad:");
        if (!newCity) {
            return;
        }
        const newWeatherApi = `https://api.openweathermap.org/data/2.5/weather?q=${newCity}&units=metric&lang=es&appid=34da5500bcbefe05da5c9fe2e726ef86`;
        fetch(newWeatherApi)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`ERROR: ${newCity} no es una ciudad que existe!!!`);
                }
                if (WEATHER_API === newWeatherApi) {
                    throw new Error("ERROR: has seleccionado la misma ciudad.");
                }
                WEATHER_API = newWeatherApi; // update WEATHER_API with the new city value
                return getWeather(); // get new weather data with the new WEATHER_API
            })
            .then(weatherData => {
                weather = weatherData; // update weather with the new weather data
                m.redraw();
            })
            .catch(error => {
                console.error('Error:', error);
                alert(error.message);
            });
    }

    function updateWind() {
        const deg = weather.deg;
        let rotation = "";
        if (deg >= 0 && deg <= 90) {
            rotation = `rotate(${deg}deg) scaleX(-1)`;
        } else if (deg > 90 && deg <= 180) {
            rotation = `rotate(${deg}deg)`;
        } else if (deg > 180 && deg <= 270) {
            rotation = `rotate(${deg}deg) scaleX(-1)`;
        } else if (deg > 270 && deg <= 360) {
            rotation = `rotate(${deg}deg)`;
        }
        return `transform: ${rotation};`;
    }

    return {
        view: () => [
            m("button", {
                id: "city",
                onclick: updateWeather,
                style: {
                    position: "absolute",
                    top: "800",
                    left: "25",
                },
            }, "Cambiar ciudad"),
            m("div", {
                style:
                    "position: absolute; text-align: center; animation: pulse 10s ease-in-out; top: 50px; left: 30px; padding: 15px; color: white; background-color: #4ecdc4; font-size: 30px; padding: 15px; height: 710px; width: 590px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);"
            }, [
                m("div", {}, `Zona Horaria: ${timezone}`),
                m("br"), m("br"),
                m("div", {}, `Ciudad: ${weather.city}`),
                m("br"), m("br"),
                m("div", {}, `País: ${weather.country}`),
                m("br"), m("br"),
                m("div", {}, `Temperatura Máxima: ${weather.max} °C`),
                m("br"), m("br"),
                m("div", {}, `Temperatura Mínima: ${weather.min} °C`),
                m("br"), m("br"),
                m("div", {}, `Sensación térmica: ${weather.term} °C`),
                m("br"), m("br"),
                m("div", {}, `Velociadad del viento: ${weather.speed} km/h`),
                m("br"), m("br"),
                m("div", {}, `Dirección del viento: ${weather.deg} °`),
                m("img", {
                    src: "/src/apps/Daniel-Trabajos/imgs/flecha.png",
                    alt: "Flecha",
                    style: "position: absolute; top: 60%; right: 1%; transform: translate(-10%, -10%); height: 50px; width: 50px;" + updateWind(),
                }),
                m("br"), m("br"),
                m("div", {}, `Presión atmosférica: ${weather.atmos} hPa`),
                m("br"), m("br"),
                m("div", {}, `Longitud: ${weather.lon}`),
                m("br"), m("br"),
                m("div", {}, `Latitud: ${weather.lat}`),
                m("br"), m("br"),
                m("div", {}, `Clima: ${weather.description}`),
                weather.description === "cielo claro" ? m("div", {
                    style: "display:flex; justify-content:center; margin-bottom: 300px;"
                }, [
                    m("img", {
                        src: "/src/apps/Daniel-Trabajos/imgs/cielo_claro.png",
                        alt: "Cielo claro",
                        style: "position: absolute; top: 94%; right: 1%; transform: translate(-10%, -10%); width: 40px; height: 40px;",
                    })
                ]) : null,

                weather.description === "nubes" ? m("div", {
                    style: "display:flex; justify-content:center; margin-bottom: 300px;"
                }, [
                    m("img", {
                        src: "/src/apps/Daniel-Trabajos/imgs/nubes.png",
                        alt: "Nubes",
                        style: "position: absolute; top: 92%; right: 1%; transform: translate(-10%, -10%); width: 40px; height: 40px;",
                    })
                ]) : null,

                weather.description === "algo de nubes" ? m("div", {
                    style: "display:flex; justify-content:center; margin-bottom: 300px;"
                }, [
                    m("img", {
                        src: "/src/apps/Daniel-Trabajos/imgs/nubes.png",
                        alt: "algo de nubes",
                        style: "position: absolute; top: 92%; right: 1%; transform: translate(-10%, -10%); width: 40px; height: 40px;",
                    })
                ]) : null,

                weather.description === "muy nuboso" ? m("div", {
                    style: "display:flex; justify-content:center; margin-bottom: 300px;"
                }, [
                    m("img", {
                        src: "/src/apps/Daniel-Trabajos/imgs/nubes.png",
                        alt: "muy nuboso",
                        style: "position: absolute; top: 92%; right: 1%; transform: translate(-10%, -10%); width: 40px; height: 40px;",
                    })
                ]) : null,

                weather.description === "nubes dispersas" ? m("div", {
                    style: "display:flex; justify-content:center; margin-bottom: 300px;"
                }, [
                    m("img", {
                        src: "/src/apps/Daniel-Trabajos/imgs/nubes_dispersas.jpeg",
                        alt: "Nubes dispersas",
                        style: "position: absolute; top: 92%; right: 1%; transform: translate(-10%, -10%); width: 40px; height: 40px;",
                    })
                ]) : null,

                weather.description === "nubes fragmentadas" ? m("div", {
                    style: "display:flex; justify-content:center; margin-bottom: 300px;"
                }, [
                    m("img", {
                        src: "/src/apps/Daniel-Trabajos/imgs/nubes_fragmentadas.jpeg",
                        alt: "Nubes fragmentadas",
                        style: "position: absolute; top: 92%; right: 1%; transform: translate(-10%, -10%); width: 40px; height: 40px;",
                    })
                ]) : null,

                weather.description === "nubes rotas" ? m("div", {
                    style: "display:flex; justify-content:center; margin-bottom: 300px;"
                }, [
                    m("img", {
                        src: "/src/apps/Daniel-Trabajos/imgs/nubes_rotas.png",
                        alt: "Nubes rotas",
                        style: "position: absolute; top: 92%; right: 1%; transform: translate(-10%, -10%); width: 40px; height: 40px;",
                    })
                ]) : null,

                weather.description === "cielo nublado" ? m("div", {
                    style: "display:flex; justify-content:center; margin-bottom: 300px;"
                }, [
                    m("img", {
                        src: "/src/apps/Daniel-Trabajos/imgs/cielo_nublado.png",
                        alt: "Cielo nublado",
                        style: "position: absolute; top: 92%; right: 1%; transform: translate(-10%, -10%); width: 40px; height: 40px;",
                    })
                ]) : null,

                weather.description === "lluvia ligera" ? m("div", {
                    style: "display:flex; justify-content:center; margin-bottom: 300px;"
                }, [
                    m("img", {
                        src: "/src/apps/Daniel-Trabajos/imgs/lluvia_ligera.png",
                        alt: "Lluvia ligera",
                        style: "position: absolute; top: 92%; right: 1%; transform: translate(-10%, -10%); width: 40px; height: 40px;",
                    })
                ]) : null,

                weather.description === "lluvia moderada" ? m("div", {
                    style: "display:flex; justify-content:center; margin-bottom: 300px;"
                }, [
                    m("img", {
                        src: "/src/apps/Daniel-Trabajos/imgs/lluvia_moderada.png",
                        alt: "Lluvia moderada",
                        style: "position: absolute; top: 92%; right: 1%; transform: translate(-10%, -10%); width: 40px; height: 40px;",
                    })
                ]) : null,

                weather.description === "lluvia fuerte" ? m("div", {
                    style: "display:flex; justify-content:center; margin-bottom: 300px;"
                }, [
                    m("img", {
                        src: "/src/apps/Daniel-Trabajos/imgs/lluvia_fuerte.png",
                        alt: "Lluvia fuerte",
                        style: "position: absolute; top: 92%; right: 1%; transform: translate(-10%, -10%); width: 40px; height: 40px;",
                    })
                ]) : null,

                weather.description === "lluvia helada ligera" ? m("div", {
                    style: "display:flex; justify-content:center; margin-bottom: 300px;"
                }, [
                    m("img", {
                        src: "/src/apps/Daniel-Trabajos/imgs/lluvia_helada_ligera.png",
                        alt: "Lluvia helada ligera",
                        style: "position: absolute; top: 92%; right: 1%; transform: translate(-10%, -10%); width: 40px; height: 40px;",
                    })
                ]) : null,

                weather.description === "lluvia helada ligera" ? m("div", {
                    style: "display:flex; justify-content:center; margin-bottom: 300px;"
                }, [
                    m("img", {
                        src: "/src/apps/Daniel-Trabajos/imgs/lluvia_helada_ligera.png",
                        alt: "Lluvia helada ligera",
                        style: "position: absolute; top: 92%; right: 1%; transform: translate(-10%, -10%); width: 40px; height: 40px;",
                    })
                ]) : null,

                weather.description === "lluvia helada moderada" ? m("div", {
                    style: "display:flex; justify-content:center; margin-bottom: 300px;"
                }, [
                    m("img", {
                        src: "/src/apps/Daniel-Trabajos/imgs/lluvia_helada.png",
                        alt: "Lluvia helada moderada",
                        style: "position: absolute; top: 92%; right: 1%; transform: translate(-10%, -10%); width: 40px; height: 40px;",
                    })
                ]) : null,

                weather.description === "lluvia helada fuerte" ? m("div", {
                    style: "display:flex; justify-content:center; margin-bottom: 300px;"
                }, [
                    m("img", {
                        src: "/src/apps/Daniel-Trabajos/imgs/lluvia_helada_fuerte.jpeg",
                        alt: "Lluvia helada fuerte",
                        style: "position: absolute; top: 92%; right: 1%; transform: translate(-10%, -10%); width: 40px; height: 40px;",
                    })
                ]) : null,

                weather.description === "llovizna ligera" ? m("div", {
                    style: "display:flex; justify-content:center; margin-bottom: 300px;"
                }, [
                    m("img", {
                        src: "/src/apps/Daniel-Trabajos/imgs/llovizna.png",
                        alt: "llovizna ligera",
                        style: "position: absolute; top: 92%; right: 1%; transform: translate(-10%, -10%); width: 40px; height: 40px;",
                    })
                ]) : null,

                weather.description === "llovizna moderada" ? m("div", {
                    style: "display:flex; justify-content:center; margin-bottom: 300px;"
                }, [
                    m("img", {
                        src: "/src/apps/Daniel-Trabajos/imgs/llovizna.png",
                        alt: "llovizna moderada",
                        style: "position: absolute; top: 92%; right: 1%; transform: translate(-10%, -10%); width: 40px; height: 40px;",
                    })
                ]) : null,

                weather.description === "llovizna fuerte" ? m("div", {
                    style: "display:flex; justify-content:center; margin-bottom: 300px;"
                }, [
                    m("img", {
                        src: "/src/apps/Daniel-Trabajos/imgs/llovizna_fuerte.png",
                        alt: "llovizna fuerte",
                        style: "position: absolute; top: 92%; right: 1%; transform: translate(-10%, -10%); width: 40px; height: 40px;",
                    })
                ]) : null,

                weather.description === "lluvia y nieve ligera" ? m("div", {
                    style: "display:flex; justify-content:center; margin-bottom: 300px;"
                }, [
                    m("img", {
                        src: "/src/apps/Daniel-Trabajos/imgs/lluvia_nieve.png",
                        alt: "Lluvia y nieve ligera",
                        style: "position: absolute; top: 92%; right: 1%; transform: translate(-10%, -10%); width: 40px; height: 40px;",
                    })
                ]) : null,

                weather.description === "lluvia y nieve moderada" ? m("div", {
                    style: "display:flex; justify-content:center; margin-bottom: 300px;"
                }, [
                    m("img", {
                        src: "/src/apps/Daniel-Trabajos/imgs/lluvia_nieve.png",
                        alt: "Lluvia y nieve moderada",
                        style: "position: absolute; top: 92%; right: 1%; transform: translate(-10%, -10%); width: 40px; height: 40px;",
                    })
                ]) : null,

                weather.description === "lluvia y nieve fuerte" ? m("div", {
                    style: "display:flex; justify-content:center; margin-bottom: 300px;"
                }, [
                    m("img", {
                        src: "/src/apps/Daniel-Trabajos/imgs/lluvia_nieve.png",
                        alt: "Lluvia y nieve fuerte",
                        style: "position: absolute; top: 92%; right: 1%; transform: translate(-10%, -10%); width: 40px; height: 40px;",
                    })
                ]) : null,

                weather.description === "nieve ligera" ? m("div", {
                    style: "display:flex; justify-content:center; margin-bottom: 300px;"
                }, [
                    m("img", {
                        src: "/src/apps/Daniel-Trabajos/imgs/nieve.png",
                        alt: "Nieve ligera",
                        style: "position: absolute; top: 92%; right: 1%; transform: translate(-10%, -10%); width: 40px; height: 40px;",
                    })
                ]) : null,

                weather.description === "nieve moderada" ? m("div", {
                    style: "display:flex; justify-content:center; margin-bottom: 300px;"
                }, [
                    m("img", {
                        src: "/src/apps/Daniel-Trabajos/imgs/nieve.png",
                        alt: "Nieve moderada",
                        style: "position: absolute; top: 92%; right: 1%; transform: translate(-10%, -10%); width: 40px; height: 40px;",
                    })
                ]) : null,

                weather.description === "nieve fuerte" ? m("div", {
                    style: "display:flex; justify-content:center; margin-bottom: 300px;"
                }, [
                    m("img", {
                        src: "/src/apps/Daniel-Trabajos/imgs/nieve_fuerte.png",
                        alt: "Nieve fuerte",
                        style: "position: absolute; top: 92%; right: 1%; transform: translate(-10%, -10%); width: 40px; height: 40px;",
                    })
                ]) : null,

                weather.description === "tormenta con lluvia ligera" ? m("div", {
                    style: "display:flex; justify-content:center; margin-bottom: 300px;"
                }, [
                    m("img", {
                        src: "/src/apps/Daniel-Trabajos/imgs/tormenta_lluvia.png",
                        alt: "Tormenta con lluvia ligera",
                        style: "position: absolute; top: 92%; right: 1%; transform: translate(-10%, -10%); width: 40px; height: 40px;",
                    })
                ]) : null,

                weather.description === "tormenta con lluvia moderada" ? m("div", {
                    style: "display:flex; justify-content:center; margin-bottom: 300px;"
                }, [
                    m("img", {
                        src: "/src/apps/Daniel-Trabajos/imgs/tormenta_lluvia.png",
                        alt: "Tormenta con lluvia moderada",
                        style: "position: absolute; top: 92%; right: 1%; transform: translate(-10%, -10%); width: 40px; height: 40px;",
                    })
                ]) : null,

                weather.description === "tormenta con lluvia fuerte" ? m("div", {
                    style: "display:flex; justify-content:center; margin-bottom: 300px;"
                }, [
                    m("img", {
                        src: "/src/apps/Daniel-Trabajos/imgs/tormenta_lluvia_fuerte.png",
                        alt: "Tormenta con lluvia fuerte",
                        style: "position: absolute; top: 92%; right: 1%; transform: translate(-10%, -10%); width: 40px; height: 40px;",
                    })
                ]) : null,

                weather.description === "tormenta con lluvia helada ligera" ? m("div", {
                    style: "display:flex; justify-content:center; margin-bottom: 300px;"
                }, [
                    m("img", {
                        src: "/src/apps/Daniel-Trabajos/imgs/tormenta_helada.png",
                        alt: "Tormenta con lluvia helada ligera",
                        style: "position: absolute; top: 92%; right: 1%; transform: translate(-10%, -10%); width: 40px; height: 40px;",
                    })
                ]) : null,

                weather.description === "tormenta con lluvia helada moderada" ? m("div", {
                    style: "display:flex; justify-content:center; margin-bottom: 300px;"
                }, [
                    m("img", {
                        src: "/src/apps/Daniel-Trabajos/imgs/tormenta_helada.png",
                        alt: "Tormenta con lluvia helada moderada",
                        style: "position: absolute; top: 92%; right: 1%; transform: translate(-10%, -10%); width: 40px; height: 40px;",
                    })
                ]) : null,

                weather.description === "tormenta con lluvia helada fuerte" ? m("div", {
                    style: "display:flex; justify-content:center; margin-bottom: 300px;"
                }, [
                    m("img", {
                        src: "/src/apps/Daniel-Trabajos/imgs/tormenta_helada.png",
                        alt: "Tormenta con lluvia helada fuerte",
                        style: "position: absolute; top: 92%; right: 1%; transform: translate(-10%, -10%); width: 40px; height: 40px;",
                    })
                ]) : null,

                weather.description === "tormenta con llovizna ligera" ? m("div", {
                    style: "display:flex; justify-content:center; margin-bottom: 300px;"
                }, [
                    m("img", {
                        src: "/src/apps/Daniel-Trabajos/imgs/tormenta_llovizna.png",
                        alt: "Tormenta con llovizna ligera",
                        style: "position: absolute; top: 92%; right: 1%; transform: translate(-10%, -10%); width: 40px; height: 40px;",
                    })
                ]) : null,

                weather.description === "tormenta con llovizna moderada" ? m("div", {
                    style: "display:flex; justify-content:center; margin-bottom: 300px;"
                }, [
                    m("img", {
                        src: "/src/apps/Daniel-Trabajos/imgs/tormenta_llovizna.png",
                        alt: "Tormenta con llovizna moderada",
                        style: "position: absolute; top: 92%; right: 1%; transform: translate(-10%, -10%); width: 40px; height: 40px;",
                    })
                ]) : null,

                weather.description === "tormenta con llovizna fuerte" ? m("div", {
                    style: "display:flex; justify-content:center; margin-bottom: 300px;"
                }, [
                    m("img", {
                        src: "/src/apps/Daniel-Trabajos/imgs/tormenta_llovizna.png",
                        alt: "Tormenta con llovizna fuerte",
                        style: "position: absolute; top: 92%; right: 1%; transform: translate(-10%, -10%); width: 40px; height: 40px;",
                    })
                ]) : null,

                weather.description === "tormenta con nieve ligera" ? m("div", {
                    style: "display:flex; justify-content:center; margin-bottom: 300px;"
                }, [
                    m("img", {
                        src: "/src/apps/Daniel-Trabajos/imgs/tormenta_nieve.png",
                        alt: "Tormenta con nieve ligera",
                        style: "position: absolute; top: 92%; right: 1%; transform: translate(-10%, -10%); width: 40px; height: 40px;",
                    })
                ]) : null,

                weather.description === "tormenta con nieve moderada" ? m("div", {
                    style: "display:flex; justify-content:center; margin-bottom: 300px;"
                }, [
                    m("img", {
                        src: "/src/apps/Daniel-Trabajos/imgs/tormenta_nieve.png",
                        alt: "Tormenta con nieve moderada",
                        style: "position: absolute; top: 92%; right: 1%; transform: translate(-10%, -10%); width: 40px; height: 40px;",
                    })
                ]) : null,

                weather.description === "tormenta con nieve fuerte" ? m("div", {
                    style: "display:flex; justify-content:center; margin-bottom: 300px;"
                }, [
                    m("img", {
                        src: "/src/apps/Daniel-Trabajos/imgs/tormenta_nieve.png",
                        alt: "Tormenta con nieve fuerte",
                        style: "position: absolute; top: 92%; right: 1%; transform: translate(-10%, -10%); width: 40px; height: 40px;",
                    })
                ]) : null,

                weather.description === "niebla" ? m("div", {
                    style: "display:flex; justify-content:center; margin-bottom: 300px;"
                }, [
                    m("img", {
                        src: "/src/apps/Daniel-Trabajos/imgs/niebla.png",
                        alt: "Niebla",
                        style: "position: absolute; top: 92%; right: 1%; transform: translate(-10%, -10%); width: 40px; height: 40px;",
                    })
                ]) : null,

                weather.description === "bruma" ? m("div", {
                    style: "display:flex; justify-content:center; margin-bottom: 300px;"
                }, [
                    m("img", {
                        src: "/src/apps/Daniel-Trabajos/imgs/bruma.png",
                        alt: "Bruma",
                        style: "position: absolute; top: 92%; right: 1%; transform: translate(-10%, -10%); width: 40px; height: 40px;",
                    })
                ]) : null,

                weather.description === "tormenta de arena/polvo" ? m("div", {
                    style: "display:flex; justify-content:center; margin-bottom: 300px;"
                }, [
                    m("img", {
                        src: "/src/apps/Daniel-Trabajos/imgs/tormenta_arena:polvo.jpeg",
                        alt: "Tormenta de arena/polvo",
                        style: "position: absolute; top: 92%; right: 1%; transform: translate(-10%, -10%); width: 40px; height: 40px;",
                    })
                ]) : null,

                weather.description === "volcánica" ? m("div", {
                    style: "display:flex; justify-content:center; margin-bottom: 300px;"
                }, [
                    m("img", {
                        src: "/src/apps/Daniel-Trabajos/imgs/volcan.png",
                        alt: "Volcánica",
                        style: "position: absolute; top: 92%; right: 1%; transform: translate(-10%, -10%); width: 40px; height: 40px;",
                    })
                ]) : null,

                weather.description === "tornado" ? m("div", {
                    style: "display:flex; justify-content:center; margin-bottom: 300px;"
                }, [
                    m("img", {
                        src: "/src/apps/Daniel-Trabajos/imgs/tornado.png",
                        alt: "Tornado",
                        style: "position: absolute; top: 92%; right: 1%; transform: translate(-10%, -10%); width: 40px; height: 40px;",
                    })
                ]) : null,

                weather.description === "nieve" ? m("div", {
                    style: "display:flex; justify-content:center; margin-bottom: 300px;"
                }, [
                    m("img", {
                        src: "/src/apps/Daniel-Trabajos/imgs/nieve.png",
                        alt: "nieve",
                        style: "position: absolute; top: 92%; right: 1%; transform: translate(-10%, -10%); width: 40px; height: 40px;",
                    })
                ]) : null,
            ]),
            m(
                "div",
                {
                    style:
                    "display: flex; background-color: rgb(168, 158, 10); margin-top: 150px; margin-left: 170px; padding: 35px;"
                },
                [
                    m(Digit, { digit: Math.floor(hours / 10) }),
                    m(Digit, { digit: hours % 10 }),
                    m("div", {
                        style: "font-size: 50px; color: white; margin-top: 55px; margin-right: 10px;"
                    }, ":"),
                    m(Digit, { digit: Math.floor(min / 10) }),
                    m(Digit, { digit: min % 10 }),
                    m("div", {
                        style: "font-size: 50px; color: white; margin-top: 55px; margin-right: 10px;"
                    }, ":"),
                    m(Digit, { digit: Math.floor(sec / 10) }),
                    m(Digit, { digit: sec % 10 }),
                ]),
        ]
    }
}

function AnalogClock() {
    var now = new Date();
    var hours = now.getHours() % 12;
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();

    var hourAngle = (hours * 30) + (minutes / 2);
    var minuteAngle = (minutes * 6) + (0.1 * seconds);
    var secondAngle = seconds * 6;

    var clock = m('.clock', [
        m('.hour', { style: { transform: 'rotate(' + hourAngle + 'deg)' } }),
        m('.minute', { style: { transform: 'rotate(' + minuteAngle + 'deg)' } }),
        m('.second', { style: { transform: 'rotate(' + secondAngle + 'deg)' } }),
        m('.dot'),
        m('.number.one', '1'),
        m('.number.two', '2'),
        m('.number.three', '3'),
        m('.number.four', '4'),
        m('.number.five', '5'),
        m('.number.six', '6'),
        m('.number.seven', '7'),
        m('.number.eight', '8'),
        m('.number.nine', '9'),
        m('.number.ten', '10'),
        m('.number.eleven', '11'),
        m('.number.twelve', '12')
    ]);

    return clock;
}

function DigitCountdown() {
    let digit;
    let wide;
    let color;
  
    return {
      view: (vnode) => {
        digit = vnode.attrs.digit;
        wide = vnode.attrs.wide || 15;
        color = vnode.attrs.color || "white";
        let border = `${wide}px solid ${color}`;
        return m("div", { style: "display: flex; flex-direction: column; width: 40px;" },
          m("div", {
            style: {
              width: "40px",
              height: "40px",
              ...([0, 2, 3, 5, 7, 8, 9].includes(digit) ? { "border-top": border } : {}),
              ...([0, 1, 4, 5, 6, 8, 9].includes(digit) ? { "border-left": border } : {}),
              ...([0, 2, 3, 4, 7, 8, 9].includes(digit) ? { "border-right": border } : {}),
              ...([2, 3, 4, 5, 6, 8, 9].includes(digit) ? { "border-bottom": border } : {}),
            }
          }),
          m("div", {
            style: {
              width: "40px",
              height: "40px",
              ...([0, 1, 2, 6, 8].includes(digit) ? { "border-left": border } : {}),
              ...([0, 3, 4, 5, 6, 7, 8, 9].includes(digit) ? { "border-right": border } : {}),
              ...([0, 2, 3, 5, 6, 8].includes(digit) ? { "border-bottom": border } : {}),
            }
          }),
        )
      }
    }
}

function Countdown() {
      let hours = 0;
      let min = 0;
      let sec = 0;
      let targetTime;
      let timer;
      let isRunning = false;
      let isPaused = false;
      let remainingTime = 0;
      let isVisible = false;
        
    function toggleCountdown() {
        let countdownElement = document.getElementById("countdown");
        let toggleButton = document.getElementById("toggle-button");
        if (countdownElement.style.visibility === "hidden") {
          countdownElement.style.visibility = "visible";
          toggleButton.style.visibility = "visible";
          isVisible = true;
        } else {
          countdownElement.style.visibility = "hidden";
          toggleButton.style.visibility = "visible";
          isVisible = false;
        }
    }     
      
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
            setTimeout(() => {
            alert("Countdown has finished!!!");
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
        targetTime = new Date().getTime() + remainingTime;
        clearInterval(timer);
        timer = setInterval(updateTime, 100);
        isPaused = false;
        isRunning = true;
    }       

    function resetCountdown() {
        clearInterval(timer);
        isRunning = false;
        hours = 0;
        min = 0;
        sec = 0;
    }

    function setTargetTime(t) {
        targetTime = t;
        m.redraw();
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
                m("div", { style: "display: flex; flex-direction: row; margin-top: 50px; margin-left: 100px;" }, [
                    m("div", { style: "margin-left: 110; margin-right: auto;" }, [
                        m("label", { for: "hours-input" }, "H: "),
                        m("select", { id: "hours-input" }, hourList.map(hour => m("option", { value: hour }, hour)))
                    ]),
                    m("div", { style: "margin-left: 5; margin-right: 50;" }, [
                        m("label", { for: "minutes-input" }, "M: "),
                        m("select", { id: "minutes-input" }, minSecList.map(minute => m("option", { value: minute }, minute)))
                    ]),
                    m("div", { style: "margin-left: 5; margin-right: 290;" }, [
                        m("label", { for: "seconds-input" }, "S: "),
                        m("select", { id: "seconds-input" }, minSecList.map(second => m("option", { value: second }, second)))
                    ])                    
                ]),                
                m("div", { style: "display: flex; margin-left: 170; margin-right: 245; gap: 10px; background-color: rgb(61, 78, 160); padding: 15px;" }, [
                    m(DigitCountdown, { digit: Math.floor(hours / 10) }),
                    m(DigitCountdown, { digit: hours % 10 }),
                    m("div", { style: "font-size: 50px; margin-top: 30px; margin-right: 5px;" }, ":"),
                    m(DigitCountdown, { digit: Math.floor(min / 10) }),
                    m(DigitCountdown, { digit: min % 10 }),
                    m("div", { style: "font-size: 50px; margin-top: 30px; margin-right: 5px;" }, ":"),
                    m(DigitCountdown, { digit: Math.floor(sec / 10) }),
                    m(DigitCountdown, { digit: sec % 10 }),
                ]),
                m("div", { style: "display: flex; flex-direction: column; align-items: center; gap: 2px; margin-top: -100px; right: 9%; transform: translateX(25%)" }, [
                    m("button", { id : "StartPause", onclick: toggleStartPause }, isPaused ? "Resumir" : (isRunning ? "Pausar" : "Iniciar")),
                    m("button", { id: "reset", onclick: resetCountdown }, "Limpiar"),
                ]), 
                m("div", { style: "position: absolute; top: 52%; right: 9%; transform: translateX(50%);" }, [
                    m("button", { id : "toggle-button", onclick: toggleCountdown }, isVisible ? "Esconder Cuenta Regresiva 1" : "Mostrar Cuenta Regresiva 1")
                ]), 
            ])
        }
    }
}

function Countdown2() {
    let hours2 = 0;
    let min2 = 0;
    let sec2 = 0;
    let targetTime2;
    let timer2;
    let isRunning = false;
    let isPaused = false;
    let remainingTime2 = 0;
    let isVisible2 = false;

    function toggleCountdown2() {
        let countdownElement = document.getElementById("countdown2");
        let toggleButton = document.getElementById("toggle-button2");
        if (countdownElement.style.visibility === "hidden") {
          countdownElement.style.visibility = "visible";
          toggleButton.style.visibility = "visible";
          isVisible2 = true;
        } else {
          countdownElement.style.visibility = "hidden";
          toggleButton.style.visibility = "visible";
          isVisible2 = false;
        }
    }     
      
    function toggleStartPause2() {
        if (!isRunning) {
            startCountdown2();
        } else if (isPaused) {
            resumeCountdown2();
        } else {
            pauseCountdown2();
        }
    }

  function startCountdown2() {
      if (!isRunning && !isPaused) {
          hours2 = parseInt(document.getElementById("hours-input-2").value);
          min2 = parseInt(document.getElementById("minutes-input-2").value);
          sec2 = parseInt(document.getElementById("seconds-input-2").value);
          targetTime2 = new Date().getTime() + (hours2 * 60 * 60 * 1000) + (min2 * 60 * 1000) + (sec2 * 1000);
          clearInterval(timer2);
          timer2 = setInterval(updateTime2, 100);
          isRunning = true;
      } else if (isPaused) {
          targetTime2 = new Date().getTime() + remainingTime2;
          clearInterval(timer2);
          timer2 = setInterval(updateTime2, 100);
          isPaused = false;
          isRunning = true;
      }
  }

  function updateTime2() {
    let currentTime = new Date().getTime();
    let remainingTime2 = targetTime2 - currentTime;

    if (remainingTime2 <= 0) {
        clearInterval(timer2);
        setTimeout(() => {
        alert("Countdown has finished!!!");
        resetCountdown2();
        }, 500);
        return;
    }

    let newHours2 = Math.floor(remainingTime2 / (1000 * 60 * 60));
    let newMin2 = Math.floor((remainingTime2 / (1000 * 60)) % 60);
    let newSec2 = Math.floor((remainingTime2 / 1000) % 60);

    let elapsedMs = currentTime % 1000;
    if (remainingTime2 >= 500 && (elapsedMs + remainingTime2 >= 1000)) {
        newSec2 = Math.ceil(newSec2);
        if (newSec2 === 60) {
            newSec2 = 0;
            newMin2++;
        }
        if (newMin2 === 60) {
            newMin2 = 0;
            newHours2++;
        }
        console.log(hours2, min2, sec2);
        m.redraw();
    }

    hours2 = newHours2;
    min2 = newMin2;
    sec2 = newSec2;
    m.redraw();
  }

  function pauseCountdown2() {
      clearInterval(timer2);
      remainingTime2 = targetTime2 - new Date().getTime();
      isPaused = true;
      isRunning = false;
  }
  
  function resumeCountdown2() {
      targetTime2 = new Date().getTime() + remainingTime2;
      clearInterval(timer2);
      timer2 = setInterval(updateTime2, 100);
      isPaused = false;
      isRunning = true;
  }       

  function resetCountdown2() {
      clearInterval(timer2);
      isRunning = false;
      hours2 = 0;
      min2 = 0;
      sec2 = 0;
  }

  function setTargetTime2(d) {
      targetTime2 = d;
      m.redraw();
  }
  
  setTargetTime2(new Date().getTime() + ((hours2 * 60 * 60) + (min2 * 60) + sec2) * 1000);

    return {
        view: () => {
            let hourList2 = [];
            for (let i = 0; i <= 99; i++) {
                hourList2.push(i.toString());
            }
            let minSecList2 = [];
            for (let i = 0; i <= 59; i++) {
                minSecList2.push(i.toString());
            }
            return m("div", [
                m("div", { style: "display: flex; flex-direction: row; margin-top: 50px; margin-left: 70px;" }, [
                    m("div", { style: "margin-left: 110; margin-right: auto;" }, [
                        m("label", { for: "hours-input-2" }, "H: "),
                        m("select", { id: "hours-input-2" }, hourList2.map(hour => m("option", { value: hour }, hour)))
                    ]),
                    m("div", { style: "margin-left: 5; margin-right: 50;" }, [
                        m("label", { for: "minutes-input-2" }, "M: "),
                        m("select", { id: "minutes-input-2" }, minSecList2.map(minute => m("option", { value: minute }, minute)))
                    ]),
                    m("div", { style: "margin-left: 5; margin-right: 290;" }, [
                        m("label", { for: "seconds-input-2" }, "S: "),
                        m("select", { id: "seconds-input-2" }, minSecList2.map(second => m("option", { value: second }, second)))
                    ])                    
                ]),                
                m("div", { style: "display: flex; margin-left: 170; margin-right: 245; gap: 10px; background-color: rgb(202, 135, 9); padding: 15px;" }, [
                    m(DigitCountdown, { digit: Math.floor(hours2 / 10) }),
                    m(DigitCountdown, { digit: hours2 % 10 }),
                    m("div", { style: "font-size: 50px; margin-top: 30px; margin-right: 5px;" }, ":"),
                    m(DigitCountdown, { digit: Math.floor(min2 / 10) }),
                    m(DigitCountdown, { digit: min2 % 10 }),
                    m("div", { style: "font-size: 50px; margin-top: 30px; margin-right: 5px;" }, ":"),
                    m(DigitCountdown, { digit: Math.floor(sec2 / 10) }),
                    m(DigitCountdown, { digit: sec2 % 10 }),
                ]),
                m("div", { style: "display: flex; flex-direction: column; align-items: center; gap: 2px; margin-top: -100px; right: 9%; transform: translateX(25%)" }, [
                    m("button", { id : "StartPause2", onclick: toggleStartPause2 }, isPaused ? "Resumir" : (isRunning ? "Pausar" : "Iniciar")),
                    m("button", { id: "reset2", onclick: resetCountdown2 }, "Limpiar"),
                ]),
                m("div", { style: "position: absolute; top: 72%; right: 9%; transform: translateX(50%);" }, [
                    m("button", { id : "toggle-button2", onclick: toggleCountdown2 }, isVisible2 ? "Esconder Cuenta Regresiva 2" : "Mostrar Cuenta Regresiva 2")
                ]), 
            ])
        }
    }
}

function Countdown3() {
    let hours3 = 0;
    let min3 = 0;
    let sec3 = 0;
    let targetTime3;
    let timer3;
    let isRunning = false;
    let isPaused = false;
    let remainingTime3 = 0;
    let isVisible3 = false;

    function toggleCountdown3() {
        let countdownElement = document.getElementById("countdown3");
        let toggleButton = document.getElementById("toggle-button3");
        if (countdownElement.style.visibility === "hidden") {
          countdownElement.style.visibility = "visible";
          toggleButton.style.visibility = "visible";
          isVisible3 = true;
        } else {
          countdownElement.style.visibility = "hidden";
          toggleButton.style.visibility = "visible";
          isVisible3 = false;
        }
    }     
      
    function toggleStartPause3() {
        if (!isRunning) {
            startCountdown3();
        } else if (isPaused) {
            resumeCountdown3();
        } else {
            pauseCountdown3();
        }
    }

  function startCountdown3() {
      if (!isRunning && !isPaused) {
          hours3 = parseInt(document.getElementById("hours-input-3").value);
          min3 = parseInt(document.getElementById("minutes-input-3").value);
          sec3 = parseInt(document.getElementById("seconds-input-3").value);
          targetTime3 = new Date().getTime() + (hours3 * 60 * 60 * 1000) + (min3 * 60 * 1000) + (sec3 * 1000);
          clearInterval(timer3);
          timer3 = setInterval(updateTime3, 100);
          isRunning = true;
      } else if (isPaused) {
          targetTime3 = new Date().getTime() + remainingTime3;
          clearInterval(timer2);
          timer3 = setInterval(updateTime3, 100);
          isPaused = false;
          isRunning = true;
      }
  }

  function updateTime3() {
    let currentTime = new Date().getTime();
    let remainingTime3 = targetTime3 - currentTime;

    if (remainingTime3 <= 0) {
        clearInterval(timer3);
        setTimeout(() => {
        alert("Countdown has finished!!!");
        resetCountdown3();
        }, 500);
        return;
    }

    let newHours3 = Math.floor(remainingTime3 / (1000 * 60 * 60));
    let newMin3 = Math.floor((remainingTime3 / (1000 * 60)) % 60);
    let newSec3 = Math.floor((remainingTime3 / 1000) % 60);

    let elapsedMs = currentTime % 1000;
    if (remainingTime3 >= 500 && (elapsedMs + remainingTime3 >= 1000)) {
        newSec3 = Math.ceil(newSec3);
        if (newSec3 === 60) {
            newSec3 = 0;
            newMin3++;
        }
        if (newMin3 === 60) {
            newMin3 = 0;
            newHours3++;
        }
        console.log(hours3, min3, sec3);
        m.redraw();
    }

    hours3 = newHours3;
    min3 = newMin3;
    sec3 = newSec3;
    m.redraw();
  }

  function pauseCountdown3() {
      clearInterval(timer3);
      remainingTime3 = targetTime3 - new Date().getTime();
      isPaused = true;
      isRunning = false;
  }
  
  function resumeCountdown3() {
      targetTime3 = new Date().getTime() + remainingTime3;
      clearInterval(timer3);
      timer3 = setInterval(updateTime3, 100);
      isPaused = false;
      isRunning = true;
  }       

  function resetCountdown3() {
      clearInterval(timer3);
      isRunning = false;
      hours3 = 0;
      min3 = 0;
      sec3 = 0;
  }

  function setTargetTime3(f) {
      targetTime3 = f;
      m.redraw();
  }
  
  setTargetTime3(new Date().getTime() + ((hours3 * 60 * 60) + (min3 * 60) + sec3) * 1000);

    return {
        view: () => {
            let hourList3 = [];
            for (let i = 0; i <= 99; i++) {
                hourList3.push(i.toString());
            }
            let minSecList3 = [];
            for (let i = 0; i <= 59; i++) {
                minSecList3.push(i.toString());
            }
            return m("div", [
                m("div", { style: "display: flex; flex-direction: row; margin-top: 50px; margin-left: 70px;" }, [
                    m("div", { style: "margin-left: 110; margin-right: auto;" }, [
                        m("label", { for: "hours-input-3" }, "H: "),
                        m("select", { id: "hours-input-3" }, hourList3.map(hour => m("option", { value: hour }, hour)))
                    ]),
                    m("div", { style: "margin-left: 5; margin-right: 50;" }, [
                        m("label", { for: "minutes-input-3" }, "M: "),
                        m("select", { id: "minutes-input-3" }, minSecList3.map(minute => m("option", { value: minute }, minute)))
                    ]),
                    m("div", { style: "margin-left: 5; margin-right: 290;" }, [
                        m("label", { for: "seconds-input-3" }, "S: "),
                        m("select", { id: "seconds-input-3" }, minSecList3.map(second => m("option", { value: second }, second)))
                    ])                    
                ]),                
                m("div", { style: "display: flex; margin-left: 170; margin-right: 245; gap: 10px; background-color: rgb(113, 94, 131); padding: 15px;" }, [
                    m(DigitCountdown, { digit: Math.floor(hours3 / 10) }),
                    m(DigitCountdown, { digit: hours3 % 10 }),
                    m("div", { style: "font-size: 50px; margin-top: 30px; margin-right: 5px;" }, ":"),
                    m(DigitCountdown, { digit: Math.floor(min3 / 10) }),
                    m(DigitCountdown, { digit: min3 % 10 }),
                    m("div", { style: "font-size: 50px; margin-top: 30px; margin-right: 5px;" }, ":"),
                    m(DigitCountdown, { digit: Math.floor(sec3 / 10) }),
                    m(DigitCountdown, { digit: sec3 % 10 }),
                ]),
                m("div", { style: "display: flex; flex-direction: column; align-items: center; gap: 2px; margin-top: -100px; right: 9%; transform: translateX(25%)" }, [
                    m("button", { id : "StartPause3", onclick: toggleStartPause3 }, isPaused ? "Resumir" : (isRunning ? "Pausar" : "Iniciar")),
                    m("button", { id: "reset3", onclick: resetCountdown3 }, "Limpiar"),
                ]),
                m("div", { style: "position: absolute; top: 92%; right: 9%; transform: translateX(50%);" }, [
                    m("button", { id : "toggle-button3", onclick: toggleCountdown3 }, isVisible3 ? "Esconder Cuenta Regresiva 3" : "Mostrar Cuenta Regresiva 3")
                ]),
            ])
        }
    }
}   

export { Clock, AnalogClock, Countdown, Countdown2, Countdown3, getCurrentDate, }
