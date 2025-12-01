import * as admin from "firebase-admin";

// Firebase Admin Service Account Configuration
// يمكنك وضع Service Account Key هنا مباشرة
const firebaseServiceAccount: any = {
  type: "service_account",
  project_id: "invare-bd572",
  private_key_id: "27cef0b7761989e7d012232d3ea95b61950e0efe",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCZuUpc+pSSGq7v\nr5wOj8MnQoCKMg3R2pSPLbLrGSvNQ6ocvldMUeOtafGp73JHogo1T9gVfPcaRL4P\nXI5d7fzQ3x5ZWeokYw0HVn9UBmJB1C0DfhpbBRrBrXHE0gvZnu6BjJDQ2GZ/DElO\nllcj7jBEHLFxoIdb7cL9HQmCDPFy1ut1kYtLqDJvIo+JtXdgag8bH7N2htXPYIaG\ncosmOiqI8k8OpkPX+CTUZTBhVghlhK7Mgw7eurE9rpALJMgMRmce78vJQy5tyM/3\nqdT9TT9qO4iqxfGfj0RaPVu7TDR98en4CZhiWxfLHWA0TLfQCAE5XCZEa6M1Tsof\nQQ/O4UETAgMBAAECggEACaXATf+H7XdxPSenQp6xH7ijuoiTp3TxV98FWI3W2uYB\nOhaUAf0trcd1XDXj1S0NOPVO2WJjW6mux+YGJUz3TeCC1ha3hBsXSTubeBmCdyEq\nxgpW+xlh6X/KIRERn1HDJCw/NmwuWpDZ1O3IgD/FlbC7TidF93X/g8UbwKaxTISp\nka0SIVxvA25iuVZ21JTSrESn/Y1JCyffGw/EDtRWRd+jPAkpamaVC563tTcxSavd\nMulJh6DLd9tJ2YkBEvpMZnCUcc704AFvC3Q/7TzJfhrMZeT1Rjrhq68axxs0zaoo\nm2CJzJYivTZMFKjeA0qOWUGCn+BeTeuhn9dz7u1UOQKBgQDIIMaXKfq+jaT9L/gK\nVK+tIChGpOeDNKX/mvka6TbVIGuBCEJh09gnYadvd0emPIZ67F5/C52PO1S5kFpA\nI07ZKbWWhPKbt0qHrpFlgkqKZLH9bBQ5MGWCzstymbjRyBfgCzJw6mgGl/YkdKvw\n8yf8ZWav1eO4oS+6rCov/LtDpwKBgQDEo/ySgn2QxPWAcTF/B+QBr9IAcXEaL52x\nX3BIDi7Fne99EaGZOHhoXeevHgjAF15/oz1+Rxyw8BEoZpJZ2jFKkQT/pxE7FDXE\nhuITJVJUvZFa5vk5wr51I5PdqmJIU/KraLE87yV2cgPcpV2DkdakjULWIqik6YVa\nDELkpu+0tQKBgGxRCQtiBjvCkE0U/Gwi/951LDdoI4HpKftZVoBRP4NFA8qXvM4U\nCcbu3N/AsH/x/FtluZOLpuCSHT4+OgrC0XdKUuU/2cub/fPH8Rv+0/dpnshqCdwW\nLKsK4CSLvPOWGA4EIW3qARmof+mlWDaWdMrv2w9KdfFFFH81lbPZV0W7AoGAXINO\nQ9uSmbagTfJzN/GNauG+Kik07f3y8c0V9UB+7shUMQJHhd+Ufn2Xj8LQmRclhWVW\ne/+W1wPK/rfrKMzHne5GbMS8DZB/j1tqJ1nKt0WMijjajjs6AcBgQ8xyetbL96rE\noAdfF6+ic391VH4bfsVa6YXa0+NtsqTMH+kOI3UCgYA5kvol6aLudAKJV1mrPYFq\nMEHxPNMKNBPnsWIJ5ojLifxqgxPUlR/HdJiZ+cwkMdRb00U4KVMhLvJB4eNm2NZr\nXJJq+vitM+diz47An49FoU4ZoKba5O3+tmrrLHv0AoyUwh/jBmHWqPlNQpbI6Eq7\nTgV0JaMLlQEWIro8MKzZKw==\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@invare-bd572.iam.gserviceaccount.com",
  client_id: "104316067428306074894",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40invare-bd572.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  try {
    let serviceAccount: any = undefined;

    // First priority: Use hardcoded service account if available
    if (firebaseServiceAccount.private_key) {
      serviceAccount = firebaseServiceAccount;
      console.log(
        "Firebase Admin: Using hardcoded service account configuration"
      );
    }

    // Second priority: Try to get service account from environment variable
    if (!serviceAccount && process.env.FIREBASE_SERVICE_ACCOUNT) {
      const fs = require("fs");
      const path = require("path");
      const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT.trim();

      // First, try to read as file path (more reliable)
      if (fs.existsSync(serviceAccountPath)) {
        try {
          const fileContent = fs.readFileSync(serviceAccountPath, "utf8");
          serviceAccount = JSON.parse(fileContent);
          console.log(
            `Firebase Admin: Loaded service account from file: ${serviceAccountPath}`
          );
        } catch (fileError: any) {
          console.error(
            `Firebase Admin: Error reading file ${serviceAccountPath}:`,
            fileError.message
          );
        }
      } else {
        // If not a file, try parsing as JSON string
        try {
          serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
          console.log(
            "Firebase Admin: Loaded service account from environment variable"
          );
        } catch (parseError: any) {
          console.error(
            "Firebase Admin: Invalid FIREBASE_SERVICE_ACCOUNT - not a valid JSON string or file path"
          );
          console.error("Error:", parseError.message);
          console.error("Please either:");
          console.error(
            "  1. Set FIREBASE_SERVICE_ACCOUNT to a file path (e.g., ./firebase-service-account.json)"
          );
          console.error(
            "  2. Or remove FIREBASE_SERVICE_ACCOUNT from .env and place firebase-service-account.json in backend folder"
          );
        }
      }
    }

    // Third priority: Try to load from default file location
    if (!serviceAccount) {
      const fs = require("fs");
      const path = require("path");
      const defaultPaths = [
        path.join(process.cwd(), "firebase-service-account.json"),
        path.join(process.cwd(), "serviceAccountKey.json"),
        path.join(__dirname, "../../firebase-service-account.json"),
      ];

      for (const filePath of defaultPaths) {
        if (fs.existsSync(filePath)) {
          const fileContent = fs.readFileSync(filePath, "utf8");
          serviceAccount = JSON.parse(fileContent);
          console.log(
            `Firebase Admin: Loaded service account from ${filePath}`
          );
          break;
        }
      }
    }

    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id,
      });
      console.log("Firebase Admin initialized with service account");
    } else {
      // Try to use default credentials (for local development with gcloud CLI)
      try {
        admin.initializeApp({
          credential: admin.credential.applicationDefault(),
        });
        console.log(
          "Firebase Admin initialized with application default credentials"
        );
      } catch (defaultError) {
        console.warn(
          "Firebase Admin: Could not initialize with default credentials, notifications may not work"
        );
        console.warn(
          "Please set FIREBASE_SERVICE_ACCOUNT environment variable or place serviceAccountKey.json in the backend root"
        );
      }
    }
  } catch (error: any) {
    console.error("Firebase Admin initialization error:", error.message);
    console.error("Full error:", error);
  }
} else {
  console.log("Firebase Admin already initialized");
}

