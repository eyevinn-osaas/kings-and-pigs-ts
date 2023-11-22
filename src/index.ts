import { ECS, init } from "./ecs";
import { InputSystem } from "./systems/InputSystem";
import { PhysicsSystem } from "./systems/PhysicsSystem";
import { DebugRenderSystem } from "./systems/DebugRenderSystem";
import { Box, Vec2 } from "planck";
import { PhysicsComponent } from "./components/PhysicsComponent";
import { RenderSystem } from "./systems/RenderSystem";
import { MovementSystem } from "./systems/MovementSystem";
import { AnimateSpriteSystem } from "./systems/AnimateSpriteSystem";
import { UpdateSpriteVariantSystem } from "./systems/UpdateSpriteVariantSystem";
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
import { HealthSystem } from "./systems/HealthSystem";
import { ScoreSystem } from "./systems/ScoreSystem";
import { createScore } from "./entities/score";

const DEBUG = process.env.DEBUG === "true";

const canvas = document.querySelector("canvas");

if (!canvas) {
	throw "[Dungeon Survival] No canvas found!";
}

let animationRequestId: number = -1;
function startGameLoop(ecs: ECS) {
	const loop = (time: number) => {
		ecs?.tick(time);
		animationRequestId = requestAnimationFrame(loop);
	};
	animationRequestId = requestAnimationFrame(loop);
}

function stopGameLoop(ecs: ECS) {
	cancelAnimationFrame(animationRequestId);
	ecs.reset();
}

function start(): () => void {
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

	const enemies =
		getEntities(EntityId.ENEMY)?.map((enemy) => {
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

	ecs.register(InputSystem(ecs, player));
	ecs.register(MovementSystem(ecs));

	ecs.register(EnemyAiSystem(ecs, player, enemies));
	ecs.register(BombSystem(ecs, player));
	ecs.register(HealthSystem(ecs, player));

	ecs.register(UpdateSpriteVariantSystem(ecs));
	ecs.register(AnimateSpriteSystem(ecs));

	ecs.register(ScoreSystem(ecs, player, createScore(ecs)));

	ecs.register(PhysicsSystem(ecs));

	ecs.register(RenderSystem(ecs));

	if (DEBUG) {
		ecs.register(DebugRenderSystem(ecs));
	}

	startGameLoop(ecs);

	return () => stopGameLoop(ecs);
}


window.onload = () => {
	let stop = start();

	document
		.querySelector<HTMLButtonElement>("#restart")
		?.addEventListener("click", () => {
			stop();
			stop = start();
		});

	// TODO: create a not so hacky way to restart the game...
	document.onkeydown = (evt) => {
		if (evt.code === "KeyR") {
			stop();
			stop = start();
		}
	};
}
