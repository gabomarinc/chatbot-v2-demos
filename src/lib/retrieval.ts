import { prisma } from './prisma';

export interface DocumentChunk {
  id: string;
  content: string;
  embedding: number[];
}

/**
 * Simple cosine similarity calculation
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Retrieve relevant chunks for a query using vector similarity
 * This is a simplified version. In production, use pgvector or a dedicated vector DB.
 */
export async function retrieveRelevantChunks(
  agentId: string,
  query: string,
  limit: number = 5
): Promise<DocumentChunk[]> {
  // Get all ready knowledge sources for this agent
  const knowledgeBases = await prisma.knowledgeBase.findMany({
    where: {
      agentId,
      sources: {
        some: {
          status: 'READY' as const,
        },
      },
    },
    include: {
      sources: {
        where: { status: 'READY' as const },
        include: {
          chunks: true,
        },
      },
    },
  });

  // Collect all chunks
  const allChunks: DocumentChunk[] = [];
  for (const kb of knowledgeBases) {
    for (const source of kb.sources) {
      for (const chunk of source.chunks) {
        const embedding = chunk.embedding as number[];
        allChunks.push({
          id: chunk.id,
          content: chunk.content,
          embedding,
        });
      }
    }
  }

  if (allChunks.length === 0) {
    return [];
  }

  // For now, we'll do a simple text-based search
  // In production, you'd generate an embedding for the query and use vector similarity
  const queryLower = query.toLowerCase();
  const scoredChunks = allChunks.map((chunk) => {
    const contentLower = chunk.content.toLowerCase();
    let score = 0;
    
    // Simple keyword matching
    const queryWords = queryLower.split(/\s+/);
    queryWords.forEach((word) => {
      if (contentLower.includes(word)) {
        score += 1;
      }
    });
    
    // Boost score if exact phrase matches
    if (contentLower.includes(queryLower)) {
      score += 5;
    }
    
    return { chunk, score };
  });

  // Sort by score and return top results
  scoredChunks.sort((a, b) => b.score - a.score);
  
  return scoredChunks
    .filter((item) => item.score > 0)
    .slice(0, limit)
    .map((item) => item.chunk);
}

/**
 * Generate embedding for text (stub - in production use OpenAI embeddings API)
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  // TODO: Implement using OpenAI embeddings API
  // For now, return a dummy embedding
  return new Array(1536).fill(0).map(() => Math.random());
}

/**
 * Ingest text content into knowledge base
 */
export async function ingestText(
  agentId: string,
  text: string,
  knowledgeBaseName: string = 'Default'
): Promise<string> {
  // Find or create knowledge base
  let kb = await prisma.knowledgeBase.findFirst({
    where: {
      agentId,
      name: knowledgeBaseName,
    },
  });

  if (!kb) {
    kb = await prisma.knowledgeBase.create({
      data: {
        agentId,
        name: knowledgeBaseName,
      },
    });
  }

  // Create knowledge source
  const source = await prisma.knowledgeSource.create({
    data: {
      knowledgeBaseId: kb.id,
      type: 'TEXT',
      status: 'PROCESSING' as const,
    },
  });

  // Split text into chunks (simple approach - in production use better chunking)
  const chunkSize = 500;
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }

  // Process chunks
  for (const chunkText of chunks) {
    const embedding = await generateEmbedding(chunkText);
    
    await prisma.documentChunk.create({
      data: {
        knowledgeSourceId: source.id,
        content: chunkText,
        embedding,
      },
    });
  }

  // Update source status
  await prisma.knowledgeSource.update({
    where: { id: source.id },
    data: { status: 'READY' },
  });

  return source.id;
}

/**
 * Ingest website content
 */
export async function ingestWebsite(
  agentId: string,
  url: string,
  crawlSubpages: boolean = false,
  updateInterval: string = 'NEVER'
): Promise<string> {
  // Find or create knowledge base
  let kb = await prisma.knowledgeBase.findFirst({
    where: {
      agentId,
      name: 'Website',
    },
  });

  if (!kb) {
    kb = await prisma.knowledgeBase.create({
      data: {
        agentId,
        name: 'Website',
      },
    });
  }

  // Create knowledge source
  const source = await prisma.knowledgeSource.create({
    data: {
      knowledgeBaseId: kb.id,
      type: 'WEBSITE',
      url,
      status: 'PROCESSING' as const,
      crawlSubpages,
      updateInterval: updateInterval as any,
    },
  });

  // TODO: Implement actual website crawling and content extraction
  // For now, we'll mark it as processing
  // In production, use a queue system to process this asynchronously
  
  return source.id;
}

/**
 * Ingest document file
 */
export async function ingestDocument(
  agentId: string,
  fileUrl: string,
  fileName: string
): Promise<string> {
  // Find or create knowledge base
  let kb = await prisma.knowledgeBase.findFirst({
    where: {
      agentId,
      name: 'Documents',
    },
  });

  if (!kb) {
    kb = await prisma.knowledgeBase.create({
      data: {
        agentId,
        name: 'Documents',
      },
    });
  }

  // Create knowledge source
  const source = await prisma.knowledgeSource.create({
    data: {
      knowledgeBaseId: kb.id,
      type: 'DOCUMENT',
      fileUrl,
      status: 'PROCESSING' as const,
    },
  });

  // TODO: Implement actual document parsing (PDF, DOCX, etc.)
  // For now, we'll mark it as processing
  // In production, use a queue system to process this asynchronously
  
  return source.id;
}

