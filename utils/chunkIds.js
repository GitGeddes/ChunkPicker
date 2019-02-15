/**
 * Created by jespe on 2019-02-15.
 */
/**
 * starting at top left 4671, 256 for each x,  -1 for each y
 */
const chunkIDs = {
	/**
	 * The chunkID of the top left chunk
	 */
	topLeft: 4671,
	/**
	 * The amount chunkID will be increased for each horizontal tile
	 */
	xIncrease: 256,
	/**
	 * The amount chunkID will be increased for each vertical tile
	 */
	yIncrease: -1,

	/**
	 * @param spriteIndex
	 * @returns chunkID {number}
	 */
	getChunkIDFromSpriteIndex: function (spriteIndex) {
		const pos = chunkIDs.getPositionFromSpriteIndex(spriteIndex);
		return chunkIDs.getChunkIDFromPosition(pos);
	},

	/**
	 *
	 * @param pos {{x: number, y: number}}
	 * @returns chunkID {number}
	 */
	getChunkIDFromPosition: function (pos) {
		return (chunkIDs.topLeft + (chunkIDs.yIncrease * pos.y) + (chunkIDs.xIncrease * pos.x));
	},

	/**
	 * @param chunkID
	 * @returns spriteIndex {number}
	 */
	getSpriteIndexFromChunkID: function (chunkID) {
		return chunkIDs.getSpriteIndexFromPosition(chunkIDs.getPositionFromChunkID(chunkID));
	},
	/**
	 * @param pos {{x: number, y: number}}
	 * @returns spriteIndex {number}
	 */
	getSpriteIndexFromPosition: function (pos) {
		return (pos.y * rows) + pos.x;
	},
	/**
	 * @param spriteIndex {number}
	 * @returns {{x: number, y: number}} pos
	 */
	getPositionFromSpriteIndex: function (spriteIndex) {
		return {
			x: Math.floor(spriteIndex / rows),
			y: spriteIndex % rows
		};
	},
	/**
	 * @param chunkID
	 * @returns {{x: number, y: number}} pos
	 */
	getPositionFromChunkID: function (chunkID) {
		chunkID -= (chunkIDs.topLeft);

		const widthInIDs = chunkID / chunkIDs.xIncrease;
		let x = Math.floor((chunkID) / chunkIDs.xIncrease);
		let y = ((((widthInIDs) - Math.floor(widthInIDs))) * chunkIDs.xIncrease);
		if (y > 0) {
			y = chunkIDs.xIncrease - y;
		}
		if (chunkID > 0) {
			x += 1;
		}
		return {x, y};
	},
};