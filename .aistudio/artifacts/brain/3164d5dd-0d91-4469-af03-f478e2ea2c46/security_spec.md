# Firestore Security Specification

## Data Invariants
1. **Projects:** Publicly readable if `isPublished` is true. Admin can read/write all.
2. **User Orders:** Users can only read/write their own orders. Admin can read all.
3. **Drafts:** Users can read/write their own drafts. Admin can read/write all.

## The "Dirty Dozen" Payloads (Examples)
1. **Public Write:** Anonymous user trying to write to `projects`.
2. **Privilege Escalation:** Regular user trying to write `status: 'approved_published'` to a draft.
3. **Data Spoofing:** User trying to change `userId` in `orders` collection to another user's ID.
4. **Field Injection:** Adding extra fields to `drafts` that shouldn't be there (Shadow Update).
5. **ID Poisoning:** Using a 2KB string as a document ID.
6. **Terminal State Violation:** Updating a finished order.
7. **Read PII:** Unauthorized user trying to read another user's order details.
8. **Public List Manipulation:** Querying `drafts` without filtering by `visitorId`.
9. **Timestamp Manipulation:** Providing a custom `createdAt` timestamp.
10. **Admin Identity Spoof:** A non-admin user trying to create a document in `admins` collection.
11. **Type Confusion:** Sending a number instead of a string for project titles.
12. **Unbounded Array:** Sending an array with 1000 items as a tag list.

## Test Strategy (Summary)
We will use `firestore.rules.test.ts` to ensure all these payloads are rejected by the security rules, and valid authorized requests are permitted.
