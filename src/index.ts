import { Component, Entity, init } from "./ecs";

type World = {
	ecs?: ReturnType<typeof init>;
	player?: Entity
}

const world: World = {}

function loop() {
	world.ecs?.tick();
	requestAnimationFrame(loop);
}

class TransformComponent extends Component {
	constructor(public x = 0, public y = 0) {
		super();
	}
}

class RectComponent extends Component {
	constructor(public width: number = 10, public height: number = 10, public fillStyle: string = 'rgb(255, 0, 0)') {
		super();
	}
}

function main() {
	world.ecs = init();

	const player = world.ecs.create();
	world.ecs.emplace(player, new TransformComponent());
	world.ecs.emplace(player, new RectComponent());
	world.player = player;

	world.ecs.register({
		query: {
		},
		handler: (entities) => {
			const canvas = document.querySelector<HTMLCanvasElement>("canvas");
			const context = canvas?.getContext("2d");
			if (!canvas ||!context) {
				return;
			}

			context.clearRect(0, 0, canvas?.width, canvas?.height);

			entities.forEach((entity) => {
				const rect = world.ecs?.get(entity, RectComponent);
				const transform = world.ecs?.get(entity, TransformComponent);
				if (transform && rect) {
					context.fillStyle = rect.fillStyle;
					context.fillRect(transform.x, transform.y, rect.width, rect.height);
				}
			})
		}
	})

	requestAnimationFrame(loop);
}

window.onload = main;
