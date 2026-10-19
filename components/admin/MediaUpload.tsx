"use client";
// Upload box for images or videos. No URL fields: you pick a real file from your device.
// Shows a preview and a progress bar. Saves the file path into a hidden form field.
import { useRef, useState } from "react";
import { discardUploads } from "@/app/admin/actions";
import { mediaUrl } from "@/lib/media";
import { IMAGE_TYPES, MAX_VIDEO_MB, VIDEO_TYPES, compressImage, uploadFile, videoThumbnail } from "@/lib/upload";

type Props = {
  name: string; // hidden input name, e.g. "media_path"
  kind: "image" | "video";
  folder: string; // storage folder, e.g. the section slug
  initialPath?: string | null;
  initialThumb?: string | null;
  required?: boolean;
  onBusyChange?: (busy: boolean) => void;
};

export function MediaUpload({ name, kind, folder, initialPath, initialThumb, required, onBusyChange }: Props) {
  const [path, setPath] = useState(initialPath ?? "");
  const [thumb, setThumb] = useState(initialThumb ?? "");
  const [progress, setProgress] = useState<number | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);
  const thumbInput = useRef<HTMLInputElement>(null);
  // Files uploaded in this form but not saved yet (deleted if replaced).
  const fresh = useRef<Set<string>>(new Set());

  function busy(on: boolean) {
    onBusyChange?.(on);
    if (!on) setProgress(null);
  }

  function dropIfFresh(oldPath: string) {
    if (oldPath && fresh.current.has(oldPath)) {
      fresh.current.delete(oldPath);
      discardUploads([oldPath]).catch(() => {});
    }
  }

  async function onPick(file: File | undefined) {
    if (!file) return;
    setError("");
    const allowed = kind === "image" ? IMAGE_TYPES : VIDEO_TYPES;
    if (!allowed.includes(file.type)) {
      setError(kind === "image" ? "Please pick a JPG, PNG, WebP or GIF image." : "Please pick an MP4 or WebM video.");
      return;
    }
    if (kind === "video" && file.size > MAX_VIDEO_MB * 1024 * 1024) {
      setError(`This video is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is ${MAX_VIDEO_MB} MB.`);
      return;
    }

    busy(true);
    try {
      setProgress(0);
      let blob: Blob = file;
      if (kind === "image") {
        setStatus("Shrinking image…");
        blob = await compressImage(file);
      }
      setStatus("Uploading…");
      const newPath = await uploadFile(blob, folder, setProgress);
      dropIfFresh(path);
      fresh.current.add(newPath);
      setPath(newPath);

      if (kind === "video") {
        setStatus("Making thumbnail…");
        const still = await videoThumbnail(file);
        if (still) {
          const thumbPath = await uploadFile(still, folder);
          dropIfFresh(thumb);
          fresh.current.add(thumbPath);
          setThumb(thumbPath);
        }
      }
      setStatus("Uploaded. Don't forget to press Save.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
      setStatus("");
    } finally {
      busy(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  async function onPickThumb(file: File | undefined) {
    if (!file) return;
    if (!IMAGE_TYPES.includes(file.type)) return setError("Thumbnail must be an image.");
    busy(true);
    try {
      setProgress(0);
      const newPath = await uploadFile(await compressImage(file), folder, setProgress);
      dropIfFresh(thumb);
      fresh.current.add(newPath);
      setThumb(newPath);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      busy(false);
      if (thumbInput.current) thumbInput.current.value = "";
    }
  }

  const url = mediaUrl(path);
  const thumbUrl = mediaUrl(thumb);

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={path} />
      {kind === "video" && <input type="hidden" name="thumb_path" value={thumb} />}

      {url ? (
        kind === "image" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="preview" className="max-h-56 border border-line object-contain" />
        ) : (
          <video src={url} poster={thumbUrl ?? undefined} controls muted playsInline className="max-h-56 border border-line" />
        )
      ) : (
        <div className="flex h-28 items-center justify-center border border-dashed border-line text-sm text-muted">
          No {kind} yet
        </div>
      )}

      {progress !== null && (
        <div className="h-1.5 w-full bg-line" aria-label="Upload progress">
          <div className="h-full bg-accent transition-[width] duration-150" style={{ width: `${Math.round(progress * 100)}%` }} />
        </div>
      )}
      {status && <p className="text-xs text-muted">{status}{progress !== null && ` ${Math.round(progress * 100)}%`}</p>}
      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex flex-wrap gap-2">
        <label className="cursor-pointer border border-line px-3 py-2 text-sm hover:border-fg">
          {url ? `Replace ${kind}` : `Upload ${kind}`}
          <input
            ref={fileInput}
            type="file"
            accept={(kind === "image" ? IMAGE_TYPES : VIDEO_TYPES).join(",")}
            className="sr-only"
            required={required && !path}
            onChange={(e) => onPick(e.target.files?.[0])}
          />
        </label>
        {kind === "video" && url && (
          <label className="cursor-pointer border border-line px-3 py-2 text-sm hover:border-fg">
            {thumbUrl ? "Replace thumbnail" : "Upload thumbnail"}
            <input ref={thumbInput} type="file" accept={IMAGE_TYPES.join(",")} className="sr-only" onChange={(e) => onPickThumb(e.target.files?.[0])} />
          </label>
        )}
        {url && !required && (
          <button
            type="button"
            className="px-3 py-2 text-sm text-muted hover:text-fg"
            onClick={() => {
              dropIfFresh(path);
              setPath("");
            }}
          >
            Remove
          </button>
        )}
      </div>
      {kind === "video" && (
        <p className="text-xs text-muted">MP4 or WebM, up to {MAX_VIDEO_MB} MB. A thumbnail is made automatically.</p>
      )}
      {kind === "image" && <p className="text-xs text-muted">JPG, PNG, WebP or GIF. Big photos are shrunk before upload.</p>}
    </div>
  );
}
