import { Component } from "../ecs";

export enum Action {
	LEFT = "left",
	RIGHT = "right",
	JUMP = "jump"
}

export class ActionComponent extends Component {
	public actions: Action[] = [];

	constructor() {
		super();
	}
	public destroy() {}
}
