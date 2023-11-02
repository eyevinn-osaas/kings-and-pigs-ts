import enemyIdleSprite from "../../public/assets/sprites/05-pig_thowing_a_bomb/idle_(26x26).png";

import { Sprite } from "../gfx/AnimatedSprite";
import { ECS } from "../ecs";
import { Box, Vec2 } from "planck";
import { PhysicsComponent } from "../components/PhysicsComponent";
import {
	MovementComponent,
	MovementDirection,
	MovementState,
} from "../components/MovementComponent";
import { AnimatedSpriteComponent, SpriteVariant } from "../components/AnimatedSpriteComponent";
import { EntityType } from "../constants";
import { LdtkDirection } from "../level";

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
		}),
	);

	return enemy;
}
