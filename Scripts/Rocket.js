const ROCKET_SPEED = 10;

class Rocket {
    #position; //Forma: {x, y}
    #velocity; //Forma: {x, y}
    #radius; //Forma: number

    constructor(position, velocity, radius = 5) {
        this.#position = position;
        this.#velocity = velocity;
        this.#radius = radius;
    }

    getPosition() {
        return this.#position;
    }
    getVelocity() {
        return this.#velocity;
    }
    getRadius() {
        return this.#radius;
    }

    setPosition(newPosition) {
        this.#position = newPosition;
    }
    setVelocity(newVelocity) {
        this.#velocity = newVelocity;
    }
    setRadius(newRadius) {
        this.#radius = newRadius;
    }

    draw() {
        canvasContext.beginPath();
        canvasContext.arc(
            this.#position.x,
            this.#position.y,
            this.#radius,
            0,
            Math.PI * 2,
            false
        );
        canvasContext.closePath();

        canvasContext.fillStyle = "white";
        canvasContext.fill();
    }

    update() {
        this.draw();
        this.#position.x += this.#velocity.x * ROCKET_SPEED;
        this.#position.y += this.#velocity.y * ROCKET_SPEED;
    }
}
