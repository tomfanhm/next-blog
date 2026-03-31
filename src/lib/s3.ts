import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { env } from "@/env";

const R2 = new S3Client({
  region: "auto",
  endpoint: env.R2_ENDPOINT,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
  },
});

const BUCKET = env.R2_BUCKET_NAME;
const PUBLIC_URL = env.R2_PUBLIC_URL;

/**
 * Upload a thumbnail image to Cloudflare R2.
 * Returns the public URL of the uploaded file.
 */
export async function uploadThumbnail(
  file: Buffer,
  filename: string,
  contentType: string,
): Promise<string> {
  const key = `thumbnails/${String(Date.now())}-${filename}`;

  await R2.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: file,
      ContentType: contentType,
    }),
  );

  return `${PUBLIC_URL}/${key}`;
}

/**
 * Delete a thumbnail from R2 by its full public URL.
 */
export async function deleteThumbnail(url: string): Promise<void> {
  const key = url.replace(`${PUBLIC_URL}/`, "");

  if (!key.startsWith("thumbnails/")) {
    throw new Error(`Invalid thumbnail key: ${key}`);
  }

  await R2.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    }),
  );
}
