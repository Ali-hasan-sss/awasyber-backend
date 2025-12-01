# إعداد Firebase Admin - دليل سريع

## المشكلة الحالية

```
SyntaxError: Expected ':' after property name in JSON at position 36
```

هذا يعني أن JSON في متغير البيئة `FIREBASE_SERVICE_ACCOUNT` غير صحيح.

## الحلول المتاحة

### الحل 1: استخدام ملف JSON (الأسهل والأكثر أماناً)

1. حمّل Service Account Key من Firebase Console
2. احفظ الملف باسم `firebase-service-account.json` في مجلد `backend`
3. أضف إلى `.gitignore`:
   ```
   firebase-service-account.json
   serviceAccountKey.json
   ```
4. الكود سيجد الملف تلقائياً!

### الحل 2: استخدام متغير البيئة (JSON String)

في ملف `.env` في مجلد `backend`:

```env
# الطريقة 1: JSON كامل في سطر واحد (يجب أن يكون بدون فواصل أو أسطر)
FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"your-project-id",...}'

# الطريقة 2: مسار الملف
FIREBASE_SERVICE_ACCOUNT=./firebase-service-account.json
```

**ملاحظة مهمة:** إذا كنت تستخدم JSON في `.env`، يجب أن يكون في سطر واحد بدون فواصل أو أسطر جديدة.

### الحل 3: استخدام Application Default Credentials

إذا كنت تستخدم Google Cloud Platform:

```bash
gcloud auth application-default login
```

## التحقق من الإعداد

بعد إعداد Firebase Admin، أعد تشغيل الـ backend وتحقق من السجلات:

```
Firebase Admin initialized with service account
```

إذا رأيت هذه الرسالة، فالإعداد صحيح!

## اختبار الإشعارات

1. تأكد من أن الأدمن سجلوا دخولهم
2. تأكد من أنهم منحوا إذن الإشعارات
3. أرسل كوتيشن جديد
4. تحقق من السجلات:
   ```
   Attempting to send notification for new quotation request: ...
   Found X admin FCM tokens
   Notification sent to X admins, 0 failed
   ```
