import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";

const execAsync = promisify(exec);

const BACKUP_DIR = path.join(process.cwd(), "backups");

async function ensureBackupDir() {
  await fs.mkdir(BACKUP_DIR, { recursive: true });
}

function parseDbUrl(url: string) {
  // postgresql://user:password@host:port/dbname?schema=public
  const match = url.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/);
  if (!match) throw new Error("Could not parse DATABASE_URL");
  const [, user, password, host, port, database] = match;
  return { user, password, host, port, database };
}

export const backupService = {
  async list() {
    await ensureBackupDir();
    const files = await fs.readdir(BACKUP_DIR);
    const backups = await Promise.all(
      files
        .filter((f) => f.endsWith(".sql"))
        .map(async (filename) => {
          const stat = await fs.stat(path.join(BACKUP_DIR, filename));
          return { filename, sizeBytes: stat.size, createdAt: stat.birthtime };
        })
    );
    return backups.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  async create() {
    await ensureBackupDir();

    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) throw new Error("DATABASE_URL not configured");

    const { user, password, host, port, database } = parseDbUrl(dbUrl);

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `heroy-backup-${timestamp}.sql`;
    const filepath = path.join(BACKUP_DIR, filename);

    const env = { ...process.env, PGPASSWORD: password };

    await execAsync(
      `pg_dump -h ${host} -p ${port} -U ${user} -d ${database} -F p -f "${filepath}"`,
      { env }
    );

    const stat = await fs.stat(filepath);
    return { filename, sizeBytes: stat.size, createdAt: stat.birthtime };
  },

  async getFilePath(filename: string) {
    // Prevent path traversal — only allow plain filenames we generated
    if (!/^heroy-backup-[\w-]+\.sql$/.test(filename)) {
      throw new Error("Invalid backup filename");
    }
    const filepath = path.join(BACKUP_DIR, filename);
    await fs.access(filepath); // throws if it doesn't exist
    return filepath;
  },

  async remove(filename: string) {
    const filepath = await this.getFilePath(filename);
    await fs.unlink(filepath);
  },
};
