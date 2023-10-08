import { System } from "../ecs";

/**
 *  Prepares the canvas for the next animation frame
 */
export const PreRenderSystem = (): System => ({
	query: {},
	handler: () => {
		const canvas = document.querySelector<HTMLCanvasElement>("canvas");
		const context = canvas?.getContext("2d");
		if (!canvas || !context) {
			return;
		}

		context.clearRect(0, 0, canvas?.width, canvas?.height);
	},
});
