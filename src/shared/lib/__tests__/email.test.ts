const sendMock = jest.fn();

jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: { send: sendMock },
  })),
}));

describe('sendEmail', () => {
  const ORIGINAL_ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    sendMock.mockReset();
    process.env = { ...ORIGINAL_ENV };
  });

  afterAll(() => {
    process.env = ORIGINAL_ENV;
  });

  it('no-ops when RESEND_API_KEY is unset, mirroring the Telegram module', async () => {
    delete process.env['RESEND_API_KEY'];
    delete process.env['RESEND_FROM_EMAIL'];

    const { sendEmail } = await import('../email');
    const result = await sendEmail({ to: 'a@b.com', subject: 'Hi', html: '<p>Hi</p>' });

    expect(result).toBe(false);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('fails closed when the API key is set but the from address is missing', async () => {
    process.env['RESEND_API_KEY'] = 're_test_key';
    delete process.env['RESEND_FROM_EMAIL'];

    const { sendEmail } = await import('../email');
    const result = await sendEmail({ to: 'a@b.com', subject: 'Hi', html: '<p>Hi</p>' });

    expect(result).toBe(false);
    expect(sendMock).not.toHaveBeenCalled();
  });

  it('sends with both env vars set and returns true on success', async () => {
    process.env['RESEND_API_KEY'] = 're_test_key';
    process.env['RESEND_FROM_EMAIL'] = 'noreply@invicsol.com.ua';
    sendMock.mockResolvedValue({ data: { id: 'email_123' }, error: null });

    const { sendEmail } = await import('../email');
    const result = await sendEmail({ to: 'a@b.com', subject: 'Hi', html: '<p>Hi</p>' });

    expect(result).toBe(true);
    expect(sendMock).toHaveBeenCalledWith({
      from: 'noreply@invicsol.com.ua',
      to: 'a@b.com',
      subject: 'Hi',
      html: '<p>Hi</p>',
    });
  });

  it('returns false when Resend rejects the send', async () => {
    process.env['RESEND_API_KEY'] = 're_test_key';
    process.env['RESEND_FROM_EMAIL'] = 'noreply@invicsol.com.ua';
    sendMock.mockResolvedValue({ data: null, error: { message: 'invalid domain' } });

    const { sendEmail } = await import('../email');
    const result = await sendEmail({ to: 'a@b.com', subject: 'Hi', html: '<p>Hi</p>' });

    expect(result).toBe(false);
  });
});
