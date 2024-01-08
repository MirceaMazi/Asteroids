"use strict";

const FRICTION = 0.95;
const ROTATION_SPEED = 0.07;

//Luam canvas-ul din HTML si ii randam marimea, care va fi egala
//Cu marimea "window-ului" din pagina web si il facem negru, pentru fundal
const canvas = document.getElementById("game-canvas");
const canvasContext = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvasContext.fillRect(0, 0, canvas.width, canvas.height);

//Generam nava jucatorului in mijlocul ecranului
const spaceship = new Spaceship(
    { x: canvas.width / 2, y: canvas.height / 2 },
    { x: 0, y: 0 }
);

//Acesta este obiectul de care ne vom folosi pentru a stii ce tasta este apasata
const keys = {
    arrowUp: {
        pressed: false,
    },
    arrowDown: {
        pressed: false,
    },
    arrowLeft: {
        pressed: false,
    },
    arrowRight: {
        pressed: false,
    },
    x: {
        pressed: false,
    },
    z: {
        pressed: false,
    },
    c: {
        pressed: false,
    },
};

//Acesta este array-ul pe care il vom folosi pentru a
//Limita numarul de rachete permise pe ecran
const rockets = new Array();
const asteroids = new Array();

//La fiecare 2 secunde, un nou asteroid va aparea pe ecran
const intervalId = window.setInterval(function () {
    let x, y; //Position x and y
    let vx, vy; //Velocity x and y
    let radius = generateRadius();

    //Generam o valoarea aleatoare pentru marimea asteroidului
    function generateRadius() {
        const numbers = [70, 80, 90, 100];
        const randomIndex = Math.floor(Math.random() * numbers.length);
        return numbers[randomIndex];
    }

    //Generam aleator punctul de plecare al asteroidului
    function generatePosition() {
        //Cele 4 pozitii cardinale(sus, jos, stanga, dreapta)
        const index = Math.floor(Math.random() * 4);

        switch (index) {
            case 0: //Pleaca din stanga
                x = 0 - radius;
                y = Math.random() * canvas.height;
                vx = 1 * (Math.floor(Math.random() * SPEED) + 1);
                vy = 0;
                break;
            case 1: //Pleaca de jos
                x = Math.random() * canvas.width;
                y = canvas.height + radius;
                vx = 0;
                vy = -1 * (Math.floor(Math.random() * SPEED) + 1);
                break;
            case 2: //Pleaca din dreapta
                x = canvas.width + radius;
                y = Math.random() * canvas.height;
                vx = -1 * (Math.floor(Math.random() * SPEED) + 1);
                vy = 0;
                break;
            case 3: //Pleaca de sus
                x = Math.random() * canvas.width;
                y = 0 - radius;
                vx = 0;
                vy = 1 * (Math.floor(Math.random() * SPEED) + 1);
                break;
        }

        return [x, y, vx, vy];
    }

    [x, y, vx, vy] = generatePosition();

    asteroids.push(new Asteroid({ x: x, y: y }, { x: vx, y: vy }, radius));
}, 3000);

//Logica pentru coliziunea proiectillelor
function rocketCollision(rocket, asteroid) {
    //Luam diferenta dintre coordonate
    //Si aplicam Pitagora
    const distanceX = asteroid.getPosition().x - rocket.getPosition().x;
    const distanceY = asteroid.getPosition().y - rocket.getPosition().y;

    const distance = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));

    if (distance < rocket.getRadius() + asteroid.getRadius()) {
        return true;
    }

    return false;
}

let score = 0;
let target = 50;

