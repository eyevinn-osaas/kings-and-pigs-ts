export type Entity = string;

export abstract class Component {
	public enabled = true;
	public abstract destroy(): void;
}

export const ALWAYS_TICK = -1;

export interface System {
	lag: 0;
	msPerTick: number;
	query: {
		// TODO: implement a way to select which components are of interest for the system
		// types?: string[],
		entities?: Entity[];
	};
	handler: (entities: Entity[]) => void;
}

export const SystemDefaults: Omit<System, "handler" | "query"> = {
	lag: 0,
	msPerTick: ALWAYS_TICK,
};

type ComponentClass<T extends Component> = new (...args: any[]) => T;

let uuid = 0;

export function init() {
	const registry: Entity[] = [];
	const components: Map<Entity, Map<Function, Component>> = new Map();
	const systems: System[] = [];

	let lastTime: number | undefined;
	return {
		create: () => {
			const entity: Entity = (++uuid).toString();
			registry.push(entity);
			components.set(entity, new Map());
			return entity;
		},
		delete: (entity: Entity) => {
			const index = registry.indexOf(entity);
			if (index > -1) {
				registry.splice(index, 1);
				components.get(entity)?.forEach((component) => {
					component.destroy();
				});
				components.delete(entity);
			}
		},
		emplace(entity: Entity, component: Component) {
			const entityComponents = components.get(entity);
			entityComponents?.set(component.constructor, component);
		},
		destroy(entity: Entity, component: Component) {
			const entityComponents = components.get(entity);
			entityComponents?.delete(component.constructor);
		},
		register(system: System) {
			systems.push(system);
		},
		get<T extends Component>(
			entity: Entity,
			componentClass: ComponentClass<T>,
		) {
			return components.get(entity)?.get(componentClass) as T | undefined;
		},
		tick(time: number) {
			if (lastTime === undefined) {
				lastTime = time;
			}
			let delta = time - lastTime;
			lastTime = time;
			systems.forEach((system) => {
				if (system.msPerTick === ALWAYS_TICK) {
					system.handler(system.query.entities || registry);
				} else {
					system.lag += delta;

					while (system.lag >= system.msPerTick) {
						system.handler(system.query.entities || registry);
						system.lag -= system.msPerTick;
					}
				}
			});
		},
		reset() {
			registry.forEach((entity) => {
				components.get(entity)?.forEach((component) => {
					component.destroy();
				});
			});
			components.clear();
			registry.length = 0;
			systems.length = 0;
		}
	};
}

export type ECS = ReturnType<typeof init>;
