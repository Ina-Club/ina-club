export enum GroupStatus {
  OPEN = "OPEN",
  ACTIVATED = "ACTIVATED", // Represents the old CLOSED status
  RESOLVED = "RESOLVED", // Represents an activated group that all participants has paid or been charged
  CANCELED = "CANCELED",
  EXPIRED = "EXPIRED",
  PENDING = "PENDING",
  PREVIEW = "PREVIEW",
}

export enum PaymentTokenStatus {
  ACTIVE = "ACTIVE",
  CONSUMED = "CONSUMED",
  RELEASED = "RELEASED",
}

export enum CouponStatus {
  ACTIVE = "ACTIVE",
  EXPIRED = "EXPIRED",
  USED = "USED",
}
