import { ECS, Entity, System, SystemDefaults } from "../ecs";
import { physicsWorld } from "../physics";

export const PhysicsSystem = (ecs: ECS): System => ({
	...SystemDefaults,
	msPerTick: 1000 / 60,
	query: {},
	handler(entities: Entity[]) {
		// TODO: Handle catchup etc.
		physicsWorld.step(1 / 60);
	},
});
