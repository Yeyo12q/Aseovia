import React, { useState } from 'react';
import { X, Star, CheckCircle, HeartHandshake, MapPin, Send, MessageSquareHeart } from 'lucide-react';
import { submitTestimonial } from '../services/firestoreService';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewSubmitted?: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  onReviewSubmitted,
}) => {
  const [nombre, setNombre] = useState('');
  const [comuna, setComuna] = useState<'Alto Hospicio' | 'Iquique'>('Alto Hospicio');
  const [tipoEspacio, setTipoEspacio] = useState('Casa o Departamento');
  const [servicio, setServicio] = useState('Plan Estándar');
  const [calificacion, setCalificacion] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [comentario, setComentario] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!nombre.trim()) {
      setError('Por favor indica tu nombre o el nombre de tu local.');
      return;
    }

    if (!comentario.trim() || comentario.trim().length < 10) {
      setError('Por favor déjanos un breve comentario de al menos 10 caracteres sobre tu experiencia.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitTestimonial({
        nombre: nombre.trim(),
        comuna,
        espacio: `${comuna} · ${tipoEspacio}`,
        servicio,
        calificacion,
        comentario: comentario.trim(),
        activo: true,
      });

      setSubmitted(true);
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (err: any) {
      console.error('Error al enviar testimonio:', err);
      setError('Ocurrió un inconveniente al registrar tu comentario. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setSubmitted(false);
    setNombre('');
    setComentario('');
    setCalificacion(5);
    setError(null);
    onClose();
  };

  const getRatingFeedback = (stars: number) => {
    switch (stars) {
      case 5:
        return '¡Excelente! Quedé muy satisfecho(a)';
      case 4:
        return 'Muy buen trabajo y dedicación';
      case 3:
        return 'Buen servicio en general';
      case 2:
        return 'Regular, hay cosas por mejorar';
      case 1:
        return 'No cumplió mis expectativas';
      default:
        return '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-sky-800 to-sky-700 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <MessageSquareHeart className="w-5 h-5 text-sky-200" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">
                Déjanos tu Opinión
              </h3>
              <p className="text-xs text-sky-200 mt-0.5">
                Aseo Vía · Alto Hospicio e Iquique
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={resetAndClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          /* Success Screen */
          <div className="p-8 text-center space-y-4 my-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center animate-in zoom-in-50">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-xl font-black text-slate-900">
              ¡Muchas gracias por tu comentario!
            </h4>
            <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
              Tu experiencia ya ha sido registrada y ayuda a otros vecinos y negocios de Alto Hospicio e Iquique a conocer nuestro compromiso y dedicación.
            </p>
            <div className="pt-4">
              <button
                type="button"
                onClick={resetAndClose}
                className="w-full py-3 px-6 rounded-xl bg-sky-700 hover:bg-sky-800 text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        ) : (
          /* Review Form */
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
            
            <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 text-xs text-sky-900 flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-sky-700 shrink-0" />
              <span>
                ¿Terminamos la limpieza en tu espacio? Cuéntanos qué tal quedó el resultado y la atención.
              </span>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                {error}
              </div>
            )}

            {/* Rating Stars */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                ¿Cómo calificarías nuestro servicio? *
              </label>
              
              <div className="flex items-center justify-center gap-2 mb-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const currentRating = hoverRating || calificacion;
                  const isFilled = star <= currentRating;
                  return (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(null)}
                      onClick={() => setCalificacion(star)}
                      className="p-1 focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                      aria-label={`Calificar con ${star} estrellas`}
                    >
                      <Star
                        className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                          isFilled
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              <span className="text-xs font-semibold text-sky-800">
                {getRatingFeedback(hoverRating || calificacion)}
              </span>
            </div>

            {/* Comuna Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Comuna donde se realizó el servicio *
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['Alto Hospicio', 'Iquique'] as const).map((loc) => (
                  <button
                    type="button"
                    key={loc}
                    onClick={() => setComuna(loc)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 cursor-pointer ${
                      comuna === loc
                        ? 'bg-sky-700 text-white border-sky-700'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{loc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Name & Space Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tu Nombre o Empresa *
                </label>
                <input
                  type="text"
                  placeholder="Ej: Sofía M. / Almacén Don Juan"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-600"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tipo de Espacio
                </label>
                <select
                  value={tipoEspacio}
                  onChange={(e) => setTipoEspacio(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-sky-600"
                >
                  <option value="Casa">Casa</option>
                  <option value="Departamento">Departamento</option>
                  <option value="Oficina o Cowork">Oficina o Cowork</option>
                  <option value="Local Comercial / Tienda">Local Comercial / Tienda</option>
                  <option value="Consulta u Óptica">Consulta Médica u Óptica</option>
                  <option value="Otro espacio">Otro espacio</option>
                </select>
              </div>
            </div>

            {/* Service Received */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Servicio o Plan Contratado
              </label>
              <select
                value={servicio}
                onChange={(e) => setServicio(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-sky-600"
              >
                <option value="Plan ESTÁNDAR">Plan ESTÁNDAR</option>
                <option value="Plan BÁSICO">Plan BÁSICO</option>
                <option value="Plan PROFUNDO">Plan PROFUNDO</option>
                <option value="Limpieza Residencial">Limpieza Residencial</option>
                <option value="Limpieza Comercial / Negocio">Limpieza Comercial / Negocio</option>
                <option value="Limpieza de Oficina">Limpieza de Oficina</option>
              </select>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tu Reseña o Comentario *
              </label>
              <textarea
                rows={3}
                placeholder="Cuéntanos cómo quedó tu espacio, la puntualidad, el trato del equipo y si lo recomendarías..."
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-600"
                required
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-5 rounded-xl font-bold text-sm text-white bg-sky-700 hover:bg-sky-800 disabled:bg-slate-400 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-md shadow-sky-800/20 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Publicando opinión...' : 'PUBLICAR MI OPINIÓN'}</span>
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
};
