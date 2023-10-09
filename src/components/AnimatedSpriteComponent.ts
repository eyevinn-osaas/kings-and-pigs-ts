import { Vec2 } from "planck";
import { Sprite } from "../gfx/AnimatedSprite";
import { Component } from "../ecs";
import { MovementState } from "./MovementComponent";

type MovementSpriteMap = {
	[key in MovementState]: Sprite;
};

export class AnimatedSpriteComponent extends Component {
	private _state: MovementState = MovementState.IDLE;
	private spriteMap: MovementSpriteMap;

	public frameIndex = 0;

	constructor(spriteMap: MovementSpriteMap) {
		super();
		this.spriteMap = spriteMap;
	}

	get activeSprite() {
		return this.spriteMap[this._state];
	}

	get state() {
		return this._state;
	}

	set state(state: MovementState) {
		this._state = state;
		this.frameIndex = 0;
	}

	get spriteSheet() {
		return this.activeSprite.spriteSheet;
	}

	get width() {
		return this.activeSprite.width;
	}

	get height() {
		return this.activeSprite.height;
	}

	get center() {
		return this.activeSprite.center;
	}

	get totalFrames() {
		return this.activeSprite.frames - 1;
	}

	get position() {
		return Vec2(this.frameIndex * this.width, 0);
	}

	public destroy() {}
}
