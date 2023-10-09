import { PhysicsComponent } from "../components/PhysicsComponent";
import { AnimatedSpriteComponent } from "../components/AnimatedSpriteComponent";
import { ECS, Entity, System, SystemDefaults } from "../ecs";

export const RenderSystem = (ecs: ECS): System => ({
	...SystemDefaults,
	query: {},
	handler: (entities: Entity[]) => {
		const canvas = document.querySelector<HTMLCanvasElement>("canvas");
		const context = canvas?.getContext("2d");
		if (!canvas || !context) {
			return;
		}

		entities.forEach((entity) => {
			const body = ecs?.get(entity, PhysicsComponent);
			const sprite = ecs?.get(entity, AnimatedSpriteComponent);

			if (body && sprite) {
				const { x, y } = body.position;
				const { x: sx, y: sy } = sprite.position;
				const { x: cx, y: cy } = sprite.center;

				context.drawImage(
					sprite.spriteSheet,
					sx,
					sy,
					sprite.width,
					sprite.height,
					x-cx,
					y-cy,
					sprite.width, 
					sprite.height
				);
			}
		});
	},
});
