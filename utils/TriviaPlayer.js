class TriviaPlayer {
    constructor(name) {
        this.name = name;
        this.score = 0;
    }

    addScore(points) {
        this.score += points;
    }

    getScore() {
        return this.score;
    }
}

module.exports = TriviaPlayer;
