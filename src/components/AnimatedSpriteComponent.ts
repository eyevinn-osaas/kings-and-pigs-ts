import { Vec2 } from "planck";
import { Sprite } from "../gfx/AnimatedSprite";

export class AnimatedSpriteComponent {
	public frameIndex = 0;

	constructor(private sprite: Sprite) {}

	get spriteSheet() {
		return this.sprite.spriteSheet;
	}

	get width() {
		return this.sprite.width;
	}

	get height() {
		return this.sprite.height;
	}

	get center() {
		return this.sprite.center;
	}

	get totalFrames() {
		return this.sprite.frames - 1;
	}

	get position() {
		return Vec2(this.frameIndex * this.width, 0);
	}

	public destroy() {}
}
