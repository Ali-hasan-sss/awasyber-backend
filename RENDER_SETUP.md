# إعدادات النشر على Render

## 📋 الخطوات المطلوبة

### 1. إعدادات البناء (Build Settings)

في Render Dashboard، عند إنشاء Web Service جديد:

#### Basic Settings:

- **Name**: `awa-cyber-backend` (أو أي اسم تفضله)
- **Environment**: `Node`
- **Region**: اختر أقرب منطقة لك
- **Branch**: `main` (أو الفرع الذي تريد النشر منه)
- **Root Directory**: اتركه فارغاً (أو `backend` إذا كان المشروع في مجلد فرعي)

#### Build & Deploy:

- **Build Command**:

  ```bash
  npm install && npm run build
  ```

- **Start Command**:
  ```bash
  npm start
  ```

### 2. متغيرات البيئة (Environment Variables)

أضف المتغيرات التالية في قسم **Environment** في Render:

#### متغيرات مطلوبة:

```
NODE_ENV=production
PORT=10000
```

#### متغيرات قاعدة البيانات:

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/awa_cyber?retryWrites=true&w=majority
```

> **ملاحظة**: استخدم MongoDB Atlas أو أي خدمة MongoDB سحابية

#### متغيرات الأمان:

```
JWT_SECRET=your-super-secret-jwt-key-here-min-32-chars
ADMIN_SETUP_KEY=your-admin-setup-key-here
```

#### متغيرات CORS:

```
CORS_ORIGIN=https://your-frontend-domain.com,https://www.your-frontend-domain.com
```

> **ملاحظة**: أضف جميع النطاقات المسموح بها مفصولة بفواصل

#### متغيرات السيدينغ (Seeding):

```
SEED_ADMIN_NAME=Super Admin
SEED_ADMIN_EMAIL=admin@awacyber.com
SEED_ADMIN_PHONE=+1000000000
SEED_ADMIN_COMPANY=AWA Cyber
SEED_ADMIN_PASSWORD=YourSecurePassword123!
```

> **⚠️ مهم**: غيّر `SEED_ADMIN_PASSWORD` إلى كلمة مرور قوية!

### 3. إعدادات إضافية

#### Health Check Path (اختياري):

- **Path**: `/api/health` (إذا كنت تريد إضافة endpoint للصحة)
- أو اتركه فارغاً

#### Auto-Deploy:

- ✅ **Enabled**: سيتم النشر تلقائياً عند push إلى GitHub

### 4. السيدينغ (Seeding)

السيدينغ يعمل تلقائياً عند بدء الخادم عبر `npm start` الذي يستدعي `seed:prod`.

- إذا كان الادمن موجوداً بالفعل، سيتم تخطي السيدينغ
- إذا لم يكن موجوداً، سيتم إنشاؤه تلقائياً

### 5. التحقق من النشر

بعد النشر الناجح:

1. **تحقق من Logs**: في Render Dashboard → Logs
2. **تحقق من API**:
   - `https://your-app.onrender.com/api/auth/login` (للتحقق من أن الخادم يعمل)
   - `https://your-app.onrender.com/docs` (لرؤية Swagger Documentation)

### 6. نصائح مهمة

- ✅ استخدم MongoDB Atlas (مجاني) لقاعدة البيانات
- ✅ استخدم كلمات مرور قوية لجميع المتغيرات الحساسة
- ✅ أضف جميع النطاقات المسموح بها في `CORS_ORIGIN`
- ✅ راقب Logs بعد النشر للتأكد من أن كل شيء يعمل
- ✅ السيدينغ يعمل مرة واحدة فقط (عند أول تشغيل)

### 7. استكشاف الأخطاء

#### المشكلة: الخادم لا يبدأ

- تحقق من Logs في Render
- تأكد من أن جميع المتغيرات موجودة
- تحقق من `MONGO_URI` صحيح

#### المشكلة: CORS Error

- تأكد من إضافة النطاق الصحيح في `CORS_ORIGIN`
- تأكد من استخدام `https://` وليس `http://`

#### المشكلة: السيدينغ لا يعمل

- تحقق من Logs
- تأكد من أن `MONGO_URI` صحيح
- تحقق من أن جميع متغيرات `SEED_ADMIN_*` موجودة

---

## 📝 ملخص سريع

**Build Command**: `npm install && npm run build`
**Start Command**: `npm start`

**Environment Variables المطلوبة**:

- `NODE_ENV=production`
- `PORT=10000` (أو أي port يحدده Render)
- `MONGO_URI=...`
- `JWT_SECRET=...`
- `CORS_ORIGIN=...`
- `SEED_ADMIN_*` (جميع المتغيرات)
