"use client";

import { useDiscord } from "../contexts/DiscordContext";

interface DiscordIdInputProps {
  placeholder?: string;
  className?: string;
}

/**
 * Simple Discord ID input form
 */
export function DiscordIdInput({ 
  placeholder = "Enter Discord ID", 
  className = ""
}: DiscordIdInputProps) {
  const { discordId, setDiscordId, isValidDiscordId } = useDiscord();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={discordId}
          onChange={(e) => setDiscordId(e.target.value)}
          placeholder={placeholder}
          className={`flex-1 bg-light dark:bg-dark text-dark dark:text-light rounded-md p-2 border-2 border-slate-200 dark:border-slate-800 ${className}`}
        />
      </div>
      {isValidDiscordId === false && (
        <p className="text-red-500 text-sm">Invalid Discord ID</p>
      )}
    </div>
  );
}