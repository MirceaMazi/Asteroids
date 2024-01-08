const SPEED = 5;

class Spaceship {
    #position; //Forma: {x, y}
    #velocity; //Forma: {x, y}
    #rotation; //Forma: number
    #lives //Forma: number

    //Position folosim pentru locatia navei
    //Velocity e folosit pentru calcularea vitezei
    //Rotation e important pentru a stii ce directie e "inainte"
    constructor(position, velocity, rotation = 0, lives = 2) {
        this.#position = position;
        this.#velocity = velocity;
        this.#rotation = rotation;
        this.#lives = lives;
    }

    getPosition() {
        return this.#position;
    }
    getVelocity() {
        return this.#velocity;
    }
    getRotation() {
        return this.#rotation;
    }
    getRotation() {
        return this.#rotation;
    }
    getLives(){
        return this.#lives;
    }

    setPosition(newPosition) {
        this.#position = newPosition;
    }
    setVelocity(newVelocity) {
        this.#velocity = newVelocity;
    }
    setRotation(newRotation) {
        this.#rotation = newRotation;
    }
    setRotation(newRotation) {
        this.#rotation = newRotation;
    }
    setLives(newLives){
        this.#lives = newLives;
    }

    //Desenam forma triunghiulara a navei
    draw() {
        canvasContext.save();

        canvasContext.translate(this.#position.x, this.#position.y);
        canvasContext.rotate(this.#rotation);
        canvasContext.translate(-this.#position.x, -this.#position.y);

        canvasContext.beginPath();
        canvasContext.moveTo(this.#position.x + 20, this.#position.y);
        canvasContext.lineTo(this.#position.x - 15, this.#position.y - 15);
        canvasContext.lineTo(this.#position.x - 15, this.#position.y + 15);
        canvasContext.closePath();

        canvasContext.fillStyle = "white";
        canvasContext.fill();

        canvasContext.restore();
    }

    //Functia utilizata pentru a actualiza pozitia navei pe ecran
    update() {
        this.draw();
        this.#position.x += this.#velocity.x * SPEED;
        this.#position.y += this.#velocity.y * SPEED;
    }

    getVertices() {
        const cos = Math.cos(this.#rotation);
        const sin = Math.sin(this.#rotation);

        //Aici returnam coordonatele fiecarui colt al triunghiului
        return [
            {
                x: this.#position.x + cos * 20 - sin * 0,
                y: this.#position.y + sin * 20 + cos * 0,
            },
            {
                x: this.#position.x + cos * 20 - sin * 15,
                y: this.#position.y + sin * -15 + cos * 15,
            },
            {
                x: this.#position.x + cos * -15 - sin * -15,
                y: this.#position.y + sin * -15 + cos * -15,
            },
        ];
    }
}
