# 2.5D Isometric Canvas-Based Rendering Engine: Design and Analysis Report

## Executive Summary
This report analyzes the current visual representation of the village boards in the NAMAA application and designs a high-performance, dynamic, Canvas-based 2.5D isometric rendering engine. Implementing this design will eliminate the dependency on large pre-rendered images (saving over 50MB of assets), solve layout bugs (such as broken image fallbacks in the child view), and enable fluid, pixel-perfect user interaction.

---

## 1. Analysis of the Existing Codebase

### 1.1 Existing Component Directory (`src/components/village`)
- **`VillageBoard.tsx`**: Renders the village by overlaying a static background (`base_map.png.png`), a full-screen wall image (`FortressWall`), and individual building wrappers (`BankSVG`, `CenterSVG`, `FarmSVG`, `MarketSVG`, `Windmill`) using absolute CSS percentages. 
  - *Limitation*: Relies on absolute positioning, which can break or shift layout at non-standard aspect ratios. Additionally, simple vertical float CSS animations (`@keyframes float`) are used for depth effect, but the buildings do not have true depth sorting.
- **`KidVillageBoard.tsx`**: Intended to render the child's village. It attempts to load pre-rendered background images `/assets/village/village_${level}.png`.
  - *Critical Defect*: No `village_X.png` assets exist in the public directory (assets are named `bank_X`, `center_X`, `kingdom_X`, etc.). This causes the component to constantly fail image loading and display a static fallback card (`imgError` is always `true`).
- **`KingdomBoard.tsx`**: Used for the grand family view. It displays the consolidated kingdom using large pre-rendered images: `/assets/village/kingdom_${level}.png` (levels 1-5).
  - *Performance Issue*: Each of these 5 kingdom images is roughly **9.5MB to 10.1MB** in size. Loading these files causes massive bandwidth usage (~50MB total) and high initial render latency for mobile/web users.
- **Building & Wall Wrappers** (`BankSVG.tsx`, `CenterSVG.tsx`, etc.): These files do not contain inline SVGs. Instead, they are React wrapper components returning simple `<img>` tags pointing to `.png.png` assets in `/assets/village` (e.g., `windmill_1.png.png` through `windmill_5.png.png`).

### 1.2 Page Integration (`KidCastlePage.tsx` & `FatherVillagePage.tsx`)
- **`KidCastlePage.tsx`**:
  - Binds live database levels (`bank_level`, `farm_level`, `market_level`, `center_level`, and a dynamic `windmillLevel` based on completed tasks) from context.
  - Passes these levels to `<KidVillageBoard>` which represents the individual village view.
  - Contains a developer level-control slider at the bottom to test UI upgrades.
- **`FatherVillagePage.tsx`**:
  - Displays the shared family board `<KingdomBoard>` using average levels computed from all children's individual performance.
  - Contains side-by-side preview cards showing the levels of each child (Khalid and Salem).
  - Opening a child's detail button displays a modal that runs the dynamic `<VillageBoard>` loaded with that child's exact levels.
  
### 1.3 Case for Canvas Migration
By transitioning to a dynamic Canvas-based isometric rendering system, we achieve:
1. **Dynamic Composition**: We can render buildings of different levels independently on the same map (e.g., Level 5 Bank next to a Level 1 Farm), which is impossible with pre-rendered whole-kingdom images.
2. **Zero Pre-rendered Kingdom Images**: The ~50MB of `kingdom_X.png` images can be discarded. We instead draw individual building sprites ($\approx$ 250KB each) dynamically on top of the base map.
3. **True Depth Sorting**: Render components properly overlapping each other based on their 3D coordinates.

---

## 2. 2.5D Isometric Projection Mathematics

In an isometric grid system, the grid is rotated by $45^\circ$ and scaled vertically by $\approx 57.7\%$ (representing a 3D viewing angle). This is mathematically approximated by a $2:1$ projection ratio where the width of a grid cell on-screen is exactly twice its height.

```
            (0,0)  - Far Back (Top)
            /   \
           /     \
    (0,7) /       \ (7,0) - Far Right
    Far   \       /
    Left   \     /
            \   /
            (7,7)  - Far Front (Bottom)
```

