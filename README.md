# Admin AI - React Dashboard

تطبيق لوحة تحكم إدارية متطور تم تطويره باستخدام React، مع تكامل Firebase للمصادقة و Supabase لقاعدة البيانات. هذا التطبيق هو نسخة محولة من تطبيق Flutter الأصلي مع الحفاظ على نفس التصميم والميزات.

## الميزات الرئيسية

- 📊 **لوحة تحكم شاملة** - عرض الإحصائيات والبيانات المهمة
- 📦 **إدارة المنتجات** - إضافة وتعديل وحذف المنتجات
- 🛒 **إدارة الطلبات** - تتبع ومعالجة طلبات العملاء
- 👥 **إدارة المستخدمين** - إدارة حسابات المستخدمين والصلاحيات
- 📁 **إدارة الفئات** - تنظيم المنتجات في فئات
- ⚙️ **الإعدادات** - تكوين إعدادات التطبيق
- 🔐 **المصادقة الآمنة** - باستخدام Firebase Authentication
- 💾 **قاعدة بيانات متقدمة** - باستخدام Supabase
- 📱 **تصميم متجاوب** - يعمل على جميع الأجهزة

## التقنيات المستخدمة

- **React 19** - مكتبة واجهة المستخدم
- **Vite** - أداة البناء والتطوير
- **Tailwind CSS** - إطار عمل CSS
- **shadcn/ui** - مكونات واجهة المستخدم
- **Lucide React** - أيقونات
- **Firebase** - المصادقة
- **Supabase** - قاعدة البيانات وتخزين الملفات

## متطلبات التشغيل

- Node.js 18+ 
- pnpm (مدير الحزم)
- حساب Firebase
- حساب Supabase

## التثبيت والإعداد

### 1. استنساخ المشروع
```bash
git clone <repository-url>
cd admin-ai-nextjs
```

### 2. تثبيت التبعيات
```bash
pnpm install
```

### 3. إعداد Firebase

1. إنشاء مشروع جديد في [Firebase Console](https://console.firebase.google.com/)
2. تفعيل Authentication وإضافة طريقة تسجيل الدخول بالبريد الإلكتروني
3. نسخ معلومات التكوين وإضافتها في `src/lib/firebase.js`:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

### 4. إعداد Supabase

1. إنشاء مشروع جديد في [Supabase](https://supabase.com/)
2. تشغيل SQL المرفق لإنشاء الجداول (انظر `SUPABASE_SCHEMA.md`)
3. نسخ URL و API Key وإضافتهما في `src/lib/supabase.js`:

```javascript
const supabaseUrl = 'your-supabase-url';
const supabaseKey = 'your-supabase-anon-key';
```

### 5. تشغيل التطبيق

```bash
pnpm run dev
```

سيتم تشغيل التطبيق على `http://localhost:5173`

## بنية المشروع

```
src/
├── components/          # المكونات القابلة لإعادة الاستخدام
│   ├── ui/             # مكونات shadcn/ui
│   ├── Sidebar.jsx     # الشريط الجانبي
│   ├── DashboardStats.jsx
│   ├── RecentOrders.jsx
│   └── RecentUsers.jsx
├── pages/              # صفحات التطبيق
│   ├── Dashboard.jsx
│   ├── Products.jsx
│   ├── Orders.jsx
│   ├── Users.jsx
│   ├── Categories.jsx
│   └── Settings.jsx
├── contexts/           # React Contexts
│   └── AuthContext.jsx
├── hooks/              # Custom Hooks
│   └── useSupabase.js
├── lib/                # المكتبات والأدوات
│   ├── firebase.js
│   ├── supabase.js
│   └── utils.js
├── App.jsx             # المكون الرئيسي
└── main.jsx           # نقطة الدخول
```

## الاستخدام

### لوحة التحكم
- عرض الإحصائيات العامة (المبيعات، الطلبات، المنتجات، المستخدمين)
- عرض الطلبات والمستخدمين الحديثين

### إدارة المنتجات
- عرض جميع المنتجات مع الصور والتفاصيل
- إضافة منتجات جديدة
- تعديل المنتجات الموجودة
- حذف المنتجات

### إدارة الطلبات
- عرض جميع الطلبات مع التفاصيل
- تتبع حالة الطلبات
- عرض عناصر كل طلب

### إدارة المستخدمين
- عرض جميع المستخدمين
- إدارة الأدوار والصلاحيات
- تفعيل/إلغاء تفعيل الحسابات

### إدارة الفئات
- إنشاء فئات جديدة للمنتجات
- تعديل الفئات الموجودة
- حذف الفئات

### الإعدادات
- تكوين العملة الافتراضية
- تحديد تكلفة التوصيل
- إعدادات عامة للتطبيق

## النشر

### بناء التطبيق للإنتاج
```bash
pnpm run build
```

### معاينة البناء محلياً
```bash
pnpm run preview
```

## المساهمة

1. Fork المشروع
2. إنشاء فرع للميزة الجديدة (`git checkout -b feature/AmazingFeature`)
3. Commit التغييرات (`git commit -m 'Add some AmazingFeature'`)
4. Push إلى الفرع (`git push origin feature/AmazingFeature`)
5. فتح Pull Request

## الترخيص

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](LICENSE) للتفاصيل.

## الأخطاء الشائعة وحلولها

### خطأ UUID الفارغ
```
"code": "22P02",
"message": "invalid input syntax for type uuid: """
```

**السبب:** إرسال سلسلة نصية فارغة `""` لحقل UUID بدلاً من `null`.

**الحل:** تم إصلاح هذه المشكلة في المكونات التالية:
- `AddProductModal.jsx` - السطر 90
- `EditProductModal.jsx` - السطر 120

الكود المُحدث:
```javascript
category_id: formData.category_id && formData.category_id.trim() !== '' ? formData.category_id : null
```

### مشكلة مربعات الحوار لا تستجيب للثيم المظلم
```
مربعات الحوار للحذف تظهر بخلفية بيضاء حتى في الوضع المظلم
```

**السبب:** تم تحديد `className="bg-white"` بشكل صريح في AlertDialogContent.

**الحل:** تم إصلاح هذه المشكلة في الصفحات التالية:
- `Categories.jsx` - السطر 159
- `Products.jsx` - السطر 200

الكود المُحدث:
```javascript
<AlertDialogContent className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-sm">
  <AlertDialogTitle className="text-gray-900 dark:text-white">Delete Item</AlertDialogTitle>
  <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
    Are you sure you want to delete <strong className="text-gray-900 dark:text-white">{item?.name}</strong>?
  </AlertDialogDescription>
```

### مشاكل رفع الصور
- تأكد من إعداد bucket `images` في Supabase
- تفعيل السياسات المناسبة للقراءة والكتابة والحذف
- التأكد من صحة معلومات التكوين في Supabase

### مشاكل المصادقة
- تأكد من تفعيل Email/Password في Firebase Authentication
- التحقق من صحة معلومات Firebase في `firebase.js`

### مشاكل قاعدة البيانات
- تأكد من إنشاء جميع الجداول المطلوبة حسب `SETUP_GUIDE.md`
- التحقق من صحة العلاقات بين الجداول (Foreign Keys)
- التأكد من إعداد Row Level Security إذا لزم الأمر

## الدعم

إذا واجهت أي مشاكل أو لديك أسئلة، يرجى فتح issue في المستودع.

