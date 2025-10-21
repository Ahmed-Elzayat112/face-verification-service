import { InferenceSession, Tensor } from "onnxruntime-node";
import sharp from "sharp";

let session: InferenceSession;

export async function initializeModel(): Promise<void> {
    const modelPath = "./models/arcface.onnx";
    session = await InferenceSession.create(modelPath);
}

export async function preprocessImage(imageBuffer: Buffer): Promise<Tensor> {
    const rawBuffer = await sharp(imageBuffer)
        .resize(112, 112)
        .removeAlpha()
        .raw()
        .toBuffer();

    const data = new Float32Array(rawBuffer.length);

    for (let i = 0; i < rawBuffer.length; i++) {
        data[i] = (rawBuffer[i] / 255.0 - 0.5) / 0.5;
    }

    const tensor = new Tensor("float32", data, [1, 112, 112, 3]);

    return tensor;
}

export async function getEmbedding(imageBuffer: Buffer): Promise<number[]> {
    const tensor = await preprocessImage(imageBuffer);
    const feeds = { input_1: tensor };

    const results = await session.run(feeds);
    const embedding = results.embedding.data as Float32Array;

    return Array.from(embedding);
}

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
    let dotProduct = 0.0;
    let normA = 0.0;
    let normB = 0.0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
