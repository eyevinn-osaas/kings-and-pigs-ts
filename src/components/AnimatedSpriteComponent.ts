import { Vec2 } from "planck";
import { Sprite } from "../gfx/AnimatedSprite";
import { Component } from "../ecs";

export enum SpriteVariant {
	IDLE = "IDLE",
	RUNNING = "RUNNING",
	FALLING = "FALLING",
	JUMPING = "JUMPING",
	ATTACKING = "ATTACKING",
	DYING = "DYING",
}

type SpriteVariantMap = {
	[key in SpriteVariant]?: Sprite;
};

const emptySprite = new Sprite({
	url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
	width: 0,
	height: 0,
	frames: 0,
	center: new Vec2(0, 0),
});

export class AnimatedSpriteComponent extends Component {
	private _variant: SpriteVariant = SpriteVariant.IDLE;
	private _flip: boolean = false;
	private spriteMap: SpriteVariantMap;

	private _frameIndex = 0;

	constructor(spriteMap: SpriteVariantMap) {
		super();
		this.spriteMap = spriteMap;
	}

	tick() {
		this._frameIndex += 1;
		if (this._frameIndex > this.totalFrames) {
			this._frameIndex = this.activeSprite.loop ? 0 : this.totalFrames;
		}
	}

	get activeSprite() {
		return this.spriteMap[this._variant] ?? emptySprite;
	}

	get variant() {
		return this._variant;
	}

	set variant(variant: SpriteVariant) {
		if (variant === this._variant) {
			return;
		}
		this._variant = variant;
		this._frameIndex = 0;
	}

	get frameIndex() {
		return this._frameIndex;
	}

	get flip() {
		return this.activeSprite.flip ? !this._flip : this._flip;
	}

	set flip(flip) {
		this._flip = flip;
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
