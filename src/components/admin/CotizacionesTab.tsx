import React, { useState } from 'react';
import {
  Bell,
  BellRing,
  CheckCircle2,
  Clock,
  ExternalLink,
  Filter,
  Flame,
  MessageCircle,
  Phone,
  PhoneCall,
  Search,
  Sparkles,
  Trash2,
  Volume2,
  VolumeX,
  AlertCircle,
  Check,
  Building,
  MapPin,
  DollarSign,
  CreditCard,
} from 'lucide-react';
import { CotizacionItem, CompanyConfig } from '../../types';
import { WhatsAppIcon } from '../BrandIcons';
import {
  updateCotizacion,
  deleteCotizacion,
  saveCotizacion,
} from '../../services/firestoreService';
import {
  isAudioEnabled,
  setAudioEnabled,
  playNotificationChime,
} from '../../utils/audioAlert';

interface CotizacionesTabProps {
  cotizaciones: CotizacionItem[];
  onRefresh: () => Promise<void>;
  showToast: (text: string, type?: 'success' | 'error') => void;
  config: CompanyConfig;
}

export const CotizacionesTab: React.FC<CotizacionesTabProps> = ({
  cotizaciones,
  onRefresh,
  showToast,
  config,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('todas');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [soundActive, setSoundActive] = useState<boolean>(isAudioEnabled());
  const [actingId, setActingId] = useState<string | null>(null);

  const pendingCount = cotizaciones.filter((c) => c.estado === 'pendiente').length;
  const respondedCount = cotizaciones.filter((c) => c.estado === 'respondido').length;
  const confirmedCount = cotizaciones.filter((c) => c.estado === 'confirmado').length;

  const handleToggleSound = () => {
    const nextState = !soundActive;
    setSoundActive(nextState);
    setAudioEnabled(nextState);
    if (nextState) {
      playNotificationChime();
      showToast('Sonido de alerta activado.');
    } else {
      showToast('Sonido de alerta silenciado.');
    }
  };

  const handleTestChime = () => {
    playNotificationChime();
    showToast('Reproduciendo sonido de campana de prueba.');
  };

  const handleStatusChange = async (
    id: string,
    newStatus: CotizacionItem['estado']
  ) => {
    setActingId(id);
    try {
      await updateCotizacion(id, {
        estado: newStatus,
        leido: true,
      });
      await onRefresh();
      showToast(`Estado actualizado a "${newStatus}".`);
    } catch (err: any) {
      showToast('Error al actualizar estado: ' + err.message, 'error');
    } finally {
      setActingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Deseas eliminar este registro de cotización?')) return;
    setActingId(id);
    try {
      await deleteCotizacion(id);
      await onRefresh();
      showToast('Cotización eliminada correctamente.');
    } catch (err: any) {
      showToast('Error al eliminar cotización: ' + err.message, 'error');
    } finally {
      setActingId(null);
    }
  };

  const handleQuickWhatsAppResponse = async (cot: CotizacionItem) => {
    // Sanitize phone number
    let cleanPhone = cot.telefono.replace(/[^0-9]/g, '');
    if (cleanPhone.length === 9 && !cleanPhone.startsWith('56')) {
      cleanPhone = `56${cleanPhone}`;
    } else if (cleanPhone.length === 8) {
      cleanPhone = `569${cleanPhone}`;
    }

    // Personalizar respuesta de acuerdo a la preferencia de abono indicada por el cliente
    let abonoText = 'Te recordamos que la reserva se confirma habitualmente con un abono de $10.000.';
    if (cot.opcionAbono === 'Sin abono') {
      abonoText = 'Vemos que tu preferencia es pagar el total directamente al finalizar el trabajo.';
    } else if (cot.opcionAbono === '10.000 pesos') {
      abonoText = `Vemos que prefieres abonar los $10.000 de reserva (saldo restante de ${cot.saldoRestante || 'restante'} al finalizar).`;
    } else if (cot.opcionAbono === 'La mitad') {
      abonoText = `Vemos que prefieres abonar la mitad (${cot.montoAbono || '50%'}) para agendar de inmediato (saldo de ${cot.saldoRestante || '50%'} al finalizar).`;
    } else if (cot.opcionAbono === 'Todo al tiro') {
      abonoText = `Vemos que prefieres abonar todo al tiro (${cot.montoAbono || cot.precioReferencial}) para dejar el servicio 100% saldado.`;
    }

    const message = encodeURIComponent(
      `¡Hola ${cot.nombre}! Te saludamos cordialmente de Aseo Vía ✨. Recibimos tu cotización para el Plan ${cot.plan} en ${cot.tipoEspacio || 'tu espacio'} (${cot.ubicacion}). ${abonoText} ¿Qué día y horario te acomodaría para realizar la visita?`
    );

    const waUrl = cleanPhone
      ? `https://wa.me/${cleanPhone}?text=${message}`
      : `https://wa.me/?text=${message}`;

    window.open(waUrl, '_blank', 'noopener,noreferrer');

    // Auto mark as responded if it was pending
    if (cot.estado === 'pendiente') {
      await handleStatusChange(cot.id, 'respondido');
    }
  };

  // Helper to create a quick test quotation
  const handleCreateTestQuote = async () => {
    try {
      const sampleNames = [
        'Valentina Morales',
        'Rodrigo Carrasco',
        'Camila Fuentes',
        'Matías Vergara',
      ];
      const randomName =
        sampleNames[Math.floor(Math.random() * sampleNames.length)];
      const sampleLocations = ['Alto Hospicio', 'Iquique'];
      const randomLocation =
        sampleLocations[Math.floor(Math.random() * sampleLocations.length)];

      const abonoVariants: Array<{
        opcionAbono: 'Sin abono' | '10.000 pesos' | 'La mitad' | 'Todo al tiro';
        monto: string;
        saldo: string;
      }> = [
        { opcionAbono: 'Sin abono', monto: '$0', saldo: '$44.990' },
        { opcionAbono: '10.000 pesos', monto: '$10.000', saldo: '$34.990' },
        { opcionAbono: 'La mitad', monto: '$22.495', saldo: '$22.495' },
        { opcionAbono: 'Todo al tiro', monto: '$44.990', saldo: '$0' },
      ];
      const randomAbono =
        abonoVariants[Math.floor(Math.random() * abonoVariants.length)];

      await saveCotizacion({
        nombre: randomName,
        telefono: '+56 9 8765 4321',
        ubicacion: randomLocation,
        categoria: 'Hogar',
        tipoEspacio: 'Hogar - Casa Residencial',
        plan: 'ESTÁNDAR',
        tamano: 'Mediano (51 a 100 m²)',
        precioReferencial: '$44.990',
        abonoReserva: randomAbono.monto,
        opcionAbono: randomAbono.opcionAbono,
        montoAbono: randomAbono.monto,
        saldoRestante: randomAbono.saldo,
        detalles: 'Solicita atención para el próximo sábado en la mañana.',
        fecha: new Date().toLocaleString('es-CL', {
          dateStyle: 'short',
          timeStyle: 'short',
        }),
        timestamp: Date.now(),
        estado: 'pendiente',
        leido: false,
      });

      playNotificationChime();
      await onRefresh();
      showToast('Cotización de prueba creada con alerta visual y sonora.');
    } catch (err: any) {
      showToast('Error al crear cotización de prueba: ' + err.message, 'error');
    }
  };

  // Filter and search logic
  const filteredQuotes = cotizaciones.filter((cot) => {
    if (filterStatus !== 'todas' && cot.estado !== filterStatus) {
      return false;
    }
    if (searchTerm.trim()) {
      const s = searchTerm.toLowerCase();
      const matchName = cot.nombre?.toLowerCase().includes(s);
      const matchPhone = cot.telefono?.toLowerCase().includes(s);
      const matchPlan = cot.plan?.toLowerCase().includes(s);
      const matchSpace = cot.tipoEspacio?.toLowerCase().includes(s);
      const matchLoc = cot.ubicacion?.toLowerCase().includes(s);
      return matchName || matchPhone || matchPlan || matchSpace || matchLoc;
    }
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Top Banner & Audio Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-800 shrink-0">
            {pendingCount > 0 ? (
              <BellRing className="w-5 h-5 text-rose-600 animate-bounce" />
            ) : (
              <Bell className="w-5 h-5 text-sky-700" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-serif font-bold text-sm text-slate-900">
                Bandeja de Cotizaciones y Alertas en Vivo
              </h4>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                En Tiempo Real
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Cada vez que un cliente cotiza en la web, se registra aquí al instante con aviso sonoro y distintivo visual.
            </p>
          </div>
        </div>

        {/* Action buttons & sound toggle */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleToggleSound}
            title={soundActive ? 'Desactivar sonido' : 'Activar sonido'}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
              soundActive
                ? 'bg-sky-50 border-sky-300 text-sky-800 hover:bg-sky-100'
                : 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {soundActive ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-sky-700" />
                <span>Sonido Activo</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                <span>Sonido Silenciado</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleTestChime}
            title="Probar sonido de notificación"
            className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors cursor-pointer"
          >
            Probar Campana
          </button>

          <button
            type="button"
            onClick={handleCreateTestQuote}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-sky-700 hover:bg-sky-800 text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simular Cotización</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Pending Card */}
        <div
          onClick={() => setFilterStatus('pendiente')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            filterStatus === 'pendiente'
              ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-400/40'
              : 'bg-white border-slate-200 hover:border-rose-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-rose-700 font-bold mb-1">
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
              Por Contactar
            </span>
            {pendingCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping"></span>
            )}
          </div>
          <div className="text-2xl font-black text-rose-700">{pendingCount}</div>
          <p className="text-[10px] text-slate-500 mt-0.5">
            {pendingCount > 0 ? '⚡ Responder de inmediato' : 'Al día'}
          </p>
        </div>

        {/* Responded Card */}
        <div
          onClick={() => setFilterStatus('respondido')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            filterStatus === 'respondido'
              ? 'bg-sky-50 border-sky-300 ring-2 ring-sky-400/40'
              : 'bg-white border-slate-200 hover:border-sky-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-sky-800 font-bold mb-1">
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3.5 h-3.5 text-sky-600" />
              En Conversación
            </span>
          </div>
          <div className="text-2xl font-black text-sky-900">{respondedCount}</div>
          <p className="text-[10px] text-slate-500 mt-0.5">Contactadas vía WhatsApp</p>
        </div>

        {/* Confirmed Card */}
        <div
          onClick={() => setFilterStatus('confirmado')}
          className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
            filterStatus === 'confirmado'
              ? 'bg-emerald-50 border-emerald-300 ring-2 ring-emerald-400/40'
              : 'bg-white border-slate-200 hover:border-emerald-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs text-emerald-800 font-bold mb-1">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Confirmadas
            </span>
          </div>
          <div className="text-2xl font-black text-emerald-800">{confirmedCount}</div>
          <p className="text-[10px] text-slate-500 mt-0.5">Abono $10.000 recibido</p>
        </div>

        {/* Target Speed Card */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
          <div className="flex items-center justify-between text-xs text-slate-700 font-bold mb-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              Meta Respuesta
            </span>
          </div>
          <div className="text-2xl font-black text-slate-900">&lt; 15 min</div>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Garantiza 85% más de cierre
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1 mr-0.5" />
          {[
            { id: 'todas', label: `Todas (${cotizaciones.length})` },
            { id: 'pendiente', label: `⚡ Pendientes (${pendingCount})` },
            { id: 'respondido', label: `Respondidas (${respondedCount})` },
            { id: 'confirmado', label: `Confirmadas (${confirmedCount})` },
            { id: 'archivado', label: 'Archivadas' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                filterStatus === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64 shrink-0">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por cliente, teléfono..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:border-sky-500"
          />
        </div>
      </div>

      {/* Quote Cards List */}
      {filteredQuotes.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-dashed border-slate-300 text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Bell className="w-6 h-6" />
          </div>
          <h5 className="font-serif font-bold text-sm text-slate-800">
            No hay cotizaciones para mostrar en este filtro
          </h5>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Cuando los clientes hagan clic en "Cotizar Servicio" en la web o completen el formulario con su número de teléfono, aparecerán aquí inmediatamente.
          </p>
          <button
            type="button"
            onClick={handleCreateTestQuote}
            className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold bg-sky-700 text-white hover:bg-sky-800 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generar cotización de prueba ahora</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredQuotes.map((cot) => {
            const isPending = cot.estado === 'pendiente';
            const isConfirmed = cot.estado === 'confirmado';

            return (
              <div
                key={cot.id}
                className={`p-4 rounded-xl border transition-all duration-200 relative ${
                  isPending
                    ? 'bg-amber-50/40 border-amber-300 shadow-[0_4px_12px_-2px_rgba(245,158,11,0.15)] ring-1 ring-amber-300'
                    : isConfirmed
                    ? 'bg-emerald-50/30 border-emerald-200'
                    : 'bg-white border-slate-200 shadow-xs'
                }`}
              >
                {/* Visual pulse tag for pending quotes */}
                {isPending && (
                  <div className="absolute -top-2.5 left-4 px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-sm animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                    <span>Nueva · Requiere Respuesta Rápida</span>
                  </div>
                )}

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
                  {/* Left Column: Client & Space Info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 font-serif">
                        {cot.nombre}
                      </span>

                      {/* Location tag */}
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        <MapPin className="w-3 h-3 text-sky-600" />
                        <span>{cot.ubicacion || 'Alto Hospicio / Iquique'}</span>
                      </span>

                      {/* Date tag */}
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>{cot.fecha}</span>
                      </span>
                    </div>

                    {/* Service & Plan Specs Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Plan Solicitado
                        </span>
                        <span className="font-bold text-sky-800">
                          {cot.plan}
                        </span>
                      </div>

                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Tipo de Inmueble
                        </span>
                        <span className="font-semibold text-slate-800 truncate block" title={cot.tipoEspacio}>
                          {cot.tipoEspacio || cot.categoria || 'Residencial'}
                        </span>
                      </div>

                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Tamaño / Metraje
                        </span>
                        <span className="font-semibold text-slate-800">
                          {cot.tamano}
                        </span>
                      </div>

                      <div className="bg-slate-50 p-2 rounded-lg border border-slate-200">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Valor Estimado
                        </span>
                        <span className="font-black text-emerald-700">
                          {cot.precioReferencial}
                        </span>
                      </div>
                    </div>

                    {/* Preferencia de Abono Badge */}
                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                      <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                        <CreditCard className="w-3.5 h-3.5 text-sky-700" />
                        <span>Abono:</span>
                      </span>
                      {cot.opcionAbono === 'Sin abono' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
                          <span>Sin abono previo (Paga 100% al finalizar)</span>
                        </span>
                      ) : cot.opcionAbono === 'La mitad' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                          <span>La mitad ({cot.montoAbono || '50%'} ahora · Saldo: {cot.saldoRestante || '50%'})</span>
                        </span>
                      ) : cot.opcionAbono === 'Todo al tiro' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                          <span>Todo al tiro (100% pagado: {cot.montoAbono || cot.precioReferencial})</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-sky-50 text-sky-800 border border-sky-200">
                          <span>{cot.opcionAbono || '$10.000'} ({cot.montoAbono || cot.abonoReserva || '$10.000'} ahora · Saldo: {cot.saldoRestante || 'restante'})</span>
                        </span>
                      )}
                    </div>

                    {/* Client Notes if any */}
                    {cot.detalles && cot.detalles !== 'Sin especificaciones adicionales' && (
                      <div className="text-xs bg-slate-100/80 p-2 rounded-md text-slate-700 border border-slate-200/80 italic">
                        "{cot.detalles}"
                      </div>
                    )}
                  </div>

                  {/* Right Column: Fast Contact & Status Actions */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-stretch md:items-end gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-200">
                    
                    {/* Primary Button: WhatsApp Response con Ícono Oficial */}
                    <button
                      type="button"
                      onClick={() => handleQuickWhatsAppResponse(cot)}
                      className="px-3.5 py-2 rounded-lg text-xs font-bold bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                    >
                      <WhatsAppIcon variant="official" className="w-4 h-4 shrink-0" />
                      <span>Responder por WhatsApp</span>
                    </button>

                    {/* Secondary Actions Row */}
                    <div className="flex items-center gap-1.5 justify-end">
                      {cot.telefono && cot.telefono !== 'No indicado' && (
                        <a
                          href={`tel:${cot.telefono}`}
                          className="p-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 transition-colors"
                          title={`Llamar a ${cot.telefono}`}
                        >
                          <Phone className="w-3.5 h-3.5 text-sky-700" />
                        </a>
                      )}

                      {/* Status Dropdown */}
                      <select
                        value={cot.estado}
                        disabled={actingId === cot.id}
                        onChange={(e) =>
                          handleStatusChange(
                            cot.id,
                            e.target.value as CotizacionItem['estado']
                          )
                        }
                        className={`text-xs font-bold py-1.5 px-2.5 rounded-lg border cursor-pointer focus:outline-none ${
                          cot.estado === 'pendiente'
                            ? 'bg-rose-50 text-rose-700 border-rose-300'
                            : cot.estado === 'respondido'
                            ? 'bg-sky-50 text-sky-800 border-sky-300'
                            : cot.estado === 'confirmado'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-slate-100 text-slate-600 border-slate-300'
                        }`}
                      >
                        <option value="pendiente">⚡ Pendiente</option>
                        <option value="respondido">💬 Respondido</option>
                        <option value="confirmado">✅ Confirmado ($10.000)</option>
                        <option value="archivado">📦 Archivado</option>
                      </select>

                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() => handleDelete(cot.id)}
                        disabled={actingId === cot.id}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Eliminar registro"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
