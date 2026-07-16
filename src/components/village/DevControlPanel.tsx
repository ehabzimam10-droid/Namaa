import type { BuildingLevels } from './IsometricCanvas';

interface DevControlPanelProps {
  mode: 'child' | 'parent';
  onModeChange: (mode: 'child' | 'parent') => void;
  levels: BuildingLevels;
  onLevelsChange: (levels: BuildingLevels) => void;
  wallLevel: number;
  onWallLevelChange: (level: number) => void;
  onMockUpgrade: (buildingKey: keyof BuildingLevels) => void;
}

export default function DevControlPanel({
  mode,
  onModeChange,
  levels,
  onLevelsChange,
  wallLevel,
  onWallLevelChange,
  onMockUpgrade,
}: DevControlPanelProps) {
  const buildingNames: Record<keyof BuildingLevels, string> = {
    center: 'المنزل الرئيسي 🏰',
    bank: 'حصالة الادخار 💰',
    market: 'مستقبلي الاستثماري 📈',
    farm: 'مساحة التبرعات 💚',
    windmill: 'طاحونة المهام ⚙️',
  };

  const handleLevelChange = (key: keyof BuildingLevels, val: number) => {
    onLevelsChange({
      ...levels,
      [key]: val,
    });
  };

  return (
    <div aria-hidden="true" className="w-full bg-[#111C2E]/60 backdrop-blur-2xl border border-white/10 shadow-2xl rounded-3xl p-6 text-right text-white space-y-6 font-sans">
      <div className="border-b border-white/5 pb-3">
        <h3 className="text-base font-bold text-orange-400">لوحة تحكم المحاكاة والتطوير 🎮</h3>
        <p className="text-[11px] text-slate-400 mt-1">تعديل حالات العرض والتحكم بالمستويات لتجربة حركة الترقية مباشرة</p>
      </div>

      {/* Mode Toggle */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-300">وضع العرض (Mode)</label>
        <div className="flex gap-2">
          <button
            onClick={() => onModeChange('parent')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
              mode === 'parent'
                ? 'bg-orange-500/25 border-orange-500 text-orange-400'
                : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-400'
            }`}
          >
            وضع ولي الأمر (Parent)
          </button>
          <button
            onClick={() => onModeChange('child')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
              mode === 'child'
                ? 'bg-orange-500/25 border-orange-500 text-orange-400'
                : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-400'
            }`}
          >
            وضع الابن (Child)
          </button>
        </div>
      </div>

      {/* Wall Level Slider */}
      <div className="space-y-2 bg-white/5 border border-white/5 rounded-2xl p-4">
        <div className="flex justify-between items-center text-xs">
          <span className="font-bold text-orange-400 font-sans">{wallLevel} / 5</span>
          <span className="font-bold text-slate-350">مستوى السور العائلي 🧱</span>
        </div>
        <input
          type="range"
          min="1"
          max="5"
          value={wallLevel}
          onChange={(e) => onWallLevelChange(parseInt(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
        />
      </div>

      {/* Buildings Levels Sliders */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold text-slate-300 font-sans">مستويات المباني وتأثيرات الترقية</h4>
        <div className="space-y-3">
          {(Object.keys(levels) as (keyof BuildingLevels)[]).map((key) => (
            <div key={key} className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-orange-400 font-sans">{levels[key]} / 5</span>
                <span className="font-bold text-slate-350">{buildingNames[key]}</span>
              </div>
              <div className="flex items-center gap-4">
                {/* Upgrade trigger button */}
                <button
                  onClick={() => onMockUpgrade(key)}
                  className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 hover:border-emerald-500/50 text-emerald-400 rounded-xl text-[10px] font-extrabold transition-all whitespace-nowrap"
                >
                  محاكاة ترقية 🚀
                </button>
                {/* Slider */}
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={levels[key]}
                  onChange={(e) => handleLevelChange(key, parseInt(e.target.value))}
                  className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
