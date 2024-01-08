//Din cauza faptului ca trebuie sa verificam
//Coliziunea unui poligon atipic(triunghi)
//Avem nevoie de un numar de functii speciale
//Acest fisier va avea rol de "biblioteca", stocand functii

function circleTriangleCollision(circle, triangle) {
    //Verificam coliziunea cu fiecare dintre colturi
    for (let i = 0; i < 3; i++) {
        let start = triangle[i];
        let end = triangle[(i + 1) % 3];

        let distanceX = end.x - start.x;
        let distanceY = end.y - start.y;
        let length = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        let dot =
            ((circle.getPosition().x - start.x) * distanceX +
                (circle.getPosition().y - start.y) * distanceY) /
            Math.pow(length, 2);

        let closestX = start.x + dot * distanceX;
        let closestY = start.y + dot * distanceY;

        if (!isPointOnLineSegment(closestX, closestY, start, end)) {
            closestX = closestX < start.x ? start.x : end.x;
            closestY = closestY < start.y ? start.y : end.y;
        }

        distanceX = closestX - circle.getPosition().x;
        distanceY = closestY - circle.getPosition().y;

        let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

        if (distance <= circle.getRadius()) {
            return true;
        }
    }

    //Nu exista coliziune
    return false;
}

function isPointOnLineSegment(x, y, start, end) {
    return (
        x >= Math.min(start.x, end.x) &&
        x <= Math.max(start.x, end.x) &&
        y >= Math.min(start.y, end.y) &&
        y <= Math.max(start.y, end.y)
    );
}
