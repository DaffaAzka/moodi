import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth-session";
import { CalmRoom } from "@/features/calm/components/calm-room";
import { getCalmRoomData } from "@/features/calm/queries";
import { siteCopy } from "@/lib/copy/id";

export const metadata = {
  title: `Ruang Tenang | ${siteCopy.brand}`,
};

export default async function CalmRoomPage() {
  const session = await getAuthSession();
  if (!session) redirect("/login");

  const calmData = await getCalmRoomData(session.user.id);

  return (
    <main className="min-w-0 flex-1 px-4 py-8 pb-24 sm:px-6 lg:px-10 lg:pb-12">
      <div className="mx-auto max-w-4xl">
        <CalmRoom
          hasConsent={calmData.hasConsent}
          initialJournalEntries={calmData.journalEntries}
          userName={session.user.name}
        />
      </div>
    </main>
  );
}
