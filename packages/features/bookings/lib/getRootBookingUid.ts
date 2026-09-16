type BookingIdentity = {
  uid: string;
  rootBookingUid?: string | null;
};

/**
 * Returns the booking identity that survives reschedules.
 * New bookings persist `rootBookingUid`; older rows fall back to `uid`.
 */
export function getRootBookingUid(booking: BookingIdentity): string {
  return booking.rootBookingUid || booking.uid;
}

export function getRootBookingUidForCreate({
  newUid,
  originalRescheduledBooking,
}: {
  newUid: string;
  originalRescheduledBooking?: BookingIdentity | null;
}): string {
  if (!originalRescheduledBooking) {
    return newUid;
  }

  return getRootBookingUid(originalRescheduledBooking);
}