/**
 * Send notification to all admin users
 */
export const sendNotificationToAllAdmins = async (
  title: string,
  body: string,
  data?: any
) => {
  try {
    // Check if Firebase Admin is initialized
    if (!admin.apps.length) {
      console.error(
        "Firebase Admin is not initialized. Cannot send notifications."
      );
      return {
        success: 0,
        failed: 0,
        total: 0,
        error: "Firebase Admin not initialized",
      };
    }

    const { getNotificationTokens } = await import(
      "@/services/notificationService"
    );

    // Get all admin FCM tokens
    const adminTokens = await getNotificationTokens({ role: "admin" });
    console.log(`Found ${adminTokens.length} admin FCM tokens`);

    if (adminTokens.length === 0) {
      console.log(
        "No admin tokens found - admins need to subscribe to notifications first"
      );
      return {
        success: 0,
        failed: 0,
        total: 0,
        error: "No admin tokens found",
      };
    }

    // Create notification log for each admin
    const { createNotificationLog } = await import(
      "@/services/notificationService"
    );
    const { User } = await import("@/models/User");

    const admins = await User.find({ role: "admin" }).lean();

    // Create logs for all admins
    for (const adminUser of admins) {
      try {
        await createNotificationLog({
          userId: adminUser._id.toString(),
          role: "admin",
          title,
          body,
          data,
        });
      } catch (error) {
        console.error(
          `Error creating notification log for admin ${adminUser._id}:`,
          error
        );
      }
    }

    // Send notifications to all admin tokens
    const messages = adminTokens.map((token) => ({
      notification: {
        title,
        body,
      },
      data: data
        ? {
            ...Object.entries(data).reduce((acc, [key, value]) => {
              acc[key] = String(value);
              return acc;
            }, {} as Record<string, string>),
          }
        : undefined,
      webpush: {
        notification: {
          title,
          body,
          icon: "/icon-192x192.png",
          badge: "/icon-192x192.png",
          requireInteraction: false,
        },
        fcmOptions: {
          link:
            data?.type === "quotation_request"
              ? "/admin/dashboard/quotes"
              : data?.type === "project_modification" && data?.projectId
              ? `/admin/dashboard/projects/${data.projectId}?tab=modifications`
              : "/admin/dashboard",
        },
      },
      token,
    }));

    // Send in batches (Firebase allows up to 500 tokens per batch)
    const batchSize = 500;
    const results = [];

    for (let i = 0; i < messages.length; i += batchSize) {
      const batch = messages.slice(i, i + batchSize);
      const batchResults = await Promise.allSettled(
        batch.map((message) =>
          admin.messaging().send(message as admin.messaging.Message)
        )
      );
      results.push(...batchResults);
    }

    // Log results
    const successCount = results.filter((r) => r.status === "fulfilled").length;
    const failureCount = results.filter((r) => r.status === "rejected").length;

    console.log(
      `Notification sent to ${successCount} admins, ${failureCount} failed`
    );

    // Remove invalid tokens (async cleanup)
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        const error = result.reason as any;
        if (
          error?.code === "messaging/invalid-registration-token" ||
          error?.code === "messaging/registration-token-not-registered"
        ) {
          const invalidToken = adminTokens[index];
          if (invalidToken) {
            // Remove invalid token from database (async, don't wait)
            import("@/services/notificationService")
              .then(({ unsubscribeFromNotifications }) => {
                unsubscribeFromNotifications(invalidToken).catch((err) => {
                  console.error("Error removing invalid token:", err);
                });
              })
              .catch((err) => {
                console.error("Error importing notification service:", err);
              });
          }
        }
      }
    });

    return {
      success: successCount,
      failed: failureCount,
      total: adminTokens.length,
    };
  } catch (error) {
    console.error("Error sending notification to admins:", error);
    throw error;
  }
};

export default admin;
