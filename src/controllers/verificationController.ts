import { Request, Response } from "express";
import { User } from "../models/user";
import { getEmbedding, cosineSimilarity } from "../services/faceApiService";

interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

export async function encode(
    req: MulterRequest,
    res: Response
): Promise<Response> {
    if (!req.file) {
        return res
            .status(400)
            .json({ success: false, error: "No image file provided." });
    }

    try {
        const embedding = await getEmbedding(req.file.buffer);
        const newUser = await User.create({ embedding });

        return res.status(200).json({
            success: true,
            embedding: newUser.embedding,
            userId: newUser.id,
        });
    } catch (error) {
        console.error("Error in /encode:", error);
        return res
            .status(500)
            .json({ success: false, error: "Failed to process image." });
    }
}

export async function compare(
    req: MulterRequest,
    res: Response
): Promise<Response> {
    if (!req.file) {
        return res
            .status(400)
            .json({ success: false, error: "No image file provided." });
    }

    const { storedEmbedding } = req.body;
    if (!storedEmbedding) {
        return res
            .status(400)
            .json({ success: false, error: "No stored embedding provided." });
    }

    try {
        const newEmbedding = await getEmbedding(req.file.buffer);
        const parsedStoredEmbedding: number[] = JSON.parse(storedEmbedding);

        const similarity = cosineSimilarity(
            newEmbedding,
            parsedStoredEmbedding
        );
        const isMatch = similarity > 0.6; // Your threshold

        return res.status(200).json({
            success: true,
            isMatch,
            similarity,
        });
    } catch (error) {
        console.error("Error in /compare:", error);
        if (error instanceof SyntaxError) {
            return res.status(400).json({
                success: false,
                error: "Invalid storedEmbedding format. It must be a JSON string.",
            });
        }
        return res
            .status(500)
            .json({ success: false, error: "Failed to compare faces." });
    }
}
