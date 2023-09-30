import { Component } from "../ecs";

export class VelocityComponent extends Component {
	constructor(
		public x = 0,
		public y = 0,
	) {
		super();
	}
}

export class TransformComponent extends Component {
	constructor(
		public x = 0,
		public y = 0,
	) {
		super();
	}
}

export class RectComponent extends Component {
	constructor(
		public width: number = 10,
		public height: number = 10,
		public fillStyle: string = "rgb(255, 0, 0)",
	) {
		super();
	}
}