### 2.1 Forward Projection (3D to 2D)
Given a 3D grid coordinate $(x, y, z)$, where $x$ represents the grid row index (pointing down-right on screen), $y$ represents the grid column index (pointing down-left on screen), and $z$ represents the vertical elevation (pointing straight up), the projected screen coordinates $(px, py)$ are calculated as follows:

$$px = (x - y) \cdot \frac{W_{tile}}{2} + X_{offset}$$

$$py = (x + y) \cdot \frac{H_{tile}}{2} - z \cdot H_{height} + Y_{offset}$$

Where:
- $W_{tile}$: The screen width of a single ground tile.
- $H_{tile}$: The screen height of a single ground tile (for $2:1$ isometric projection, $H_{tile} = \frac{W_{tile}}{2}$).
- $H_{height}$: The vertical scale factor mapping a unit of $z$ to screen pixels. (Typically $H_{height} = H_{tile}$ or a constant like $40\text{px}$).
- $X_{offset}$: The horizontal translation to center the grid on the canvas.
- $Y_{offset}$: The vertical translation to center the grid on the canvas.

### 2.2 Offset Calibration (Centering the Grid)
For a grid size of $N \times N$ tiles (where $N = 8$), the boundaries of the projected grid on screen are:
- Total Screen Width: $W_{grid} = N \cdot W_{tile}$
- Total Screen Height: $H_{grid} = N \cdot H_{tile}$

To center the grid on a canvas of width $W_{canvas}$ and height $H_{canvas}$:

$$X_{offset} = \frac{W_{canvas}}{2}$$

$$Y_{offset} = \frac{H_{canvas} - H_{grid}}{2} + Y_{padding}$$

Where $Y_{padding}$ is a downward offset (e.g., $40\text{px}$) to accommodate buildings on the back row that extend vertically above the grid boundary.

### 2.3 Responsiveness & Resolution Scaling
To prevent rendering blur on Retina/high-DPI screens, the canvas drawing buffer resolution must scale with the device pixel ratio, while maintaining CSS styling dimensions.

1. **Calculate Dimensions**:
   ```typescript
   const dpr = window.devicePixelRatio || 1;
   const rect = canvas.getBoundingClientRect();
   canvas.width = rect.width * dpr;
   canvas.height = rect.height * dpr;
   ctx.scale(dpr, dpr);
   ```
2. **Dynamic Tile Sizing**:
   To make the board fully responsive, the tile size $W_{tile}$ adjusts dynamically to the container's CSS width $W_{css}$:
   
   $$W_{tile} = \frac{W_{css}}{N + 2}$$
   
   $$H_{tile} = \frac{W_{tile}}{2}$$
   
   This automatically scales all coordinates and visual assets when resizing the window or switching devices (mobile to desktop).

---

## 3. Mouse Hover & Selection Interaction

Because buildings have vertical height, the mouse cursor can hover over a building's roof which maps to a completely different ground grid cell. Two primary strategies resolve this:

### 3.1 Method A: Inverse Isometric Projection (Ground Plane Only)
If interaction is limited to the ground floor or a selection indicator, we translate screen coordinates $(mx, my)$ back to grid coordinates $(x, y)$ by setting $z = 0$:

$$x = \frac{my - Y_{offset}}{H_{tile}} + \frac{mx - X_{offset}}{W_{tile}}$$

$$y = \frac{my - Y_{offset}}{H_{tile}} - \frac{mx - X_{offset}}{W_{tile}}$$

Taking the floor of these values gives the active cell indices:

$$x_{grid} = \lfloor x \rfloor, \quad y_{grid} = \lfloor y \rfloor$$

If $0 \le x_{grid} < N$ and $0 \le y_{grid} < N$, the cursor is inside the grid boundary.

### 3.2 Method B: Bounding Polygons (PNPOLY Ray-Casting)
For precise building clicks, define a clickable bounding polygon around each building relative to its screen position $(px, py)$. The polygon approximates the isometric silhouette of the structure.

To check if mouse coordinates $(mx, my)$ are inside the polygon:
```typescript
function isPointInPolygon(mx: number, my: number, polygon: { x: number; y: number }[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].x, yi = polygon[i].y;
    const xj = polygon[j].x, yj = polygon[j].y;
    const intersect = ((yi > my) !== (yj > my)) &&
                      (mx < ((xj - xi) * (my - yi)) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}
```

