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

const getScale = (elapsed: number): number => {
  const p = elapsed / 500;
  if (p < 0.3) {
    const t = p / 0.3;
    const ease = 1 - (1 - t) * (1 - t);
    return 1.0 + 0.3 * ease;
  } else if (p < 0.7) {
    const t = (p - 0.3) / 0.4;
    const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    return 1.3 - 0.4 * ease;
  } else {
    const t = (p - 0.7) / 0.3;
    const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    return 0.9 + 0.1 * ease;
  }
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

  useEffect(() => {
    const keys: (keyof BuildingLevels)[] = ['bank', 'farm', 'market', 'center', 'windmill'];
    keys.forEach((key) => {
      const prevVal = prevLevelsRef.current[key];
      const newVal = levels[key];
      if (newVal > prevVal) {
        bounceAnimationsRef.current[key] = performance.now();
        upgradeTriggeredRef.current[key] = true;
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
      .catch((err) => console.error("Asset load failure:", err));
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
    
    // Periodically sync size to catch layout shifts
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
      const dpr = window.devicePixelRatio || 1;
      const cssWidth = canvas.width / dpr;
      const cssHeight = canvas.height / dpr;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(dpr, dpr);

      // 1. Draw Base Map (fill entire CSS space)
      try {
        const baseMapImg = assetManager.get('base_map');
        ctx.drawImage(baseMapImg, 0, 0, cssWidth, cssHeight);
      } catch (e) {
        console.error(e);
      }

      // 2. Draw Fortress Wall
      try {
        const wallImg = assetManager.get(`wall_${Math.min(5, Math.max(1, wallLevel))}`);
        ctx.drawImage(wallImg, 0, 0, cssWidth, cssHeight);
      } catch (e) {
        console.error(e);
      }

      // Calculate tile size and centering offsets
      const W_tile = cssWidth / 10;
      const H_tile = W_tile / 2;
      const X_offset = cssWidth / 2;
      const Y_offset = (cssHeight - (8 * H_tile)) / 2 + 40;

      // 0. Trigger and spawn particles if needed
      const keys: (keyof BuildingLevels)[] = ['bank', 'farm', 'market', 'center', 'windmill'];
      keys.forEach((key) => {
        if (upgradeTriggeredRef.current[key]) {
          upgradeTriggeredRef.current[key] = false;
          
          let bx = -1, by = -1;
          if (key === 'windmill') {
            bx = 1; by = 1;
          } else if (key === 'bank') {
            bx = 1; by = 5;
          } else if (key === 'center') {
            bx = 3; by = 3;
          } else if (key === 'market') {
            bx = 5; by = 1;
          } else if (key === 'farm') {
            bx = 5; by = 5;
          }

          if (bx !== -1 && by !== -1) {
            const px = (bx - by) * (W_tile / 2) + X_offset;
            const py = (bx + by) * (H_tile / 2) + Y_offset;
            
            const pivotYOffset = key === 'windmill' ? H_tile * 0.5 : H_tile;
            const baseX = px;
            const baseY = py + pivotYOffset;

            let color = '255, 255, 255';
            if (key === 'bank') color = '255, 215, 0'; // Gold/Yellow
            else if (key === 'farm') color = '16, 185, 129'; // Emerald Green
            else if (key === 'market') color = '245, 158, 11'; // Amber/Orange
            else if (key === 'windmill') color = '59, 130, 246'; // Blue
            else if (key === 'center') {
              color = Math.random() > 0.5 ? '239, 68, 68' : '251, 191, 36'; // Red/Yellow
            }

            const numParticles = 10 + Math.floor(Math.random() * 6); // 10-15 particles
            for (let i = 0; i < numParticles; i++) {
              particlesRef.current.push({
                id: Math.random(),
                x: baseX + (Math.random() - 0.5) * W_tile * 0.8,
                y: baseY + (Math.random() - 0.5) * H_tile * 0.8,
                vx: (Math.random() - 0.5) * 1.5,
                vy: -1.0 - Math.random() * 2.0, // Rise upwards
                color,
                alpha: 1.0,
                size: 2 + Math.random() * 3, // radius 2 to 5 pixels
                life: 600 + Math.random() * 600, // 0.6s to 1.2s
                elapsed: 0,
                lastUpdate: performance.now(),
              });
            }
          }
        }
      });

      const drawBuildingWithBounce = (
        key: keyof BuildingLevels,
        img: HTMLImageElement,
        px: number,
        py: number,
        width: number,
        height: number,
        pivotYOffset: number
      ) => {
        const now = performance.now();
        const bounceStartTime = bounceAnimationsRef.current[key];
        let scale = 1.0;
        if (bounceStartTime !== undefined) {
          const elapsed = now - bounceStartTime;
          if (elapsed >= 500) {
            delete bounceAnimationsRef.current[key];
          } else {
            scale = getScale(elapsed);
          }
        }

        const pivotX = px;
        const pivotY = py + pivotYOffset;

        ctx.save();
        ctx.translate(pivotX, pivotY);
        ctx.scale(scale, scale);
        ctx.translate(-pivotX, -pivotY);
        ctx.drawImage(img, px - width / 2, py - height + pivotYOffset, width, height);
        ctx.restore();
      };

      // 3. Draw Hover Footprint under the hovered building/outpost on the ground
      if (hoveredItem) {
        let hX = -1;
        let hY = -1;
        let footprintSize = 1;

        if (hoveredItem.type === 'building') {
          if (hoveredItem.key === 'windmill') {
            hX = 1; hY = 1; footprintSize = 1;
          } else if (hoveredItem.key === 'bank') {
            hX = 1; hY = 5; footprintSize = 2;
          } else if (hoveredItem.key === 'center') {
            hX = 3; hY = 3; footprintSize = 2;
          } else if (hoveredItem.key === 'market') {
            hX = 5; hY = 1; footprintSize = 2;
          } else if (hoveredItem.key === 'farm') {
            hX = 5; hY = 5; footprintSize = 2;
          }
        } else if (hoveredItem.type === 'outpost') {
          hX = hoveredItem.data.gridX;
          hY = hoveredItem.data.gridY;
          footprintSize = 1;
        }

        if (hX !== -1 && hY !== -1) {
          const hpx = (hX - hY) * (W_tile / 2) + X_offset;
          const hpy = (hX + hY) * (H_tile / 2) + Y_offset;

          ctx.fillStyle = 'rgba(255, 215, 0, 0.2)';
          ctx.strokeStyle = 'rgba(255, 215, 0, 0.7)';
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

      // 4. Painter's Algorithm Loop (Back-to-front rendering)
      for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
          const px = (x - y) * (W_tile / 2) + X_offset;
          const py = (x + y) * (H_tile / 2) + Y_offset;

          // Windmill at (1, 1)
          if (x === 1 && y === 1) {
            try {
              const img = assetManager.get(`windmill_${levels.windmill}`);
              drawBuildingWithBounce('windmill', img, px, py, W_tile, H_tile * 2, H_tile * 0.5);
            } catch (e) {
              console.error(e);
            }
          }

          // Bank at (1, 5)
          if (x === 1 && y === 5) {
            try {
              const img = assetManager.get(`bank_${levels.bank}`);
              drawBuildingWithBounce('bank', img, px, py, W_tile * 2, H_tile * 3, H_tile);
            } catch (e) {
              console.error(e);
            }
          }

          // Castle at (3, 3)
          if (x === 3 && y === 3) {
            try {
              const img = assetManager.get(`center_${levels.center}`);
              drawBuildingWithBounce('center', img, px, py, W_tile * 2, H_tile * 3, H_tile);
            } catch (e) {
              console.error(e);
            }
          }

          // Market at (5, 1)
          if (x === 5 && y === 1) {
            try {
              const img = assetManager.get(`market_${levels.market}`);
              drawBuildingWithBounce('market', img, px, py, W_tile * 2, H_tile * 3, H_tile);
            } catch (e) {
              console.error(e);
            }
          }

          // Farm at (5, 5)
          if (x === 5 && y === 5) {
            try {
              const img = assetManager.get(`farm_${levels.farm}`);
              drawBuildingWithBounce('farm', img, px, py, W_tile * 2, H_tile * 3, H_tile);
            } catch (e) {
              console.error(e);
            }
          }

          // Outposts (only in parent mode)
          if (mode === 'parent') {
            const outpost = outposts.find(o => o.gridX === x && o.gridY === y);
            if (outpost) {
              try {
                // Fallback to center_1 or center_2 scaled down
                const outpostImg = assetManager.get(outpost.level >= 2 ? 'center_2' : 'center_1');
                ctx.drawImage(outpostImg, px - W_tile / 2, py - H_tile * 1.25, W_tile, H_tile * 1.75);

                // Draw rounded label box
                const labelText = outpost.name;
                ctx.font = 'bold 10px sans-serif';
                const textWidth = ctx.measureText(labelText).width;
                const rectW = textWidth + 12;
                const rectH = 16;
                const rectX = px - rectW / 2;
                const rectY = py - H_tile * 1.25 - 20;

                ctx.fillStyle = 'rgba(13, 21, 39, 0.85)';
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                if (typeof (ctx as any).roundRect === 'function') {
                  (ctx as any).roundRect(rectX, rectY, rectW, rectH, 6);
                } else {
                  ctx.rect(rectX, rectY, rectW, rectH);
                }
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = '#ffffff';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(labelText, px, rectY + rectH / 2);
              } catch (e) {
                console.error(e);
              }
            }
          }
        }
      }

      // 5. Update and Draw Particles
      const now = performance.now();
      particlesRef.current = particlesRef.current.filter((p) => {
        const elapsed = now - p.lastUpdate;
        p.elapsed += elapsed;
        p.lastUpdate = now;

        if (p.elapsed >= p.life) {
          return false;
        }

        p.x += p.vx;
        p.y += p.vy;
        p.alpha = Math.max(0, 1 - p.elapsed / p.life);

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        
        ctx.shadowBlur = 8;
        ctx.shadowColor = `rgba(${p.color}, ${p.alpha})`;
        
        ctx.fill();
        ctx.restore();

        return true;
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [assetsLoaded, levels, wallLevel, outposts, mode, hoveredItem]);

  const getHoveredElement = (mx: number, my: number): HoveredItem => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const dpr = window.devicePixelRatio || 1;
    const cssWidth = canvas.width / dpr;
    const cssHeight = canvas.height / dpr;

    const W_tile = cssWidth / 10;
    const H_tile = W_tile / 2;
    const X_offset = cssWidth / 2;
    const Y_offset = (cssHeight - (8 * H_tile)) / 2 + 40;

    // Search front-to-back (reverse Painter's Algorithm)
    for (let x = 7; x >= 0; x--) {
      for (let y = 7; y >= 0; y--) {
        const px = (x - y) * (W_tile / 2) + X_offset;
        const py = (x + y) * (H_tile / 2) + Y_offset;

        // Check outposts in parent mode
        if (mode === 'parent') {
          const outpost = outposts.find(o => o.gridX === x && o.gridY === y);
          if (outpost) {
            const minX = px - W_tile / 2;
            const maxX = px + W_tile / 2;
            const minY = py - H_tile * 1.25;
            const maxY = py + H_tile * 0.5;
            if (mx >= minX && mx <= maxX && my >= minY && my <= maxY) {
              return { type: 'outpost', data: outpost, px, py };
            }
          }
        }

        // Check main buildings
        // Windmill
        if (x === 1 && y === 1) {
          const minX = px - W_tile / 2;
          const maxX = px + W_tile / 2;
          const minY = py - H_tile * 1.5;
          const maxY = py + H_tile * 0.5;
          if (mx >= minX && mx <= maxX && my >= minY && my <= maxY) {
            return { type: 'building', key: 'windmill', px, py };
          }
        }
        // Bank
        if (x === 1 && y === 5) {
          const minX = px - W_tile;
          const maxX = px + W_tile;
          const minY = py - H_tile * 2;
          const maxY = py + H_tile;
          if (mx >= minX && mx <= maxX && my >= minY && my <= maxY) {
            return { type: 'building', key: 'bank', px, py };
          }
        }
        // Castle
        if (x === 3 && y === 3) {
          const minX = px - W_tile;
          const maxX = px + W_tile;
          const minY = py - H_tile * 2;
          const maxY = py + H_tile;
          if (mx >= minX && mx <= maxX && my >= minY && my <= maxY) {
            return { type: 'building', key: 'center', px, py };
          }
        }
        // Market
        if (x === 5 && y === 1) {
          const minX = px - W_tile;
          const maxX = px + W_tile;
          const minY = py - H_tile * 2;
          const maxY = py + H_tile;
          if (mx >= minX && mx <= maxX && my >= minY && my <= maxY) {
            return { type: 'building', key: 'market', px, py };
          }
        }
        // Farm
        if (x === 5 && y === 5) {
          const minX = px - W_tile;
          const maxX = px + W_tile;
          const minY = py - H_tile * 2;
          const maxY = py + H_tile;
          if (mx >= minX && mx <= maxX && my >= minY && my <= maxY) {
            return { type: 'building', key: 'farm', px, py };
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
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const hovered = getHoveredElement(mx, my);
    setHoveredItem(hovered);

    if (hovered) {
      if (hovered.type === 'building') {
        if (onHoverBuilding) onHoverBuilding(hovered.key);
        if (onHoverOutpost) onHoverOutpost(null);
      } else if (hovered.type === 'outpost') {
        if (onHoverOutpost) onHoverOutpost(hovered.data);
        if (onHoverBuilding) onHoverBuilding(null);
      }
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
    if (hoveredItem.type === 'building' && onClickBuilding) {
      onClickBuilding(hoveredItem.key);
    } else if (hoveredItem.type === 'outpost' && onClickOutpost) {
      onClickOutpost(hoveredItem.data);
    }
  };

  // Tooltip content provider
  const getTooltipContent = () => {
    if (!hoveredItem) return null;

    if (mode === 'child' && kid) {
      if (hoveredItem.type === 'building') {
        switch (hoveredItem.key) {
          case 'center':
            return {
              title: 'المنزل الرئيسي 🏰',
              desc: 'المستوى العام لنموك الشخصي والمالي',
              val: `${(kid.balance || 0) + (kid.saved || 0)} ريال (إجمالي الثروة)`,
            };
          case 'bank':
            return {
              title: 'حصالة الادخار 💰',
              desc: 'مجموع المبالغ المودعة في حصالتك',
              val: `${kid.saved || 0} ريال موفر`,
            };
          case 'market':
            return {
              title: 'مستقبلي الاستثماري 📈',
              desc: 'حجم المشاركة في تمويل المشاريع الاستثمارية',
              val: `${getInvestmentAmount(kid)} ريال مستثمر`,
            };
          case 'farm':
            return {
              title: 'مساحة التبرعات وعمل الخير 💚',
              desc: 'تبرعاتك ونقاط الخير المكتسبة بالدوري',
              val: `${kid.donationPoints || 0} نقطة خير`,
            };
          case 'windmill':
            return {
              title: 'طاحونة إنجاز المهام ⚙️',
              desc: 'الواجبات المنزلية المعتمدة بنجاح',
              val: `${getCompletedTasks(kid)} مهام مكتملة`,
            };
        }
      }
    } else if (mode === 'parent' && kids.length > 0) {
      const khalid = kids.find((k) => k.name === 'خالد') || kids[0];
      const salem = kids.find((k) => k.name === 'سالم') || kids[1] || kids[0];

      if (hoveredItem.type === 'building') {
        switch (hoveredItem.key) {
          case 'center':
            return {
              title: 'قلعة العائلة الكبرى 🏰',
              desc: 'المستوى العام المشترك ونماء المملكة العام',
              stats: [
                { name: khalid?.name || 'خالد', val: `${(khalid?.balance || 0) + (khalid?.saved || 0)} ريال` },
                { name: salem?.name || 'سالم', val: `${(salem?.balance || 0) + (salem?.saved || 0)} ريال` },
              ],
            };
          case 'bank':
            return {
              title: 'البنك العائلي 💰',
              desc: 'مجموع المدخرات والأرصدة المودعة بالحصالة',
              stats: [
                { name: khalid?.name || 'خالد', val: `${khalid?.saved || 0} ريال` },
                { name: salem?.name || 'سالم', val: `${salem?.saved || 0} ريال` },
              ],
            };
          case 'market':
            return {
              title: 'سوق الاستثمار المشترك 📈',
              desc: 'المشاريع الاستثمارية المفتوحة وحجم رأس المال',
              stats: [
                { name: khalid?.name || 'خالد', val: `${getInvestmentAmount(khalid)} ريال` },
                { name: salem?.name || 'سالم', val: `${getInvestmentAmount(salem)} ريال` },
              ],
            };
          case 'farm':
            return {
              title: 'مزارع العطاء والخير 💚',
              desc: 'المساهمات المجتمعية ونقاط التبرع بالواحة',
              stats: [
                { name: khalid?.name || 'خالد', val: `${khalid?.donationPoints || 0} نقطة` },
                { name: salem?.name || 'سالم', val: `${salem?.donationPoints || 0} نقطة` },
              ],
            };
          case 'windmill':
            return {
              title: 'طاحونة المهام والمسؤوليات ⚙️',
              desc: 'معدل إنجاز الواجبات المنزلية والتمكين اليومي',
              stats: [
                { name: khalid?.name || 'خالد', val: `${getCompletedTasks(khalid)} مهام` },
                { name: salem?.name || 'سالم', val: `${getCompletedTasks(salem)} مهام` },
              ],
            };
        }
      } else if (hoveredItem.type === 'outpost') {
        const oData = hoveredItem.data;
        return {
          title: `قرية ${oData.name} 🏡`,
          desc: 'اضغط لعرض تفاصيل القرية بالكامل',
          stats: [
            { name: 'إجمالي الرصيد', val: `${oData.balance} ريال` },
            { name: 'المدخرات', val: `${oData.saved} ريال` },
            { name: 'نقاط الخير', val: `${oData.donationPoints} نقطة` },
          ],
        };
      }
    }

    return null;
  };

  const tooltip = getTooltipContent();

  if (!assetsLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-white">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-semibold text-orange-400">
          جاري تحميل القرية التفاعلية ({loadingProgress}%)
        </p>
      </div>
    );
  }

  const canvasWidth = canvasRef.current ? canvasRef.current.width : 0;
  const W_tile = canvasWidth ? (canvasWidth / (window.devicePixelRatio || 1)) / 10 : 60;
  const H_tile = W_tile / 2;

  return (
    <div ref={containerRef} className="relative w-full aspect-square max-w-[800px] mx-auto select-none overflow-visible">
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className="w-full h-full block rounded-3xl cursor-pointer"
        style={{ touchAction: 'none' }}
      />

      {/* Floating Glassmorphic Tooltip */}
      {hoveredItem && tooltip && (
        <div
          className="absolute bg-[#0D1527]/95 border border-white/15 p-4 rounded-2xl shadow-2xl z-50 backdrop-blur-md text-right font-sans min-w-[260px] pointer-events-none animate-fade-in"
          style={{
            left: `${hoveredItem.px}px`,
            top: `${hoveredItem.py - (hoveredItem.type === 'building' && hoveredItem.key === 'windmill' ? H_tile * 1.5 : H_tile * 2) - 15}px`,
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
              <span className="text-slate-350">الإحصائيات:</span>
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
