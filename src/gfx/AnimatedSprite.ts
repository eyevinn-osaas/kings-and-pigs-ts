import { Vec2 } from "planck";

type SpriteOpts = {
	url: string;
	width: number;
	height: number;
	center: Vec2;
	frames: number;
};

export class Sprite {
	public spriteSheet: HTMLImageElement;

	public width: number;
	public height: number;
	public center: Vec2;
	public frames: number;

	constructor({ url, width, height, center, frames }: SpriteOpts) {
		this.spriteSheet = new Image();
		this.spriteSheet.src = url;

		this.width = width;
		this.height = height;
		this.center = center;
		this.frames = frames;
	}
}
