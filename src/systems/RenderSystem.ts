import { PhysicsComponent } from "../components/PhysicsComponent";
import { AnimatedSpriteComponent } from "../components/AnimatedSpriteComponent";
import { ECS, Entity, System, SystemDefaults } from "../ecs";

import level from "../../public/assets/levels/main/simplified/Level_0/_composite.png";

// TODO: move this...
const levelComposite = new Image();
levelComposite.src = level;

export const RenderSystem = (ecs: ECS): System => ({
	...SystemDefaults,
	query: {},
	handler: (entities: Entity[]) => {
		const canvas = document.querySelector<HTMLCanvasElement>("canvas");
		const context = canvas?.getContext("2d");
		if (!canvas || !context) {
			return;
		}

		context.drawImage(levelComposite, 0, 0, canvas.width, canvas.height);

		entities.forEach((entity) => {
			const body = ecs?.get(entity, PhysicsComponent);
			const sprite = ecs?.get(entity, AnimatedSpriteComponent);

			if (body?.shape && sprite) {
				const { x, y } = body.position;
				const { x: sx, y: sy } = sprite.position;
				const { x: cx, y: cy } = sprite.center;

				const flip = sprite.flip;

				context.save();

				context.translate(x - (flip ? sprite.width - cx : cx), y - cy);

				context.scale(flip ? -1 : 1, 1);

				context.drawImage(
					sprite.spriteSheet,
					sx,
					sy,
					sprite.width,
					sprite.height,
					0,
					0,
					sprite.width * (flip ? -1 : 1),
					sprite.height,
				);

				context.restore();
			}
		});
	},
});
