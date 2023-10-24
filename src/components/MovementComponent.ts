import { Component } from "../ecs";

export enum MovementDirection {
	RIGHT = "right",
	LEFT = "left",
}

export enum MovementState {
	IDLE = "idle",
	RUNNING = "running",
	FALLING = "falling",
	JUMPING = "jumping",
}

export function requestState(current: MovementState, target: MovementState): MovementState {
	switch(target) {
		case MovementState.IDLE:
			if (current === MovementState.RUNNING) {
				return target;
			}
			return current;
		case MovementState.RUNNING:
			if ([MovementState.FALLING, MovementState.IDLE].includes(current)) {
				return target;
			}
			return current; 
		case MovementState.FALLING:
			if (current === MovementState.JUMPING) {
				return target;
			}
			return current;
		case MovementState.JUMPING:
			if ([MovementState.IDLE, MovementState.RUNNING].includes(current)) {
				return target;
			}
			return current;
	}
	return current;
}

export class MovementComponent extends Component {
	public state: MovementState = MovementState.IDLE;
	public direction: MovementDirection = MovementDirection.RIGHT;

	constructor() {
		super();
	}
	public destroy() {}
}
