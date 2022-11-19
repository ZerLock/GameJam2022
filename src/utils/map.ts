import { Global } from '../class/global';

export enum Views {
    Upper = 'upper',
    Side = 'side',
}

export interface SpriteData {
    x: number;
    y: number;
    altitude?: number;
    id: string;
}

interface MapData {
    width: number;
    height: number;
    tiles: SpriteData[];
}

interface SpriteLayers {
    underPlayer: SpriteData[];
    playerLayer: SpriteData[];
    overPlayer: SpriteData[];
}

const sideViewSprites = (map: MapData[]): SpriteLayers => {
    const layer = Global.globalConfig.current_layer;
    return { underPlayer: [], playerLayer: map[layer].tiles, overPlayer: [] };
};

const upperViewSprites = (map: MapData[]): SpriteLayers => {
    const yPos = 14 - Global.globalConfig.player_pos.y;
    const underPlayer: SpriteData[] = [];
    const playerLayer: SpriteData[] = [];
    const overPlayer: SpriteData[] = [];

    for (let i = 0; i < map.length; i++) {
        const layer = map[i].tiles.sort((a, b) => a.y - b.y)
            .filter((sprite, i, self) => {
                // remove sprite if one block under player
                if (sprite.y > yPos + 1)
                    return false;
                //keep sprite if same level as player
                if (sprite.y === yPos || sprite.y === yPos + 1)
                    return true;
                // remove sprite if not the first index of its x position
                if (self.findIndex((s) => s.x === sprite.x) !== i) {
                    return false;
                }
                return true;
            });
        for (const sprite of layer) {
            const newSprite = { x: sprite.x, y: i, id: sprite.id, altitude: sprite.y }
            if (sprite.y > yPos) {
                underPlayer.push(newSprite);
            } else if (sprite.y === yPos) {
                playerLayer.push(newSprite);
            } else {
                overPlayer.push(newSprite);
            }
        }
    }
    console.log({ underPlayer, playerLayer, overPlayer });
    return { underPlayer, playerLayer, overPlayer };
};

export const getSpritesToDisplay = (map: MapData[], view: Views): SpriteLayers => {
    if (view === Views.Side) {
        return sideViewSprites(map);
    }
    return upperViewSprites(map);
}