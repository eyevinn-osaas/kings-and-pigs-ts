import { Component } from "../ecs";

export enum MovementDirection {
	IDLE = "idle",
	RIGHT = "right",
	LEFT = "left",
}

export enum MovementState {
	IDLE = "idle",
	RUNNING = "running",
	FALLING = "falling",
	JUMPING = "jumping",
}

export class MovementComponent extends Component {
	public state: MovementState = MovementState.IDLE;
	public direction: MovementDirection = MovementDirection.RIGHT;

	constructor() {
		super();
	}
	public destroy() {}
}
