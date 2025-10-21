import { FaceVerificationService } from '../src/services/faceVerificationService';

describe('FaceVerificationService', () => {
    let faceVerificationService: FaceVerificationService;

    beforeEach(() => {
        faceVerificationService = new FaceVerificationService();
    });

    it('should verify a face successfully', async () => {
        const result = await faceVerificationService.verifyFace('image1.jpg', 'image2.jpg');
        expect(result).toBe(true);
    });

    it('should fail to verify a face with different images', async () => {
        const result = await faceVerificationService.verifyFace('image1.jpg', 'image3.jpg');
        expect(result).toBe(false);
    });

    it('should handle errors during face verification', async () => {
        jest.spyOn(faceVerificationService, 'verifyFace').mockImplementationOnce(() => {
            throw new Error('Verification error');
        });

        await expect(faceVerificationService.verifyFace('image1.jpg', 'image2.jpg')).rejects.toThrow('Verification error');
    });
});