import { Box, Vec2 } from "planck";
import { PhysicsComponent } from "../components/PhysicsComponent";
import { EntityType } from "../constants";
import { ECS, Entity, System, SystemDefaults } from "../ecs";
import { Sprite } from "../gfx/AnimatedSprite";
import { AnimatedSpriteComponent } from "../components/AnimatedSpriteComponent";
import { MovementState } from "../components/MovementComponent";

import bombOnSprite from "../../public/assets/sprites/09-bomb/bomb_on_(52x56).png";
import bombBoomSprite from "../../public/assets/sprites/09-bomb/boooooom_(52x56).png";

export const EnemyAiSystem = (
	ecs: ECS,
	player: Entity,
	enemies: Entity[],
): System => ({
	...SystemDefaults,
	lag: 0,
	msPerTick: 1000,
	query: {
		entities: [player, ...enemies],
	},
	handler([player, ...enemies]: Entity[]) {
		const playerPhysics = ecs.get(player, PhysicsComponent);
		enemies.forEach((enemy) => {
			const enemyPhysics = ecs.get(enemy, PhysicsComponent);

			const startPosition = enemyPhysics?.position.clone();
			const targetPosition = playerPhysics?.position;

			if (!startPosition || !targetPosition) {
				// this should never happen...
				return;
			}

			// TODO: remove ugly hack that prevents bomb from touching at first frames
			// 26 is width of pigs.
			if (targetPosition.x > startPosition.x) {
				startPosition.x += 26;
			} else {
				startPosition.x -= 26;
			}

			const bomb = ecs.create();
			const physics = new PhysicsComponent({
				entityType: EntityType.BOMB,
				shape: new Box(7, 7),
				position: startPosition,
				fixtureOpt: {
					filterGroupIndex: -1,
				},
			});
			ecs.emplace(bomb, physics);

			const onSprite = new Sprite({
				url: bombOnSprite,
				width: 52,
				height: 56,
				frames: 4,
				center: new Vec2(26, 29),
			});
			const boomSprite = new Sprite({
				url: bombBoomSprite,
				width: 52,
				height: 56,
				frames: 6,
				center: new Vec2(26, 29),
			});
			ecs.emplace(
				bomb,
				new AnimatedSpriteComponent({
					// TODO: this component really needs to change....
					[MovementState.IDLE]: onSprite,
					[MovementState.RUNNING]: boomSprite,
					[MovementState.FALLING]: onSprite,
					[MovementState.JUMPING]: onSprite,
				}),
			);

			// TODO: make this system actually good
			const xRandomDistance =
				Math.random() * 100 * (Math.random() > 0.5 ? -1 : 1);
			const xImpulse = -(
				startPosition.x -
				(targetPosition.x + xRandomDistance)
			);

			physics.body.applyLinearImpulse(
				new Vec2(xImpulse, -60),
				physics.body.getWorldCenter(),
			);
		});
	},
});
