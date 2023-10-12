import { Vec2 } from "planck";
import {
	MovementComponent,
	MovementDirection,
	MovementState,
} from "../components/MovementComponent";
import { PhysicsComponent } from "../components/PhysicsComponent";
import { ECS, Entity, System, SystemDefaults } from "../ecs";

export const MovementSystem = (ecs: ECS): System => ({
	...SystemDefaults,
	query: {},
	handler(entities: Entity[]) {
		entities.forEach((entity) => {
			const movement = ecs?.get(entity, MovementComponent);
			const physics = ecs?.get(entity, PhysicsComponent);

			if (movement && physics) {
				const velocity = physics.velocity.clone();
				if (movement.state === MovementState.RUNNING) {
					// Move the entity in the desired direction by updating the velocity

					switch (movement.direction) {
						case MovementDirection.LEFT:
							velocity.x = -75;
							break;
						case MovementDirection.RIGHT:
							velocity.x = 75;
							break;
					}

					physics.velocity = velocity;
				}

				// if jumping and y velocity is 0 ( not jumping or falling ) apply impulse to make the body "jump"
				if (movement.state === MovementState.JUMPING && velocity.y === 0) {
					physics.body.applyLinearImpulse(
						new Vec2(0, -30),
						physics.body.getWorldCenter(),
					);
				}

				// check the velocity and determine the state of the movement
				if (velocity.y < 0) {
					// movement.state = MovementState.JUMPING;
				} else if (velocity.y > 0) {
					movement.state = MovementState.FALLING;
				} else if (velocity.y === 0) {
					movement.state = MovementState.IDLE;
				}
			}
		});
	},
});
