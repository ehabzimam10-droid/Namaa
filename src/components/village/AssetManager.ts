export const ASSET_MANIFEST: Record<string, string> = {
  base_map: '/assets/village/base_map.png',
  
  // Walls
  wall_1: '/assets/village/wall_1.png',
  wall_2: '/assets/village/wall_2.png',
  wall_3: '/assets/village/wall_3.png',
  wall_4: '/assets/village/wall_4.png',
  wall_5: '/assets/village/wall_5.png',

  // Center / Castle
  center_1: '/assets/village/center_1.png',
  center_2: '/assets/village/center_2.png',
  center_3: '/assets/village/center_3.png',
  center_4: '/assets/village/center_4.png',
  center_5: '/assets/village/center_5.png',

  // Bank
  bank_1: '/assets/village/bank_1.png',
  bank_2: '/assets/village/bank_2.png',
  bank_3: '/assets/village/bank_3.png',
  bank_4: '/assets/village/bank_4.png',
  bank_5: '/assets/village/bank_5.png',

  // Market
  market_1: '/assets/village/market_1.png',
  market_2: '/assets/village/market_2.png',
  market_3: '/assets/village/market_3.png',
  market_4: '/assets/village/market_4.png',
  market_5: '/assets/village/market_5.png',

  // Farm
  farm_1: '/assets/village/farm_1.png',
  farm_2: '/assets/village/farm_2.png',
  farm_3: '/assets/village/farm_3.png',
  farm_4: '/assets/village/farm_4.png',
  farm_5: '/assets/village/farm_5.png',

  // Windmill
  windmill_1: '/assets/village/windmill_1.png',
  windmill_2: '/assets/village/windmill_2.png',
  windmill_3: '/assets/village/windmill_3.png',
  windmill_4: '/assets/village/windmill_4.png',
  windmill_5: '/assets/village/windmill_5.png',
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
          console.warn(`[AssetManager] Failed to load asset: ${src}. Using fallback.`);
          // Create a fallback colored canvas so the village still renders
          const fallback = document.createElement('canvas');
          fallback.width = 200;
          fallback.height = 200;
          const fctx = fallback.getContext('2d')!;
          fctx.fillStyle = '#1C2C4E';
          fctx.fillRect(0, 0, 200, 200);
          fctx.strokeStyle = '#FFD700';
          fctx.lineWidth = 4;
          fctx.strokeRect(4, 4, 192, 192);
          fctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
          fctx.font = 'bold 14px sans-serif';
          fctx.textAlign = 'center';
          fctx.textBaseline = 'middle';
          fctx.fillText('?', 100, 100);
          const fakeImg = new Image();
          fakeImg.src = fallback.toDataURL();
          fakeImg.onload = () => {
            this.images.set(key, fakeImg);
            loadedCount++;
            if (onProgress) onProgress(Math.round((loadedCount / entries.length) * 100));
            resolve();
          };
          fakeImg.onerror = () => {
            // Even the fake img failed — just resolve silently
            loadedCount++;
            if (onProgress) onProgress(Math.round((loadedCount / entries.length) * 100));
            resolve();
          };
        };
      });
    });

    await Promise.all(promises);
    this.loaded = true;
  }

  public get(key: string): HTMLImageElement | undefined {
    return this.images.get(key);
  }

  public isLoaded(): boolean {
    return this.loaded;
  }
}
