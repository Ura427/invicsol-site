import type { LeadSubmission } from './types';

const CONTACT_METHOD_LABEL: Record<LeadSubmission['contactMethod'], string> = {
  phone: 'Дзвінок',
  viber: 'Viber',
  telegram: 'Telegram',
};

const SOURCE_LABEL: Record<LeadSubmission['source'], string> = {
  calculator: 'Калькулятор',
  contact: 'Контактна форма',
  callback: 'Замовлення дзвінка',
};

/**
 * Labels for everything the calculator wizard collects.
 *
 * A notification carrying only name/phone/contact-method throws away the eight
 * answers the visitor just spent two minutes giving, which is the entire point
 * of the calculator. Any key without a label here is still sent under its raw
 * name, so a new wizard step can never silently disappear from the message.
 */
const EXTRA_LABELS: Record<string, string> = {
  propertyType: 'Тип об’єкта',
  solutionType: 'Тип рішення',
  phase: 'Фазність',
  monthlyKwh: 'Споживання, кВт·год/міс',
  goals: 'Цілі',
  tariff: 'Тариф',
  desiredPowerKw: 'Бажана потужність, кВт',
  mountType: 'Тип монтажу',
  wantsGenerator: 'Генератор',
  wantsCriticalBackup: 'Група критичних споживачів',
  comment: 'Коментар',
};

function formatExtraValue(value: unknown): string | null {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value === 'boolean') return value ? 'так' : 'ні';
  if (Array.isArray(value)) {
    const items = value.filter((item) => item !== null && item !== undefined && item !== '');
    return items.length > 0 ? items.join(', ') : null;
  }
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

/** Telegram is called with parse_mode HTML, so visitor text must be escaped. */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Lives outside actions.ts because that file is `'use server'`, where every
 * export must be an async server function — this is a pure string builder and
 * is worth testing directly.
 */
export function buildNotificationText(submission: LeadSubmission): string {
  const lines = [
    `<b>Нова заявка — ${SOURCE_LABEL[submission.source]}</b>`,
    `Ім'я: ${escapeHtml(submission.name)}`,
    `Телефон: ${escapeHtml(submission.phone)}`,
    `Зв'язок: ${CONTACT_METHOD_LABEL[submission.contactMethod]}`,
  ];

  const extraLines = Object.entries(submission.extra ?? {})
    .map(([key, value]) => {
      const formatted = formatExtraValue(value);
      if (formatted === null) return null;
      return `${EXTRA_LABELS[key] ?? key}: ${escapeHtml(formatted)}`;
    })
    .filter((line): line is string => line !== null);

  if (extraLines.length > 0) {
    lines.push('', '<b>Відповіді з калькулятора</b>', ...extraLines);
  }

  return lines.join('\n');
}
