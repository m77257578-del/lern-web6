# Security Specification for Firestore: Lern Web

## 1. Data Invariants
- Every UserOrder must have a valid userId that corresponds to the user placing the order.
- AiCustomizationDrafts belong to specific visitors, accessible only by that visitor.
- CmsArticles and FaqItems are managed by admins, published content is readable by all.
- Notifications belong to a specific user and are accessible only by that user.

## 2. The "Dirty Dozen" Payloads (Examples)
1. Unauthorized UserOrder creation with arbitrary userId.
2. AiCustomizationDraft modification by a different visitor ID.
3. Accessing another user's UserNotifications.
4. Admin-only CMS update by a standard user.
5. Deleting published CmsArticles by a standard user.
6. Updating a terminal status on an AiCustomizationDraft (e.g., 'completed' to 'in_progress').
7. Injecting a 5KB string into a project title (ID Poisoning).
8. Creating a UserOrder without a timestamp.
9. Modifying 'createdAt' field on a UserOrder.
10. Listing all notifications without filtering by userId.
11. Reading PII (if any added later) without appropriate roles.
12. Creating a notification with an invalid type.

## 3. Test Scenarios (Planned)
- Test `allow create` for UserOrder with mismatched userId -> Expect PERMISSION_DENIED.
- Test `allow update` for AiCustomizationDraft by unauthorized visitor -> Expect PERMISSION_DENIED.
- Test `allow read` for UserNotifications by unauthorized user -> Expect PERMISSION_DENIED.
- Test `allow update` for CmsArticle by non-admin -> Expect PERMISSION_DENIED.
