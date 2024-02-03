import HttpException from "./http.exception";

class GameException extends HttpException {
  public message: string;

  constructor(message: string) {
    super(503, message);
    this.message = message;
  }
}

export default GameException;