### 3.3 Method C: Offscreen Color-Buffer Picking (Recommended)
For overlapping, non-convex sprite shapes, color-buffer picking is the industry standard:
1. Initialize an offscreen canvas of the same dimensions.
2. In a quick offscreen pass, render each building's exact sprite silhouette in a unique solid color mapping to its ID (e.g., Castle is filled with `rgb(1, 0, 0)`, Bank with `rgb(2, 0, 0)`, etc.).
3. On mouse-move, extract the pixel data under the cursor:
   ```typescript
   const pixel = offscreenCtx.getImageData(mx, my, 1, 1).data;
   const id = pixel[3] > 10 ? pixel[0] : 0; // Check alpha threshold to ignore transparent pixels
   ```
4. Map the red channel value (`id`) directly to the hovered building. This offers $O(1)$ lookup complexity and perfect accuracy, regardless of visual overlap.

---

## 4. Grid Coordinate Layout Map

The coordinate system uses an $8 \times 8$ grid. Ground coordinates $(0,0)$ correspond to the top point of the isometric board, while $(7,7)$ corresponds to the bottom.

### 4.1 Building Placement Table

| Building / Outpost | Grid Anchor $(x, y)$ | Footprint Size | Visual Layer Order | Description / Growth Metric |
| :--- | :---: | :---: | :---: | :--- |
| **Windmill (طاحونة المهام)** | $(1, 1)$ | $1 \times 1$ | Back-Center | Linked to kid's completed household tasks. |
| **Castle (القصر العائلي)** | $(3, 3)$ | $2 \times 2$ | Center | Represents total financial growth / level. |
| **Bank (البنك العائلي)** | $(1, 5)$ | $2 \times 2$ | Mid-Left | Represents total savings in smart coin box. |
| **Market (سوق الاستثمار)** | $(5, 1)$ | $2 \times 2$ | Mid-Right | Represents active investment in family projects. |
| **Farm (مزرعة العطاء)** | $(5, 5)$ | $2 \times 2$ | Front-Center | Represents donations and community work. |
| **Fortress Wall (الأسوار)** | Perimeter | $1 \times 1$ units | Boundary | Surrounds the grid perimeter. Upgrades with castle level. |
| **Outpost 1: Khalid (خالد)** | $(6, 3)$ | $1 \times 1$ | Front-Right | Small house displaying Khalid's profile status. |
| **Outpost 2: Salem (سالم)** | $(3, 6)$ | $1 \times 1$ | Front-Left | Small house displaying Salem's profile status. |

### 4.2 Render Ordering & Depth Sorting (Painter's Algorithm)
To prevent clipping issues (where background assets draw over foreground assets), objects must be rendered from back-to-front. 

```typescript
// Render loop following the Painter's Algorithm
function drawScene(ctx: CanvasRenderingContext2D) {
  // 1. Draw Base Map (Ground grass and paths)
  ctx.drawImage(baseMapImage, 0, 0, canvasWidth, canvasHeight);

  // 2. Loop through the grid from back to front (increasing x + y depth)
  for (let x = 0; x < 8; x++) {
    for (let y = 0; y < 8; y++) {
      // a. Draw Wall Segment at (x, y) if cell lies on the perimeter
      if (isPerimeter(x, y)) {
        drawWallSegment(ctx, x, y, wallLevel);
      }

      // b. Draw Main Building if (x, y) matches building anchor
      const building = getBuildingAt(x, y);
      if (building) {
        drawBuildingSprite(ctx, building.type, building.level, x, y);
      }

      // c. Draw Child Outpost if (x, y) matches outpost anchor
      const outpost = getOutpostAt(x, y);
      if (outpost) {
        drawOutpostSprite(ctx, outpost.kidName, outpost.level, x, y);
        drawOutpostLabel(ctx, outpost.kidName, x, y);
      }
    }
  }
}
```

---

## 5. Asset Pre-loading Strategy & Manifest

To avoid dynamic flickering as levels change or assets load asynchronously during render cycles, all assets must be pre-loaded.

