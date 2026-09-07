import { buildNotificationText } from '../notification';
import type { LeadSubmission } from '../types';

const base: LeadSubmission = {
  source: 'calculator',
  name: 'Іван',
  phone: '+380671234567',
  contactMethod: 'viber',
  locale: 'uk',
  website: '',
};

describe('buildNotificationText', () => {
  it('includes every calculator answer, not just the contact details', () => {
    // The bug this covers: the message carried name/phone/contact only, so the
    // eight answers the visitor gave the wizard never reached the person who
    // has to call them back.
    const text = buildNotificationText({
      ...base,
      extra: {
        propertyType: 'house',
        solutionType: 'hybrid',
        phase: 'three',
        monthlyKwh: 850,
        goals: ['backup', 'savings'],
        tariff: 'single',
        desiredPowerKw: 10,
        mountType: 'roof',
        wantsGenerator: false,
        wantsCriticalBackup: true,
      },
    });

    expect(text).toContain('Тип об’єкта: house');
    expect(text).toContain('Споживання, кВт·год/міс: 850');
    expect(text).toContain('Бажана потужність, кВт: 10');
    expect(text).toContain('Тип монтажу: roof');
  });

  it('renders booleans as words and arrays as a list', () => {
    const text = buildNotificationText({
      ...base,
      extra: { wantsGenerator: false, wantsCriticalBackup: true, goals: ['backup', 'savings'] },
    });

    expect(text).toContain('Генератор: ні');
    expect(text).toContain('Група критичних споживачів: так');
    expect(text).toContain('Цілі: backup, savings');
  });

  it('omits empty answers rather than sending blank lines', () => {
    const text = buildNotificationText({
      ...base,
      extra: { monthlyKwh: null, tariff: '', goals: [], mountType: 'ground' },
    });

    expect(text).not.toContain('Споживання');
    expect(text).not.toContain('Тариф');
    expect(text).not.toContain('Цілі');
    expect(text).toContain('Тип монтажу: ground');
  });

  it('still sends an unlabelled key so a new wizard step cannot vanish silently', () => {
    const text = buildNotificationText({ ...base, extra: { brandNewField: 'значення' } });
    expect(text).toContain('brandNewField: значення');
  });

  it('omits the answers block entirely when there are none', () => {
    const text = buildNotificationText({ ...base, source: 'callback' });
    expect(text).not.toContain('Відповіді з калькулятора');
    expect(text).toContain("Ім'я: Іван");
  });

  it('escapes HTML, because the message is sent with parse_mode HTML', () => {
    const text = buildNotificationText({
      ...base,
      name: '<b>Іван</b>',
      extra: { comment: 'дах 5 < 10 & "критично"' },
    });

    expect(text).toContain('&lt;b&gt;Іван&lt;/b&gt;');
    expect(text).toContain('&lt; 10 &amp; &quot;критично&quot;');
  });
});
