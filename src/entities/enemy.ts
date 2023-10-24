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
import { AnimatedSpriteComponent } from "../components/AnimatedSpriteComponent";
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
		center: Vec2(13, 13),
		flip: true
	});

	const enemy = ecs.create();

	ecs.emplace(
		enemy,
		new PhysicsComponent({
			entityType: EntityType.ENEMY,
			position,
			shape: new Box(11.5, 14),
			fixtureOpt: { friction: 0 },
		}),
	);
	ecs.emplace(enemy, new MovementComponent(getMovementDirection(direction)));
	ecs.emplace(
		enemy,
		new AnimatedSpriteComponent({
			[MovementState.IDLE]: idleSprite,
			[MovementState.RUNNING]: idleSprite,
			[MovementState.FALLING]: idleSprite,
			[MovementState.JUMPING]: idleSprite,
		}),
	);

	return enemy;
}