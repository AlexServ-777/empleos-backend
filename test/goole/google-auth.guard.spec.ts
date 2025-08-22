import { GoogleAuthGuard } from '../../src/auth/google_config/google-auth.guard';

describe('GoogleAuthGuard', () => {
  it('should be defined', () => {
    expect(new GoogleAuthGuard()).toBeDefined();
  });
});
