import { db } from "@/db";
import { events } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { EventForm } from "@/features/admin/components/EventForm";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  
  const resolvedParams = await params;
  const eventId = resolvedParams.id;

  const eventData = await db.select().from(events).where(eq(events.id, eventId)).limit(1);

  if (eventData.length === 0) {
    redirect("/admin/dashboard");
  }

  return <EventForm initialData={eventData[0]} />;
}