### 5.1 Asset Manifest Map
```typescript
const ASSET_MANIFEST: Record<string, string> = {
  base_map: '/assets/village/base_map.png.png',
  
  // Walls
  wall_1: '/assets/village/wall_1.png.png',
  wall_2: '/assets/village/wall_2.png.png',
  wall_3: '/assets/village/wall_3.png.png',
  wall_4: '/assets/village/wall_4.png.png',
  wall_5: '/assets/village/wall_5.png.png',

  // Castle / Center
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
  
  // Child Outpost Sprites (Fallback to center style or custom small cottages)
  outpost_1: '/assets/village/center_1.png.png',
  outpost_2: '/assets/village/center_2.png.png',
};
```

### 5.2 Pre-loader Class Design
This class handles asynchronous loading and returns a progress percentage for the loader screen:

```typescript
export class AssetManager {
  private images: Map<string, HTMLImageElement> = new Map();
  private loaded = false;

  public async preload(
    manifest: Record<string, string>, 
    onProgress?: (progress: number) => void
  ): Promise<void> {
    const entries = Object.entries(manifest);
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
```

---

## 6. React Component & Page Interaction Architecture

### 6.1 Reusable Canvas Component Signature
The core engine is encapsulated in a reusable React component `IsometricVillageCanvas.tsx`.

```typescript
import React, { useRef, useEffect, useState } from 'react';
import { AssetManager } from './AssetManager';

export interface BuildingLevels {
  bank: number;
  farm: number;
  market: number;
  center: number;
  windmill: number;
}

export interface ChildOutpostData {
  id: string;
  name: string;
  level: number;
  gridX: number;
  gridY: number;
  balance: number;
  saved: number;
  donationPoints: number;
}

interface IsometricVillageCanvasProps {
  mode: 'child' | 'parent';
  levels: BuildingLevels;
  wallLevel: number;
  outposts?: ChildOutpostData[];
  onHoverBuilding?: (buildingKey: keyof BuildingLevels | null) => void;
  onHoverOutpost?: (outpost: ChildOutpostData | null) => void;
  onClickBuilding?: (buildingKey: keyof BuildingLevels) => void;
  onClickOutpost?: (outpost: ChildOutpostData) => void;
}

export const IsometricVillageCanvas: React.FC<IsometricVillageCanvasProps> = ({
  mode,
  levels,
  wallLevel,
  outposts = [],
  onHoverBuilding,
  onHoverOutpost,
  onClickBuilding,
  onClickOutpost
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [assetManager] = useState(() => new AssetManager());
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [assetsLoaded, setAssetsLoaded] = useState(false);

  useEffect(() => {
    // 1. Preload assets once on component mount
    assetManager.preload(ASSET_MANIFEST, setLoadingProgress)
      .then(() => setAssetsLoaded(true))
      .catch((err) => console.error("Asset load failure:", err));
  }, []);

  useEffect(() => {
    if (!assetsLoaded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate responsive tile size
      const W_tile = canvas.width / 10; 
      const H_tile = W_tile / 2;
      const X_offset = canvas.width / 2;
      const Y_offset = (canvas.height - (8 * H_tile)) / 2 + 40;

      // Draw Base Map
      ctx.drawImage(assetManager.get('base_map'), 0, 0, canvas.width, canvas.height);

      // Painter's algorithm loop
      for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
          const px = (x - y) * (W_tile / 2) + X_offset;
          const py = (x + y) * (H_tile / 2) + Y_offset;

          // Draw walls on perimeter
          if (x === 0 || y === 0 || x === 7 || y === 7) {
            const wallImg = assetManager.get(`wall_${wallLevel}`);
            // Subtract wall texture height so it sits correctly on the cell
            ctx.drawImage(wallImg, px - W_tile / 2, py - H_tile, W_tile, H_tile * 2);
          }

          // Draw central castle
          if (x === 3 && y === 3) {
            const castleImg = assetManager.get(`center_${levels.center}`);
            ctx.drawImage(castleImg, px - W_tile, py - H_tile * 2, W_tile * 2, H_tile * 3);
          }

          // Draw Windmill
          if (x === 1 && y === 1) {
            const windmillImg = assetManager.get(`windmill_${levels.windmill}`);
            ctx.drawImage(windmillImg, px - W_tile / 2, py - H_tile * 1.5, W_tile, H_tile * 2);
          }

          // Draw Bank
          if (x === 1 && y === 5) {
            const bankImg = assetManager.get(`bank_${levels.bank}`);
            ctx.drawImage(bankImg, px - W_tile, py - H_tile * 2, W_tile * 2, H_tile * 3);
          }

          // Draw Market
          if (x === 5 && y === 1) {
            const marketImg = assetManager.get(`market_${levels.market}`);
            ctx.drawImage(marketImg, px - W_tile, py - H_tile * 2, W_tile * 2, H_tile * 3);
          }

          // Draw Farm
          if (x === 5 && y === 5) {
            const farmImg = assetManager.get(`farm_${levels.farm}`);
            ctx.drawImage(farmImg, px - W_tile, py - H_tile * 2, W_tile * 2, H_tile * 3);
          }

          // Render Outposts if in Parent mode
          if (mode === 'parent') {
            const outpost = outposts.find(o => o.gridX === x && o.gridY === y);
            if (outpost) {
              const outpostImg = assetManager.get(`outpost_${outpost.level}`);
              ctx.drawImage(outpostImg, px - W_tile / 2, py - H_tile, W_tile, H_tile * 2);
              
              // Draw small text label over outpost
              ctx.fillStyle = '#ffffff';
              ctx.font = 'bold 10px sans-serif';
              ctx.textAlign = 'center';
              ctx.fillText(outpost.name, px, py - H_tile - 5);
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [assetsLoaded, levels, wallLevel, outposts, mode]);

  if (!assetsLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-white">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-semibold text-orange-400">جاري تحميل القرية التفاعلية ({loadingProgress}%)</p>
      </div>
    );
  }

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full aspect-square max-w-[800px] mx-auto block rounded-3xl cursor-pointer"
    />
  );
};
```

