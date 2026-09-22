import { defaultCompanyConfig } from '../data/defaultData';

export function getWhatsAppUrl(customMessage?: string, phoneNumber?: string): string {
  const number = phoneNumber || defaultCompanyConfig.whatsapp;
  const defaultText = 'Hola, Aseo Vía. Me gustaría solicitar información sobre sus servicios de limpieza.';
  const message = customMessage ? customMessage.trim() : defaultText;
  
  // Clean non-numeric characters for the api link
  const cleanNumber = number.replace(/\D/g, '');
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function generateQuoteWhatsAppMessage(data: {
  nombre?: string;
  telefono?: string;
  tipoEspacio?: string;
  categoria?: string;
  servicio?: string;
  plan?: string;
  tamano?: string;
  precioReferencial?: string;
  ubicacion?: string; // Alto Hospicio o Iquique
  opcionAbono?: string; // 'Sin abono' | '10.000 pesos' | 'La mitad' | 'Todo al tiro'
  montoAbono?: string;
  saldoRestante?: string;
  detalles?: string;
}): string {
  const lines: string[] = [
    '👋 *¡Hola Aseo Vía! Me gustaría coordinar un servicio de limpieza:*',
    '',
  ];

  if (data.nombre) lines.push(`👤 *Nombre:* ${data.nombre}`);
  if (data.ubicacion) lines.push(`📍 *Comuna:* ${data.ubicacion}`);
  if (data.tipoEspacio) lines.push(`🏢 *Inmueble / Espacio:* ${data.tipoEspacio}`);
  if (data.plan) lines.push(`📋 *Plan seleccionado:* Plan ${data.plan}`);
  if (data.tamano) lines.push(`📐 *Tamaño aproximado:* ${data.tamano}`);
  if (data.precioReferencial) lines.push(`💵 *Valor referencial:* ${data.precioReferencial}`);

  // Sección de Abono según selección del cliente
  if (data.opcionAbono === 'Sin abono') {
    lines.push(`💳 *Preferencia de Abono:* Sin abono (Pagar 100% al finalizar la limpieza)`);
  } else if (data.opcionAbono === '10.000 pesos') {
    lines.push(`💳 *Preferencia de Abono:* $10.000 (Abono de reserva · Saldo de ${data.saldoRestante || 'restante'} al finalizar)`);
  } else if (data.opcionAbono === 'La mitad') {
    lines.push(`💳 *Preferencia de Abono:* La mitad (50% anticipado: ${data.montoAbono || '$22.500'} · Saldo de ${data.saldoRestante || '50%'} al finalizar)`);
  } else if (data.opcionAbono === 'Todo al tiro') {
    lines.push(`💳 *Preferencia de Abono:* Todo al tiro (100% total anticipado: ${data.montoAbono || data.precioReferencial})`);
  } else if (data.opcionAbono) {
    lines.push(`💳 *Preferencia de Abono:* ${data.opcionAbono} (${data.montoAbono || ''})`);
  } else {
    lines.push(`💳 *Abono referencial:* $10.000 (saldo al finalizar)`);
  }

  lines.push(`🧼 *Modalidad:* Limpieza manual detallada y profesional (sin máquinas)`);
  if (data.detalles) lines.push(`📝 *Detalles adicionales:* ${data.detalles}`);

  lines.push('');
  lines.push('Quedo atento(a) para confirmar disponibilidad y fecha de visita. ¡Muchas gracias!');

  return lines.join('\n');
}
