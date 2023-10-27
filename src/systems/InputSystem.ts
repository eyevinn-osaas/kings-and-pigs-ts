import { ECS, Entity, System, SystemDefaults } from "../ecs";
import { Action, ActionComponent } from "../components/ActionComponent";

// disable double-tap on iOS
document.ondblclick = function(e) {
    e.preventDefault();
}

const pressed = new Map<string, boolean>();

document.addEventListener("keydown", (evt) => {
	pressed.set(evt.code, true);
});

document.addEventListener("keyup", (evt) => {
	pressed.set(evt.code, false);
});

const touchLeftEl = document.querySelector(".touch .left");
touchLeftEl?.addEventListener("pointerdown", () =>
	pressed.set("ArrowLeft", true),
);
touchLeftEl?.addEventListener("pointerup", () =>
	pressed.set("ArrowLeft", false),
);

const touchRightEl = document.querySelector(".touch .right");
touchRightEl?.addEventListener("pointerdown", () =>
	pressed.set("ArrowRight", true),
);
touchRightEl?.addEventListener("pointerup", () =>
	pressed.set("ArrowRight", false),
);

const touchJumpEl = document.querySelector(".touch .jump");
touchJumpEl?.addEventListener("pointerdown", () => pressed.set("Space", true));
touchJumpEl?.addEventListener("pointerup", () => pressed.set("Space", false));

export const InputSystem = (ecs: ECS, player: Entity): System => ({
	...SystemDefaults,
	query: {
		entities: player ? [player] : [],
	},
	handler: ([player]: Entity[]) => {
		const component = ecs?.get(player, ActionComponent);

		if (component) {
			const actions = [];
			if (pressed.get("ArrowLeft")) {
				actions.push(Action.LEFT);
			} else if (pressed.get("ArrowRight")) {
				actions.push(Action.RIGHT);
			}

			if (pressed.get("Space")) {
				actions.push(Action.JUMP);
			}
			component.actions = actions;
		}
	},
});
