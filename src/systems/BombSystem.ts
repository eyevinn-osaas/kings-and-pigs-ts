import { PhysicsComponent } from "../components/PhysicsComponent";
import { AnimatedSpriteComponent, SpriteVariant } from "../components/AnimatedSpriteComponent";
import { EntityType } from "../constants";
import { ECS, Entity, System, SystemDefaults } from "../ecs";
import { isEntityTypeInContact } from "../physics";
import { HealthComponent } from "../components/HealthComponent";

export const BombSystem = (ecs: ECS, player: Entity): System => ({
	...SystemDefaults,
	msPerTick: 1000 / 60,
	query: {},
	handler(entities: Entity[]) {
		const playerHealth = ecs.get(player, HealthComponent);

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
					sprite.variant !== SpriteVariant.ATTACKING
				) {
					// TODO: shouldn't update the sprite, should update the entity to action attacking or so.
					sprite.variant = SpriteVariant.ATTACKING;
				} else if (sprite.variant === SpriteVariant.ATTACKING) {
					if (
						playerHealth &&
						isEntityTypeInContact(contactList, EntityType.PLAYER)
					) {
						playerHealth.health = 0;
					}
					if (sprite.frameIndex === sprite.totalFrames) {
						ecs.delete(entity);
					}
				}
			}
		});
	},
});
