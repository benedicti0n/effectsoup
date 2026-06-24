import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "./env";

export function createR2Client(): S3Client | null {
  if (
    !env.R2_ACCOUNT_ID ||
    !env.R2_ACCESS_KEY_ID ||
    !env.R2_SECRET_ACCESS_KEY ||
    !env.R2_BUCKET_NAME
  ) {
    return null;
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY
    }
  });
}

export async function createSignedUploadUrl(
  key: string,
  contentType: string,
  expiresInSeconds = 300
): Promise<string | null> {
  const client = createR2Client();
  if (!client || !env.R2_BUCKET_NAME) return null;

  const command = new PutObjectCommand({
    Bucket: env.R2_BUCKET_NAME,
    Key: key,
    ContentType: contentType
  });

  return getSignedUrl(client, command, { expiresIn: expiresInSeconds });
}

export function getPublicUrl(key: string): string | null {
  if (!env.R2_PUBLIC_BASE_URL) return null;
  return `${env.R2_PUBLIC_BASE_URL.replace(/\/$/, "")}/${key}`;
}
