import { World } from "..";
import { VelocityComponent } from "../components";
import { Entity, System } from "../ecs";

const pressed = new Map<string, boolean>();

document.addEventListener("keydown", (evt) => {
	pressed.set(evt.code, true);
});

document.addEventListener("keyup", (evt) => {
	pressed.set(evt.code, false);
});

export const InputSystem = (world: World): System => ({
	query: {
		entities: world.player ? [world.player] : [],
	},
	handler: ([player]: Entity[]) => {
		const velocity = world.ecs?.get(player, VelocityComponent);
		if (velocity) {
			let x = 0,
				y = 0;

			[
				{ key: "ArrowUp", y: -1 },
				{ key: "ArrowDown", y: 1 },
				{ key: "ArrowLeft", x: -1 },
				{ key: "ArrowRight", x: 1 },
			].forEach((input) => {
				if (pressed.get(input.key)) {
					x += input.x || 0;
					y += input.y || 0;
				}
			});

			velocity.x = x;
			velocity.y = y;
		}
	},
});
