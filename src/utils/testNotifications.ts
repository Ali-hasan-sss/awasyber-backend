/**
 * Test script to check notification setup
 * Run with: npx ts-node --transpile-only --require tsconfig-paths/register src/utils/testNotifications.ts
 */

import { getNotificationTokens } from "@/services/notificationService";
import { User } from "@/models/User";
import admin from "./firebaseAdmin";

async function testNotifications() {
  console.log("=== Testing Notification Setup ===\n");

  // 1. Check Firebase Admin initialization
  console.log("1. Checking Firebase Admin initialization...");
  if (!admin.apps.length) {
    console.error("❌ Firebase Admin is NOT initialized");
    console.log("   Please set FIREBASE_SERVICE_ACCOUNT environment variable");
    return;
  }
  console.log("✅ Firebase Admin is initialized\n");

  // 2. Check admin users
  console.log("2. Checking admin users...");
  const admins = await User.find({ role: "admin" }).lean();
  console.log(`   Found ${admins.length} admin user(s)`);
  admins.forEach((admin) => {
    console.log(`   - ${admin.name} (${admin.email})`);
  });
  console.log();

  // 3. Check admin FCM tokens
  console.log("3. Checking admin FCM tokens...");
  const adminTokens = await getNotificationTokens({ role: "admin" });
  console.log(`   Found ${adminTokens.length} admin FCM token(s)`);
  if (adminTokens.length === 0) {
    console.warn("   ⚠️  No tokens found! Admins need to:");
    console.warn("      1. Log in to the admin dashboard");
    console.warn("      2. Grant notification permission");
    console.warn("      3. The system will automatically subscribe them");
  } else {
    adminTokens.forEach((token, index) => {
      console.log(`   Token ${index + 1}: ${token.substring(0, 20)}...`);
    });
  }
  console.log();

  // 4. Test sending a notification
  if (adminTokens.length > 0) {
    console.log("4. Testing notification send...");
    try {
      const { sendNotificationToAllAdmins } = await import("./firebaseAdmin");
      const result = await sendNotificationToAllAdmins(
        "Test Notification",
        "This is a test notification from the backend",
        { type: "test" }
      );
      console.log("   Result:", result);
      console.log("✅ Test notification sent successfully");
    } catch (error) {
      console.error("   ❌ Error sending test notification:", error);
    }
  } else {
    console.log("4. Skipping notification test (no tokens available)");
  }

  console.log("\n=== Test Complete ===");
}

// Run the test
testNotifications()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Test failed:", error);
    process.exit(1);
  });
