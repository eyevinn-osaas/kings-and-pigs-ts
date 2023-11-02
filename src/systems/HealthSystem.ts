import {
	AnimatedSpriteComponent,
	SpriteVariant,
} from "../components/AnimatedSpriteComponent";
import { HealthComponent } from "../components/HealthComponent";
import { MovementComponent } from "../components/MovementComponent";
import { PhysicsComponent } from "../components/PhysicsComponent";
import { ECS, Entity, System, SystemDefaults } from "../ecs";

export const HealthSystem = (ecs: ECS, player: Entity): System => ({
	...SystemDefaults,
	query: {},
	handler() {
		const physics = ecs.get(player, PhysicsComponent);
		const playerHealth = ecs.get(player, HealthComponent);
		const sprite = ecs.get(player, AnimatedSpriteComponent);
		const movement = ecs.get(player, MovementComponent);
		if (!physics || !playerHealth || !sprite) {
			return;
		}

		if (playerHealth.health === 0) {
			sprite.variant = SpriteVariant.DYING;
			physics.body.getLinearVelocity().x = 0;

			if (movement) {
				ecs.destroy(player, movement);
			}
		}
	},
});
