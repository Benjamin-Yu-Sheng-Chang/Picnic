"use client";

import { useDiscord } from "../contexts/DiscordContext";

/**
 * Example component showing how to use the Discord context
 * This component can be used anywhere in the app without prop drilling
 */
export function DiscordUserInfo() {
  const { discordId, isValidDiscordId, isLoading } = useDiscord();

  if (isLoading) {
    return <div className="text-sm text-gray-500">Validating Discord user...</div>;
  }

  if (!isValidDiscordId) {
    return <div className="text-sm text-red-500">Invalid Discord user</div>;
  }

  return (
    <div className="text-sm text-green-500">
      Connected Discord User: {discordId}
    </div>
  );
}

/**
 * Example of a component that only needs the Discord ID
 */
export function SimpleDiscordDisplay() {
  const { discordId } = useDiscord();
  
  return discordId ? (
    <span>Discord: {discordId}</span>
  ) : (
    <span>No Discord user</span>
  );
}