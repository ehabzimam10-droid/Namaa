import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { suggestTaskForKid, sendGeneralChatMessage } from '../utils/aiService';
import SuggestedTaskWidget from '../components/ui/SuggestedTaskWidget';
import AIActionMenu from '../components/ui/AIActionMenu';

interface Message {
  id: string;
  sender: 'father' | 'ai';
  content: React.ReactNode | string;
  isWidget?: boolean;
  timestamp: Date;
}

export default function FatherAICoachPage() {
  const { kids, geminiApiKey, projects } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg_1',
      sender: 'ai',
      content: 'مرحباً بك يا أبو خالد في مركز الاستشارة الذكي 🤖. أنا مستشارك المالي المساعد، كيف يمكنني مساعدتك اليوم في إدارة ثقافة أبنائك المالية؟',
      timestamp: new Date(Date.now() - 60000 * 5),
    },
    {
      id: 'msg_2',
      sender: 'father',
      content: 'أهلاً بك، أريد بعض النصائح لتحسين مستوى ادخار ابني سالم، فهو ينفق مصروفه سريعاً.',
      timestamp: new Date(Date.now() - 60000 * 4),
    },
    {
      id: 'msg_3',
      sender: 'ai',
      content: 'بالتأكيد! بناءً على تحليل سلوك سالم المالي مؤخراً:\n\n1. 🎯 **حدد له هدفاً جذاباً:** مثل شراء دراجة جديدة وساعده في إعداد حصالة مقفلة لهذا الهدف.\n2. 🤝 **شجعه بمكافآت عينية:** يمكنك تخصيص مكافأة تشجيعية (مثل ساعة لعب إضافية) عند التزامه بالادخار الأسبوعي.\n3. 🧹 **عزز قيمة المسؤولية:** أسند إليه بعض المهام المنزلية البسيطة بمكافأة نقاط لتنمية تقديره لقيمة العمل والمال.\n\nهل ترغب في أن أقترح له مهمة محددة للبدء فوراً؟ 🎯',
      timestamp: new Date(Date.now() - 60000 * 3),
    }
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userText = inputValue.trim();

    const userMsg: Message = {
      id: `msg_user_${Date.now()}`,
      sender: 'father',
      content: userText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    // Show a loading indicator bubble
    const loadingId = `msg_loading_${Date.now()}`;
    const loadingMsg: Message = {
      id: loadingId,
      sender: 'ai',
      content: 'جاري التفكير وصياغة الرد... 🧠🤖',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, loadingMsg]);

    try {
      const response = await sendGeneralChatMessage(
        geminiApiKey,
        userText,
        { kids, projects }
      );

      const aiResponse: Message = {
        id: `msg_ai_${Date.now()}`,
        sender: 'ai',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => prev.filter((m) => m.id !== loadingId).concat(aiResponse));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectAction = async (action: string, details?: any) => {
    if (action === 'suggest_task') {
      const kidName = details.kidName;
      const notes = details.notes || '';
      
      // a) Display user message
      const userMsg: Message = {
        id: `msg_action_req_${Date.now()}`,
        sender: 'father',
        content: `اقترح مهمة لـ ${kidName}${notes ? ` مع التركيز على: ${notes}` : ''} 🎯`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);

      // b) Show a loading bubble
      const loadingId = `msg_loading_${Date.now()}`;
      const loadingMsg: Message = {
        id: loadingId,
        sender: 'ai',
        content: `جاري التفكير وتوليد المهمة الملائمة لـ ${kidName}... 🧠🤖`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, loadingMsg]);
      setIsLoading(true);

      // c) Fetch Salem's/Kid's data from AppContext
      const targetKid = kids.find((k) => k.name === kidName) || kids[0];

      try {
        // Fetch recommendation from Gemini API
        const recommendation = await suggestTaskForKid(geminiApiKey, targetKid, notes);

        // d) Render SuggestedTaskWidget
        const widgetNode = (
          <SuggestedTaskWidget
            kidName={kidName}
            title={recommendation.title}
            suggestedAmount={recommendation.suggestedAmount}
            type={recommendation.type}
            reasoning={recommendation.reasoning}
          />
        );

        const replyMsg: Message = {
          id: `msg_widget_${Date.now()}`,
          sender: 'ai',
          content: widgetNode,
          isWidget: true,
          timestamp: new Date(),
        };

        // Remove loading bubble and add the actual generative response
        setMessages((prev) => prev.filter((m) => m.id !== loadingId).concat(replyMsg));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    } else if (action === 'family_analysis') {
      // Show user message
      const userMsg: Message = {
        id: `msg_analysis_req_${Date.now()}`,
        sender: 'father',
        content: `أعطني تقريراً وتحليلاً شاملاً للعائلة 📊`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);

      // Show loading
      const loadingId = `msg_loading_${Date.now()}`;
      const loadingMsg: Message = {
        id: loadingId,
        sender: 'ai',
        content: 'جاري جمع البيانات المالية للأبناء وتحليلها سحابياً... 📊📈',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, loadingMsg]);
      setIsLoading(true);

      // Simulate analysis response
      setTimeout(() => {
        const textReport = `📊 **تقرير التحليل الشامل للأسرة**:\n\n*   **سالم 👦**: نسبة ادخار ممتازة بلغت 80% من خلال الحصالات النشطة، مع التزام رائع بإتمام المهام.\n*   **خالد 👦**: رصيد حالي صفر مع غياب للخطط الادخارية. يُنصح بتحويل مصروف تشجيعي له لمساعدته في بدء أولى خطواته المالية.\n\n💡 **توصية عامة:** قم بإنشاء مشروع استثماري عائلي مشترك لتحفيز الأطفال على العمل الجماعي ومشاركة العوائد! 📈`;
        
        const replyMsg: Message = {
          id: `msg_report_${Date.now()}`,
          sender: 'ai',
          content: textReport,
          timestamp: new Date(),
        };

        setMessages((prev) => prev.filter((m) => m.id !== loadingId).concat(replyMsg));
        setIsLoading(false);
      }, 1500);
    }
  };

  return (
    <div className="w-full flex flex-col h-[calc(100vh-7rem)] bg-[#0B1527] border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative">
      {/* Background glow effects */}
      <div className="absolute right-1/4 top-1/4 -z-10 h-72 w-72 rounded-full bg-[#8c7355]/5 blur-3xl"></div>
      <div className="absolute left-1/4 bottom-1/4 -z-10 h-72 w-72 rounded-full bg-blue-500/5 blur-3xl"></div>

      {/* Header */}
      <div className="px-6 py-4 bg-[#111C2E]/60 border-b border-white/10 backdrop-blur-md flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] text-emerald-400 font-bold font-sans">نشط 🟢</span>
        </div>
        <div className="text-right">
          <h2 className="text-sm font-extrabold text-white">المستشار المالي الذكي (AI Coach) 🤖</h2>
          <p className="text-[10px] text-slate-400">توجيهات ونصائح مالية ذكية مبنية على سلوك أبنائك</p>
        </div>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 flex flex-col">
        {messages.map((msg) => {
          const isAI = msg.sender === 'ai';
          const isText = typeof msg.content === 'string';

          return (
            <div
              key={msg.id}
              className={`flex w-full gap-3 text-right max-w-2xl ${
                isAI ? 'self-start flex-row-reverse' : 'self-end flex-row'
              }`}
            >
              {/* Message content */}
              <div className="flex-1 space-y-1">
                {isText ? (
                  <div
                    className={`p-4 rounded-3xl text-xs leading-relaxed shadow-lg whitespace-pre-line ${
                      isAI
                        ? 'bg-white/5 text-slate-200 border border-white/10 rounded-tr-none'
                        : 'bg-gradient-to-r from-orange-500 to-[#8c7355] text-white rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                ) : (
                  <div className="shadow-lg">{msg.content}</div>
                )}
                <span className="text-[9px] text-slate-500 font-sans block text-left">
                  {msg.timestamp.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Avatar */}
              <div
                className={`h-8 w-8 rounded-xl flex items-center justify-center text-sm border border-white/10 shrink-0 ${
                  isAI
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600'
                    : 'bg-gradient-to-br from-orange-500 to-[#8c7355]'
                }`}
              >
                {isAI ? '🤖' : '👨'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#111C2E]/60 border-t border-white/10 backdrop-blur-md relative z-20 font-sans">
        <form onSubmit={handleSendMessage} className="flex gap-2 items-center relative max-w-4xl mx-auto">
          {/* Action Menu (Popover) */}
          <AIActionMenu
            isOpen={isActionMenuOpen}
            onClose={() => setIsActionMenuOpen(false)}
            onSelectAction={handleSelectAction}
          />

          {/* Plus button */}
          <button
            type="button"
            onClick={() => setIsActionMenuOpen(!isActionMenuOpen)}
            className="h-10 w-10 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white flex items-center justify-center text-lg transition-all active:scale-95 shrink-0"
          >
            {isActionMenuOpen ? '✕' : '＋'}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            placeholder="اسأل المستشار المالي الذكي أو اضغط على (＋) للمقترحات..."
            className="flex-1 bg-[#111C2E]/90 border border-white/10 focus:border-[#8c7355] rounded-xl px-4 py-2.5 text-right text-white text-xs outline-none transition-all placeholder:text-slate-600 disabled:opacity-50"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="bg-gradient-to-r from-orange-500 to-[#8c7355] hover:from-orange-600 hover:to-[#9c8466] text-white font-extrabold px-5 py-2.5 rounded-xl text-xs transition-all active:scale-95 shadow-md flex items-center gap-1 shrink-0 disabled:opacity-50"
          >
            <span>إرسال</span>
            <span>➜</span>
          </button>
        </form>
      </div>
    </div>
  );
}
