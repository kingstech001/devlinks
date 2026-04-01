"use client";

import {
  Plus,
  GripVertical,
  Trash2,
  Link as LinkIcon,
  ChevronDown,
  Check,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  FaFacebookSquare,
  FaGithubSquare,
  FaLinkedin,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import { FaInstagram, FaSquareXTwitter, FaTwitch } from "react-icons/fa6";
import { BiLogoDevTo } from "react-icons/bi";
import { IoLogoCodepen } from "react-icons/io";

import { trpc } from "@/utils/trpc";

const PLATFORMS = [
  { value: "portfolio", label: "Portfolio", bg: "#2D3748", text: "#ffffff", icon: null },
  { value: "project", label: "Project", bg: "#0F766E", text: "#ffffff", icon: null },
  { value: "website", label: "Website", bg: "#2563EB", text: "#ffffff", icon: null },
  { value: "github", label: "GitHub", bg: "#181717", text: "#ffffff", icon: <FaGithubSquare /> },
  { value: "youtube", label: "YouTube", bg: "#FF0000", text: "#ffffff", icon: <FaYoutube /> },
  { value: "linkedin", label: "LinkedIn", bg: "#0A66C2", text: "#ffffff", icon: <FaLinkedin /> },
  { value: "twitter", label: "Twitter / X", bg: "#000000", text: "#ffffff", icon: <FaSquareXTwitter /> },
  { value: "facebook", label: "Facebook", bg: "#1877F2", text: "#ffffff", icon: <FaFacebookSquare /> },
  { value: "instagram", label: "Instagram", bg: "#E4405F", text: "#ffffff", icon: <FaInstagram /> },
  { value: "tiktok", label: "TikTok", bg: "#010101", text: "#ffffff", icon: <FaTiktok /> },
  { value: "twitch", label: "Twitch", bg: "#9146FF", text: "#ffffff", icon: <FaTwitch /> },
  { value: "devto", label: "Dev.to", bg: "#0A0A0A", text: "#ffffff", icon: <BiLogoDevTo /> },
  { value: "codepen", label: "CodePen", bg: "#000000", text: "#ffffff", icon: <IoLogoCodepen /> },
  { value: "freecodecamp", label: "freeCodeCamp", bg: "#0A0A23", text: "#ffffff", icon: null },
  { value: "gitlab", label: "GitLab", bg: "#FC6D26", text: "#ffffff", icon: null },
  { value: "hashnode", label: "Hashnode", bg: "#2962FF", text: "#ffffff", icon: null },
  { value: "stackoverflow", label: "Stack Overflow", bg: "#F58025", text: "#ffffff", icon: null },
  { value: "frontendmentor", label: "Frontend Mentor", bg: "#3F54A3", text: "#ffffff", icon: null },
];

type LinkEntry = {
  id: string;
  platform: string;
  url: string;
};

const getPlaceholder = (platform: string) => {
  switch (platform) {
    case "portfolio":
      return "https://yourname.dev";
    case "project":
      return "https://yourproject.com";
    case "website":
      return "https://example.com";
    default:
      return `https://${platform}.com/username`;
  }
};

function PlatformDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = PLATFORMS.find((p) => p.value === value) ?? PLATFORMS[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 bg-background border rounded-lg px-4 py-3 text-sm text-foreground hover:border-[#633CFF] focus:outline-none focus:ring-2 focus:ring-[#633CFF] focus:border-transparent transition-all cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <span
            className="w-7 h-7 rounded-md flex items-center justify-center text-base flex-shrink-0"
            style={{ backgroundColor: selected.bg, color: selected.text }}
          >
            {selected.icon ?? (
              <span className="text-[10px] font-bold text-white">
                {selected.label.slice(0, 2).toUpperCase()}
              </span>
            )}
          </span>
          <span className="font-medium">{selected.label}</span>
        </div>
        <ChevronDown
          size={16}
          className="text-muted-foreground transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full bg-primary-foreground border rounded-xl shadow-lg overflow-hidden">
          <div className=" overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {PLATFORMS.map((platform) => {
              const isSelected = platform.value === value;
              return (
                <button
                  key={platform.value}
                  type="button"
                  onClick={() => {
                    onChange(platform.value);
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors text-left"
                >
                  <span
                    className="w-7 h-7 rounded-md flex items-center justify-center text-base flex-shrink-0"
                    style={{ backgroundColor: platform.bg, color: platform.text }}
                  >
                    {platform.icon ?? (
                      <span className="text-[10px] font-bold text-white">
                        {platform.label.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                  </span>
                  <span
                    className={`flex-1 font-medium ${
                      isSelected ? "text-[#633CFF]" : "text-foreground"
                    }`}
                  >
                    {platform.label}
                  </span>
                  {isSelected && (
                    <Check size={14} className="text-[#633CFF] flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function LinksPageClient() {
  const [mounted, setMounted] = useState(false);
  const [links, setLinks] = useState<LinkEntry[]>([]);
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();
  const utils = trpc.useUtils();
  const { data: savedLinks, isLoading } = trpc.getLinks.useQuery();

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("devlinks-draft");
      if (stored) setLinks(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("devlinks-draft", JSON.stringify(links));
  }, [links, mounted]);

  useEffect(() => {
    if (savedLinks && !initialized) {
      const draft = localStorage.getItem("devlinks-draft");
      const parsedDraft: LinkEntry[] = draft ? JSON.parse(draft) : [];
      if (parsedDraft.length === 0) {
        setLinks(
          savedLinks.map((link) => ({
            id: String(link.id),
            platform: link.title,
            url: link.url,
          })),
        );
      }
      setInitialized(true);
    }
  }, [savedLinks, initialized]);

  const addLinkMutation = trpc.addLink.useMutation({
    onSuccess: () => {
      utils.getLinks.invalidate();
      localStorage.removeItem("devlinks-draft");
      toast.success("Links saved successfully!");
      router.push("/profile");
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteLinkMutation = trpc.deleteLink.useMutation({
    onSuccess: () => utils.getLinks.invalidate(),
    onError: (error) => toast.error(error.message),
  });

  const addLink = () => {
    setLinks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), platform: "github", url: "" },
    ]);
  };

  const removeLink = (id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id));
    const numericId = Number(id);
    if (!isNaN(numericId)) {
      deleteLinkMutation.mutate({ id: numericId });
    }
  };

  const updateLink = (
    id: string,
    field: keyof Omit<LinkEntry, "id">,
    value: string,
  ) => {
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)),
    );
  };

  const getPlatform = (value: string) =>
    PLATFORMS.find((p) => p.value === value) ?? PLATFORMS[0];

  const hasLinks = links.length > 0;

  const handleSave = async () => {
    const hasEmptyUrls = links.some((link) => !link.url.trim());
    if (hasEmptyUrls) {
      toast.error("Please fill in all link URLs before saving.");
      return;
    }
    const newLinks = links.filter((link) => isNaN(Number(link.id)));
    if (newLinks.length === 0) {
      toast.info("No new links to save.");
      return;
    }
    await Promise.all(
      newLinks.map((link) =>
        addLinkMutation.mutateAsync({ title: link.platform, url: link.url }),
      ),
    );
  };

  return <section className="flex flex-col sm:flex-row w-full sm:justify-between gap-6 p-4 lg:p-6 bg-background"><div className="hidden flex-1 lg:flex items-center justify-center bg-card rounded-xl border p-[24px]"><div className="relative w-[307px] h-[631px]"><Image src="/Rectangle1.png" alt="phone frame" fill className="object-contain" priority /><div className="absolute inset-0 flex items-center justify-center pointer-events-none"><Image src="/Subtract.png" alt="screen mask" width={280} height={611} className="object-contain" priority /></div><div className="absolute inset-0 flex flex-col items-center pt-24 px-8 space-y-14"><div className="w-full flex flex-col items-center"><div className="w-24 h-24 rounded-full bg-muted animate-pulse mb-4" /><div className="h-2 rounded bg-muted w-3/4 mb-2 animate-pulse" /><div className="h-2 rounded bg-muted w-1/2 animate-pulse" /></div><div className="w-full overflow-y-auto max-h-[280px] space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">{isLoading ? Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 rounded bg-muted animate-pulse" />) : hasLinks ? links.map((link) => { const platform = getPlatform(link.platform); return <div key={link.id} className="h-12 rounded-lg flex items-center justify-between px-4 transition-colors flex-shrink-0" style={{ backgroundColor: platform.bg }}><div className="flex items-center gap-2">{platform.icon && <span className="text-base flex-shrink-0" style={{ color: platform.text }}>{platform.icon}</span>}<span className="text-xs font-medium truncate" style={{ color: platform.text }}>{platform.label}</span></div><svg className="w-3 h-3 flex-shrink-0" style={{ color: platform.text }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></div>; }) : Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 rounded bg-muted animate-pulse" />)}</div></div></div></div><div className="flex-1 bg-card rounded-xl border p-6 lg:p-8 flex flex-col"><div className="h-[90vh] overflow-auto overflow-y-scroll space-y-[40px]"><div><h2 className="text-2xl md:text-3xl font-bold text-foreground">Customize your links</h2><p className="text-muted-foreground mt-2 text-[16px]">Add/edit/remove links below and then share all your profiles with the world!</p></div><div className="flex flex-col gap-6 flex-1"><button onClick={addLink} className="flex items-center gap-2 border border-[#633CFF] text-[#633CFF] rounded-[8px] w-full justify-center py-[11px] font-semibold hover:bg-[#EFEBFF] transition-colors cursor-pointer"><Plus size={18} /><span>Add new link</span></button>{isLoading && <div className="flex flex-col gap-5">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="rounded-xl border p-5 h-[160px] bg-muted animate-pulse" />)}</div>}{!isLoading && !hasLinks && <div className="flex flex-col items-center justify-center py-15 px-5 bg-card rounded-xl border space-y-10"><div className="hidden lg:block"><Image src="/addlink.png" alt="add link image" width={249} height={160} /></div><div className="lg:hidden"><Image src="/addlink.png" alt="add link image" width={124} height={80} /></div><div className="space-y-6"><h2 className="text-2xl lg:text-[32px] font-bold text-center">Let's get you started</h2><p className="text-[16px] font-normal text-center text-[#737373]">Use the "Add new link" button to get started. Once you have more than one link, you can reorder and edit them. We're here to help you share your profiles with everyone!</p></div></div>}{!isLoading && hasLinks && <div className="flex flex-col gap-5">{links.map((link, index) => { const platform = getPlatform(link.platform); const isSaved = !isNaN(Number(link.id)); return <div key={link.id} className="rounded-xl border p-5 space-y-4 transition-colors" style={{ backgroundColor: `${platform.bg}18` }}><div className="flex items-center justify-between"><div className="flex items-center gap-2 font-semibold" style={{ color: platform.bg }}><GripVertical size={18} className="cursor-grab opacity-60" /><span className="text-muted-foreground text-sm font-normal">Link #{index + 1}</span>{isSaved && <span className="text-xs text-green-500 font-normal">saved</span>}</div><button onClick={() => removeLink(link.id)} className="text-muted-foreground transition-colors hover:text-red-500"><Trash2 size={16} /></button></div><div className="space-y-1"><label className="text-sm font-medium text-foreground">Platform</label><PlatformDropdown value={link.platform} onChange={(val) => updateLink(link.id, "platform", val)} /></div><div className="space-y-1"><label className="text-sm font-medium text-foreground">Link</label><div className="relative"><LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: platform.bg }} /><input type="url" value={link.url} onChange={(e) => updateLink(link.id, "url", e.target.value)} placeholder={getPlaceholder(link.platform)} className="w-full bg-background border rounded-lg pl-9 pr-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#633CFF] transition-shadow duration-200" style={{ "--tw-ring-color": platform.bg, boxShadow: undefined } as React.CSSProperties} onFocus={(e) => { e.currentTarget.style.boxShadow = `0 0 0 4px ${platform.bg}26`; }} onBlur={(e) => { e.currentTarget.style.boxShadow = ""; }} /></div></div></div>; })}</div>}</div></div>{mounted && hasLinks && <div className="flex justify-end mt-4 pt-4 border-t"><button onClick={handleSave} disabled={addLinkMutation.isPending} className="bg-[#633CFF] hover:bg-[#4e2fe0] text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">{addLinkMutation.isPending ? "Saving..." : "Save"}</button></div>}</div></section>;
}
