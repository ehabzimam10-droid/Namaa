# سجل تزامن الذكاء الاصطناعي (AI Sync Log) - كروت الكاروسيل الحركية الدوارة (v-16)

يوثق هذا السجل تطبيق المرحلة الثانية لتطوير واجهات المستخدم، وذلك بتصميم وبناء عنصر الكاروسيل الحركي الدوار (`DynamicCarousel`) لإبراز بطاقات استثمار المهام والتبرعات وتطهير النماذج المباشرة في لوحة التحكم الرئيسية للأب والطفل.

## 📂 الملفات المشمولة بالتغيير

### 1. الملفات الجديدة:
*   **[v-16-dynamic-carousel.md](file:///d:/Documents/Namaa/docs/ai_sync/v-16-dynamic-carousel.md)**:
    *   سجل التزامن لتوثيق الكاروسيل الدوار وتوجيه الواجهات الجديد.
*   **[DynamicCarousel.tsx](file:///d:/Documents/Namaa/src/components/ui/DynamicCarousel.tsx)**:
    *   مكون حركي عام وقابل لإعادة الاستخدام يعرض مصفوفة عناصر ديناميكية مع خاصية التدوير التلقائي (كل 5 ثوانٍ) وأزرار توجيه جانبية ومؤشر نقاط التنقل السفلي.
*   **[KidDonationsPage.tsx](file:///d:/Documents/Namaa/src/pages/KidDonationsPage.tsx)**:
    *   صفحة انتقالية فارغة للتبرعات والمسؤولية المجتمعية للأبناء.
*   **[FatherProjectsPage.tsx](file:///d:/Documents/Namaa/src/pages/FatherProjectsPage.tsx)**:
    *   صفحة انتقالية فارغة لإدارة المشاريع الاستثمارية لولي الأمر.

### 2. الملفات المعدلة:
*   **[mockData.ts](file:///d:/Documents/Namaa/src/data/mockData.ts)**:
    *   تصدير ثابت لقائمة قنوات التبرع: `donationCauses`.
*   **[App.tsx](file:///d:/Documents/Namaa/src/App.tsx)**:
    *   إدراج مسارات التنقل الجديدة وتضمينها تحت شاشة التخطيط الأساسي:
        *   `/kid/donations` -> `KidDonationsPage`.
        *   `/father/projects` -> `FatherProjectsPage`.
*   **[KidDashboard.tsx](file:///d:/Documents/Namaa/src/pages/KidDashboard.tsx)**:
    *   إزالة بطاقات العرض الثابتة للمهام، والتبرع، والمشاريع، واستبدالها بكروت الكاروسيل الدوار الحركي.
    *   ربط الكروت كروابط توجيهية لصفحات التفاصيل المخصصة.
*   **[FatherDashboard.tsx](file:///d:/Documents/Namaa/src/pages/FatherDashboard.tsx)**:
    *   تنظيف لوحة الأب من نماذج المشاريع الفورية واستبدال كرت المشاريع بكاروسيل دوار تفاعلي يوجه الأب لصفحة المشاريع الكاملة.

---

## 🛠️ تفاصيل التحقق والأنواع لـ TypeScript
*   تم فحص بناء المشروع بالكامل وتجاوز تدقيق الأنواع لـ TypeScript بنسبة **0 أخطاء (0 Errors)** بنجاح.
