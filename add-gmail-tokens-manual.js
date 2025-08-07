import { db } from './src/server/db/index.js';

async function addGmailTokensTable() {
  try {
    console.log('🔧 Adding userGmailTokens table...');

    // Create the table manually
    await db.execute(`
      CREATE TABLE IF NOT EXISTS "ojir_user_gmail_tokens" (
        "id" varchar(255) PRIMARY KEY NOT NULL,
        "user_id" varchar(255) NOT NULL,
        "access_token" text NOT NULL,
        "refresh_token" text NOT NULL,
        "expires_at" timestamp with time zone NOT NULL,
        "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "updated_at" timestamp with time zone
      );
    `);

    // Add foreign key constraint
    await db.execute(`
      ALTER TABLE "ojir_user_gmail_tokens"
      ADD CONSTRAINT "ojir_user_gmail_tokens_user_id_user_id_fk"
      FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
    `);

    // Add indexes
    await db.execute(`
      CREATE INDEX IF NOT EXISTS "user_gmail_token_user_id_idx" ON "ojir_user_gmail_tokens" USING btree ("user_id");
    `);

    await db.execute(`
      CREATE INDEX IF NOT EXISTS "user_gmail_token_expires_at_idx" ON "ojir_user_gmail_tokens" USING btree ("expires_at");
    `);

    console.log('✅ userGmailTokens table created successfully!');
  } catch (error) {
    console.error('❌ Error creating userGmailTokens table:', error);
  }
}

addGmailTokensTable();
