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

import playerIdleSprite from "../public/assets/knight/idle.png";
import playerRunSprite from "../public/assets/knight/run.png";
import playerJumpSprite from "../public/assets/knight/jump.png";
import playerFallSprite from "../public/assets/knight/fall.png";

import map from "../public/assets/world/map.json";

console.log(map);

const canvas = document.querySelector("canvas");

if (!canvas) {
	throw "[Dungeon Survival] No canvas found!";
}

canvas.style.backgroundColor = map.defaultLevelBgColor;

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

	const player = ecs.create();
	const collisions = map.levels[0].layerInstances[0].autoLayerTiles.map(
		(tile) => {
			const entity = ecs.create();

			ecs.emplace(
				entity,
				new PhysicsComponent({
					entityType: "ground",
					position: new Vec2(tile.px[0] + 8, tile.px[1] + 8),
					bodyType: "static",
					shape: new Box(8, 8),
				}),
			);
		},
	);

	const idleSprite = new Sprite({
		url: playerIdleSprite,
		width: 120,
		height: 80,
		frames: 10,
		center: Vec2(55, 61),
	});

	const runSprite = new Sprite({
		url: playerRunSprite,
		width: 120,
		height: 80,
		frames: 10,
		center: Vec2(55, 61),
	});

	const jumpSprite = new Sprite({
		url: playerJumpSprite,
		width: 120,
		height: 80,
		frames: 3,
		center: Vec2(55, 61),
	});

	const fallSprite = new Sprite({
		url: playerFallSprite,
		width: 120,
		height: 80,
		frames: 3,
		center: Vec2(55, 61),
	});

	const playerPosition = map.levels[0].layerInstances[1].entityInstances[0].px;

	ecs.emplace(
		player,
		new PhysicsComponent({
			entityType: EntityType.PLAYER,
			position: new Vec2(playerPosition[0], playerPosition[1]),
			shape: new Box(10, 19),
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
