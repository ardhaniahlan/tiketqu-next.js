import { db } from "@/db";
import { events } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { EventForm } from "@/features/admin/components/EventForm";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const eventId = resolvedParams.id;

  const eventData = await db
    .select()
    .from(events)
    .where(eq(events.id, eventId))
    .limit(1);

  if (eventData.length === 0) {
    redirect("/admin/dashboard");
  }

  const event = eventData[0];

  return (
    <EventForm
      initialData={{
        ...event,
        imageUrl: event.imageUrl ?? undefined,
        category: event.category ?? undefined,
        organizer: event.organizer ?? undefined,
        time: event.time ?? undefined,
        locationMapUrl: event.locationMapUrl ?? undefined,
      }}
    />
  );
}
