import { PhysicsComponent } from "../components/PhysicsComponent";
import { AnimatedSpriteComponent } from "../components/AnimatedSpriteComponent";
import { EntityType } from "../constants";
import { ECS, Entity, System, SystemDefaults } from "../ecs";
import { MovementState } from "../components/MovementComponent";
import { isEntityTypeInContact } from "../physics";

export const BombSystem = (ecs: ECS, player: Entity): System => ({
	...SystemDefaults,
	msPerTick: 1000 / 60,
	query: {},
	handler(entities: Entity[]) {
		entities.forEach((entity) => {
			const physics = ecs.get(entity, PhysicsComponent);

			if (physics?.body.getUserData() === EntityType.BOMB) {
				const sprite = ecs.get(entity, AnimatedSpriteComponent);
				const contactList = physics.body.getContactList();

				if (!contactList || !sprite) {
					return;
				}

				if (
					(isEntityTypeInContact(contactList, EntityType.TERRAIN) ||
						isEntityTypeInContact(contactList, EntityType.PLAYER)) &&
					sprite.state !== MovementState.RUNNING
				) {
					sprite.state = MovementState.RUNNING;
				} else if (
					sprite.state === MovementState.RUNNING &&
					sprite.frameIndex + 1 === sprite.totalFrames
				) {
					if (isEntityTypeInContact(contactList, EntityType.PLAYER)) {
						ecs.delete(player);
					}
					ecs.delete(entity);
				}
			}
		});
	},
});