//Trebuie sa actualizam permanent imaginea, pentru a randa
//Modificarile de pozitie ale asteroizilor si jucatorului
//O sa ne folosim de requestAnimationFrame
function animate() {
    const animationId = window.requestAnimationFrame(animate);

    //Fundalul negru
    canvasContext.fillStyle = "black";
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);

    //Interfata
    canvasContext.fillStyle = "white";
    const font = "bold 50px serif";
    canvasContext.font = font;
    canvasContext.textBaseline = "top";

    canvasContext.fillText("Lives: " + spaceship.getLives(), 50, 50);
    canvasContext.fillText("Score: " + score, canvas.width - 250, 50);

    spaceship.update();

    //Logica pentru primirea de vieti suplimentare
    if (score > target && score !== 0) {
        target += 50;
        spaceship.setLives(spaceship.getLives() + 1);
    }

    //Aici randam rachetele lansate
    for (let i = rockets.length - 1; i >= 0; i--) {
        const rocket = rockets[i];
        rocket.update();

        //Cand o racheta depaseste limitele canvas-ului, va fi stearsa
        //Pentru a nu supra solicita resursele
        if (
            rocket.getPosition().x + rocket.getRadius() < 0 ||
            rocket.getPosition().x - rocket.getRadius() > canvas.width ||
            rocket.getPosition().y - rocket.getRadius() > canvas.height ||
            rocket.getPosition().y + rocket.getRadius() < 0
        ) {
            rockets.splice(i, 1);
        }
    }

    //Aici randam asteroizii
    for (let i = asteroids.length - 1; i >= 0; i--) {
        const asteroid = asteroids[i];
        asteroid.update();

        //Logica de "Game Over"
        if (circleTriangleCollision(asteroid, spaceship.getVertices())) {
            //Cazul in care ramai fara vieti si e afisat "Game Over"
            if (spaceship.getLives() === 0) {
                window.cancelAnimationFrame(animationId);
                window.clearInterval(intervalId);

                canvasContext.fillStyle = "black";
                canvasContext.fillRect(0, 0, canvas.width, canvas.height);

                canvasContext.fillStyle = "white";
                const font = "bold 100px serif";
                canvasContext.font = font;
                canvasContext.textBaseline = "top";

                canvasContext.fillText(
                    "Game Over",
                    (canvas.width - 450) / 2,
                    (canvas.height - 100) / 2
                );
            } else {
                //Cazul in care mai ai vieti, iar jocul se continua
                canvasContext.fillStyle = "black";
                canvasContext.fillRect(0, 0, canvas.width, canvas.height);
                asteroids.splice(0);

                spaceship.setLives(spaceship.getLives() - 1);
                spaceship.setPosition({
                    x: canvas.width / 2,
                    y: canvas.height / 2,
                });
                spaceship.setVelocity({ x: 0, y: 0 });
            }
        }

        //garbage collection pentru asteroizi
        if (
            asteroid.getPosition().x + asteroid.getRadius() < 0 ||
            asteroid.getPosition().x - asteroid.getRadius() > canvas.width ||
            asteroid.getPosition().y - asteroid.getRadius() > canvas.height ||
            asteroid.getPosition().y + asteroid.getRadius() < 0
        ) {
            asteroids.splice(i, 1);
        }

        //Aici verificam coliziunea dintre asteroizi si rachete
        for (let j = rockets.length - 1; j >= 0; j--) {
            const rocket = rockets[j];

            if (rocketCollision(rocket, asteroid)) {
                rockets.splice(j, 1);

                if (asteroid.getRadius() > 70) {
                    asteroid.setRadius(asteroid.getRadius() - 10);
                    score += 5;
                } else if (asteroid.getRadius() === 70) {
                    asteroids.splice(i, 1);
                    score += 10;
                }
            }
        }

        //Aici verificam coliziunea dintre 2 asteroizi si le inversam
        //Traiectoria in caz de impact
        for (let k = asteroids.length - 2; k >= 0; k--) {
            const asteroid2 = asteroids[k];

            if (asteroid2 !== asteroid) {
                if (rocketCollision(asteroid2, asteroid)) {
                    asteroid.setVelocity({
                        x: -asteroid.getVelocity().x,
                        y: -asteroid.getVelocity().y,
                    });
                    asteroid2.setVelocity({
                        x: -asteroid2.getVelocity().x,
                        y: -asteroid2.getVelocity().y,
                    });
                }
            }
        }
    }

    //Daca se doreste o viteza constanta a navetei(fara forta de frecare),
    //Activeaza codul de aici si elimina else if-ul de la "keys.arrowUp.pressed"
    // spaceship.setVelocity({ x: 0, y: 0 });

    //Controale sageti
    if (keys.arrowUp.pressed) {
        let newX = Math.cos(spaceship.getRotation());
        let newY = Math.sin(spaceship.getRotation());
        spaceship.setVelocity({ x: newX, y: newY });
    } else if (!keys.arrowUp.pressed) {
        let newVelocity = spaceship.getVelocity();
        newVelocity.x *= FRICTION;
        newVelocity.y *= FRICTION;
    }
    if (keys.arrowDown.pressed) {
        let newX = Math.cos(spaceship.getRotation());
        let newY = Math.sin(spaceship.getRotation());
        spaceship.setVelocity({ x: -newX, y: -newY });
    }
    if (keys.arrowLeft.pressed) {
        let newX = Math.cos(spaceship.getRotation());
        let newY = Math.sin(spaceship.getRotation());
        spaceship.setVelocity({ x: newY, y: -newX });
    }
    if (keys.arrowRight.pressed) {
        let newX = Math.cos(spaceship.getRotation());
        let newY = Math.sin(spaceship.getRotation());
        spaceship.setVelocity({ x: -newY, y: newX });
    }

    //Controale rotatie
    if (keys.z.pressed) {
        let newRotation = spaceship.getRotation();
        newRotation -= ROTATION_SPEED;
        spaceship.setRotation(newRotation);
    }
    if (keys.c.pressed) {
        let newRotation = spaceship.getRotation();
        newRotation += ROTATION_SPEED;
        spaceship.setRotation(newRotation);
    }
}

animate();

window.addEventListener("keydown", (e) => {
    switch (e.key) {
        case "ArrowUp":
            keys.arrowUp.pressed = true;
            break;
        case "ArrowDown":
            keys.arrowDown.pressed = true;
            break;
        case "ArrowLeft":
            keys.arrowLeft.pressed = true;
            break;
        case "ArrowRight":
            keys.arrowRight.pressed = true;
            break;
        case "x":
            //Verificarea numarului curent de rachete si
            //Generarea noilor rachete cand "x" este apasat
            if (rockets.length < 3) {
                let newX = Math.cos(spaceship.getRotation());
                let newY = Math.sin(spaceship.getRotation());

                rockets.push(
                    new Rocket(
                        {
                            x: spaceship.getPosition().x + newX * 20,
                            y: spaceship.getPosition().y + newY * 20,
                        },
                        { x: newX, y: newY }
                    )
                );
            }
            break;
        case "z":
            keys.z.pressed = true;
            break;
        case "c":
            keys.c.pressed = true;
            break;
    }
});

window.addEventListener("keyup", (e) => {
    switch (e.key) {
        case "ArrowUp":
            keys.arrowUp.pressed = false;
            break;
        case "ArrowDown":
            keys.arrowDown.pressed = false;
            break;
        case "ArrowLeft":
            keys.arrowLeft.pressed = false;
            break;
        case "ArrowRight":
            keys.arrowRight.pressed = false;
            break;
        case "z":
            keys.z.pressed = false;
            break;
        case "c":
            keys.c.pressed = false;
            break;
    }
});
