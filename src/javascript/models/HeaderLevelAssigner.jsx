
// Input is a flow of heights which are potential headers, output are header level for each height or the judgement, that it is no header
// Levels are from 1..6, where 1 is the biggest headline.
// HeaderLevelAssigner is use with an start level. If the start level is 2, then the first headline will be of level 2 and there will be no level 1 given.
export default class HeaderLevelAssigner {

    constructor(options) {
        this.startLevel = options.startLevel;
        this.paragraphHeight = options.paragraphHeight;
        this.lastLevel = null;
        this.lastHeight = null;
        this.heightToLevel = {};
    }

    add(height) {
        if (!this.lastHeight) {
            this.lastLevel = this.startLevel;
            this.heightToLevel[height] = this.startLevel;
        } else {
            const existingLevel = this.heightToLevel[height];
            if (!existingLevel) {
                //
            }
        }

        this.lastHeight = height;
    }
}