import { Vector3 } from "@babylonjs/core";
import { PlatformSectionConfig } from "../PlatformManager";

export interface LevelConfig {
    name: string;
    sections: PlatformSectionConfig[];
}

export const level01: LevelConfig = {
    name: "Level 01",
    sections: [
        {
            name: "start",
            platforms: [
                { position: new Vector3(0, 20, 300), size: { width: 300, height: 40, depth: 300 } },
                { position: new Vector3(0, 150, 700), size: { width: 250, height: 20, depth: 250 } },
                { position: new Vector3(0, 300, 1200), size: { width: 250, height: 20, depth: 250 } },
                { position: new Vector3(500, 300, 1200), size: { width: 1250, height: 20, depth: 5 } },
                { position: new Vector3(1200, 300, 1200), size: { width: 250, height: 20, depth: 250 } },
                { position: new Vector3(1200, 150, 800), size: { width: 250, height: 20, depth: 250 } },
                { position: new Vector3(1500, 0, 900), size: { width: 250, height: 20, depth: 250 } },
                { position: new Vector3(1700, -100, 700), size: { width: 50, height: 20, depth: 50 } },
                { position: new Vector3(1700, -50, 500), size: { width: 50, height: 20, depth: 50 } },
                { position: new Vector3(1700, 0, 300), size: { width: 50, height: 20, depth: 50 } },
            ],
        },
        {
            name: "forest",
            origin: new Vector3(2000, 0, 0),
            platforms: [
                { position: new Vector3(0, 20, 0), size: { width: 400, height: 20, depth: 400 } },
            ],
        },
    ],
}