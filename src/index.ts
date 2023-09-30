import {
	RectComponent,
	TransformComponent,
	VelocityComponent,
} from "./components";
import { Entity, init } from "./ecs";
import { InputSystem } from "./systems/InputSystem";
import { PhysicsSystem } from "./systems/PhysicsSystem";
import { RenderSystem } from "./systems/RenderSystem";

// TODO: move this...
export type World = {
	ecs?: ReturnType<typeof init>;
	player?: Entity;
};

const world: World = {};

function loop() {
	world.ecs?.tick();
	requestAnimationFrame(loop);
}

function main() {
	world.ecs = init();

	const player = world.ecs.create();
	world.ecs.emplace(player, new VelocityComponent());
	world.ecs.emplace(player, new TransformComponent());
	world.ecs.emplace(player, new RectComponent());
	world.player = player;

	world.ecs?.register(InputSystem(world));
	world.ecs?.register(PhysicsSystem(world));
	world.ecs.register(RenderSystem(world));

	requestAnimationFrame(loop);
}

window.onload = main;
