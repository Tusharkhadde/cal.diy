import type { EventPayloadType, EventTypeInfo } from "@calcom/features/webhooks/lib/sendPayload";
import type { CalendarEvent } from "@calcom/types/Calendar";

import { getRootBookingUid } from "./getRootBookingUid";

export const getWebhookPayloadForBooking = ({
  booking,
  evt,
}: {
  booking: {
    eventType: {
      title: string;
      description: string | null;
      requiresConfirmation: boolean;
      price: number;
      currency: string;
      length: number;
      id: number;
    } | null;
    id: number;
    eventTypeId: number | null;
    userId: number | null;
    uid?: string;
    rootBookingUid?: string | null;
  };
  evt: CalendarEvent;
}) => {
  const eventTypeInfo: EventTypeInfo = {
    eventTitle: booking.eventType?.title,
    eventDescription: booking.eventType?.description,
    requiresConfirmation: booking.eventType?.requiresConfirmation || null,
    price: booking.eventType?.price,
    currency: booking.eventType?.currency,
    length: booking.eventType?.length,
  };

  const payload: EventPayloadType = {
    ...evt,
    ...eventTypeInfo,
    bookingId: booking.id,
    rootBookingUid: booking.uid
      ? getRootBookingUid({ uid: booking.uid, rootBookingUid: booking.rootBookingUid ?? evt.rootBookingUid })
      : evt.rootBookingUid,
  };

  return payload;
};
