import { Vec2 } from "planck";

type SpriteOpts = {
	url: string;
	width: number;
	height: number;
	center: Vec2;
	frames: number;

	/**
	 * By default the system assumes the sprites face the right direction, if the sprite
	 * doesn't set this to true to fix its default orientation 
	 */
	flip?: boolean;
};

export class Sprite {
	public spriteSheet: HTMLImageElement;

	public width: number;
	public height: number;
	public center: Vec2;
	public frames: number;

	public flip: boolean;

	constructor({ url, width, height, center, frames, flip = false }: SpriteOpts) {
		this.spriteSheet = new Image();
		this.spriteSheet.src = url;

		this.width = width;
		this.height = height;
		this.center = center;
		this.frames = frames;

		this.flip = flip;
	}
}
