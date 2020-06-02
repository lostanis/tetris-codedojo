export default class Controller {
  constructor(game, view) {
    this.game = game;
    this.view = view;
    this.isPlaying = false;
    this.intervalId = null;

    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    document.addEventListener('keyup', this.handleKeyUp.bind(this));
    this.view.renderStartScreen();
  }

  update() {
    this.game.movePieceDown();
    this.updateView()
  }

  play() {
    this.isPlaying = true;
    this.startTimer();
    this.updateView()
  };
  
  pause() {
    this.isPlaying = false;
    this.stopTimer();
    this.updateView()
  };

  reset() {
    this.game.reset();
    this.play()
  }

  updateView() {
    const state = this.game.getState();
    if (state.isGameOver) {
      this.view.renderEndScreen(state)
    } else if (!this.isPlaying) {
      this.view.renderPauseScreen();
    } else {
      this.view.renderMainScreen(this.game.getState());
    }
  }

  startTimer() {

    const speed = 1000 - this.game.getState().level * 100;

    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        this.update();
      }, speed > 0 ? speed : 100)
    };
  }

  stopTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  handleKeyDown(ev) {
    const state = this.game.getState();

    switch (ev.keyCode) {
      case 13: // Enter
        if (state.isGameOver) {
          this.reset()
        } else if (this.isPlaying) {
          this.pause()
        } else {
          this.play()
        }
        break;
      case 37: // LEFT
        this.game.movePieceLeft();
        this.updateView();
        break;
      case 38: // UP
        this.game.rotatePiece();
        this.updateView();
        break;
      case 39: // RIGHT
        this.game.movePieceRight();
        this.updateView();
        break;
      case 40: // DOWN
        this.stopTimer();
        this.game.movePieceDown();
        this.updateView();
        break;
    }
  }

  handleKeyUp(ev) {
    switch (ev.keyCode) {
      case 40:
        this.startTimer();
        break;
    }
  }
}
