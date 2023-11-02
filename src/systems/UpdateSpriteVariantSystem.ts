import {
	AnimatedSpriteComponent,
	SpriteVariant,
} from "../components/AnimatedSpriteComponent";
import {
	MovementComponent,
	MovementDirection,
	MovementState,
} from "../components/MovementComponent";
import { ECS, Entity, System, SystemDefaults } from "../ecs";

export const UpdateSpriteVariantSystem = (ecs: ECS): System => ({
	...SystemDefaults,
	query: {},
	handler(entities: Entity[]) {
		entities.forEach((entity) => {
			const sprite = ecs?.get(entity, AnimatedSpriteComponent);
			const movement = ecs?.get(entity, MovementComponent);

			if (sprite && movement) {
				if (movement.direction === MovementDirection.LEFT) {
					sprite.flip = true;
				} else if (movement.direction === MovementDirection.RIGHT) {
					sprite.flip = false;
				}

				if (sprite.variant === SpriteVariant.ATTACKING) {
					return;
				}
				switch (movement.state) {
					case MovementState.IDLE:
						sprite.variant = SpriteVariant.IDLE;
						break;
					case MovementState.RUNNING:
						sprite.variant = SpriteVariant.RUNNING;
						break;
					case MovementState.JUMPING:
						sprite.variant = SpriteVariant.JUMPING;
						break;
					case MovementState.FALLING:
						sprite.variant = SpriteVariant.FALLING;
						break;
				}
			}
		});
	},
});
