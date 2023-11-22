import { Component } from "../ecs";

const HIGHSCORE_KEY = "highscore";

let highscore: string = "0";
try {
	highscore = localStorage.getItem(HIGHSCORE_KEY) ?? "0";
} catch (e) {}

export function updateHighscore(score: number) {
	if (score > +highscore) {
		try {
			localStorage.setItem(HIGHSCORE_KEY, highscore);
		} catch (e) {}
	}
}

export default class ScoreComponent extends Component {
	score: number = 0;
	highscore: number = Number(highscore);

	public destroy(): void {}
}
