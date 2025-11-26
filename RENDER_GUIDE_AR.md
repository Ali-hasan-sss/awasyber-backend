# دليل النشر على Render - بالعربية

## 🚀 إعدادات النشر السريعة

### 1️⃣ إعدادات البناء (Build Settings)

عند إنشاء **Web Service** جديد في Render:

| الإعداد            | القيمة                    |
| ------------------ | ------------------------- |
| **Name**           | `awa-cyber-backend`       |
| **Environment**    | `Node`                    |
| **Region**         | اختر أقرب منطقة           |
| **Branch**         | `main` (أو الفرع الرئيسي) |
| **Root Directory** | اتركه فارغاً              |

### 2️⃣ أوامر البناء والتشغيل

#### Build Command:

```bash
npm install && npm run build
```

> **ملاحظة**: البناء يستخدم `tsc-alias` لحل مسارات `@/*` تلقائياً

#### Start Command:

```bash
npm start
```

### 3️⃣ متغيرات البيئة (Environment Variables)

أضف هذه المتغيرات في قسم **Environment**:

#### ⚙️ إعدادات أساسية:

```
NODE_ENV=production
PORT=10000
```

#### 🗄️ قاعدة البيانات:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/awa_cyber?retryWrites=true&w=majority
```

> 💡 استخدم [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (مجاني)

#### 🔐 الأمان:

```
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
ADMIN_SETUP_KEY=your-admin-setup-key-here
```

#### 🌐 CORS (نطاقات الواجهة الأمامية):

```
CORS_ORIGIN=https://your-frontend.com,https://www.your-frontend.com
```

> ⚠️ أضف جميع النطاقات المسموح بها مفصولة بفواصل

#### 👤 بيانات الادمن (للسيدينغ):

```
SEED_ADMIN_NAME=Super Admin
SEED_ADMIN_EMAIL=admin@awacyber.com
SEED_ADMIN_PHONE=+1000000000
SEED_ADMIN_COMPANY=AWA Cyber
SEED_ADMIN_PASSWORD=YourSecurePassword123!
```

> ⚠️ **مهم جداً**: غيّر `SEED_ADMIN_PASSWORD` إلى كلمة مرور قوية!

### 4️⃣ السيدينغ (Seeding)

✅ **السيدينغ يعمل تلقائياً** عند بدء الخادم:

- إذا كان الادمن موجوداً → يتم تخطي السيدينغ
- إذا لم يكن موجوداً → يتم إنشاؤه تلقائياً

### 5️⃣ التحقق من النشر

بعد النشر الناجح، تحقق من:

1. **Logs في Render**: Dashboard → Logs
2. **API Health**:
   - `https://your-app.onrender.com/api/auth/login`
   - `https://your-app.onrender.com/docs` (Swagger Documentation)

### 6️⃣ نصائح مهمة

✅ استخدم MongoDB Atlas (مجاني)  
✅ استخدم كلمات مرور قوية  
✅ أضف جميع النطاقات في `CORS_ORIGIN`  
✅ راقب Logs بعد النشر  
✅ السيدينغ يعمل مرة واحدة فقط

### 7️⃣ استكشاف الأخطاء

| المشكلة          | الحل                                        |
| ---------------- | ------------------------------------------- |
| الخادم لا يبدأ   | تحقق من Logs والمتغيرات                     |
| CORS Error       | تأكد من `CORS_ORIGIN` صحيح                  |
| السيدينغ لا يعمل | تحقق من `MONGO_URI` ومتغيرات `SEED_ADMIN_*` |

---

## 📝 ملخص سريع

**Build**: `npm install && npm run build`  
**Start**: `npm start`

**المتغيرات المطلوبة**: `NODE_ENV`, `PORT`, `MONGO_URI`, `JWT_SECRET`, `CORS_ORIGIN`, `SEED_ADMIN_*`
