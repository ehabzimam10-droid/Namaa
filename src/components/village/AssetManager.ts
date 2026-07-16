export const ASSET_MANIFEST: Record<string, string> = {
  base_map: '/assets/village/base_map.png.png',
  
  // Walls
  wall_1: '/assets/village/wall_1.png.png',
  wall_2: '/assets/village/wall_2.png.png',
  wall_3: '/assets/village/wall_3.png.png',
  wall_4: '/assets/village/wall_4.png.png',
  wall_5: '/assets/village/wall_5.png.png',

  // Center / Castle
  center_1: '/assets/village/center_1.png.png',
  center_2: '/assets/village/center_2.png.png',
  center_3: '/assets/village/center_3.png.png',
  center_4: '/assets/village/center_4.png.png',
  center_5: '/assets/village/center_5.png.png',

  // Bank
  bank_1: '/assets/village/bank_1.png.png',
  bank_2: '/assets/village/bank_2.png.png',
  bank_3: '/assets/village/bank_3.png.png',
  bank_4: '/assets/village/bank_4.png.png',
  bank_5: '/assets/village/bank_5.png.png',

  // Market
  market_1: '/assets/village/market_1.png.png',
  market_2: '/assets/village/market_2.png.png',
  market_3: '/assets/village/market_3.png.png',
  market_4: '/assets/village/market_4.png.png',
  market_5: '/assets/village/market_5.png.png',

  // Farm
  farm_1: '/assets/village/farm_1.png.png',
  farm_2: '/assets/village/farm_2.png.png',
  farm_3: '/assets/village/farm_3.png.png',
  farm_4: '/assets/village/farm_4.png.png',
  farm_5: '/assets/village/farm_5.png.png',

  // Windmill
  windmill_1: '/assets/village/windmill_1.png.png',
  windmill_2: '/assets/village/windmill_2.png.png',
  windmill_3: '/assets/village/windmill_3.png.png',
  windmill_4: '/assets/village/windmill_4.png.png',
  windmill_5: '/assets/village/windmill_5.png.png',
};

export class AssetManager {
  private images = new Map<string, HTMLImageElement>();
  private loaded = false;

  public async preload(
    onProgress?: (progress: number) => void
  ): Promise<void> {
    const entries = Object.entries(ASSET_MANIFEST);
    let loadedCount = 0;

    const promises = entries.map(([key, src]) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          this.images.set(key, img);
          loadedCount++;
          if (onProgress) {
            onProgress(Math.round((loadedCount / entries.length) * 100));
          }
          resolve();
        };
        img.onerror = () => {
          reject(new Error(`Failed to load asset: ${src}`));
        };
      });
    });

    await Promise.all(promises);
    this.loaded = true;
  }

  public get(key: string): HTMLImageElement {
    const img = this.images.get(key);
    if (!img) {
      throw new Error(`Asset key "${key}" not found in cache.`);
    }
    return img;
  }

  public isLoaded(): boolean {
    return this.loaded;
  }
}
