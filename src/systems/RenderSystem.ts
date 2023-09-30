import { World } from "..";
import { RectComponent, TransformComponent } from "../components";
import { Entity, System } from "../ecs";

export const RenderSystem = (world: World): System => ({
	query: {},
	handler: (entities: Entity[]) => {
		const canvas = document.querySelector<HTMLCanvasElement>("canvas");
		const context = canvas?.getContext("2d");
		if (!canvas || !context) {
			return;
		}

		context.clearRect(0, 0, canvas?.width, canvas?.height);

		entities.forEach((entity) => {
			const rect = world.ecs?.get(entity, RectComponent);
			const transform = world.ecs?.get(entity, TransformComponent);

			if (transform && rect) {
				context.fillStyle = rect.fillStyle;
				context.fillRect(transform.x, transform.y, rect.width, rect.height);
			}
		});
	},
});
