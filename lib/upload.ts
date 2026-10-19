"use client";
// Browser-side upload helpers for the admin panel.
// Files go straight from your device to Supabase Storage (not through Vercel),
// so big videos work and we can show a progress bar.
import { createClient } from "./supabase/client";
import { MEDIA_BUCKET, SUPABASE_KEY, SUPABASE_URL } from "./supabase/env";

export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const VIDEO_TYPES = ["video/mp4", "video/webm"];
export const MAX_VIDEO_MB = 50; // Supabase free plan limit. See docs/SETUP.md to raise it.
const MAX_IMAGE_SIDE = 1600; // pixels

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
}

// Shrinks a photo to max 1600px and saves it as WebP. GIFs are left alone (keeps animation).
export async function compressImage(file: File): Promise<Blob> {
  if (file.type === "image/gif") return file;
  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) return file;

  const scale = Math.min(1, MAX_IMAGE_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  let blob = await canvasToBlob(canvas, "image/webp", 0.82);
  // Older Safari can't make WebP: fall back to PNG (keeps transparency) or JPEG.
  if (!blob || blob.type !== "image/webp") {
    blob = await canvasToBlob(canvas, file.type === "image/png" ? "image/png" : "image/jpeg", 0.85);
  }
  if (!blob) return file;
  return blob.size < file.size ? blob : file;
}

// Grabs a still frame (around the 1-second mark) from a video to use as its thumbnail.
export function videoThumbnail(file: File): Promise<Blob | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    let done = false;
    const finish = (blob: Blob | null) => {
      if (done) return;
      done = true;
      URL.revokeObjectURL(url);
      resolve(blob);
    };
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.src = url;
    video.onloadeddata = () => {
      video.currentTime = Math.min(1, (video.duration || 2) / 2);
    };
    video.onseeked = async () => {
      const scale = Math.min(1, 900 / Math.max(video.videoWidth, video.videoHeight, 1));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(video.videoWidth * scale);
      canvas.height = Math.round(video.videoHeight * scale);
      canvas.getContext("2d")?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const blob = (await canvasToBlob(canvas, "image/webp", 0.8)) ?? (await canvasToBlob(canvas, "image/jpeg", 0.8));
      finish(blob);
    };
    video.onerror = () => finish(null);
    setTimeout(() => finish(null), 10000);
  });
}

function extensionFor(type: string) {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
    "video/mp4": "mp4",
    "video/webm": "webm",
  };
  return map[type] ?? "bin";
}

// Uploads a file to Supabase Storage and reports progress (0 to 1). Returns the saved file path.
export async function uploadFile(blob: Blob, folder: string, onProgress?: (p: number) => void): Promise<string> {
  const supabase = createClient();
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error("Your login expired. Please log in again.");

  const safeFolder = folder.replace(/[^a-z0-9-]/gi, "") || "misc";
  const path = `${safeFolder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extensionFor(blob.type)}`;

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${SUPABASE_URL}/storage/v1/object/${MEDIA_BUCKET}/${path}`);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.setRequestHeader("apikey", SUPABASE_KEY);
    xhr.setRequestHeader("Content-Type", blob.type);
    xhr.setRequestHeader("x-upsert", "false");
    xhr.setRequestHeader("cache-control", "max-age=31536000");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(e.loaded / e.total);
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) return resolve();
      let message = `Upload failed (${xhr.status}).`;
      try {
        const body = JSON.parse(xhr.responseText);
        message = body.message || body.error || message;
      } catch {}
      if (xhr.status === 413) message = `File is too big. The limit is ${MAX_VIDEO_MB} MB.`;
      reject(new Error(message));
    };
    xhr.onerror = () => reject(new Error("Network error while uploading. Check your connection."));
    xhr.send(blob);
  });

  onProgress?.(1);
  return path;
}
