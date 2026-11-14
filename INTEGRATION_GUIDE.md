# WorkForce 360 — Third-Party Integrations & Services Guide

This guide details the integration architecture, credential management, and setup workflows for external services powering WorkForce 360: Push Notifications, Bangladesh Payment Gateways, Local SMS Providers, Supabase Cloud Storage, and Biometric Device Bridges.

---

## 1. Push Notifications — Firebase Cloud Messaging (FCM v1)

WorkForce 360 uses FCM v1 to deliver real-time notifications for punch approvals, leave status updates, task deadlines, and emergency broadcasts.

### Service Account Credentials
1. Navigate to **Firebase Console** -> Project Settings -> Service accounts.
2. Generate a new private key JSON and base64-encode it:
   ```bash
   cat service-account.json | base64 -w 0
   ```
3. Store the output in the environment variable:
   ```env
   FCM_SERVICE_ACCOUNT_BASE64="eyJ0eXBlIjoic2VydmljZV9hY2NvdW50IiwicHJvamVjdF9pZCI6Indvcmtmb3JjZTM2MC0..."
   ```

### Channel & Topic Architecture
- **Personal Alerts**: Sent directly to the employee's registered FCM device token (`device_tokens` table).
- **Tenant Announcements**: Subscribed to topic `org_<org_id>_announcements`.
- **Department Alerts**: Subscribed to topic `org_<org_id>_dept_<dept_id>`.
- **Super Admin Broadcast**: Subscribed to topic `system_broadcast_critical`.

---

## 2. Bangladesh Payment Gateways

WorkForce 360 supports native BDT payments for SaaS tenant subscription billing, add-on seat purchases, and automated payroll disbursements.

### A. SSLCommerz Integration
- **Sandbox URL**: `https://sandbox.sslcommerz.com/gwprocess/v4/api.php`
- **Production URL**: `https://securepay.sslcommerz.com/gwprocess/v4/api.php`
- **Validation URL**: `https://securepay.sslcommerz.com/validator/api/validationserverAPI.php`

**Initiating Subscription Payment:**
```typescript
const payload = {
  store_id: process.env.SSLCOMMERZ_STORE_ID,
  store_passwd: process.env.SSLCOMMERZ_STORE_PASSWD,
  total_amount: subscriptionAmountBDT,
  currency: 'BDT',
  tran_id: `WF360-${tenantId}-${Date.now()}`,
  success_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/sslcommerz/success`,
  fail_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/sslcommerz/fail`,
  cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/sslcommerz/cancel`,
  ipn_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/sslcommerz/ipn`,
  cus_name: organization.name,
  cus_email: adminUser.email,
  cus_phone: adminUser.phone,
};
```

### B. bKash Merchant API
- **Token Endpoint**: `https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/token/grant`
- **Create Payment**: `https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/create`
- **Execute Payment**: `https://tokenized.pay.bka.sh/v1.2.0-beta/tokenized/checkout/execute`

Supports direct employee salary disbursements into bKash personal wallets using the bKash B2C Payout API.

---

## 3. SMS Notification Gateways (Bangladesh)

For OTP authentication, account activation, and critical payroll alerts, WorkForce 360 integrates with leading Bangladeshi SMS aggregators.

### Greenweb Bangladesh SMS Gateway
```typescript
export async function sendGreenwebSMS(phone: string, message: string): Promise<boolean> {
  const token = process.env.GREENWEB_SMS_TOKEN;
  const normalizedPhone = phone.replace(/^(\+88)?/, '88');
  
  const response = await fetch('http://api.greenweb.com.bd/api.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      token,
      to: normalizedPhone,
      message,
    }),
  });
  
  const resultText = await response.text();
  return resultText.includes('Ok');
}
```

---

## 4. Supabase Storage Buckets & Policies

Three secure storage buckets are provisioned in `supabase/migrations/07_finance_assets_and_documents.sql`:

### 1. `avatars` Bucket
- **Visibility**: Public read access.
- **Max file size**: 2 MB.
- **Allowed MIME types**: `image/jpeg`, `image/png`, `image/webp`.
- **Upload policy**: Authenticated user can upload to `avatars/{user_id}/avatar.*`.

### 2. `documents` Bucket
- **Visibility**: Private.
- **Max file size**: 25 MB.
- **Allowed MIME types**: `application/pdf`, `image/*`, `application/msword`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`.
- **Access Policy**: Row Level Security checks if `auth.uid()` belongs to the organization owning the document.

### 3. `payslips` Bucket
- **Visibility**: Confidential / Signed URLs only.
- **Max file size**: 5 MB.
- **Policy**: Only the employee matching the payslip ID or the company HR Admin can generate signed access tokens. Signed URLs expire after **900 seconds (15 minutes)**.

---

## 5. Biometric Machine Hardware Integration Bridge

For organizations with on-premise biometric finger/facial recognition terminals (e.g., ZKTeco, Hikvision):

### Architecture
```
[ ZKTeco / Biometric Hardware ]
              │ (TCP/IP Port 4370)
              ▼
  [ Local Python/Node Bridge ]
              │ (HTTPS REST + HMAC SHA256 Signature)
              ▼
[ WorkForce 360 Biometric Ingestion API ]
              │
              ▼
  [ Supabase `attendance_logs` Table ]
```

### Ingestion Endpoint: `POST /api/attendance/hardware-punch`
```json
{
  "device_serial": "ZK-VF380-DHAKA-01",
  "organization_id": "00000000-0000-0000-0000-000000000001",
  "employee_badge_id": "EMP-001",
  "timestamp": "2026-11-12T09:14:32+06:00",
  "verification_mode": "FINGERPRINT",
  "punch_type": "CHECK_IN",
  "hmac_signature": "a6f5e7c8b9d0..."
}
```
The endpoint validates device attestation, maps `employee_badge_id` to the active employee record, and invokes `record_attendance_punch` with `punch_method = 'BIOMETRIC_HARDWARE'`.
