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

    for (const collection of collections) {
      const collectionName = collection.name;
      console.log(`📦 Migrating: ${collectionName}`);

      const data = await sourceDb.collection(collectionName).find({}).toArray();

      if (data.length > 0) {
        // await targetDb.collection(collectionName).deleteMany({});

        await targetDb.collection(collectionName).insertMany(data);
        console.log(`  ✓ Migrated ${data.length} documents`);
        totalMigrated += data.length;
      } else {
        console.log(`  ⚠ Collection is empty, skipping...`);
      }
    }

    console.log(`\n✅ Migration completed successfully!`);
    console.log(`📊 Total documents migrated: ${totalMigrated}`);
  } catch (error) {
    console.error("\n❌ Migration error:", error.message);
    console.error("Full error:", error);
    process.exit(1);
  } finally {
    await sourceClient.close();
    await targetClient.close();
    console.log("\n🔌 Connections closed");
  }
}

migrateDatabase();
