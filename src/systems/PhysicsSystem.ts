import { World } from "..";
import { TransformComponent, VelocityComponent } from "../components";
import { System } from "../ecs";

export const PhysicsSystem = (world: World): System => ({
	query: {},
	handler(entities) {
		entities.forEach((entity) => {
			const velocity = world.ecs?.get(entity, VelocityComponent);
			const transform = world.ecs?.get(entity, TransformComponent);

			if (velocity && transform) {
				transform.x += velocity.x;
				transform.y += velocity.y;
			}
		});
	},
});
