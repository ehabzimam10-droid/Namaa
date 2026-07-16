# Project: Namaa Kingdom & Village Canvas Simulator

## Architecture
We are building a custom HTML5 2D Canvas-based 2.5D/3D Isometric Rendering engine to replace the static image-based boards in Namaa.
- All transformations (isometric projection: projecting 3D/2.5D grid coordinate (x, y, z) into 2D screen coordinates (px, py)) will be computed mathematically in React/TypeScript.
- Buildings are represented as interactive entities rendered on the canvas.
- Smooth transitions and particle effects will be drawn frame-by-frame using `requestAnimationFrame`.
- A developer dashboard/testing control panel will allow developers to toggle levels and inspect visual outputs.

### Code Layout
- `src/components/village/IsometricCanvas.tsx` - Reusable Canvas component for isometric rendering, animations, and mouse interaction.
- `src/components/village/KingdomBoard.tsx` - Replaced with the Canvas-based simulator, showing parent's view (fortress walls, castle, outposts).
- `src/components/village/KidVillageBoard.tsx` - Replaced with the Canvas-based simulator, showing child's detailed village.
- `src/components/village/DevControlPanel.tsx` - Controls to test buildings, levels, and trigger upgrade animations.
- `src/components/village/ChildVillageModal.tsx` - The modal popped when clicking a child outpost.

## Milestones
| # | Name | Scope | Dependencies | Status | Conversation ID |
|---|------|-------|--------------|--------|-----------------|
| 1 | E2E Testing Track | Design and implement complete 4-tier E2E test cases, outputs `TEST_READY.md` | None | DONE | cf45c4e8-b40c-450b-b9ab-d7cde00fa0b2 |
| 2 | Canvas Rendering Engine | Core isometric mathematics, asset loading, base map and building rendering | None | DONE | 0c437141-c538-43a4-be3e-e3dec51c1f92 |
| 3 | Level Evolution & Animation | Level 1-5 rendering, transition effects, particles, and developer controls | M2 | DONE | 0c437141-c538-43a4-be3e-e3dec51c1f92 |
| 4 | Parent Dashboard & Outposts | Fortress walls, central castle, child outposts, clicking outposts triggers modals | M2, M3 | DONE | 0c437141-c538-43a4-be3e-e3dec51c1f92 |
| 5 | E2E Test Pass & Audit | Running E2E tests, fixing any failures, running Forensic Auditor | M1, M4 | DONE | 0c437141-c538-43a4-be3e-e3dec51c1f92 / 5deaced1-f937-4094-8a2e-50325fedd4f5 |

## Interface Contracts
### `IsometricCanvasProps`
- `mode`: `'parent' | 'child'`
- `level`: `number` (1 to 5)
- `onOutpostClick?`: `(childId: string) => void`
- `kidsData?`: `Kid[]`
- `selectedKidId?`: `string`

### Child Outpost Modal Interface
- `isOpen`: `boolean`
- `onClose`: `() => void`
- `kid`: `Kid`
- `kidLevel`: `number`
