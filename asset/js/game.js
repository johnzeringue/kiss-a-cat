'use strict';

window.onload = function() {
    var HOLE_SIZE_TO_SPACING = 10;

    var canvas = document.getElementById('game');
    var ctx = canvas.getContext('2d');

    var score = 0;
    var startTime = Date.now();

    var holeSize = function() {
        return canvas.width / (3 + 4 / HOLE_SIZE_TO_SPACING);
    };

    var spacing = function() {
        return holeSize() / HOLE_SIZE_TO_SPACING;
    };

    var holeX = function(x) {
        return x * (holeSize() + spacing()) + spacing();
    };

    var holeY = function(y) {
        return y * (holeSize() + spacing()) + spacing();
    };

    var clearCanvas = function(color) {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    var drawHoles = function() {
        var fillHole = function(x, y, size) {
            ctx.beginPath();

            ctx.arc(
                    x + size / 2, // cx
                    y + size / 2, // cy
                    size / 2,     // radius
                    0,            // start angle
                    Math.PI * 2); // end angle

            ctx.fill();
        };

        ctx.fillStyle = 'saddlebrown';
        for (var y = 0; y < 3; y++) {
            for (var x = 0; x < 3; x++) {
                fillHole(holeX(x), holeY(y), holeSize());
            }
        }
    };

    var catImage = function() {
        var image = new Image();
        image.src = 'asset/image/pinot.png';
        return image;
    };

    var drawCat = function(x, y) {
        ctx.drawImage(
                catImage(),
                holeX(x) + spacing(),
                holeY(y) + spacing(),
                holeSize() - 2 * spacing(),
                holeSize() - 2 * spacing());
    };

    var isFinished = function() {
        return Date.now() - startTime >= 10000;
    };

    var getCanvasX = function(mouseEvent) {
        var bounds = canvas.getBoundingClientRect();
        return (mouseEvent.pageX - bounds.left) * canvas.width / bounds.width;
    };

    var getCanvasY = function(mouseEvent) {
        var bounds = canvas.getBoundingClientRect();
        return (mouseEvent.pageY - bounds.top) * canvas.height / bounds.height;
    };

    var randomInt = function(min, max) {
          return Math.floor(Math.random() * (max - min)) + min;
    };

    var createCats = function() {
        var catX = randomInt(0, 3);
        var catY = randomInt(0, 3);

        clearCanvas('brown');
        drawHoles();
        drawCat(catX, catY);

        var createTime = Date.now();

        var isOnCat = function(x, y) {
            var cx = holeX(catX) + holeSize() / 2;
            var cy = holeY(catY) + holeSize() / 2;

            var dx = x - cx;
            var dy = y - cy;

            return holeSize() / 2 >= Math.sqrt(dx * dx + dy * dy);
        };

        var onClick = function(event) {
            var x = getCanvasX(event);
            var y = getCanvasY(event);

            if (isOnCat(x, y)) {
                canvas.removeEventListener('click', onClick);
                score += 1000 - Date.now() + createTime;

                if (isFinished()) {
                    showScore();
                } else {
                    createCats();
                }
            }
        };

        canvas.addEventListener('click', onClick);
    };

    var showScore = function() {
        alert('You scored ' + score + '!');
    };

    var playGame = function() {
        createCats();
    }

    playGame();
};
