# Firebase Admin Setup Guide

## Overview

This guide explains how to set up Firebase Admin SDK for sending push notifications to admin users when a new quotation request is submitted.

## Prerequisites

1. Firebase project with Cloud Messaging enabled
2. Service account key from Firebase Console

## Setup Steps

### 1. Get Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to Project Settings → Service Accounts
4. Click "Generate New Private Key"
5. Download the JSON file

### 2. Configure Environment Variable

Add the service account JSON content to your `.env` file:

```env
FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"your-project-id",...}'
```

**OR** store the JSON file securely and reference it in your environment.

### 3. Alternative: Use Application Default Credentials

If you're using Google Cloud Platform, you can use Application Default Credentials:

```bash
gcloud auth application-default login
```

This will automatically authenticate Firebase Admin SDK.

### 4. Install Dependencies

```bash
npm install
```

The `firebase-admin` package is already added to `package.json`.

## How It Works

When a client submits a quotation request:

1. The request is saved to the database
2. The system fetches all admin FCM tokens
3. A notification is sent to all admins with:

   - Title: "New Quotation Request | طلب عرض سعر جديد"
   - Body: Client name, company (if any), and requested service
   - Data: Quotation ID, client details, service information

4. A notification log is created for each admin in the database

## Testing

To test the notification system:

1. Make sure at least one admin is logged in and has subscribed to notifications
2. Submit a quotation request from the public quote page
3. All logged-in admins should receive a push notification

## Troubleshooting

### No notifications received

- Check that admins have subscribed to notifications (logged in and granted permission)
- Verify Firebase Admin SDK is properly initialized
- Check server logs for errors

### Invalid token errors

- Invalid tokens are automatically removed from the database
- Users need to log in again to get a new token

## Security Notes

- Never commit the service account key to version control
- Use environment variables for sensitive credentials
- Regularly rotate service account keys
