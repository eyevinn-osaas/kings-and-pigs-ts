import world, { EntityInstance } from "../../public/assets/levels/main.ldtk";

export enum LayerId {
	ENTITIES = "Entities",
	TERRAIN = "Terrain",
}

export enum EntityId {
	PLAYER = "Player",
	ENEMY = "Enemy",
	DOOR = "Door",
}

export enum EntityEnum {
	DIRECTION = "Direction",
}

export type LdtkDirection = "Right" | "Left";

export function getLevel() {
	return world.levels[0];
}

export function getLayer(id: LayerId) {
	return getLevel().layerInstances?.find(
		(instance: any) => instance.__identifier === id,
	);
}

export function getCollisionTiles() {
	return getLayer(LayerId.TERRAIN)?.autoLayerTiles;
}

export function getEntities(id: EntityId) {
	return getLayer(LayerId.ENTITIES)?.entityInstances.filter(
		(entity) => entity.__identifier === id,
	);
}

export function getEntityEnum(entity: EntityInstance, enumId: EntityEnum) {
	return entity.fieldInstances.find((field) => field.__identifier === enumId)
		?.__value;
}
