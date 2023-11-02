import { AnimatedSpriteComponent } from "../components/AnimatedSpriteComponent";
import { ECS, Entity, System, SystemDefaults } from "../ecs";

export const AnimateSpriteSystem = (ecs: ECS): System => ({
	...SystemDefaults,
	lag: 0,
	msPerTick: 1000 / 15,
	query: {},
	handler(entities: Entity[]) {
		entities.forEach((entity) => {
			const sprite = ecs?.get(entity, AnimatedSpriteComponent);

			if (sprite) {
				sprite.tick();
			}
		});
	},
});
