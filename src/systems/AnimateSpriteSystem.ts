import { AnimatedSpriteComponent } from "../components/AnimatedSpriteComponent";
import { ECS, Entity, System } from "../ecs";

export const AnimateSpriteSystem = (ecs: ECS): System => ({
	query: {},
	handler(entities: Entity[]) {
		entities.forEach((entity) => {
			const sprite = ecs?.get(entity, AnimatedSpriteComponent);

			if (sprite) {
				sprite.frameIndex += 1;
				if (sprite.frameIndex > sprite.totalFrames) {
					sprite.frameIndex = 0;
				}
			}
		});
	},
});
