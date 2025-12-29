import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

function getR2Client() {
    const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
    const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
    const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
    
    if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
        throw new Error('R2 credentials not configured');
    }
    
    return new S3Client({
        region: 'auto',
        endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
        credentials: {
            accessKeyId: R2_ACCESS_KEY_ID,
            secretAccessKey: R2_SECRET_ACCESS_KEY,
        },
    });
}

export async function uploadFileToR2(
    fileBuffer: Buffer,
    fileName: string,
    contentType: string
): Promise<string> {
    const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
    const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
    
    if (!R2_BUCKET_NAME || !R2_ACCOUNT_ID) {
        const errorMsg = 'R2 credentials missing. Please configure R2_BUCKET_NAME and R2_ACCOUNT_ID environment variables.';
        console.error(errorMsg);
        throw new Error(errorMsg);
    }

    try {
        const key = `${Date.now()}-${fileName}`;
        const R2 = getR2Client();

        await R2.send(
            new PutObjectCommand({
                Bucket: R2_BUCKET_NAME,
                Key: key,
                Body: fileBuffer,
                ContentType: contentType,
                // ACL: 'public-read', // R2 doesn't support ACLs the same way, usually managed via bucket settings or worker
            })
        );

        // Construct Public URL
        // Use R2_PUBLIC_DOMAIN if configured (e.g., https://pub-xxx.r2.dev)
        const publicDomain = process.env.R2_PUBLIC_DOMAIN;

        let finalUrl: string;
        if (publicDomain) {
            // Remove trailing slash if present
            const cleanDomain = publicDomain.replace(/\/$/, '');
            finalUrl = `${cleanDomain}/${key}`;
        } else {
            // Fallback: Try to construct R2.dev public URL
            // Format: https://pub-{account-id}.r2.dev/{key}
            // Note: This might not work if the bucket doesn't have a public R2.dev subdomain
            finalUrl = `https://pub-${R2_ACCOUNT_ID}.r2.dev/${key}`;
        }

        console.log('[R2] Uploaded file, key:', key, 'URL:', finalUrl);
        return finalUrl;
    } catch (error) {
        console.error('Error uploading to R2:', error);
        throw error; // Re-throw to let caller handle it
    }
}
