# سجل تزامن الذكاء الاصطناعي (AI Sync Log) - تخصيص المهام يدوياً وإدارة الأبناء (v-24)

يوثق هذا السجل تطبيق المرحلة الأولى من إعادة هيكلة الذكاء الاصطناعي وإدارة المهام: ميزة **تخصيص المهام يدوياً (Manual Task Assignment)** من قِبل الأب، بالإضافة إلى إعادة تسمية صفحة معلومات الأبناء إلى صفحة إدارة الأبناء.

## 📂 الملفات المشمولة بالتغيير

### 1. الملفات الجديدة:
*   **[v-24-manual-tasks-management.md](file:///c:/Users/saleh/OneDrive/Documentos/NAMAA/docs/ai_sync/v-24-manual-tasks-management.md)**:
    *   سجل التزامن الحالي لتوثيق تفاصيل الهيكلة والتغييرات البرمجية.
*   **[AssignTaskModal.tsx](file:///c:/Users/saleh/OneDrive/Documentos/NAMAA/src/components/ui/AssignTaskModal.tsx)**:
    *   مكون واجهة مستخدم زجاجي (Glassmorphism Modal) يتيح للأب إسناد مهمة جديدة للابن. ويشمل الحقول التالية:
        1. **عنوان المهمة (Task Title)**: حقل نصي.
        2. **نوع المكافأة (Reward Type)**: أزرار تبديل مقسمة (Segmented Toggle) بين "ريال" و"نقطة" و"مخصصة".
        3. **قيمة المكافأة (Reward Amount)**: حقل رقمي يظهر فقط عندما يكون نوع المكافأة "ريال" أو "نقطة".
        4. **المكافأة المخصصة (Custom Reward Text)**: حقل نصي يظهر فقط عندما يكون نوع المكافأة "مخصصة".
    *   يتم عرض مؤشر تحميل (Loading spinner) يحاكي الحفظ لمدة 800ms قبل إغلاق المودال وإظهار تنبيه النجاح.

### 2. الملفات المعدلة:
*   **[AppContext.tsx](file:///c:/Users/saleh/OneDrive/Documentos/NAMAA/src/context/AppContext.tsx)**:
    *   إضافة الدالة `assignManualTask(kidName, title, amount, type, customReward)` للواجهة وتطبيقها في سياق التطبيق العام:
        *   تحديث حالة الأبناء محلياً بشكل متفائل (Optimistic UI) بإدراج المهمة الجديدة بحالة معلقة `pending`.
        *   إرسال المهمة سحابياً إلى جدول `kid_tasks` في قاعدة بيانات Supabase.
        *   عند اختيار نوع مكافأة مخصص (`custom`)، يتم دمج نص المكافأة المخصصة مع العنوان في عمود `title` لتجاوز غياب عمود مخصص في قاعدة البيانات مع الحفاظ على وضوح البيانات للطفل.
*   **[Sidebar.tsx](file:///c:/Users/saleh/OneDrive/Documentos/NAMAA/src/components/layout/Sidebar.tsx)**:
    *   تحديث مسمى عنصر القائمة الجانبية للأب من "معلومات الأبناء 👦👧" إلى "إدارة الأبناء 👥".
*   **[FatherDashboard.tsx](file:///c:/Users/saleh/OneDrive/Documentos/NAMAA/src/pages/FatherDashboard.tsx)**:
    *   تحديث مسميات البطاقات والروابط النصية التي تشير إلى "معلومات الأبناء" لتصبح "إدارة الأبناء 👥".
*   **[FatherKidsPage.tsx](file:///c:/Users/saleh/OneDrive/Documentos/NAMAA/src/pages/FatherKidsPage.tsx)**:
    *   استيراد المودال الجديد `AssignTaskModal` وتثبيت حالات فتحه وإغلاقه.
    *   إضافة زر رئيسي جديد تحت مسمى "تخصيص مهمة 🎯" لكل طفل أسفل زر "تحويل مالي ذكي 💸".
    *   ربط المودال بالضغط على زر التخصيص لتمرير اسم الطفل المستهدف.

---

## 🛠️ التحقق البنائي وتدقيق TypeScript
*   تم التحقق من سلامة البناء وتدقيق الأنواع بنجاح ودون أي أخطاء برمجية.
