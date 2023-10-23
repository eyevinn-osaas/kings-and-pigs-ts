import { ECS, Entity, init } from "./ecs";
import { InputSystem } from "./systems/InputSystem";
import { PhysicsSystem } from "./systems/PhysicsSystem";
import { DebugRenderSystem } from "./systems/DebugRenderSystem";
import { Box, Vec2 } from "planck";
import { PhysicsComponent } from "./components/PhysicsComponent";
import { EntityType } from "./constants";
import { FallingRocksSystem } from "./systems/FallingRocksSystem";
import { HealthComponent } from "./components/HealthComponent";
import { AnimatedSpriteComponent } from "./components/AnimatedSpriteComponent";
import { RenderSystem } from "./systems/RenderSystem";
import { MovementSystem } from "./systems/MovementSystem";
import {
	MovementComponent,
	MovementState,
} from "./components/MovementComponent";
import { PreRenderSystem } from "./systems/PreRenderSystem";
import { Sprite } from "./gfx/AnimatedSprite";
import { AnimateSpriteSystem } from "./systems/AnimateSpriteSystem";
import { UpdateSpriteStateSystem } from "./systems/UpdateSpriteStateSystem";

import playerIdleSprite from "../public/assets/sprites/01-king_human/idle_(78x58).png
import playerRunSprite from "../public/assets/sprites/01-king_human/run_(78x58).png";
import playerJumpSprite from "../public/assets/sprites/01-king_human/jump_(78x58).png";
import playerFallSprite from "../public/assets/sprites/01-king_human/fall_(78x58).png";

import map from "../public/assets/levels/main.ldtk";

console.log(map);

const canvas = document.querySelector("canvas");

if (!canvas) {
	throw "[Dungeon Survival] No canvas found!";
}

// TODO: move this...
export type Game = {
	ecs?: ReturnType<typeof init>;
	player?: Entity;

	width: number;
	height: number;
};

const game: Game = {
	width: canvas.width,
	height: canvas.height,
};

function start(ecs: ECS) {
	const loop = (time: number) => {
		if (!game.player) {
			return;
		}

		ecs?.tick(time);

		const playerHealth = ecs.get(game.player, HealthComponent);
		if (playerHealth && playerHealth.health > 0) {
			requestAnimationFrame(loop);
		}
	};
	requestAnimationFrame(loop);
}

function main() {
	const ecs = init();

	const level = map.levels[0];

	document.body.style.backgroundColor = level.bgColor;

	const player = ecs.create();
	const collisions = level.layerInstances[1].autoLayerTiles.map(
		(tile: any) => {
			const entity = ecs.create();

			ecs.emplace(
				entity,
				new PhysicsComponent({
					entityType: "ground",
					position: new Vec2(tile.px[0] + 16, tile.px[1] + 16),
					bodyType: "static",
					shape: new Box(16, 16),
				}),
			);
		},
	);

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

	const playerPosition = level.layerInstances[0].entityInstances[3].px;

	ecs.emplace(
		player,
		new PhysicsComponent({
			entityType: EntityType.PLAYER,
			position: new Vec2(playerPosition[0], playerPosition[1]),
			shape: new Box(11.5, 14),
		}),
	);
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

	game.player = player;

	ecs.register(MovementSystem(ecs));
	ecs.register(InputSystem(ecs, player));

	ecs.register(UpdateSpriteStateSystem(ecs));
	ecs.register(FallingRocksSystem(ecs, player));
	ecs.register(PhysicsSystem(ecs));

	ecs.register(AnimateSpriteSystem(ecs));

	ecs.register(PreRenderSystem());
	ecs.register(RenderSystem(ecs));
	ecs.register(DebugRenderSystem(ecs));

	start(ecs);
}

window.onload = main;
