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

const touchLeftEl = document.querySelector(".touch .left");
touchLeftEl?.addEventListener('pointerdown', () => pressed.set('ArrowLeft', true))
touchLeftEl?.addEventListener('pointerup', () => pressed.set('ArrowLeft', false))

const touchRightEl = document.querySelector(".touch .right");
touchRightEl?.addEventListener('pointerdown', () => pressed.set('ArrowRight', true))
touchRightEl?.addEventListener('pointerup', () => pressed.set('ArrowRight', false))

const touchJumpEl = document.querySelector(".touch .jump");
touchJumpEl?.addEventListener('pointerdown', () => pressed.set('Space', true))
touchJumpEl?.addEventListener('pointerup', () => pressed.set('Space', false))


export const InputSystem = (ecs: ECS, player: Entity): System => ({
	...SystemDefaults,
	query: {
		entities: player ? [player] : [],
	},
	handler: ([player]: Entity[]) => {
		const movement = ecs?.get(player, MovementComponent);
		if (movement) {
			if (pressed.get("ArrowLeft")) {
				movement.state =
					movement.state === MovementState.IDLE
						? MovementState.RUNNING
						: movement.state;
				movement.direction = MovementDirection.LEFT;
			} else if (pressed.get("ArrowRight")) {
				movement.state =
					movement.state === MovementState.IDLE
						? MovementState.RUNNING
						: movement.state;
				movement.direction = MovementDirection.RIGHT;
			} else {
				movement.state = MovementState.IDLE;
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
