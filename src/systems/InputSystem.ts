import { ECS, Entity, System, SystemDefaults } from "../ecs";
import {
	MovementComponent,
	MovementDirection,
} from "../components/MovementComponent";
import { MovementState } from "../components/MovementComponent";

const pressed = new Map<string, boolean>();

document.addEventListener("keydown", (evt) => {
	pressed.set(evt.code, true);
});

document.addEventListener("keyup", (evt) => {
	pressed.set(evt.code, false);
});

export const InputSystem = (ecs: ECS, player: Entity): System => ({
	...SystemDefaults,
	query: {
		entities: player ? [player] : [],
	},
	handler: ([player]: Entity[]) => {
		const movement = ecs?.get(player, MovementComponent);
		if (movement) {
			if ([MovementState.IDLE, MovementState.RUNNING].includes(movement.state)) {
				if (pressed.get("ArrowLeft")) {
					movement.state = MovementState.RUNNING;
					movement.direction = MovementDirection.LEFT;
				} else if (pressed.get("ArrowRight")) {
					movement.state = MovementState.RUNNING;
					movement.direction = MovementDirection.RIGHT;
				} else {
					movement.state = MovementState.IDLE;
				}
			}

			if (
				pressed.get("Space") &&
				[MovementState.IDLE, MovementState.RUNNING].includes(movement.state)
			) {
				movement.state = MovementState.JUMPING;
			}
		}
	},
});
