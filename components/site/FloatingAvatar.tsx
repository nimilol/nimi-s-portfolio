"use client";
// Your profile photo in a small circle, bottom-right. Appears after you scroll past the top.
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

export function FloatingAvatar({ photo, href, name }: { photo: string; href: string; name: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.5);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel="noopener noreferrer"
      aria-label={`${name} on X`}
      className="fixed bottom-5 right-5 z-30 block h-14 w-14 overflow-hidden rounded-full border-2 border-line shadow-[0_10px_30px_-10px_rgba(0,0,0,0.9)] md:bottom-8 md:right-8 md:h-16 md:w-16"
      initial={false}
      animate={{ opacity: show ? 1 : 0, scale: show ? 1 : 0.6, pointerEvents: show ? "auto" : "none" }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    >
      <Image src={photo} alt="" fill sizes="64px" className="object-cover" />
    </motion.a>
  );
}
