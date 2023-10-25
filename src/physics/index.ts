import { ContactEdge, Edge, PolygonShape, Settings, Shape, Vec2, World } from "planck";
import { EntityType } from "../constants";

Settings.lengthUnitsPerMeter = 10;

export const physicsWorld = new World({
	gravity: new Vec2(0, 9.8*100),
});

export function isEntityTypeInContact(
	contactList: ContactEdge,
	entityType: (typeof EntityType)[keyof typeof EntityType],
) {
	for (let list: ContactEdge | null = contactList; list; list = list.next) {
		const fixtures = [list.contact.getFixtureA(), list.contact.getFixtureB()];
		if (
			fixtures.some((fixture) => fixture.getBody().getUserData() === entityType)
		) {
			return true;
		}
	}
	return false;
}

export function getPolygonWidthHeight(shape: PolygonShape) {
	// TODO: do actual calculation...
	return {
		width: shape.m_vertices[1].x * 2,
		height: shape.m_vertices[1].y * 2
	}
}