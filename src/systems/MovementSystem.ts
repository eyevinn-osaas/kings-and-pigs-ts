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
				// Move the entity in the desired direction by updating the velocity
				const velocity = physics.velocity.clone();

				switch (movement.direction) {
					case MovementDirection.LEFT:
						velocity.x = -50;
						break;
					case MovementDirection.RIGHT:
						velocity.x = 50;
						break;
					case MovementDirection.IDLE:
						velocity.x = 0; // TODO: apply some force/impulse instead? configure friction?
				}

				physics.velocity = velocity;

				// if jumping and y velocity is 0 ( not jumping or falling ) apply impulse to make the body "jump"
				if (movement.state === MovementState.JUMPING && velocity.y === 0) {
					physics.body.applyLinearImpulse(
						new Vec2(0, -30),
						physics.body.getWorldCenter(),
					);
				}

				console.log(velocity.y)

				// check the velocity and determine the state of the movement
				if (velocity.y < 0) {
					// movement.state = MovementState.JUMPING;
				} else if (velocity.y > 0) {
					movement.state = MovementState.FALLING;
				} else if (velocity.y === 0) {
					if (
						MovementDirection.RIGHT === movement.direction ||
						MovementDirection.LEFT === movement.direction
					) {
						movement.state = MovementState.RUNNING;
					} else {
						movement.state = MovementState.IDLE;
					}
				}
			}
		});
	},
});
