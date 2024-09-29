import React, { useEffect } from "react";

interface CustomImageProps {
  src: string | undefined;
  alt?: string;
  className?: string;
}
export const CustomUserImage: React.FC<CustomImageProps> = ({ src, alt = "image", className = "" }) => {
  const [sourceName, setSourceName] = React.useState<string>("")

  useEffect(() => {
    setSourceName(getSourceName(src))
  }, [src])

  const getSourceName = (src: string | undefined) => {
    if (!src) return "/user.jpg"

    if (src.includes("google") || src.includes("github") || src.startsWith("blob")) {
      return src
    }

    return `${process.env.NEXT_PUBLIC_AWS_S3_IMAGE_HOST_URI}/users/${src}`

  }

  return <img src={sourceName} alt={alt} className={className} />;
};