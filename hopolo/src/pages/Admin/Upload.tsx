import { requireRole } from "../../lib/auth.server";
import { uploadFile } from "../../services/storageService.server";

export async function action({ request }: { request: Request }) {
  await requireRole(request, ['admin']);
  const formData = await request.formData();
  const files = formData.getAll("images") as File[];

  if (!files || files.length === 0) {
    return { success: false, error: "No files provided" };
  }

  try {
    const uploadPromises = files.map(file => uploadFile(file));
    const urls = await Promise.all(uploadPromises);
    return { success: true, urls };
  } catch (error: any) {
    console.error("[Upload Action] Error:", error);
    return { success: false, error: error.message };
  }
}

export default function UploadRoute() {
  return null; // Resource route only
}
