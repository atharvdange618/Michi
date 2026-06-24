import { useEffect } from "react";

const SITE_URL = "https://michi.atharvdangedev.in";
const SITE_NAME = "Michi";
const DEFAULT_DESCRIPTION =
  "Michi is a client-side router for React, built from first principles. No library abstractions - just the History API, regex pattern matching, and React primitives. Learn how routers actually work.";

export function useSEO({
  title,
  description = DEFAULT_DESCRIPTION,
  path,
}: {
  title: string;
  description?: string;
  path: string;
}) {
  useEffect(() => {
    const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
    document.title = fullTitle;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", fullTitle);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", description);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("content", `${SITE_URL}${path}`);

    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute("content", fullTitle);

    const twitterDesc = document.querySelector('meta[name="twitter:description"]');
    if (twitterDesc) twitterDesc.setAttribute("content", description);

    const canonical = document.querySelector("link[rel='canonical']");
    if (canonical) canonical.setAttribute("href", `${SITE_URL}${path}`);
  }, [title, description, path]);
}
