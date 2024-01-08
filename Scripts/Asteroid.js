class Asteroid extends Rocket {
    draw() {
        canvasContext.beginPath();
        canvasContext.arc(
            this.getPosition().x,
            this.getPosition().y,
            this.getRadius(),
            0,
            Math.PI * 2,
            false
        );
        canvasContext.closePath();

        canvasContext.strokeStyle = "white";
        canvasContext.lineWidth = "5";
        canvasContext.stroke();

        canvasContext.fillStyle = "white";
        const font = "bold 30px serif";
        canvasContext.font = font;
        canvasContext.textBaseline = "middle";

        canvasContext.fillText(
            (this.getRadius() - 60) / 10,
            this.getPosition().x - 7,
            this.getPosition().y
        );
    }

    update() {
        this.draw();
        this.getPosition().x += this.getVelocity().x;
        this.getPosition().y += this.getVelocity().y;
    }
}
