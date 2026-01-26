"use client";
import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function CardQRCode() {
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUrl(window.location.href);
    }
  }, []);

  if (!url) return null;

  return (
    <div className="flex justify-center">
      <QRCodeSVG value={url} size={128} />
    </div>
  );
}
