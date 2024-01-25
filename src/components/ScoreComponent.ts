import { Component } from "../ecs";

const HIGHSCORE_KEY = "highscore";

function getHighscore() {
  let highscore: string = "0";
  try {
    highscore = localStorage.getItem(HIGHSCORE_KEY) ?? "0";
  } catch (e) {}

  return +highscore;
}

export function updateHighscore(score: number) {
  const highscore = getHighscore();
  if (score > highscore) {
    try {
      localStorage.setItem(HIGHSCORE_KEY, score.toString());
    } catch (e) {}
  }
}

export default class ScoreComponent extends Component {
  score: number = 0;
  highscore: number = +getHighscore();

  public destroy(): void {}
}