---

## 7. Component Communication & Integration Design

### 7.1 Child View: `KidVillageBoard.tsx`
- **Role**: Render the interactive village of the active kid.
- **Props**: Receives active `kid` and `kidLevel` props.
- **Implementation**:
  - Maps `kid` level data to the `BuildingLevels` interface:
    - `bank: kid.bank_level`
    - `farm: kid.farm_level`
    - `market: kid.market_level`
    - `center: kid.center_level`
    - `windmill: windmillLevel` (derived from completed tasks).
  - Renders `<IsometricVillageCanvas mode="child" levels={levels} wallLevel={kid.center_level} onHoverBuilding={handleHover} />`.
  - Handles `onHoverBuilding` to display the active React floating HTML overlay card showing their personal stats (e.g., total saved, donations, investments).

### 7.2 Parent View: `KingdomBoard.tsx`
- **Role**: Render the shared family castle board comparing children.
- **Props**: Receives consolidated family level and the array of children's profile objects.
- **Implementation**:
  - Calculates average building levels from the `kids` array.
  - Generates the `outposts` list placing Khalid at $(6, 3)$ and Salem at $(3, 6)$ dynamically loaded with their specific levels and profile IDs.
  - Renders `<IsometricVillageCanvas mode="parent" levels={averageLevels} wallLevel={familyLevel} outposts={childOutposts} onHoverOutpost={handleHoverOutpost} onClickOutpost={handleOpenDetailModal} />`.
  - Displays a dual-stat comparison tooltip card when hovering over the average buildings, showing Salem's vs Khalid's numbers (matching the existing design requirement).
  - When clicking on a child's outpost, triggers `handleOpenDetailModal` which opens a popup displaying that kid's individual board.

---

## 8. Verification Strategy & Next Steps

To verify the implementation of this Canvas-based 2.5D Isometric Rendering engine, the following automated and visual tests should be conducted:
1. **Asset Loading Verification**:
   - Check that `AssetManager.preload()` successfully loads all 31 images without failing or logging network errors.
   - Verify fallback handles gracefully if an image fails.
2. **Mathematical Precision Verification**:
   - Create unit tests for coordinate translation: verifying that `forwardProjection(x, y)` matches the screen center offset and that `inverseProjection(px, py)` returns the original integer coordinate $(x,y)$.
3. **Interactive Spot Hover Bounds**:
   - Ensure the color-buffer offscreen canvas aligns pixel-for-pixel with the onscreen canvas during resize states.
4. **Performance Benchmark**:
   - Compare memory foot-print and bandwidth in DevTools: Verify the network payload drops from ~50MB (pre-rendered images) to ~15MB (individual sprites) and that CSS reflows/layout shifts are eliminated.
