import { HealthComponent } from "../components/HealthComponent";
import ScoreComponent, { updateHighscore } from "../components/ScoreComponent";
import { ECS, Entity, System, SystemDefaults } from "../ecs";


const scoreElement = document.querySelector<HTMLSpanElement>("#score");

export const ScoreSystem = (ecs: ECS, player: Entity, score: Entity): System => ({
	...SystemDefaults,
	msPerTick: 1000 / 10,
	query: {},
	handler() {
		const scoreComponent = ecs.get(score, ScoreComponent);
		const playerHealth = ecs.get(player, HealthComponent);
		if (!scoreElement || !scoreComponent) {
			return;
		}

		if (playerHealth?.health) {
			scoreElement.innerText = `${(++scoreComponent.score).toString()} / ${scoreComponent.highscore}`;
		} else if(scoreComponent.score > +scoreComponent.highscore) {
			updateHighscore(scoreComponent.score);
		}
	},
});
