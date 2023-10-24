import playerIdleSprite from "../../public/assets/sprites/01-king_human/idle_(78x58).png";
import playerRunSprite from "../../public/assets/sprites/01-king_human/run_(78x58).png";
import playerJumpSprite from "../../public/assets/sprites/01-king_human/jump_(78x58).png";
import playerFallSprite from "../../public/assets/sprites/01-king_human/fall_(78x58).png";
import { Sprite } from "../gfx/AnimatedSprite";
import { ECS } from "../ecs";
import { Box, Vec2 } from "planck";
import { PhysicsComponent } from "../components/PhysicsComponent";
import { ActionComponent } from "../components/ActionComponent";
import {
	MovementComponent,
	MovementState,
} from "../components/MovementComponent";
import { HealthComponent } from "../components/HealthComponent";
import { AnimatedSpriteComponent } from "../components/AnimatedSpriteComponent";
import { EntityType } from "../constants";

export function createPlayer(ecs: ECS, position: Vec2) {
	const idleSprite = new Sprite({
		url: playerIdleSprite,
		width: 78,
		height: 58,
		frames: 11,
		center: Vec2(32, 32),
	});

	const runSprite = new Sprite({
		url: playerRunSprite,
		width: 78,
		height: 58,
		frames: 8,
		center: Vec2(32, 32),
	});

	const jumpSprite = new Sprite({
		url: playerJumpSprite,
		width: 78,
		height: 58,
		frames: 1,
		center: Vec2(32, 32),
	});

	const fallSprite = new Sprite({
		url: playerFallSprite,
		width: 78,
		height: 58,
		frames: 1,
		center: Vec2(32, 32),
	});

	const player = ecs.create();

	ecs.emplace(
		player,
		new PhysicsComponent({
			entityType: EntityType.PLAYER,
			position,
			shape: new Box(11.5, 14),
			fixtureOpt: { friction: 0 },
		}),
	);
	ecs.emplace(player, new ActionComponent());
	ecs.emplace(player, new MovementComponent());
	ecs.emplace(player, new HealthComponent());
	ecs.emplace(
		player,
		new AnimatedSpriteComponent({
			[MovementState.IDLE]: idleSprite,
			[MovementState.RUNNING]: runSprite,
			[MovementState.FALLING]: fallSprite,
			[MovementState.JUMPING]: jumpSprite,
		}),
	);

	return player;
}
