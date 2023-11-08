import { HealthComponent } from "../components/HealthComponent";
import { ECS, Entity, System, SystemDefaults } from "../ecs";

const HIGHSCORE_KEY = "highscore";

let highscore: string = '0';
try {
	highscore = localStorage.getItem(HIGHSCORE_KEY) ?? '0'; 
} catch(e) {}

const scoreElement = document.querySelector<HTMLSpanElement>("#score");

let score = 0;
export const ScoreSystem = (ecs: ECS, player: Entity): System => ({
	...SystemDefaults,
	msPerTick: 1000 / 60,
	query: {},
	handler() {
		if (!scoreElement) {
			return;
		}

		const playerHealth = ecs.get(player, HealthComponent);
		if (playerHealth?.health) {
			scoreElement.innerText = `${(++score).toString()} / ${highscore}`;
		} else if(+score > +highscore) {
			try {
				localStorage.setItem(HIGHSCORE_KEY, score.toString());
			} catch(e) {}
		}
	},
});
