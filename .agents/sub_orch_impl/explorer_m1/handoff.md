# Handoff Report: 2.5D Isometric Canvas Rendering Engine Design

## 1. Observation
- Under `src/components/village`, three main rendering boards exist:
  - `VillageBoard.tsx` (lines 20-161): Uses absolute HTML/CSS positioning to render overlays (`base_map.png.png`, `FortressWall`, and five buildings: `Windmill`, `CenterSVG`, `BankSVG`, `MarketSVG`, `FarmSVG` which are PNG wrapper components).
  - `KidVillageBoard.tsx` (lines 27-102): Attempts to load `/assets/village/village_${level}.png`. However, the directory `public/assets/village` does not contain any `village_X` files (only `bank_X`, `center_X`, etc.). This causes the component to constantly fail and hit the `imgError` state, rendering only a fallback UI card.
  - `KingdomBoard.tsx` (lines 31-120): Loads large pre-rendered images `/assets/village/kingdom_${level}.png` of size **~9.5MB to ~10.1MB each** from the public assets directory.
- Referencing pages:
  - `src/pages/KidCastlePage.tsx` (lines 58-61): Loads `<KidVillageBoard kidLevel={centerLevel} kid={kid} />` bound to the active child's database progress.
  - `src/pages/FatherVillagePage.tsx` (lines 99-103, 249-258): Loads `<KingdomBoard familyLevel={familyCastleLevel} kids={localKids} />` for the dashboard, and `<VillageBoard levels={...} />` inside a child's detail modal.

## 2. Logic Chain
- **Step 1**: The codebase currently uses a hybrid layout approach. In `VillageBoard.tsx`, it uses CSS absolute layouts overlaying PNG sprites on a base map. In `KingdomBoard.tsx` and `KidVillageBoard.tsx`, it relies on loading single monolithic pre-rendered files.
- **Step 2**: The current monolithic asset approach for `KingdomBoard.tsx` is highly unoptimized, downloading ~10MB image files for each board level update. The individual child board `KidVillageBoard.tsx` fails to load assets because they do not exist.
- **Step 3**: By designing a dynamic Canvas-based 2.5D rendering engine, we can draw the individual asset slices (`bank_X.png.png`, `center_X.png.png`, `wall_X.png.png`) directly onto the ground plane using isometric projection math ($px = (x - y) \cdot W_{tile} / 2 + X_{offset}$, $py = (x + y) \cdot H_{tile} / 2 - z \cdot H_{height} + Y_{offset}$).
- **Step 4**: With an $8 \times 8$ grid coordinate layout, we can map the exact positions of all five buildings and insert child outposts for individual kids. Using the Painter's Algorithm loop ($x$ and $y$ increasing from $0$ to $7$), we naturally sort and render the visual assets from back to front, resolving all depth overlapping challenges.
- **Step 5**: To ensure interactive responsiveness, we dynamically scale $W_{tile}$ relative to the canvas CSS client width, and handle high-DPI blur by multiplying size with `window.devicePixelRatio`.
- **Step 6**: We can resolve hover detection on overlapping/complex height sprites using offscreen color-buffer picking, reading individual pixel RGBA channels to identify the exact hovered component in $O(1)$ time.

## 3. Caveats
- **Outpost Assets**: The codebase does not currently contain dedicated `outpost` assets. The design assumes we fallback to `center_1.png.png` / `center_2.png.png` scaled down to fit a $1\times 1$ grid unit, or add new assets in the future.
- **Isometric Wall Clipping**: Slicing the monolithic wall assets into modular perimeter walls requires careful alignment of textures. If modular walls are unavailable, the wall image overlay can be drawn as a monolithic layer immediately after the base map.

## 4. Conclusion
The proposed design for `IsometricVillageCanvas.tsx` is a robust, dynamic, and high-performance replacement for the three separate board files. It will fix the broken child village fallback bug and eliminate massive resource payloads (saving over 50MB of images).

## 5. Verification Method
- **Mathematical Integrity**: Inspect and verify that the forward/inverse formulas balance out:
  - $(x, y) = (\text{inverseProjection}(\text{forwardProjection}(x, y)))$
- **Asset Availability**: Verify that all 31 assets defined in `ASSET_MANIFEST` of `analysis.md` exist under `public/assets/village/` (the filenames have been verified using `list_dir`).
- **Layout Integrity**: Inspect `analysis.md` in the working directory `C:\Users\saleh\OneDrive\Documentos\NAMAA\.agents\sub_orch_impl\explorer_m1/` to ensure all equations, pseudocode, and structural designs are complete.
