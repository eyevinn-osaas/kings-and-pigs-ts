import { Vec2 } from "planck";

type SpriteOpts = {
	url: string;
	width: number;
	height: number;
	center: Vec2;
	frames: number;

	/**
	 * Whether or not the sprite animation should be looped, defaults to true.
	 */
	loop?: boolean;

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

	public loop: boolean;
	public flip: boolean;

	constructor({ url, width, height, center, frames, flip = false, loop = true }: SpriteOpts) {
		this.spriteSheet = new Image();
		this.spriteSheet.src = url;

		this.width = width;
		this.height = height;
		this.center = center;
		this.frames = frames;

		this.loop = loop;
		this.flip = flip;
	}
}
