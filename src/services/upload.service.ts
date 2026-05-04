import { uploadRepository } from "@/repositories/upload.repository";

function Session_Id_Stamp() {
    return Math.random().toString(36).substring(2, 9);
}

export const uploadService = {
    uploadAnimalImage: async (file: File) => {
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const ext = file.name.split('.').pop() || "jpg";
        const filename = `${Session_Id_Stamp()}-${Date.now()}.${ext}`;

        return await uploadRepository.uploadFile(filename, buffer, file.type || "image/jpeg");
    }
};
