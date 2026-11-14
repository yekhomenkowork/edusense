import assert from 'node:assert/strict';
import test from 'node:test';
import { loginPayload } from './loginPayload.js';

test('ordinary login omits TOTP', () => {
  assert.deepEqual(loginPayload('staff@example.invalid', 'fixture'), {
    email: 'staff@example.invalid', password: 'fixture',
  });
});

test('administrator login preserves leading zeroes in TOTP', () => {
  assert.equal(loginPayload('admin@example.invalid', 'fixture', '012345').otp, '012345');
});
