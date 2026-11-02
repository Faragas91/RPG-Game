import { Scene, ShadowGenerator, Vector3 } from "@babylonjs/core";
import { Platform, PlatformConfig } from "./Platform";
import { LevelConfig } from "./levels/Level01";

export interface PlatformSectionConfig {
    name: string;
    origin?: Vector3;            // optionaler Offset, Positionen relativ dazu
    platforms: PlatformConfig[];
}

export class PlatformManager {
    constructor(
        private readonly _scene: Scene, 
        private readonly _shadowGenerator: ShadowGenerator,
        private readonly _sections = new Map<string, Platform[]>()
    ) {}


    loadLevel(level: LevelConfig): void {
        this.clear();
        for (const section of level.sections) {
            this.createSection(section);
        }
    }

    createSection(config: PlatformSectionConfig): void {
        const origin = config.origin ?? Vector3.Zero();

        const platforms = config.platforms.map((platformConfig) =>
            new Platform(
                this._scene, 
                {
                    ...platformConfig,
                    position: platformConfig.position.add(origin),
                }, 
                this._shadowGenerator,
            ),
        );
        this._sections.set(config.name, platforms);
    }

    getSection(name: string): Platform[] | undefined {
        return this._sections.get(name);
    }

    setSectionVisible(name: string, visible: boolean): void {
        const platforms = this._sections.get(name);
        if (!platforms) {
            return;
        }

        for (const platform of platforms) {
            platform.mesh.setEnabled(visible);
        }
    }

    clear() {
        for (const platforms of this._sections.values()) {
            for (const platform of platforms) {
                platform.dispose();
            }
        }
        this._sections.clear();
    }
  
    dispose(): void {
        this.clear();
    }
}