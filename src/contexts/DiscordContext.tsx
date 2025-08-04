"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

interface DiscordContextType {
  discordId: string;
  setDiscordId: (id: string) => void;
  isValidDiscordId: boolean;
  setIsValidDiscordId: (id: boolean) => void;
  validateDiscordId: (id: string) => void;
}

const DiscordContext = createContext<DiscordContextType | undefined>(undefined);

interface DiscordProviderProps {
  children: ReactNode;
}

export function DiscordProvider({ children }: DiscordProviderProps) {
  const [discordId, setDiscordId] = useState<string>("");
  const [isValidDiscordId, setIsValidDiscordId] = useState<boolean>(false);
  
  const checkDiscordId = useMutation(
    api.discord.linking.checkDiscordId, 
  );

  const validateDiscordId = async (id: string) => {
    const isValid = await checkDiscordId({ discordUserId: id });
    console.log("isValid", isValid);
    setIsValidDiscordId(isValid);
    return isValid;
  }
  console.log("discordId", discordId);
  useEffect(() => {
    validateDiscordId(discordId);
  }, [discordId]);

  const value: DiscordContextType = {
    discordId,
    setDiscordId,
    isValidDiscordId,
    setIsValidDiscordId,
    validateDiscordId
  };

  return (
    <DiscordContext.Provider value={value}>
      {children}
    </DiscordContext.Provider>
  );
}

export function useDiscord() {
  const context = useContext(DiscordContext);
  if (context === undefined) {
    throw new Error("useDiscord must be used within a DiscordProvider");
  }
  return context;
}

// Optional: Hook specifically for getting just the Discord ID
export function useDiscordId() {
  const { discordId } = useDiscord();
  return discordId;
}

// Optional: Hook for checking if user is authenticated with valid Discord ID
export function useIsDiscordAuthenticated() {
  const { isValidDiscordId } = useDiscord();
  return { isAuthenticated: Boolean(isValidDiscordId) };
}