import { AnimatedSpriteComponent } from "../components/AnimatedSpriteComponent";
import { MovementComponent } from "../components/MovementComponent";
import { ECS, Entity, System, SystemDefaults } from "../ecs";

export const UpdateSpriteStateSystem = (ecs: ECS): System => ({
	...SystemDefaults,
	query: {},
	handler(entities: Entity[]) {
		entities.forEach((entity) => {
			const sprite = ecs?.get(entity, AnimatedSpriteComponent);
			const movement = ecs?.get(entity, MovementComponent);

			if (sprite && movement && sprite.state !== movement.state) {
				sprite.state = movement.state;
			}
		});
	},
});
