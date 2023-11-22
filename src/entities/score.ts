import ScoreComponent from "../components/ScoreComponent";
import { ECS } from "../ecs";

export function createScore(ecs: ECS) {
	const entity = ecs.create();
	ecs.emplace(entity, new ScoreComponent());

	return entity;
}
