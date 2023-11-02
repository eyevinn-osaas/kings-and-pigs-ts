import { Sprite } from "../gfx/AnimatedSprite";
import { ECS } from "../ecs";
import { Box, Vec2 } from "planck";
import { PhysicsComponent } from "../components/PhysicsComponent";
import {
	MovementComponent,
	MovementDirection,
} from "../components/MovementComponent";
import { AnimatedSpriteComponent, SpriteVariant } from "../components/AnimatedSpriteComponent";
import { EntityType } from "../constants";
import { LdtkDirection } from "../level";

import enemyIdleSprite from "../../public/assets/sprites/05-pig_thowing_a_bomb/idle_(26x26).png";
import enemyAttackingSprite from "../../public/assets/sprites/05-pig_thowing_a_bomb/throwing_boom_(26x26).png";

function getMovementDirection(
	direction: LdtkDirection,
): MovementDirection {
	if (direction === "Right") {
		return MovementDirection.RIGHT;
	}
	return MovementDirection.LEFT;
}

export function createEnemy(
	ecs: ECS,
	position: Vec2,
	direction: LdtkDirection,
) {
	const idleSprite = new Sprite({
		url: enemyIdleSprite,
		width: 26,
		height: 26,
		frames: 10,
		center: new Vec2(13, 13),
		flip: true
	});

	const attackingSprite = new Sprite({
		url: enemyAttackingSprite,
		width: 26,
		height: 26,
		frames: 5,
		center: new Vec2(13, 13),
		flip: true,
		loop: false
	});

	const enemy = ecs.create();

	ecs.emplace(
		enemy,
		new PhysicsComponent({
			entityType: EntityType.ENEMY,
			bodyType: 'static',
			position,
			shape: new Box(11.5, 14),
			fixtureOpt: { filterGroupIndex: -1 },
		}),
	);
	ecs.emplace(enemy, new MovementComponent(getMovementDirection(direction)));
	ecs.emplace(
		enemy,
		new AnimatedSpriteComponent({
			[SpriteVariant.IDLE]: idleSprite,
			[SpriteVariant.ATTACKING]: attackingSprite
		}),
	);

	return enemy;
}
