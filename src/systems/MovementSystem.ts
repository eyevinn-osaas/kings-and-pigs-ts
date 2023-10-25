import { Vec2 } from "planck";
import {
	MovementComponent,
	MovementDirection,
	MovementState,
} from "../components/MovementComponent";
import { PhysicsComponent } from "../components/PhysicsComponent";
import { ECS, Entity, System, SystemDefaults } from "../ecs";
import { Action, ActionComponent } from "../components/ActionComponent";

export const MovementSystem = (ecs: ECS): System => ({
	...SystemDefaults,
	query: {},
	handler(entities: Entity[]) {
		entities.forEach((entity) => {
			const action = ecs?.get(entity, ActionComponent);
			const movement = ecs?.get(entity, MovementComponent);
			const physics = ecs?.get(entity, PhysicsComponent);

			if (action && movement && physics) {
				const velocity = physics.velocity.clone();
				velocity.x = 0;

				action.actions.forEach((action) => {
					switch (action) {
						case Action.LEFT:
							movement.direction = MovementDirection.LEFT;

							velocity.x = -75;
							break;
						case Action.RIGHT:
							movement.direction = MovementDirection.RIGHT;

							velocity.x = 75;
							physics.velocity = velocity;
							break;
						case Action.JUMP:
							// if jumping and y velocity is 0 ( not jumping or falling ) apply impulse to make the body "jump"
							if (velocity.y === 0) {
								physics.body.applyLinearImpulse(
									new Vec2(0, -320),
									physics.body.getWorldCenter(),
								);
								velocity.y = physics.velocity.y;
							}
							break;
					}
				});

				physics.velocity = velocity;

				// check the velocity and determine the state of the movement
				if (velocity.y < 0) {
					movement.state = MovementState.JUMPING;
				} else if (velocity.y > 0) {
					movement.state = MovementState.FALLING;
				} else if (velocity.y === 0) {
					movement.state =
						velocity.x === 0 ? MovementState.IDLE : MovementState.RUNNING;
				}
			}
		});
	},
});
