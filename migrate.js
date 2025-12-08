// migrate-db.js
const { MongoClient } = require("mongodb");

const sourceUri =
  "mongodb+srv://awauser:Mola1992@cluster0.yaccgyp.mongodb.net/";
const targetUri = "mongodb://localhost:27017/awa_cyber";

console.log("🚀 Starting database migration...");
console.log("Source (Atlas):", sourceUri.replace(/\/\/.*@/, "//***:***@"));
console.log("Target (VPS):", targetUri);
console.log("");

async function migrateDatabase() {
  const sourceClient = new MongoClient(sourceUri);
  const targetClient = new MongoClient(targetUri);

  try {
    console.log("📡 Connecting to source database (Atlas)...");
    await sourceClient.connect();
    console.log("✓ Connected to Atlas");

    console.log("📡 Connecting to target database (VPS)...");
    await targetClient.connect();
    console.log("✓ Connected to VPS MongoDB");

    const sourceDbName = sourceUri.split("/").pop().split("?")[0] || "test";
    const sourceDb = sourceClient.db(sourceDbName);
    const targetDb = targetClient.db("awa_cyber");

    console.log("\n📋 Fetching collections from Atlas...");
    const collections = await sourceDb.listCollections().toArray();
    console.log(`Found ${collections.length} collections to migrate\n`);

    let totalMigrated = 0;
    let totalSkipped = 0;
    let totalUpdated = 0;

    for (const collection of collections) {
      const collectionName = collection.name;
      console.log(`📦 Migrating: ${collectionName}`);

      const data = await sourceDb.collection(collectionName).find({}).toArray();

      if (data.length > 0) {
        const targetCollection = targetDb.collection(collectionName);
        let inserted = 0;
        let updated = 0;
        let skipped = 0;

        // استخدام bulkWrite مع upsert للتعامل مع المكررات
        const operations = data.map((doc) => {
          // استخدام _id كمعرف فريد، أو email للمستخدمين
          const filter = doc._id
            ? { _id: doc._id }
            : collectionName === "users" && doc.email
            ? { email: doc.email }
            : { _id: doc._id };

          return {
            updateOne: {
              filter: filter,
              update: { $set: doc },
              upsert: true,
            },
          };
        });

        try {
          const result = await targetCollection.bulkWrite(operations, {
            ordered: false, // مواصلة حتى عند وجود أخطاء
          });

          inserted = result.upsertedCount || 0;
          updated = result.modifiedCount || 0;
          skipped = data.length - inserted - updated;

          console.log(
            `  ✓ Inserted: ${inserted}, Updated: ${updated}, Skipped: ${skipped}`
          );
          totalMigrated += inserted;
          totalUpdated += updated;
          totalSkipped += skipped;
        } catch (bulkError) {
          // في حالة وجود أخطاء، جرب insertMany مع ordered: false
          console.log(`  ⚠ Bulk write had some errors, trying insertMany...`);
          try {
            await targetCollection.insertMany(data, {
              ordered: false, // مواصلة حتى عند وجود أخطاء
            });
            inserted = data.length;
            console.log(`  ✓ Migrated ${inserted} documents`);
            totalMigrated += inserted;
          } catch (insertError) {
            console.log(`  ⚠ Some documents were skipped due to duplicates`);
            // عد الوثائق المدرجة بنجاح
            const insertedIds = insertError.insertedIds || {};
            inserted = Object.keys(insertedIds).length;
            totalMigrated += inserted;
            totalSkipped += data.length - inserted;
          }
        }
      } else {
        console.log(`  ⚠ Collection is empty, skipping...`);
      }
    }

    console.log(`\n✅ Migration completed!`);
    console.log(`📊 Statistics:`);
    console.log(`   - Inserted: ${totalMigrated}`);
    console.log(`   - Updated: ${totalUpdated}`);
    console.log(`   - Skipped (duplicates): ${totalSkipped}`);
  } catch (error) {
    console.error("\n❌ Migration error:", error.message);
    if (error.code === 11000) {
      console.error(
        "   This is a duplicate key error. The script will continue..."
      );
    } else {
      console.error("Full error:", error);
      process.exit(1);
    }
  } finally {
    await sourceClient.close();
    await targetClient.close();
    console.log("\n🔌 Connections closed");
  }
}

migrateDatabase();
