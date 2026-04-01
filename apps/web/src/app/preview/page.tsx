"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { trpc } from "@/utils/trpc";
import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

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
  {
    value: "freecodecamp",
    label: "freeCodeCamp",
    bg: "#0A0A23",
    text: "#ffffff",
  },
  { value: "gitlab", label: "GitLab", bg: "#FC6D26", text: "#ffffff" },
  { value: "hashnode", label: "Hashnode", bg: "#2962FF", text: "#ffffff" },
  {
    value: "stackoverflow",
    label: "Stack Overflow",
    bg: "#F58025",
    text: "#ffffff",
  },
  {
    value: "frontendmentor",
    label: "Frontend Mentor",
    bg: "#3F54A3",
    text: "#ffffff",
  },
];

const getPlatform = (value: string) =>
  PLATFORMS.find((p) => p.value === value) ?? {
    label: value,
    bg: "#333333",
    text: "#ffffff",
  };

function PreviewPage() {
  const { data: links, isLoading: linksLoading } = trpc.getLinks.useQuery();
  const { data: profile } = trpc.getProfile.useQuery();
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const session = await authClient.getSession();
        if (session && session.data?.user) {
          setCurrentUser({ id: session.data.user.id });
        }
      } catch (error) {
        console.error("Failed to get session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getCurrentUser();
  }, []);

  const hasLinks = links && links.length > 0;
  const isOwner = currentUser && profile && currentUser.id === profile.userId;

  const avatarUrl = profile?.image ?? null;
  const firstName = profile?.firstName ?? "";
  const lastName = profile?.lastName ?? "";
  const email = profile?.email ?? "";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Purple top banner */}
      <div className="hidden sm:block bg-[#633CFF] rounded-b-[32px] h-89.25 w-full absolute top-0 left-0 z-0" />

      {/* Header - Only show if user is the profile owner */}
      {isOwner && (
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-6 py-4 sm:px-10 sm:py-6 bg-primary-foreground max-w-348 mx-auto mt-6 rounded-2xl">
          <Link
            href="/profile"
            className="bg-white border border-[#633CFF] text-[#633CFF] font-semibold px-6 py-2.5 rounded-lg hover:bg-[#EFEBFF] transition-colors text-sm"
          >
            Back to Editor
          </Link>
          <div className="flex items-center justify-center gap-2">
            <button
      onClick={() => {
        navigator.clipboard.writeText(window.location.href).then(() => {
          toast.success("Link copied to clipboard!");
        }).catch(() => {
          toast.error("Failed to copy link.");
        });
      }}
      className="bg-[#633CFF] text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-[#4e2fe0] transition-colors text-sm"
    >
      Share Link
    </button>
            <ModeToggle />
          </div>
        </div>
      )}

      {/* Theme toggle for public visitors */}
      {!isOwner && !isLoading && (
        <div className="absolute top-6 right-6 z-10">
          <ModeToggle />
        </div>
      )}

      {/* Card */}
      <div className={`relative z-10 flex items-center justify-center flex-1 pb-20 pt-10 px-4 ${isOwner ? "top-28" : "top-6"}`}>
        <div className="sm:bg-card rounded-3xl sm:shadow-2xl p-10 flex flex-col items-center gap-4 w-full max-w-87.25">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-[#633CFF] ring-offset-2 flex items-center justify-center bg-muted">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-muted animate-pulse" />
            )}
          </div>

          {/* Name */}
          {firstName || lastName ? (
            <h2 className="text-2xl font-bold text-foreground text-center">
              {firstName} {lastName}
            </h2>
          ) : (
            <div className="h-4 bg-muted rounded w-40 animate-pulse" />
          )}

          {/* Email */}
          {email ? (
            <p className="text-sm text-muted-foreground text-center">{email}</p>
          ) : (
            <div className="h-3 bg-muted rounded w-28 animate-pulse" />
          )}

          {/* Links */}
          <div className="w-full space-y-4 mt-4">
            {linksLoading
              ? Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-12 rounded-lg bg-muted animate-pulse"
                  />
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
                        className="h-12 rounded-lg flex items-center justify-between px-4 transition-opacity hover:opacity-80 border border-primary/60"
                        style={{ backgroundColor: platform.bg }}
                      >
                        <span
                          className="text-sm font-medium truncate"
                          style={{ color: platform.text }}
                        >
                          {platform.label}
                        </span>
                        <svg
                          className="w-4 h-4 shrink-0"
                          style={{ color: platform.text }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </a>
                    );
                  })
                : Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-12 rounded-lg bg-muted animate-pulse"
                    />
                  ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreviewPage;
