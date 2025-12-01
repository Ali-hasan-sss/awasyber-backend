# كيفية الحصول على Service Account Key

## الفرق بين Firebase Config و Service Account Key

### Firebase Config (للـ Frontend) - موجود في `client/lib/firebase/config.ts`

```typescript
{
  apiKey: "...",
  authDomain: "...",
  projectId: "invare-bd572",
  // ...
}
```

هذا للـ frontend فقط ❌

### Service Account Key (للـ Backend) - مطلوب في `backend/src/utils/firebaseAdmin.ts`

```typescript
{
  type: "service_account",
  project_id: "invare-bd572",
  private_key: "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-xxxxx@invare-bd572.iam.gserviceaccount.com",
  // ...
}
```

هذا للـ backend ✅

## خطوات الحصول على Service Account Key:

### 1. اذهب إلى Firebase Console

- افتح: https://console.firebase.google.com/
- اختر المشروع: **invare-bd572**

### 2. افتح Project Settings

- اضغط على ⚙️ (Settings) في أعلى اليسار
- اختر **Project Settings**

### 3. اذهب إلى Service Accounts

- اضغط على تبويب **Service Accounts** في الأعلى

### 4. أنشئ Service Account Key

- اضغط على **Generate New Private Key**
- سيتم تحميل ملف JSON

### 5. انسخ البيانات من الملف

افتح الملف المحمّل وانسخ جميع البيانات إلى `firebaseServiceAccount` في `backend/src/utils/firebaseAdmin.ts`

## مثال على Service Account Key:

```json
{
  "type": "service_account",
  "project_id": "invare-bd572",
  "private_key_id": "abc123...",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@invare-bd572.iam.gserviceaccount.com",
  "client_id": "123456789",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40invare-bd572.iam.gserviceaccount.com"
}
```

## ملاحظة مهمة:

- **لا ترفع** Service Account Key إلى GitHub (يجب أن يكون في `.gitignore`)
- هذا المفتاح يعطي صلاحيات كاملة للمشروع، لذا احتفظ به بشكل آمن
