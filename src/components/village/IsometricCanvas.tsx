import { useRef, useEffect, useState } from 'react';
import { AssetManager } from './AssetManager';
import type { Kid } from '../../data/mockData';

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

interface IsometricCanvasProps {
  mode: 'child' | 'parent';
  levels: BuildingLevels;
  wallLevel: number;
  outposts?: ChildOutpostData[];
  kid?: Kid;
  kids?: Kid[];
  onHoverBuilding?: (buildingKey: keyof BuildingLevels | null) => void;
  onHoverOutpost?: (outpost: ChildOutpostData | null) => void;
  onClickBuilding?: (buildingKey: keyof BuildingLevels) => void;
  onClickOutpost?: (outpost: ChildOutpostData) => void;
}

type HoveredItem =
  | { type: 'building'; key: keyof BuildingLevels; px: number; py: number }
  | { type: 'outpost'; data: ChildOutpostData; px: number; py: number }
  | null;

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  alpha: number;
  size: number;
  life: number;
  elapsed: number;
  lastUpdate: number;
}

interface LevelTransition {
  oldLevel: number;
  newLevel: number;
  startTime: number;
  duration: number;
}

interface Cloud {
  x: number;
  y: number;
  rx: number;
  ry: number;
  speed: number;
  alpha: number;
}

const getScale = (elapsed: number): number => {
  const p = elapsed / 600;
  if (p < 0.3) {
    const t = p / 0.3;
    return 1.0 + 0.35 * (1 - (1 - t) * (1 - t));
  } else if (p < 0.7) {
    const t = (p - 0.3) / 0.4;
    const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    return 1.35 - 0.45 * ease;
  } else {
    const t = (p - 0.7) / 0.3;
    const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    return 0.9 + 0.1 * ease;
  }
};

const BUILDING_GLOW_COLORS: Record<keyof BuildingLevels, string> = {
  center: 'rgba(255, 215, 0, 0.9)',
  bank: 'rgba(255, 165, 0, 0.9)',
  farm: 'rgba(16, 200, 100, 0.9)',
  market: 'rgba(245, 180, 30, 0.9)',
  windmill: 'rgba(80, 160, 255, 0.9)',
};

