import { describe, expect, it } from "vitest";

import { getRootBookingUid, getRootBookingUidForCreate } from "./getRootBookingUid";

describe("getRootBookingUid", () => {
  it("returns the persisted root when present", () => {
    expect(
      getRootBookingUid({
        uid: "new-uid",
        rootBookingUid: "original-uid",
      })
    ).toBe("original-uid");
  });

  it("falls back to uid when root is missing", () => {
    expect(getRootBookingUid({ uid: "original-uid", rootBookingUid: null })).toBe("original-uid");
  });
});

describe("getRootBookingUidForCreate", () => {
  it("uses the new uid for an original booking", () => {
    expect(getRootBookingUidForCreate({ newUid: "uid-1" })).toBe("uid-1");
  });

  it("copies the original root across a reschedule", () => {
    expect(
      getRootBookingUidForCreate({
        newUid: "uid-2",
        originalRescheduledBooking: { uid: "uid-1", rootBookingUid: "uid-1" },
      })
    ).toBe("uid-1");
  });

  it("walks a missing root back to the previous booking uid", () => {
    expect(
      getRootBookingUidForCreate({
        newUid: "uid-3",
        originalRescheduledBooking: { uid: "uid-2", rootBookingUid: null },
      })
    ).toBe("uid-2");
  });

  it("keeps the original root across a second reschedule", () => {
    expect(
      getRootBookingUidForCreate({
        newUid: "uid-3",
        originalRescheduledBooking: { uid: "uid-2", rootBookingUid: "uid-1" },
      })
    ).toBe("uid-1");
  });
});
