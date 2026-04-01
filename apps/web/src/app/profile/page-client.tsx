"use client";

import Image from "next/image";
import React, { useRef, useState } from "react";
import { ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { trpc } from "@/utils/trpc";

const PLATFORMS = [
  { value: "github", label: "GitHub", bg: "#181717", text: "#ffffff" },
  { value: "youtube", label: "YouTube", bg: "#FF0000", text: "#ffffff" },
  { value: "linkedin", label: "LinkedIn", bg: "#0A66C2", text: "#ffffff" },
  { value: "twitter", label: "Twitter / X", bg: "#000000", text: "#ffffff" },
  { value: "facebook", label: "Facebook", bg: "#1877F2", text: "#ffffff" },
  { value: "instagram", label: "Instagram", bg: "#E4405F", text: "#ffffff" },
  { value: "tiktok", label: "TikTok", bg: "#010101", text: "#ffffff" },
  { value: "twitch", label: "Twitch", bg: "#9146FF", text: "#ffffff" },
  { value: "devto", label: "Dev.to", bg: "#0A0A0A", text: "#ffffff" },
  { value: "codepen", label: "CodePen", bg: "#000000", text: "#ffffff" },
  { value: "freecodecamp", label: "freeCodeCamp", bg: "#0A0A23", text: "#ffffff" },
  { value: "gitlab", label: "GitLab", bg: "#FC6D26", text: "#ffffff" },
  { value: "hashnode", label: "Hashnode", bg: "#2962FF", text: "#ffffff" },
  { value: "stackoverflow", label: "Stack Overflow", bg: "#F58025", text: "#ffffff" },
  { value: "frontendmentor", label: "Frontend Mentor", bg: "#3F54A3", text: "#ffffff" },
];

const getPlatform = (value: string) =>
  PLATFORMS.find((p) => p.value === value) ?? {
    label: value,
    bg: "#333333",
    text: "#ffffff",
  };

export default function ProfilePageClient() {
  const { data: links, isLoading: linksLoading } = trpc.getLinks.useQuery();
  const { data: profile, isLoading: profileLoading } = trpc.getProfile.useQuery();
  const hasLinks = links && links.length > 0;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  React.useEffect(() => {
    if (profile) {
      setFirstName(profile.firstName || "");
      setLastName(profile.lastName || "");
      setEmail(profile.email || "");
      setAvatarUrl(profile.image || null);
    }
  }, [profile]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  const upsertProfile = trpc.upsertProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile saved!");
      router.push("/preview");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to save profile");
    },
  });

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("First name and last name are required.");
      return;
    }

    await upsertProfile.mutateAsync({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      image: avatarUrl ?? undefined,
    });
  };

  return (
    <section className="flex flex-col sm:flex-row w-full sm:justify-between gap-6 p-4 lg:p-6 bg-background">
      <div className="hidden flex-1 lg:flex items-center justify-center bg-card rounded-xl border p-[24px]">
        <div className="relative w-[307px] h-[631px]">
          <Image src="/Rectangle1.png" alt="phone frame" fill className="object-contain" priority />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Image src="/Subtract.png" alt="screen mask" width={288} height={611} className="object-contain" priority />
          </div>
          <div className="absolute inset-0 flex flex-col items-center pt-24 px-8 space-y-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex items-center justify-center mb-2 ring-2 ring-[#633CFF] ring-offset-2">
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-muted animate-pulse" />
              )}
            </div>
            {firstName || lastName ? (
              <p className="text-sm font-semibold text-muted-foreground text-center leading-tight">
                {firstName} {lastName}
              </p>
            ) : (
              <div className="h-2 bg-muted rounded w-3/4 animate-pulse" />
            )}
            {email ? (
              <p className="text-xs text-muted-foreground text-center">{email}</p>
            ) : (
              <div className="h-2 bg-muted rounded w-1/2 animate-pulse" />
            )}
            <div className="w-full overflow-y-auto max-h-[280px] space-y-3 mt-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {linksLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-12 rounded bg-muted animate-pulse" />
                  ))
                : hasLinks
                  ? links.map((link) => {
                      const platform = getPlatform(link.title);
                      return (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="h-12 rounded-lg flex items-center justify-between px-4 transition-opacity hover:opacity-80"
                          style={{ backgroundColor: platform.bg }}
                        >
                          <span className="text-xs font-medium truncate" style={{ color: platform.text }}>
                            {platform.label}
                          </span>
                          <svg className="w-3 h-3 shrink-0" style={{ color: platform.text }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </a>
                      );
                    })
                  : Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="h-12 rounded bg-muted animate-pulse" />
                    ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-card rounded-xl border p-6 lg:p-8 flex flex-col gap-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Profile Details</h2>
          <p className="text-muted-foreground mt-2 text-[16px]">
            Add your details to create a personal touch to your profile.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 bg-muted/40 rounded-xl p-5">
          <span className="text-sm text-muted-foreground sm:w-48 shrink-0">Profile picture</span>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-[193px] h-[193px] rounded-xl bg-[#EFEBFF] flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-[#e0d9ff] transition-colors relative overflow-hidden shrink-0"
            >
              {avatarUrl ? (
                <>
                  <img src={avatarUrl} alt="avatar preview" className="w-full h-full object-cover absolute inset-0" />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-1">
                    <ImageIcon size={24} className="text-white" />
                    <span className="text-white text-sm font-semibold">Change Image</span>
                  </div>
                </>
              ) : (
                <>
                  <ImageIcon size={24} className="text-[#633CFF]" />
                  <span className="text-[#633CFF] text-sm font-semibold">+ Upload Image</span>
                </>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg"
              className="hidden"
              onChange={handleImageChange}
            />
            <p className="text-center sm:text-left text-xs text-muted-foreground leading-relaxed">
              Image must be below 1024x1024px.
              <br />
              Use PNG or JPG format.
            </p>
          </div>
        </div>

        <div className="bg-muted/40 rounded-xl p-5 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <label className="text-sm text-foreground sm:w-48 shrink-0">First name*</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="e.g. John"
              disabled={profileLoading}
              className="flex-1 bg-background border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#633CFF] transition-shadow duration-200 disabled:opacity-50"
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = "0 0 0 4px #633CFF26";
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = "";
              }}
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <label className="text-sm text-foreground sm:w-48 shrink-0">Last name*</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="e.g. Appleseed"
              disabled={profileLoading}
              className="flex-1 bg-background border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#633CFF] transition-shadow duration-200 disabled:opacity-50"
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = "0 0 0 4px #633CFF26";
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = "";
              }}
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <label className="text-sm text-foreground sm:w-48 shrink-0">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. email@example.com"
              disabled={profileLoading}
              className="flex-1 bg-background border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-[#633CFF] transition-shadow duration-200 disabled:opacity-50"
              onFocus={(e) => {
                e.currentTarget.style.boxShadow = "0 0 0 4px #633CFF26";
              }}
              onBlur={(e) => {
                e.currentTarget.style.boxShadow = "";
              }}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t mt-auto">
          <button
            onClick={handleSave}
            disabled={upsertProfile.isPending}
            className="bg-[#633CFF] hover:bg-[#4e2fe0] disabled:bg-[#633CFF]/50 text-white font-semibold px-6 py-3 rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {upsertProfile.isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </section>
  );
}
