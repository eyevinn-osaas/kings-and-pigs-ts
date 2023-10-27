import { ECS, Entity, init } from "./ecs";
import { InputSystem } from "./systems/InputSystem";
import { PhysicsSystem } from "./systems/PhysicsSystem";
import { DebugRenderSystem } from "./systems/DebugRenderSystem";
import { Box, Vec2 } from "planck";
import { PhysicsComponent } from "./components/PhysicsComponent";
import { FallingRocksSystem } from "./systems/FallingRocksSystem";
import { HealthComponent } from "./components/HealthComponent";
import { RenderSystem } from "./systems/RenderSystem";
import { MovementSystem } from "./systems/MovementSystem";
import { PreRenderSystem } from "./systems/PreRenderSystem";
import { AnimateSpriteSystem } from "./systems/AnimateSpriteSystem";
import { UpdateSpriteStateSystem } from "./systems/UpdateSpriteStateSystem";
import { EnemyAiSystem } from "./systems/EnemyAiSystem";

import { createPlayer } from "./entities/player";
import {
	EntityEnum,
	EntityId,
	getCollisionTiles,
	getEntities,
	getEntityEnum,
	getLevel,
} from "./level";
import { createEnemy } from "./entities/enemy";
import { BombSystem } from "./systems/BombSystem";

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
		} else {
			// TODO: temp hack to reload
			document.onclick = () => window.location.reload();
		}
	};
	requestAnimationFrame(loop);
}

function main() {
	const ecs = init();

	const level = getLevel();

	document.body.style.backgroundColor = level.bgColor ?? "#000000";

	getCollisionTiles()?.forEach((tile: any) => {
		const entity = ecs.create();

		ecs.emplace(
			entity,
			new PhysicsComponent({
				entityType: "terrain",
				position: new Vec2(tile.px[0] + 16, tile.px[1] + 16),
				bodyType: "static",
				shape: new Box(16, 16),
			}),
		);
	});

	const enemies = getEntities(EntityId.ENEMY)?.map((enemy) => {
		const position = enemy.px;
		const direction = getEntityEnum(enemy, EntityEnum.DIRECTION);
		return createEnemy(ecs, new Vec2(position[0], position[1]), direction);
	}) ?? [];

	const playerPosition = getEntities(EntityId.PLAYER)?.[0]?.px;
	if (!playerPosition) {
		throw new Error("player not found!");
	}
	const player = createPlayer(
		ecs,
		new Vec2(playerPosition[0], playerPosition[1]),
	);

	game.player = player;

	ecs.register(InputSystem(ecs, player));
	ecs.register(MovementSystem(ecs));

	ecs.register(EnemyAiSystem(ecs, player, enemies));
	ecs.register(BombSystem(ecs, player));

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
