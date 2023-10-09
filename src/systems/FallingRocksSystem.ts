import { HealthComponent } from "../components/HealthComponent";
import { PhysicsComponent } from "../components/PhysicsComponent";
import { EntityType } from "../constants";
import { ECS, Entity, System, SystemDefaults } from "../ecs";
import { isEntityTypeInContact } from "../physics";

export const FallingRocksSystem = (ecs: ECS, player: Entity): System => ({
	...SystemDefaults,
	query: {
		entities: [player],
	},
	handler: ([player]: Entity[]) => {
		const physics = ecs?.get(player, PhysicsComponent);
		const health = ecs?.get(player, HealthComponent);
		if (
			physics &&
			health &&
			isEntityTypeInContact(
				physics.body.getContactList()!,
				EntityType.FALLING_ROCK,
			)
		) {
			// health.health -= 50;
		}
	},
});
