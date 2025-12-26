import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

// Initialize S3 Client for Cloudflare R2
const R2 = new S3Client({
    region: 'auto',
    endpoint: `https://${R2_ACCOUNT_ID}.eu.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID || '',
        secretAccessKey: R2_SECRET_ACCESS_KEY || '',
    },
});

export async function uploadFileToR2(
    fileBuffer: Buffer,
    fileName: string,
    contentType: string
): Promise<string> {
    if (!R2_BUCKET_NAME || !R2_ACCOUNT_ID) {
        console.error('R2 credentials missing');
        return '';
    }

    try {
        const key = `${Date.now()}-${fileName}`;

        await R2.send(
            new PutObjectCommand({
                Bucket: R2_BUCKET_NAME,
                Key: key,
                Body: fileBuffer,
                ContentType: contentType,
                // ACL: 'public-read', // R2 doesn't support ACLs the same way, usually managed via bucket settings or worker
            })
        );

        // Construct Public URL (Assuming a custom domain or worker is setup, otherwise use standard R2 dev URL if public)
        // For now, we'll try to use the public bucket URL if configured, or just the R2 path
        // Ideally, the user sets up a custom domain like assets.mydomain.com pointing to the bucket
        // Or we use the R2.dev subdomain if allowed.

        // Let's assume a public access domain env var, or fallback to R2 standard
        const publicDomain = process.env.R2_PUBLIC_DOMAIN;

        if (publicDomain) {
            return `${publicDomain}/${key}`;
        }

        // Fallback: If no public domain, we might need pre-signed URLs or assume standard structure
        return `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${R2_BUCKET_NAME}/${key}`;
    } catch (error) {
        console.error('Error uploading to R2:', error);
        return '';
    }
}