export default function IsometricCanvas({
  mode,
  levels,
  wallLevel,
  outposts = [],
  kid,
  kids = [],
  onHoverBuilding,
  onHoverOutpost,
  onClickBuilding,
  onClickOutpost,
}: IsometricCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [assetManager] = useState(() => new AssetManager());
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<HoveredItem>(null);

  const prevLevelsRef = useRef<BuildingLevels>({ ...levels });
  const bounceAnimationsRef = useRef<Partial<Record<keyof BuildingLevels, number>>>({});
  const upgradeTriggeredRef = useRef<Partial<Record<keyof BuildingLevels, boolean>>>({});
  const particlesRef = useRef<Particle[]>([]);
  const levelTransitionsRef = useRef<Partial<Record<keyof BuildingLevels, LevelTransition>>>({});
  const windmillAngleRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(performance.now());
  const cloudsRef = useRef<Cloud[]>([]);

  // Init clouds once
  useEffect(() => {
    cloudsRef.current = [
      { x: 80,  y: 28, rx: 55, ry: 18, speed: 0.12, alpha: 0.18 },
      { x: 320, y: 18, rx: 70, ry: 22, speed: 0.08, alpha: 0.13 },
      { x: 560, y: 38, rx: 45, ry: 16, speed: 0.15, alpha: 0.15 },
    ];
  }, []);

  // Detect level upgrades — trigger bounce, particles, and cross-fade transition
  useEffect(() => {
    const keys: (keyof BuildingLevels)[] = ['bank', 'farm', 'market', 'center', 'windmill'];
    keys.forEach((key) => {
      const prevVal = prevLevelsRef.current[key];
      const newVal = levels[key];
      if (newVal !== prevVal) {
        bounceAnimationsRef.current[key] = performance.now();
        if (newVal > prevVal) upgradeTriggeredRef.current[key] = true;
        levelTransitionsRef.current[key] = {
          oldLevel: prevVal,
          newLevel: newVal,
          startTime: performance.now(),
          duration: 400,
        };
      }
    });
    prevLevelsRef.current = { ...levels };
  }, [levels]);

  // Helper calculations for specific building stats
  const getInvestmentAmount = (k?: Kid) => {
    if (!k || !k.transactions) return 0;
    return k.transactions
      .filter((t: any) => t.description?.includes('استثمار') || t.type === 'investment' || t.category === 'استثمار')
      .reduce((sum: number, t: any) => sum + Math.abs(t.amount), 0);
  };

  const getCompletedTasks = (k?: Kid) => {
    if (!k || !k.tasks) return 0;
    return k.tasks.filter((t: any) => t.status === 'approved' || t.status === 'completed').length;
  };

  useEffect(() => {
    assetManager.preload(setLoadingProgress)
      .then(() => setAssetsLoaded(true))
      .catch((err) => {
        console.error('Asset load failure:', err);
      });
  }, [assetManager]);

  useEffect(() => {
    if (!assetsLoaded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const newWidth = Math.round(rect.width * dpr);
      const newHeight = Math.round(rect.height * dpr);
      if (canvas.width !== newWidth || canvas.height !== newHeight) {
        canvas.width = newWidth;
        canvas.height = newHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    const interval = setInterval(resizeCanvas, 500);
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      clearInterval(interval);
    };
  }, [assetsLoaded]);

  useEffect(() => {
    if (!assetsLoaded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const now = performance.now();
      const dt = (now - lastFrameTimeRef.current) / 1000; // seconds
      lastFrameTimeRef.current = now;

      const dpr = window.devicePixelRatio || 1;
      const cssWidth = canvas.width / dpr;
      const cssHeight = canvas.height / dpr;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      // ── Tile Geometry ────────────────────────────────────────
      const W_tile = cssWidth / 13.5;
      const H_tile = W_tile / 2;
      const X_offset = cssWidth / 2;
      const Y_offset = (cssHeight - (12 * H_tile)) / 2 + 15;

      // ── 1. BACKGROUND: Always draw procedural green kingdom ground ───
      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, cssHeight * 0.52);
      skyGrad.addColorStop(0, '#0B1624');
      skyGrad.addColorStop(0.6, '#0D2B40');
      skyGrad.addColorStop(1, '#143520');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, cssWidth, cssHeight);

      // ── Animated Clouds in sky zone ──────────────────────────
      cloudsRef.current.forEach((cloud) => {
        cloud.x += cloud.speed;
        if (cloud.x - cloud.rx > cssWidth) cloud.x = -cloud.rx;

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(cloud.x, cloud.y, cloud.rx, cloud.ry, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${cloud.alpha})`;
        ctx.fill();
        // Puff 1
        ctx.beginPath();
        ctx.ellipse(cloud.x - cloud.rx * 0.35, cloud.y - cloud.ry * 0.4, cloud.rx * 0.5, cloud.ry * 0.65, 0, 0, Math.PI * 2);
        ctx.fill();
        // Puff 2
        ctx.beginPath();
        ctx.ellipse(cloud.x + cloud.rx * 0.4, cloud.y - cloud.ry * 0.3, cloud.rx * 0.45, cloud.ry * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // ── Isometric Green Ground Tiles (always drawn) ──────────
      for (let gx = 0; gx < 12; gx++) {
        for (let gy = 0; gy < 12; gy++) {
          const tpx = (gx - gy) * (W_tile / 2) + X_offset;
          const tpy = (gx + gy) * (H_tile / 2) + Y_offset;
          const evenOdd = (gx + gy) % 2 === 0;

          ctx.beginPath();
          ctx.moveTo(tpx, tpy - H_tile / 2);
          ctx.lineTo(tpx + W_tile / 2, tpy);
          ctx.lineTo(tpx, tpy + H_tile / 2);
          ctx.lineTo(tpx - W_tile / 2, tpy);
          ctx.closePath();

          // Two alternating green shades
          ctx.fillStyle = evenOdd ? '#22551A' : '#163A10';
          ctx.fill();

          // Subtle green outline
          ctx.strokeStyle = 'rgba(100, 220, 70, 0.10)';
          ctx.lineWidth = 0.7;
          ctx.stroke();

          // Top-left highlight facet for 3D depth
          ctx.beginPath();
          ctx.moveTo(tpx, tpy - H_tile / 2);
          ctx.lineTo(tpx + W_tile / 2, tpy);
          ctx.lineTo(tpx, tpy);
          ctx.closePath();
          ctx.fillStyle = 'rgba(255,255,255,0.04)';
          ctx.fill();
        }
      }

      // Optionally overlay wall image (transparent blend)
      // base_map is not used — we use our procedural ground

      // ── 2. FORTRESS WALL ─────────────────────────────────────
      // Wall is now drawn programmatically tile-by-tile inside the Painter's Algorithm loop to prevent rendering issues and overlap.

      // ── Update windmill rotation ─────────────────────────────
      const windmillSpeed = 0.4 + levels.windmill * 0.18; // rad/s
      windmillAngleRef.current += windmillSpeed * dt;

      // ── 3. SPAWN UPGRADE PARTICLES ───────────────────────────
      const bKeys: (keyof BuildingLevels)[] = ['bank', 'farm', 'market', 'center', 'windmill'];
      bKeys.forEach((key) => {
        if (upgradeTriggeredRef.current[key]) {
          upgradeTriggeredRef.current[key] = false;
          const gridPos: Record<keyof BuildingLevels, [number, number]> = {
            windmill: [1, 1],
            bank: [1, 5],
            center: [3, 3],
            market: [5, 1],
            farm: [5, 5],
          };
          const [bx, by] = gridPos[key];
          const bpx = (bx - by) * (W_tile / 2) + X_offset;
          const bpy = (bx + by) * (H_tile / 2) + Y_offset;

          let color = '255, 215, 0';
          if (key === 'farm') color = '16, 200, 100';
          else if (key === 'market') color = '245, 158, 11';
          else if (key === 'windmill') color = '80, 160, 255';
          else if (key === 'center') color = Math.random() > 0.5 ? '239, 68, 68' : '251, 191, 36';

          const num = 14 + Math.floor(Math.random() * 8);
          for (let i = 0; i < num; i++) {
            const angle = (Math.random() * Math.PI * 2);
            const speed = 1.2 + Math.random() * 2.5;
            particlesRef.current.push({
              id: Math.random(),
              x: bpx + (Math.random() - 0.5) * W_tile * 0.6,
              y: bpy - H_tile * 0.5,
              vx: Math.cos(angle) * speed * 0.6,
              vy: -speed,
              color,
              alpha: 1.0,
              size: 2.5 + Math.random() * 3.5,
              life: 700 + Math.random() * 700,
              elapsed: 0,
              lastUpdate: now,
            });
          }
        }
      });

      // ── Helper: draw building with bounce + neon glow + cross-fade transition ──
      const drawBuilding = (
        key: keyof BuildingLevels,
        px: number,
        py: number,
        width: number,
        height: number,
        pivotYOffset: number,
        isHovered: boolean
      ) => {
        const bounceStartTime = bounceAnimationsRef.current[key];
        let scale = 1.0;
        if (bounceStartTime !== undefined) {
          const elapsed = now - bounceStartTime;
          if (elapsed >= 600) {
            delete bounceAnimationsRef.current[key];
          } else {
            scale = getScale(elapsed);
          }
        }

        const pivotX = px;
        const pivotY = py + pivotYOffset;
        const drawX = px - width / 2;
        const drawY = py - height + pivotYOffset;

        ctx.save();
        ctx.translate(pivotX, pivotY);
        ctx.scale(scale, scale);
        ctx.translate(-pivotX, -pivotY);

        // Neon glow on hover
        if (isHovered) {
          ctx.shadowBlur = 32;
          ctx.shadowColor = BUILDING_GLOW_COLORS[key];
        }

        // Cross-fade level transition
        const transition = levelTransitionsRef.current[key];
        if (transition) {
          const progress = Math.min(1, (now - transition.startTime) / transition.duration);
          if (progress >= 1) {
            delete levelTransitionsRef.current[key];
            // Just draw current
            const img = assetManager.get(`${key}_${levels[key]}`);
            if (img) ctx.drawImage(img, drawX, drawY, width, height);
          } else {
            // Draw old fading out
            const oldImg = assetManager.get(`${key}_${Math.min(5, Math.max(1, transition.oldLevel))}`);
            if (oldImg) {
              ctx.globalAlpha = 1 - progress;
              ctx.drawImage(oldImg, drawX, drawY, width, height);
            }
            // Draw new fading in
            const newImg = assetManager.get(`${key}_${Math.min(5, Math.max(1, transition.newLevel))}`);
            if (newImg) {
              ctx.globalAlpha = progress;
              ctx.drawImage(newImg, drawX, drawY, width, height);
            }
            ctx.globalAlpha = 1;
          }
        } else {
          const img = assetManager.get(`${key}_${levels[key]}`);
          if (img) ctx.drawImage(img, drawX, drawY, width, height);
        }

        ctx.restore();
      };

      // ── Helper: draw windmill blades on top of windmill building ──
      const drawWindmillBlades = (px: number, py: number, width: number, height: number, pivotYOffset: number) => {
        const bladeBaseX = px;
        const bladeBaseY = py - height + pivotYOffset + height * 0.28; // Center hub
        const bladeLen = width * 0.45;
        const bladeW = width * 0.07;

        ctx.save();
        ctx.translate(bladeBaseX, bladeBaseY);
        ctx.rotate(windmillAngleRef.current);

        for (let i = 0; i < 4; i++) {
          ctx.save();
          ctx.rotate((Math.PI / 2) * i);
          ctx.fillStyle = 'rgba(255, 255, 255, 0.82)';
          ctx.shadowBlur = 6;
          ctx.shadowColor = 'rgba(180, 220, 255, 0.8)';
          ctx.beginPath();
          if (typeof (ctx as any).roundRect === 'function') {
            (ctx as any).roundRect(-bladeW / 2, -bladeLen * 0.85, bladeW, bladeLen, 4);
          } else {
            ctx.rect(-bladeW / 2, -bladeLen * 0.85, bladeW, bladeLen);
          }
          ctx.fill();
          ctx.restore();
        }

        // Hub circle
        ctx.fillStyle = 'rgba(255,255,255,0.95)';
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(120,200,255,0.9)';
        ctx.beginPath();
        ctx.arc(0, 0, bladeW * 0.9, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };

      // ── Helper: draw isometric box/cube programmatically ──
      const drawIsoBox = (
        bx: number,
        by: number,
        hx: number,
        hy: number,
        h: number,
        colors: { top: string; left: string; right: string; stroke?: string }
      ) => {
        const dxX = hx * (W_tile / 2);
        const dyX = hx * (H_tile / 2);
        const dxY = -hy * (W_tile / 2);
        const dyY = hy * (H_tile / 2);

        const x_back  = bx - dxX - dxY;  const y_back  = by - dyX - dyY;
        const x_right = bx + dxX - dxY;  const y_right = by + dyX - dyY;
        const x_front = bx + dxX + dxY;  const y_front = by + dyX + dyY;
        const x_left  = bx - dxX + dxY;  const y_left  = by - dyX + dyY;

        const x_back_t  = x_back;   const y_back_t  = y_back - h;
        const x_right_t = x_right;  const y_right_t = y_right - h;
        const x_front_t = x_front;  const y_front_t = y_front - h;
        const x_left_t  = x_left;   const y_left_t  = y_left - h;

        const strokeColor = colors.stroke || 'rgba(0,0,0,0.15)';

        // Left Face
        ctx.beginPath();
        ctx.moveTo(x_left, y_left);
        ctx.lineTo(x_front, y_front);
        ctx.lineTo(x_front_t, y_front_t);
        ctx.lineTo(x_left_t, y_left_t);
        ctx.closePath();
        ctx.fillStyle = colors.left;
        ctx.fill();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Right Face
        ctx.beginPath();
        ctx.moveTo(x_front, y_front);
        ctx.lineTo(x_right, y_right);
        ctx.lineTo(x_right_t, y_right_t);
        ctx.lineTo(x_front_t, y_front_t);
        ctx.closePath();
        ctx.fillStyle = colors.right;
        ctx.fill();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Top Face
        ctx.beginPath();
        ctx.moveTo(x_back_t, y_back_t);
        ctx.lineTo(x_right_t, y_right_t);
        ctx.lineTo(x_front_t, y_front_t);
        ctx.lineTo(x_left_t, y_left_t);
        ctx.closePath();
        ctx.fillStyle = colors.top;
        ctx.fill();
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 1;
        ctx.stroke();
      };

      // ── Helper: draw isometric pyramid (towers roofs) programmatically ──
      const drawPyramid = (
        bx: number,
        by: number,
        hx: number,
        hy: number,
        baseYOffset: number,
        h: number,
        colors: { left: string; right: string; stroke?: string }
      ) => {
        const dxX = hx * (W_tile / 2);
        const dyX = hx * (H_tile / 2);
        const dxY = -hy * (W_tile / 2);
        const dyY = hy * (H_tile / 2);

        const x_right = bx + dxX - dxY;  const y_right = by + dyX - dyY - baseYOffset;
        const x_front = bx + dxX + dxY;  const y_front = by + dyX + dyY - baseYOffset;
        const x_left  = bx - dxX + dxY;  const y_left  = by - dyX + dyY - baseYOffset;

        const x_tip = bx;
        const y_tip = by - baseYOffset - h;

        const strokeColor = colors.stroke || 'rgba(0,0,0,0.15)';

        // Left Face
        ctx.beginPath();
        ctx.moveTo(x_left, y_left);
        ctx.lineTo(x_front, y_front);
        ctx.lineTo(x_tip, y_tip);
        ctx.closePath();
        ctx.fillStyle = colors.left;
        ctx.fill();
        ctx.strokeStyle = strokeColor;
        ctx.stroke();

        // Right Face
        ctx.beginPath();
        ctx.moveTo(x_front, y_front);
        ctx.lineTo(x_right, y_right);
        ctx.lineTo(x_tip, y_tip);
        ctx.closePath();
        ctx.fillStyle = colors.right;
        ctx.fill();
        ctx.strokeStyle = strokeColor;
        ctx.stroke();
      };

      // ── Helper: draw wall segment at tile (x, y) ──
      const drawWall = (wx: number, wy: number) => {
        const isYAxis = (wx === 0 || wx === 11);
        const isCorner = (wx === 0 && wy === 0) || (wx === 0 && wy === 11) || (wx === 11 && wy === 0) || (wx === 11 && wy === 11);

        const wpx = (wx - wy) * (W_tile / 2) + X_offset;
        const wpy = (wx + wy) * (H_tile / 2) + Y_offset;

        if (isCorner) {
          if (wallLevel === 1) {
            drawIsoBox(wpx, wpy, 0.22, 0.22, H_tile * 1.0, {
              top: '#8C5A3C', left: '#6D442B', right: '#533420'
            });
          } else if (wallLevel === 2) {
            drawIsoBox(wpx, wpy, 0.28, 0.28, H_tile * 0.4, {
              top: '#8A959E', left: '#67717A', right: '#525B63'
            });
            drawIsoBox(wpx, wpy - H_tile * 0.4, 0.22, 0.22, H_tile * 0.8, {
              top: '#8C5A3C', left: '#6D442B', right: '#533420'
            });
          } else if (wallLevel === 3) {
            const tH = H_tile * 1.8;
            drawIsoBox(wpx, wpy, 0.32, 0.32, tH, {
              top: '#A0A9B0', left: '#7B848B', right: '#636C73'
            });
            drawPyramid(wpx, wpy, 0.36, 0.36, tH, H_tile * 0.65, {
              left: '#3B5998', right: '#293E6A'
            });
          } else if (wallLevel === 4) {
            const tH = H_tile * 2.3;
            drawIsoBox(wpx, wpy, 0.35, 0.35, tH, {
              top: '#85929E', left: '#616F7D', right: '#4D5864'
            });
            drawPyramid(wpx, wpy, 0.40, 0.40, tH, H_tile * 0.8, {
              left: '#1F3A60', right: '#142540'
            });
          } else {
            const tH = H_tile * 2.8;
            drawIsoBox(wpx, wpy, 0.36, 0.36, tH, {
              top: '#ECEFF1', left: '#CFD8DC', right: '#B0BEC5'
            });
            drawIsoBox(wpx, wpy - H_tile * 1.4, 0.37, 0.37, H_tile * 0.3, {
              top: '#FFC107', left: '#FFB300', right: '#FFA000'
            });
            drawPyramid(wpx, wpy, 0.42, 0.42, tH, H_tile * 0.9, {
              left: '#FFC107', right: '#FFB300'
            });
          }
        } else {
          const hx = isYAxis ? 0.12 : 0.48;
          const hy = isYAxis ? 0.48 : 0.12;

          if (wallLevel === 1) {
            drawIsoBox(wpx, wpy, hx, hy, H_tile * 0.5, {
              top: '#8C5A3C', left: '#6D442B', right: '#533420'
            });
          } else if (wallLevel === 2) {
            const bH = H_tile * 0.3;
            drawIsoBox(wpx, wpy, hx, hy, bH, {
              top: '#8A959E', left: '#67717A', right: '#525B63'
            });
            drawIsoBox(wpx, wpy - bH, hx * 0.8, hy * 0.8, H_tile * 0.4, {
              top: '#8C5A3C', left: '#6D442B', right: '#533420'
            });
          } else if (wallLevel === 3) {
            const wH = H_tile * 1.0;
            drawIsoBox(wpx, wpy, hx, hy, wH, {
              top: '#A0A9B0', left: '#7B848B', right: '#636C73'
            });
            if (isYAxis) {
              drawIsoBox(wpx, wpy + H_tile*0.25 - wH, hx, 0.12, H_tile * 0.2, {
                top: '#A0A9B0', left: '#7B848B', right: '#636C73'
              });
              drawIsoBox(wpx, wpy - H_tile*0.25 - wH, hx, 0.12, H_tile * 0.2, {
                top: '#A0A9B0', left: '#7B848B', right: '#636C73'
              });
            } else {
              drawIsoBox(wpx + W_tile*0.25, wpy - wH, 0.12, hy, H_tile * 0.2, {
                top: '#A0A9B0', left: '#7B848B', right: '#636C73'
              });
              drawIsoBox(wpx - W_tile*0.25, wpy - wH, 0.12, hy, H_tile * 0.2, {
                top: '#A0A9B0', left: '#7B848B', right: '#636C73'
              });
            }
          } else if (wallLevel === 4) {
            const wH = H_tile * 1.3;
            drawIsoBox(wpx, wpy, hx, hy, wH, {
              top: '#85929E', left: '#616F7D', right: '#4D5864'
            });
            drawIsoBox(wpx, wpy - wH, hx * 1.1, hy * 1.1, H_tile * 0.15, {
              top: '#1F3A60', left: '#1F3A60', right: '#142540'
            });
          } else {
            const wH = H_tile * 1.6;
            drawIsoBox(wpx, wpy, hx, hy, wH, {
              top: '#ECEFF1', left: '#CFD8DC', right: '#B0BEC5'
            });
            drawIsoBox(wpx, wpy - wH * 0.5, hx * 1.05, hy * 1.05, H_tile * 0.12, {
              top: '#FFC107', left: '#FFB300', right: '#FFA000'
            });
            if (isYAxis) {
              drawIsoBox(wpx, wpy + H_tile*0.25 - wH, hx, 0.12, H_tile * 0.2, {
                top: '#FFC107', left: '#FFB300', right: '#FFA000'
              });
              drawIsoBox(wpx, wpy - H_tile*0.25 - wH, hx, 0.12, H_tile * 0.2, {
                top: '#FFC107', left: '#FFB300', right: '#FFA000'
              });
            } else {
              drawIsoBox(wpx + W_tile*0.25, wpy - wH, 0.12, hy, H_tile * 0.2, {
                top: '#FFC107', left: '#FFB300', right: '#FFA000'
              });
              drawIsoBox(wpx - W_tile*0.25, wpy - wH, 0.12, hy, H_tile * 0.2, {
                top: '#FFC107', left: '#FFB300', right: '#FFA000'
              });
            }
          }
        }
      };

      // ── 4. HOVER FOOTPRINT ───────────────────────────────────
      if (hoveredItem) {
        let hX = -1, hY = -1, footprintSize = 1;
        if (hoveredItem.type === 'building') {
          const footMap: Partial<Record<keyof BuildingLevels, [number, number, number]>> = {
            windmill: [2, 2, 1],
            bank: [2, 9, 2],
            center: [5, 5, 2],
            market: [9, 2, 2],
            farm: [9, 9, 2],
          };
          const fp = footMap[hoveredItem.key];
          if (fp) { hX = fp[0]; hY = fp[1]; footprintSize = fp[2]; }
        } else {
          hX = hoveredItem.data.gridX;
          hY = hoveredItem.data.gridY;
        }
        if (hX !== -1) {
          const hpx = (hX - hY) * (W_tile / 2) + X_offset;
          const hpy = (hX + hY) * (H_tile / 2) + Y_offset;
          const pulseT = Math.abs(Math.sin(now / 400));
          ctx.fillStyle = `rgba(255, 215, 0, ${0.12 + pulseT * 0.1})`;
          ctx.strokeStyle = `rgba(255, 215, 0, ${0.5 + pulseT * 0.3})`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          if (footprintSize === 1) {
            ctx.moveTo(hpx, hpy - H_tile / 2);
            ctx.lineTo(hpx + W_tile / 2, hpy);
            ctx.lineTo(hpx, hpy + H_tile / 2);
            ctx.lineTo(hpx - W_tile / 2, hpy);
          } else {
            ctx.moveTo(hpx, hpy - H_tile / 2);
            ctx.lineTo(hpx + W_tile, hpy + H_tile / 2);
            ctx.lineTo(hpx, hpy + 1.5 * H_tile);
            ctx.lineTo(hpx - W_tile, hpy + H_tile / 2);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
      }

      // ── 5. PAINTER'S ALGORITHM — Back-to-Front Building Loop ─
      for (let x = 0; x < 12; x++) {
        for (let y = 0; y < 12; y++) {
          const px = (x - y) * (W_tile / 2) + X_offset;
          const py = (x + y) * (H_tile / 2) + Y_offset;

          // ── Programmatic Wall Segment Drawing ──
          const isYWall = (x === 0) || (x === 11 && y !== 5 && y !== 6);
          const isXWall = (y === 0) || (y === 11 && x !== 5 && x !== 6);
          const isCorner = (x === 0 && y === 0) || (x === 0 && y === 11) || (x === 11 && y === 0) || (x === 11 && y === 11);

          if (isCorner || isYWall || isXWall) {
            drawWall(x, y);
          }

          const isHovered = (b: keyof BuildingLevels) =>
            hoveredItem?.type === 'building' && hoveredItem.key === b;

          // Windmill at (2, 2)
          if (x === 2 && y === 2) {
            drawBuilding('windmill', px, py, W_tile * 1.5, W_tile * 2.25, H_tile * 0.9, isHovered('windmill'));
          }
          // Bank at (2, 9)
          if (x === 2 && y === 9) {
            drawBuilding('bank', px, py, W_tile * 2.2, W_tile * 2.3, H_tile * 1.5, isHovered('bank'));
          }
          // Castle at (5, 5)
          if (x === 5 && y === 5) {
            drawBuilding('center', px, py, W_tile * 2.7, W_tile * 2.95, H_tile * 1.5, isHovered('center'));
          }
          // Market at (9, 2)
          if (x === 9 && y === 2) {
            drawBuilding('market', px, py, W_tile * 2.2, W_tile * 2.3, H_tile * 1.5, isHovered('market'));
          }
          // Farm at (9, 9)
          if (x === 9 && y === 9) {
            drawBuilding('farm', px, py, W_tile * 3.1, W_tile * 2.5, H_tile * 1.4, isHovered('farm'));
          }
        }
      }

      // ── 6. PARTICLES ──────────────────────────────────────────
      particlesRef.current = particlesRef.current.filter((p) => {
        const elapsed = now - p.lastUpdate;
        p.elapsed += elapsed;
        p.lastUpdate = now;
        if (p.elapsed >= p.life) return false;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04; // slight gravity
        p.alpha = Math.max(0, 1 - p.elapsed / p.life);

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${p.color}, ${p.alpha})`;
        ctx.fill();
        ctx.restore();
        return true;
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animationFrameId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetsLoaded, levels, wallLevel, outposts, mode, hoveredItem]);

  const getHoveredElement = (mx: number, my: number): HoveredItem => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const dpr = window.devicePixelRatio || 1;
    const cssWidth = canvas.width / dpr;
    const cssHeight = canvas.height / dpr;
    const W_tile = cssWidth / 13.5;
    const H_tile = W_tile / 2;
    const X_offset = cssWidth / 2;
    const Y_offset = (cssHeight - (12 * H_tile)) / 2 + 15;

    for (let x = 11; x >= 0; x--) {
      for (let y = 11; y >= 0; y--) {
        const px = (x - y) * (W_tile / 2) + X_offset;
        const py = (x + y) * (H_tile / 2) + Y_offset;

        // Main buildings hit tests
        const hits: Array<[number, number, number, number, number, number, keyof BuildingLevels]> = [
          [2, 2, W_tile * 0.75, W_tile * 0.75, W_tile * 1.8, H_tile * 0.9, 'windmill'],
          [2, 9, W_tile * 1.1, W_tile * 1.1, W_tile * 2.0, H_tile * 1.5, 'bank'],
          [5, 5, W_tile * 1.35, W_tile * 1.35, W_tile * 2.6, H_tile * 1.5, 'center'],
          [9, 2, W_tile * 1.1, W_tile * 1.1, W_tile * 2.0, H_tile * 1.5, 'market'],
          [9, 9, W_tile * 1.55, W_tile * 1.55, W_tile * 2.2, H_tile * 1.4, 'farm'],
        ];
        for (const [hx, hy, hw, , hh, , bKey] of hits) {
          if (x === hx && y === hy) {
            if (mx >= px - hw && mx <= px + hw && my >= py - hh && my <= py + H_tile) {
              return { type: 'building', key: bKey, px, py };
            }
          }
        }
      }
    }
    return null;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const hovered = getHoveredElement(e.clientX - rect.left, e.clientY - rect.top);
    setHoveredItem(hovered);
    if (hovered?.type === 'building') {
      if (onHoverBuilding) onHoverBuilding(hovered.key);
      if (onHoverOutpost) onHoverOutpost(null);
    } else if (hovered?.type === 'outpost') {
      if (onHoverOutpost) onHoverOutpost(hovered.data);
      if (onHoverBuilding) onHoverBuilding(null);
    } else {
      if (onHoverBuilding) onHoverBuilding(null);
      if (onHoverOutpost) onHoverOutpost(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
    if (onHoverBuilding) onHoverBuilding(null);
    if (onHoverOutpost) onHoverOutpost(null);
  };

  const handleClick = () => {
    if (!hoveredItem) return;
    if (hoveredItem.type === 'building' && onClickBuilding) onClickBuilding(hoveredItem.key);
    else if (hoveredItem.type === 'outpost' && onClickOutpost) onClickOutpost(hoveredItem.data);
  };

  // Tooltip content provider
  const getTooltipContent = () => {
    if (!hoveredItem) return null;
    if (mode === 'child' && kid) {
      if (hoveredItem.type === 'building') {
        const buildingInfo: Record<keyof BuildingLevels, { title: string; desc: string; val: string }> = {
          center: { title: 'المنزل الرئيسي 🏰', desc: 'المستوى العام لنموك الشخصي والمالي', val: `${(kid.balance || 0) + (kid.saved || 0)} ريال` },
          bank: { title: 'حصالة الادخار 💰', desc: 'مجموع المبالغ المودعة في حصالتك', val: `${kid.saved || 0} ريال موفر` },
          market: { title: 'مستقبلي الاستثماري 📈', desc: 'حجم المشاركة في تمويل المشاريع', val: `${getInvestmentAmount(kid)} ريال مستثمر` },
          farm: { title: 'مساحة التبرعات 💚', desc: 'تبرعاتك ونقاط الخير المكتسبة', val: `${kid.donationPoints || 0} نقطة خير` },
          windmill: { title: 'طاحونة المهام ⚙️', desc: 'الواجبات المنزلية المعتمدة بنجاح', val: `${getCompletedTasks(kid)} مهام مكتملة` },
        };
        return { ...buildingInfo[hoveredItem.key], stats: undefined };
      }
    } else if (mode === 'parent' && kids.length > 0) {
      const k0 = kids[0];
      const k1 = kids[1] || kids[0];
      if (hoveredItem.type === 'building') {
        const buildingInfo: Record<keyof BuildingLevels, { title: string; desc: string; stats: { name: string; val: string }[] }> = {
          center: { title: 'قلعة العائلة 🏰', desc: 'المستوى العام المشترك', stats: [{ name: k0?.name, val: `${(k0?.balance || 0) + (k0?.saved || 0)} ريال` }, { name: k1?.name, val: `${(k1?.balance || 0) + (k1?.saved || 0)} ريال` }] },
          bank: { title: 'البنك العائلي 💰', desc: 'مجموع المدخرات', stats: [{ name: k0?.name, val: `${k0?.saved || 0} ريال` }, { name: k1?.name, val: `${k1?.saved || 0} ريال` }] },
          market: { title: 'سوق الاستثمار 📈', desc: 'المشاريع الاستثمارية', stats: [{ name: k0?.name, val: `${getInvestmentAmount(k0)} ريال` }, { name: k1?.name, val: `${getInvestmentAmount(k1)} ريال` }] },
          farm: { title: 'مزارع العطاء 💚', desc: 'المساهمات المجتمعية', stats: [{ name: k0?.name, val: `${k0?.donationPoints || 0} نقطة` }, { name: k1?.name, val: `${k1?.donationPoints || 0} نقطة` }] },
          windmill: { title: 'طاحونة المهام ⚙️', desc: 'معدل إنجاز الواجبات', stats: [{ name: k0?.name, val: `${getCompletedTasks(k0)} مهام` }, { name: k1?.name, val: `${getCompletedTasks(k1)} مهام` }] },
        };
        return { ...buildingInfo[hoveredItem.key], val: undefined };
      } else if (hoveredItem.type === 'outpost') {
        const o = hoveredItem.data;
        return {
          title: `قرية ${o.name} 🏡`,
          desc: 'اضغط لعرض تفاصيل القرية',
          stats: [
            { name: 'الرصيد', val: `${o.balance} ريال` },
            { name: 'المدخرات', val: `${o.saved} ريال` },
            { name: 'نقاط الخير', val: `${o.donationPoints} نقطة` },
          ],
          val: undefined,
        };
      }
    }
    return null;
  };

  const tooltip = getTooltipContent();

  if (!assetsLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-white">
        <div className="w-14 h-14 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
        <p className="mt-4 text-xs font-semibold text-orange-400">
          جاري تحميل القرية التفاعلية ({loadingProgress}%)
        </p>
      </div>
    );
  }

  const canvasWidth = canvasRef.current ? canvasRef.current.width : 0;
  const W_tile = canvasWidth ? (canvasWidth / (window.devicePixelRatio || 1)) / 13.5 : 60;
  const H_tile = W_tile / 2;

  return (
    <div ref={containerRef} className="relative w-full aspect-square max-w-[800px] mx-auto select-none overflow-visible">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className="w-full h-full block rounded-3xl"
        style={{ touchAction: 'none', cursor: hoveredItem ? 'pointer' : 'default' }}
      />

      {/* Glassmorphic Tooltip */}
      {hoveredItem && tooltip && (
        <div
          className="absolute bg-[#0D1527]/95 border border-white/15 p-4 rounded-2xl shadow-2xl z-50 backdrop-blur-md text-right font-sans min-w-[240px] pointer-events-none"
          style={{
            left: `${hoveredItem.px}px`,
            top: `${hoveredItem.py - (hoveredItem.type === 'building' && hoveredItem.key === 'windmill' ? W_tile * 1.8 : W_tile * 2.3) - 15}px`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="border-b border-white/10 pb-2 mb-2">
            <h5 className="font-extrabold text-sm text-white">{tooltip.title}</h5>
            <p className="text-[9px] text-slate-400 mt-0.5">{tooltip.desc}</p>
          </div>
          {tooltip.val ? (
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-orange-400 font-sans">{tooltip.val}</span>
              <span className="text-slate-400">الإحصائيات</span>
            </div>
          ) : (
            <div className="space-y-1.5">
              {tooltip.stats?.map((s, idx) => (
                <div key={idx} className="flex justify-between items-center text-[11px]">
                  <span className="font-bold text-orange-400 font-sans">{s.val}</span>
                  <span className="text-slate-300">{s.name}:</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
