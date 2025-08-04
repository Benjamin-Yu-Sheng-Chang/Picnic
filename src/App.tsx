"use client";

import Calendar from "./Calendar";
import { DiscordProvider, useIsDiscordAuthenticated } from "./contexts/DiscordContext";
import { DiscordUserInfo } from "./components/DiscordUserInfo";
import { DiscordIdInput } from "./components/DiscordIdInput";

export default function App() {
  return (
    <DiscordProvider>
      <AppContent />
    </DiscordProvider>
  );
}

function AppContent() {
  const { isAuthenticated } = useIsDiscordAuthenticated();

  return (
    <>
      <header className="sticky top-0 z-10 bg-light dark:bg-dark p-4 border-b-2 border-slate-200 dark:border-slate-800">
        Picnic
      </header>
      <main className="p-8 flex flex-col gap-16">
        {isAuthenticated ? (
          <>
            <DiscordUserInfo />
            <Calendar />
          </>
        ) : (
          <div className="flex flex-col gap-4">
            <DiscordIdInput />
          </div>
        )}
      </main>
    </>
  );
}
