import test from 'node:test';
import assert from 'node:assert/strict';
import { storageService, buildWhatsAppUrl } from './storageService';

test('Admin passcode verification: 100100 succeeds, wrong passcode fails', () => {
  storageService.logoutAdmin();
  assert.equal(storageService.isAdminLoggedIn(), false, 'Admin should initially be logged out');

  // Attempt with invalid passcode
  const wrongAttempt = storageService.loginAdmin('wrong_code_999');
  assert.equal(wrongAttempt, false, 'Invalid passcode should fail');
  assert.equal(storageService.isAdminLoggedIn(), false, 'Session should remain unauthenticated');

  // Attempt with correct passcode 100100
  const validAttempt = storageService.loginAdmin('100100');
  assert.equal(validAttempt, true, 'Passcode 100100 must succeed');
  assert.equal(storageService.isAdminLoggedIn(), true, 'Session must now be authenticated as Admin');

  // Logout
  storageService.logoutAdmin();
  assert.equal(storageService.isAdminLoggedIn(), false, 'Logout must revoke session');
});

test('Visitor vs Admin visibility: nothing published by default until Admin publishes', () => {
  // Visitor request (includeUnpublished = false)
  const visitorProjects = storageService.getProjects(false);
  assert.equal(visitorProjects.length, 0, 'No projects should be visible to visitors by default');

  // Admin request (includeUnpublished = true)
  const adminProjects = storageService.getProjects(true);
  assert.ok(adminProjects.length >= 2, 'Admin should see unpublished drafts in the catalog');
  assert.ok(adminProjects.every((p) => p.isPublished === false), 'Default projects should be unpublished initially');

  // Verify secret files are present for admin management
  const lms = adminProjects.find((p) => p.id === 'lms-core-hub');
  assert.ok(lms, 'LMS Core project must exist');
  assert.ok(lms.secretFiles && lms.secretFiles.length > 0, 'Admin project must contain private source files');
});

test('Publishing lifecycle: Admin toggling publish status updates visitor visibility', () => {
  // Initially unpublished
  assert.equal(storageService.getProjects(false).length, 0);

  // Admin toggles LMS project to published
  const isNowPublished = storageService.togglePublishProject('lms-core-hub');
  assert.equal(isNowPublished, true, 'Project should now be published');

  // Visitor now sees 1 published project
  const visitorVisible = storageService.getProjects(false);
  assert.equal(visitorVisible.length, 1, 'Visitor must now see the published project');
  assert.equal(visitorVisible[0].id, 'lms-core-hub');

  // Admin toggles back to hide
  const isHiddenAgain = storageService.togglePublishProject('lms-core-hub');
  assert.equal(isHiddenAgain, false, 'Project should now be unpublished');
  assert.equal(storageService.getProjects(false).length, 0, 'Visitor list should be empty again');
});

test('Visitor AI Customization Draft pipeline: Staged draft requires Admin approval', () => {
  const testDraftId = `draft-test-${Date.now()}`;
  storageService.saveAiDraft({
    id: testDraftId,
    projectId: 'lms-core-hub',
    projectTitle: 'منظومة LMS Core',
    visitorId: 'u-123',
    visitorName: 'أحمد محمود',
    visitorPhone: '01012345678',
    userPrompt: 'أريد تغيير اسم السنتر إلى أكاديمية النخبة وتفعيل الوضع الليلي',
    forkedAt: new Date().toISOString(),
    status: 'pending_review',
    modifiedCode: '// test code',
    modifiedConfig: {
      centerName: 'أكاديمية النخبة',
      theme: 'midnight',
      activeCourse: 'الفيزياء الحديثة',
      hasQuiz: true,
      bannerText: 'مرحباً بكم في أكاديمية النخبة'
    }
  });

  const drafts = storageService.getAiDrafts();
  const saved = drafts.find((d) => d.id === testDraftId);
  assert.ok(saved, 'Draft must be saved');
  assert.equal(saved.status, 'pending_review', 'Draft must be in pending_review status');

  // Admin approves draft
  storageService.updateAiDraftStatus(testDraftId, 'approved_published');
  const updatedDrafts = storageService.getAiDrafts();
  const approved = updatedDrafts.find((d) => d.id === testDraftId);
  assert.equal(approved?.status, 'approved_published', 'Draft status must be updated to approved_published');
});

test('WhatsApp URL formatters generate correct deep links for ordering and drafts', () => {
  const orderUrl = storageService.formatWhatsAppOrderUrl('201024889921', 'منصة LMS Core', 'lms-core-hub', true);
  assert.ok(orderUrl.startsWith('https://wa.me/201024889921?text='), 'Must format with correct phone number');
  assert.ok(orderUrl.includes(encodeURIComponent('منصة LMS Core')), 'Must include encoded platform title');

  const draftUrl = storageService.formatWhatsAppDraftUrl('01024889921', {
    id: 'draft-999',
    projectId: 'lms-core-hub',
    projectTitle: 'LMS Core',
    visitorId: 'u-456',
    visitorName: 'خالد',
    visitorPhone: '01099887766',
    userPrompt: 'تعديل الثيم إلى الزمردي',
    forkedAt: '2026-10-25',
    status: 'pending_review',
    modifiedCode: '// test code 2',
    modifiedConfig: {
      centerName: 'سنتر الأوائل',
      theme: 'emerald',
      activeCourse: 'كيمياء',
      hasQuiz: false,
      bannerText: 'سنتر الأوائل يرحب بكم'
    }
  }, true);

  assert.ok(draftUrl.startsWith('https://wa.me/01024889921?text='), 'Must route to cleaned WhatsApp number');
  assert.ok(draftUrl.includes(encodeURIComponent('سنتر الأوائل')), 'Must include custom center name');
});

test('buildWhatsAppUrl helper correctly handles spaces, dashes, + signs, and query encoding', () => {
  // Simple clean number without message
  assert.equal(buildWhatsAppUrl('201024889921'), 'https://wa.me/201024889921');
  
  // Formatted number with spaces, plus sign, and dashes
  assert.equal(buildWhatsAppUrl('+20 102-488-9921'), 'https://wa.me/201024889921');
  
  // With message text
  const urlWithMessage = buildWhatsAppUrl('+20 102 488 9921', 'طلب شراء منصة ليرن ويب');
  assert.equal(urlWithMessage, `https://wa.me/201024889921?text=${encodeURIComponent('طلب شراء منصة ليرن ويب')}`);
  
  // Empty or invalid input fallback
  assert.equal(buildWhatsAppUrl(''), 'https://wa.me/');
});

