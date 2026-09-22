import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Image as ImageIcon,
  Layers,
  Star,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Check,
  Save,
  LogOut,
  ExternalLink,
  Copy,
  FolderPlus,
  ChevronRight,
  ShieldCheck,
  Upload,
  CheckCircle2,
  Eye,
  EyeOff,
  Bell,
  BellRing,
} from 'lucide-react';
import {
  GalleryItem,
  PlanItem,
  ServiceItem,
  TestimonialItem,
  CompanyConfig,
  UserProfile,
  CategoryItem,
  SubcategoryItem,
  CotizacionItem,
} from '../types';
import {
  saveGalleryItem,
  deleteGalleryItem,
  savePlanItem,
  deletePlanItem,
  updateCompanyConfig,
  updateTestimonial,
  deleteTestimonial,
  saveCategory,
  deleteCategory,
} from '../services/firestoreService';
import { logoutUser } from '../services/authService';
import { defaultCategories } from '../data/defaultData';
import { CotizacionesTab } from './admin/CotizacionesTab';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  categories?: CategoryItem[];
  plans: PlanItem[];
  gallery: GalleryItem[];
  services: ServiceItem[];
  testimonials: TestimonialItem[];
  config: CompanyConfig;
  cotizaciones?: CotizacionItem[];
  initialTab?: 'cotizaciones' | 'categorias' | 'planes' | 'galeria' | 'opiniones' | 'configuracion';
  onRefreshData: () => Promise<void>;
  onOpenReviewModal: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  user,
  categories = defaultCategories,
  plans,
  gallery,
  testimonials,
  config,
  cotizaciones = [],
  initialTab,
  onRefreshData,
  onOpenReviewModal,
}) => {
  const pendingCount = cotizaciones.filter((c) => c.estado === 'pendiente').length;

  const [activeTab, setActiveTab] = useState<
    'cotizaciones' | 'categorias' | 'planes' | 'galeria' | 'opiniones' | 'configuracion'
  >(initialTab || (pendingCount > 0 ? 'cotizaciones' : 'categorias'));

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  const [saving, setSaving] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{
    text: string;
    type: 'success' | 'error';
  } | null>(null);

  // --- CATEGORÍAS & SUBCATEGORÍAS STATE ---
  const [selectedCatId, setSelectedCatId] = useState<string>(
    categories[0]?.id || 'hogar'
  );
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  const currentCategory =
    categories.find((c) => c.id === selectedCatId) || categories[0];

  // Subcategory editing
  const [editingSubcat, setEditingSubcat] = useState<SubcategoryItem | null>(null);
  const [isNewSubcat, setIsNewSubcat] = useState(false);

  // --- PLANES STATE ---
  const [editingPlan, setEditingPlan] = useState<PlanItem | null>(null);
  const [newTaskInput, setNewTaskInput] = useState('');
  const [newNoIncludeInput, setNewNoIncludeInput] = useState('');

  // --- GALERÍA STATE ---
  const [editingGalleryItem, setEditingGalleryItem] =
    useState<Partial<GalleryItem> | null>(null);

  // --- CONFIGURACIÓN STATE ---
  const [companyForm, setCompanyForm] = useState<CompanyConfig>(config);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen) return null;

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedbackMsg({ text, type });
    setTimeout(() => setFeedbackMsg(null), 3500);
  };

  const handleLogout = async () => {
    await logoutUser();
    onClose();
  };

  // -------------------------------------------------------------
  // CATEGORÍAS & SUBCATEGORÍAS HANDLERS
  // -------------------------------------------------------------
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setSaving(true);
    try {
      const newCat: CategoryItem = {
        id: `cat-${Date.now()}`,
        nombre: newCatName.trim(),
        descripcion: newCatDesc.trim() || 'Servicios de aseo y limpieza manual.',
        orden: categories.length + 1,
        activo: true,
        subcategorias: [],
      };
      await saveCategory(newCat);
      await onRefreshData();
      setSelectedCatId(newCat.id);
      setNewCatName('');
      setNewCatDesc('');
      setIsCreatingCategory(false);
      showToast(`Categoría "${newCat.nombre}" creada con éxito.`);
    } catch (err: any) {
      showToast('Error al crear categoría: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCurrentCategory = async (catId: string) => {
    if (!confirm('¿Seguro que deseas eliminar esta categoría completa y sus subcategorías?')) {
      return;
    }
    setSaving(true);
    try {
      await deleteCategory(catId);
      await onRefreshData();
      const remaining = categories.filter((c) => c.id !== catId);
      if (remaining.length > 0) setSelectedCatId(remaining[0].id);
      showToast('Categoría eliminada.');
    } catch (err: any) {
      showToast('Error al eliminar categoría: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleStartNewSubcategory = () => {
    setIsNewSubcat(true);
    setEditingSubcat({
      id: `sub-${Date.now()}`,
      categoriaId: currentCategory.id,
      nombre: '',
      descripcion: '',
      activo: true,
      precios: {
        basico: { pequeno: '$34.990', mediano: '$44.990', grande: '$59.990' },
        estandar: { pequeno: '$44.990', mediano: '$54.990', grande: '$69.990' },
        profundo: { pequeno: '$54.990', mediano: '$64.990', grande: '$79.990' },
      },
    });
  };

  const handleSaveSubcategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubcat || !editingSubcat.nombre.trim()) return;
    setSaving(true);
    try {
      const updatedSubcats = [...(currentCategory.subcategorias || [])];
      const index = updatedSubcats.findIndex((s) => s.id === editingSubcat.id);

      if (index >= 0) {
        updatedSubcats[index] = editingSubcat;
      } else {
        updatedSubcats.push(editingSubcat);
      }

      const updatedCategory: CategoryItem = {
        ...currentCategory,
        subcategorias: updatedSubcats,
      };

      await saveCategory(updatedCategory);
      await onRefreshData();
      setEditingSubcat(null);
      setIsNewSubcat(false);
      showToast(`Subcategoría "${editingSubcat.nombre}" guardada con sus precios.`);
    } catch (err: any) {
      showToast('Error al guardar subcategoría: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSubcategory = async (subId: string) => {
    if (!confirm('¿Eliminar esta subcategoría y sus precios configurados?')) return;
    setSaving(true);
    try {
      const updatedSubcats = (currentCategory.subcategorias || []).filter(
        (s) => s.id !== subId
      );
      const updatedCategory: CategoryItem = {
        ...currentCategory,
        subcategorias: updatedSubcats,
      };
      await saveCategory(updatedCategory);
      await onRefreshData();
      showToast('Subcategoría eliminada.');
    } catch (err: any) {
      showToast('Error al eliminar: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // -------------------------------------------------------------
  // PLANES HANDLERS
  // -------------------------------------------------------------
  const handleAddTaskToPlan = () => {
    if (!editingPlan || !newTaskInput.trim()) return;
    setEditingPlan({
      ...editingPlan,
      incluye: [...(editingPlan.incluye || []), newTaskInput.trim()],
    });
    setNewTaskInput('');
  };

  const handleRemoveTaskFromPlan = (index: number) => {
    if (!editingPlan) return;
    const updated = [...(editingPlan.incluye || [])];
    updated.splice(index, 1);
    setEditingPlan({ ...editingPlan, incluye: updated });
  };

  const handleAddNoIncludeToPlan = () => {
    if (!editingPlan || !newNoIncludeInput.trim()) return;
    setEditingPlan({
      ...editingPlan,
      noIncluye: [...(editingPlan.noIncluye || []), newNoIncludeInput.trim()],
    });
    setNewNoIncludeInput('');
  };

  const handleRemoveNoIncludeFromPlan = (index: number) => {
    if (!editingPlan) return;
    const updated = [...(editingPlan.noIncluye || [])];
    updated.splice(index, 1);
    setEditingPlan({ ...editingPlan, noIncluye: updated });
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    setSaving(true);
    try {
      await savePlanItem(editingPlan);
      await onRefreshData();
      setEditingPlan(null);
      showToast(`Plan "${editingPlan.nombre}" actualizado con éxito.`);
    } catch (err: any) {
      showToast('Error al guardar plan: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  // -------------------------------------------------------------
  // CONFIG HANDLER
  // -------------------------------------------------------------
  const handleSaveCompanyConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateCompanyConfig(companyForm);
      await onRefreshData();
      showToast('Configuración general y logo guardados correctamente.');
    } catch (err: any) {
      showToast('Error al guardar configuración: ' + err.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[95vh] flex flex-col animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-700 flex items-center justify-center text-white font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-serif font-bold text-white tracking-tight">
                  Panel de Administración · Aseo Vía
                </h3>
                <span className="px-2 py-0.5 rounded-sm bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  Modo Editor
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Usuario: <span className="text-sky-300 font-bold">{user.username}</span> · Personaliza categorías, subcategorías, planes y precios
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              type="button"
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-7 h-7 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Cerrar panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Top Alert Banner for Pending Cotizaciones */}
        {pendingCount > 0 && (
          <div className="bg-gradient-to-r from-amber-600 via-rose-600 to-amber-600 text-white px-4 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-inner shrink-0 animate-in fade-in">
            <div className="flex items-center gap-2 text-xs font-bold">
              <span className="p-1 rounded-full bg-white/20 animate-pulse shrink-0">
                <BellRing className="w-3.5 h-3.5 text-white" />
              </span>
              <span>
                ⚡ ¡Tienes {pendingCount} cotización{pendingCount > 1 ? 'es' : ''} pendiente{pendingCount > 1 ? 's' : ''} de respuesta inmediata!
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('cotizaciones')}
              className="px-2.5 py-1 rounded bg-white text-slate-900 hover:bg-amber-50 text-[11px] font-black uppercase tracking-wider transition-colors shrink-0 cursor-pointer shadow-xs"
            >
              Responder Cotizaciones ({pendingCount})
            </button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-slate-100 p-1.5 border-b border-slate-200 flex items-center gap-1 overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('cotizaciones')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer relative ${
              activeTab === 'cotizaciones'
                ? 'bg-white text-sky-900 shadow-xs ring-1 ring-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bell className={`w-3.5 h-3.5 ${pendingCount > 0 ? 'text-rose-600 animate-bounce' : 'text-sky-700'}`} />
            <span>Cotizaciones</span>
            {pendingCount > 0 ? (
              <span className="relative flex h-4 min-w-4 items-center justify-center px-1 text-[10px] font-black text-white bg-rose-600 rounded-full shadow-xs">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative z-10">{pendingCount}</span>
              </span>
            ) : (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 font-semibold">
                {cotizaciones.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('categorias');
              setEditingSubcat(null);
            }}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'categorias'
                ? 'bg-white text-sky-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FolderPlus className="w-3.5 h-3.5 text-sky-700" />
            <span>Categorías y Precios ({categories.length})</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('planes');
              setEditingPlan(null);
            }}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'planes'
                ? 'bg-white text-sky-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-sky-700" />
            <span>Los 3 Planes & Tareas ({plans.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('galeria')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'galeria'
                ? 'bg-white text-sky-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Galería & Fotos ({gallery.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('opiniones')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'opiniones'
                ? 'bg-white text-sky-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            <span>Opiniones ({testimonials.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('configuracion')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'configuracion'
                ? 'bg-white text-sky-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Logo y Datos Empresa</span>
          </button>
        </div>

        {/* Feedback Toast */}
        {feedbackMsg && (
          <div
            className={`p-2.5 text-xs font-bold flex items-center gap-2 border-b ${
              feedbackMsg.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            {feedbackMsg.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <X className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedbackMsg.text}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-[#fafaf9]">
          
          {/* ============================================================== */}
          {/* TAB 0: BANDEJA DE COTIZACIONES Y ALERTAS EN TIEMPO REAL        */}
          {/* ============================================================== */}
          {activeTab === 'cotizaciones' && (
            <CotizacionesTab
              cotizaciones={cotizaciones}
              onRefresh={onRefreshData}
              showToast={showToast}
              config={config}
            />
          )}

          {/* ============================================================== */}
          {/* TAB 1: CATEGORÍAS & SUBCATEGORÍAS CON PRECIOS                  */}
          {/* ============================================================== */}
          {activeTab === 'categorias' && (
            <div className="space-y-6">
              
              {/* Category Pills & New Category Button */}
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-slate-950">
                      Categorías del Catálogo Comercial
                    </h4>
                    <p className="text-xs text-slate-500">
                      Selecciona una categoría para gestionar sus subespacios y los precios de cada plan por tamaño (Pequeño, Mediano y Grande).
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsCreatingCategory(!isCreatingCategory)}
                    className="px-3 py-1.5 rounded-md bg-sky-700 hover:bg-sky-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-center"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nueva Categoría</span>
                  </button>
                </div>

                {/* Create Category Form */}
                {isCreatingCategory && (
                  <form
                    onSubmit={handleCreateCategory}
                    className="mb-4 p-3 bg-slate-50 rounded-md border border-slate-200 space-y-3"
                  >
                    <div className="font-bold text-xs text-slate-800">
                      Crear Nueva Categoría (ej: Clínicas, Plantas Industriales, etc.)
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                          Nombre de la Categoría *
                        </label>
                        <input
                          type="text"
                          required
                          value={newCatName}
                          onChange={(e) => setNewCatName(e.target.value)}
                          placeholder="Ej: Centros Médicos y Clínicas"
                          className="w-full text-xs p-2 rounded-md border border-slate-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                          Descripción breve
                        </label>
                        <input
                          type="text"
                          value={newCatDesc}
                          onChange={(e) => setNewCatDesc(e.target.value)}
                          placeholder="Ej: Aseo especializado para consultorios"
                          className="w-full text-xs p-2 rounded-md border border-slate-300 bg-white"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsCreatingCategory(false)}
                        className="px-3 py-1 rounded-md text-xs font-semibold text-slate-600 hover:bg-slate-200"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-3 py-1 rounded-md text-xs font-bold bg-slate-900 text-white hover:bg-slate-800"
                      >
                        {saving ? 'Guardando...' : 'Guardar Categoría'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Categories Tabs */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setSelectedCatId(cat.id);
                        setEditingSubcat(null);
                      }}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                        selectedCatId === cat.id
                          ? 'bg-sky-800 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {cat.nombre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subcategories Inside Selected Category */}
              {currentCategory && (
                <div className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-serif font-bold text-base text-slate-950">
                          {currentCategory.nombre}
                        </h4>
                        <span className="text-[10.5px] px-2 py-0.5 rounded-sm bg-sky-100 text-sky-800 font-bold">
                          {currentCategory.subcategorias?.length || 0} subespacios
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {currentCategory.descripcion}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleStartNewSubcategory}
                        className="px-3 py-1.5 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>+ Agregar Subcategoría</span>
                      </button>

                      {categories.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteCurrentCategory(currentCategory.id)}
                          className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Eliminar esta categoría"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Subcategory Form Modal/Drawer */}
                  {editingSubcat && (
                    <form
                      onSubmit={handleSaveSubcategory}
                      className="mb-6 p-4 rounded-lg bg-sky-50/70 border-2 border-sky-200 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <h5 className="font-serif font-bold text-sm text-sky-950">
                          {isNewSubcat
                            ? `Nueva Subcategoría en ${currentCategory.nombre}`
                            : `Editar: ${editingSubcat.nombre}`}
                        </h5>
                        <button
                          type="button"
                          onClick={() => setEditingSubcat(null)}
                          className="text-slate-500 hover:text-slate-800"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">
                            Nombre del Subespacio * (ej: Casa, Cabaña, Barbería, Depto)
                          </label>
                          <input
                            type="text"
                            required
                            value={editingSubcat.nombre}
                            onChange={(e) =>
                              setEditingSubcat({ ...editingSubcat, nombre: e.target.value })
                            }
                            placeholder="Ej: Cabaña o Estancia"
                            className="w-full text-xs p-2 rounded-md border border-slate-300 bg-white"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-slate-700 block mb-1">
                            Descripción / Espacios a cubrir
                          </label>
                          <input
                            type="text"
                            value={editingSubcat.descripcion || ''}
                            onChange={(e) =>
                              setEditingSubcat({
                                ...editingSubcat,
                                descripcion: e.target.value,
                              })
                            }
                            placeholder="Ej: Habitaciones, terraza, living y baños"
                            className="w-full text-xs p-2 rounded-md border border-slate-300 bg-white"
                          />
                        </div>
                      </div>

                      {/* Pricing Matrix per Plan and Size */}
                      <div className="space-y-3 bg-white p-3 rounded-md border border-sky-100">
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <span>Matriz de Precios por Plan y Tamaño (Pequeño, Mediano, Grande):</span>
                        </div>

                        {/* PLAN BÁSICO */}
                        <div className="p-2.5 rounded-md bg-slate-50 border border-slate-200">
                          <span className="text-xs font-bold text-slate-900 block mb-1.5">
                            Plan BÁSICO (Mantener limpio)
                          </span>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="text-[10px] text-slate-500 block">Pequeño (≤50 m²)</label>
                              <input
                                type="text"
                                value={editingSubcat.precios.basico.pequeno}
                                onChange={(e) =>
                                  setEditingSubcat({
                                    ...editingSubcat,
                                    precios: {
                                      ...editingSubcat.precios,
                                      basico: {
                                        ...editingSubcat.precios.basico,
                                        pequeno: e.target.value,
                                      },
                                    },
                                  })
                                }
                                className="w-full text-xs p-1.5 rounded-sm border border-slate-300 bg-white font-bold"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-500 block">Mediano (51–100 m²)</label>
                              <input
                                type="text"
                                value={editingSubcat.precios.basico.mediano}
                                onChange={(e) =>
                                  setEditingSubcat({
                                    ...editingSubcat,
                                    precios: {
                                      ...editingSubcat.precios,
                                      basico: {
                                        ...editingSubcat.precios.basico,
                                        mediano: e.target.value,
                                      },
                                    },
                                  })
                                }
                                className="w-full text-xs p-1.5 rounded-sm border border-slate-300 bg-white font-bold"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-500 block">Grande (101–250 m²)</label>
                              <input
                                type="text"
                                value={editingSubcat.precios.basico.grande}
                                onChange={(e) =>
                                  setEditingSubcat({
                                    ...editingSubcat,
                                    precios: {
                                      ...editingSubcat.precios,
                                      basico: {
                                        ...editingSubcat.precios.basico,
                                        grande: e.target.value,
                                      },
                                    },
                                  })
                                }
                                className="w-full text-xs p-1.5 rounded-sm border border-slate-300 bg-white font-bold"
                              />
                            </div>
                          </div>
                        </div>

                        {/* PLAN ESTÁNDAR */}
                        <div className="p-2.5 rounded-md bg-sky-50/50 border border-sky-200">
                          <span className="text-xs font-bold text-sky-950 block mb-1.5">
                            Plan ESTÁNDAR (Limpiar y detallar)
                          </span>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="text-[10px] text-slate-500 block">Pequeño (≤50 m²)</label>
                              <input
                                type="text"
                                value={editingSubcat.precios.estandar.pequeno}
                                onChange={(e) =>
                                  setEditingSubcat({
                                    ...editingSubcat,
                                    precios: {
                                      ...editingSubcat.precios,
                                      estandar: {
                                        ...editingSubcat.precios.estandar,
                                        pequeno: e.target.value,
                                      },
                                    },
                                  })
                                }
                                className="w-full text-xs p-1.5 rounded-sm border border-slate-300 bg-white font-bold text-sky-950"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-500 block">Mediano (51–100 m²)</label>
                              <input
                                type="text"
                                value={editingSubcat.precios.estandar.mediano}
                                onChange={(e) =>
                                  setEditingSubcat({
                                    ...editingSubcat,
                                    precios: {
                                      ...editingSubcat.precios,
                                      estandar: {
                                        ...editingSubcat.precios.estandar,
                                        mediano: e.target.value,
                                      },
                                    },
                                  })
                                }
                                className="w-full text-xs p-1.5 rounded-sm border border-slate-300 bg-white font-bold text-sky-950"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-500 block">Grande (101–250 m²)</label>
                              <input
                                type="text"
                                value={editingSubcat.precios.estandar.grande}
                                onChange={(e) =>
                                  setEditingSubcat({
                                    ...editingSubcat,
                                    precios: {
                                      ...editingSubcat.precios,
                                      estandar: {
                                        ...editingSubcat.precios.estandar,
                                        grande: e.target.value,
                                      },
                                    },
                                  })
                                }
                                className="w-full text-xs p-1.5 rounded-sm border border-slate-300 bg-white font-bold text-sky-950"
                              />
                            </div>
                          </div>
                        </div>

                        {/* PLAN PROFUNDO */}
                        <div className="p-2.5 rounded-md bg-slate-50 border border-slate-200">
                          <span className="text-xs font-bold text-slate-900 block mb-1.5">
                            Plan PROFUNDO (Limpiar profundamente)
                          </span>
                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="text-[10px] text-slate-500 block">Pequeño (≤50 m²)</label>
                              <input
                                type="text"
                                value={editingSubcat.precios.profundo.pequeno}
                                onChange={(e) =>
                                  setEditingSubcat({
                                    ...editingSubcat,
                                    precios: {
                                      ...editingSubcat.precios,
                                      profundo: {
                                        ...editingSubcat.precios.profundo,
                                        pequeno: e.target.value,
                                      },
                                    },
                                  })
                                }
                                className="w-full text-xs p-1.5 rounded-sm border border-slate-300 bg-white font-bold"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-500 block">Mediano (51–100 m²)</label>
                              <input
                                type="text"
                                value={editingSubcat.precios.profundo.mediano}
                                onChange={(e) =>
                                  setEditingSubcat({
                                    ...editingSubcat,
                                    precios: {
                                      ...editingSubcat.precios,
                                      profundo: {
                                        ...editingSubcat.precios.profundo,
                                        mediano: e.target.value,
                                      },
                                    },
                                  })
                                }
                                className="w-full text-xs p-1.5 rounded-sm border border-slate-300 bg-white font-bold"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] text-slate-500 block">Grande (101–250 m²)</label>
                              <input
                                type="text"
                                value={editingSubcat.precios.profundo.grande}
                                onChange={(e) =>
                                  setEditingSubcat({
                                    ...editingSubcat,
                                    precios: {
                                      ...editingSubcat.precios,
                                      profundo: {
                                        ...editingSubcat.precios.profundo,
                                        grande: e.target.value,
                                      },
                                    },
                                  })
                                }
                                className="w-full text-xs p-1.5 rounded-sm border border-slate-300 bg-white font-bold"
                              />
                            </div>
                          </div>
                        </div>

                      </div>

                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setEditingSubcat(null)}
                          className="px-3 py-1.5 rounded-md text-xs font-semibold text-slate-600 hover:bg-slate-200"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          disabled={saving}
                          className="px-4 py-1.5 rounded-md text-xs font-bold bg-sky-700 hover:bg-sky-800 text-white flex items-center gap-1.5"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>{saving ? 'Guardando...' : 'Guardar Precios de Subespacio'}</span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Existing Subcategories List */}
                  <div className="space-y-3">
                    {(currentCategory.subcategorias || []).map((sub) => (
                      <div
                        key={sub.id}
                        className="p-3.5 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_2px_4px_-1px_rgb(0_0_0/0.03)]"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-serif font-bold text-sm text-slate-900">
                              {sub.nombre}
                            </span>
                          </div>
                          {sub.descripcion && (
                            <p className="text-xs text-slate-500 mt-0.5">
                              {sub.descripcion}
                            </p>
                          )}
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-600">
                            <span className="px-2 py-0.5 rounded-sm bg-slate-100 font-medium">
                              Básico: {sub.precios?.basico?.pequeno} / {sub.precios?.basico?.mediano} / {sub.precios?.basico?.grande}
                            </span>
                            <span className="px-2 py-0.5 rounded-sm bg-sky-50 text-sky-900 font-semibold">
                              Estándar: {sub.precios?.estandar?.pequeno} / {sub.precios?.estandar?.mediano} / {sub.precios?.estandar?.grande}
                            </span>
                            <span className="px-2 py-0.5 rounded-sm bg-slate-100 font-medium">
                              Profundo: {sub.precios?.profundo?.pequeno} / {sub.precios?.profundo?.mediano} / {sub.precios?.profundo?.grande}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setIsNewSubcat(false);
                              setEditingSubcat(sub);
                            }}
                            className="px-2.5 py-1 rounded-md text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Editar Precios</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSubcategory(sub.id)}
                            className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Eliminar subcategoría"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              )}

            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 2: LOS 3 PLANES & TAREAS INCLUIDAS                         */}
          {/* ============================================================== */}
          {activeTab === 'planes' && (
            <div className="space-y-6">
              
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)]">
                <h4 className="font-serif font-bold text-sm text-slate-950">
                  Gestor de los 3 Planes Principales (Básico, Estándar, Profundo)
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Modifica qué tareas incluye cada plan (ej. mopeo, limpieza de piso, zócalos, desinfección) y los precios de referencia base.
                </p>
              </div>

              {/* Editing Plan Form */}
              {editingPlan ? (
                <form
                  onSubmit={handleSavePlan}
                  className="bg-white p-5 rounded-lg border border-sky-300 shadow-md space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                    <div>
                      <h4 className="font-serif font-bold text-base text-slate-950">
                        Editando Plan: {editingPlan.nombre}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Personaliza la descripción y la lista de labores incluidas y excluidas.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingPlan(null)}
                      className="text-slate-400 hover:text-slate-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Nombre del Plan *
                      </label>
                      <input
                        type="text"
                        required
                        value={editingPlan.nombre}
                        onChange={(e) =>
                          setEditingPlan({ ...editingPlan, nombre: e.target.value })
                        }
                        className="w-full text-xs p-2 rounded-md border border-slate-300 bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        Descripción o Enfoque (ej: "Mantener limpio", "Limpiar y detallar")
                      </label>
                      <input
                        type="text"
                        value={editingPlan.descripcion}
                        onChange={(e) =>
                          setEditingPlan({ ...editingPlan, descripcion: e.target.value })
                        }
                        className="w-full text-xs p-2 rounded-md border border-slate-300 bg-white"
                      />
                    </div>
                  </div>

                  {/* Checklist of Included Tasks */}
                  <div className="p-3.5 rounded-md bg-[#fafaf9] border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        ✓ Tareas Incluidas en este Plan ({editingPlan.incluye?.length || 0})
                      </span>
                    </div>

                    <div className="space-y-1.5 max-h-52 overflow-y-auto">
                      {(editingPlan.incluye || []).map((task, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between gap-2 p-2 rounded bg-white border border-slate-200 text-xs text-slate-800"
                        >
                          <span className="flex items-center gap-2">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            {task}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTaskFromPlan(i)}
                            className="text-slate-400 hover:text-rose-600"
                            title="Eliminar tarea"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Add new task input */}
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={newTaskInput}
                        onChange={(e) => setNewTaskInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTaskToPlan();
                          }
                        }}
                        placeholder="Ej: Mopeo y limpieza de piso, zócalo, sanitarios..."
                        className="flex-1 text-xs p-2 rounded-md border border-slate-300 bg-white"
                      />
                      <button
                        type="button"
                        onClick={handleAddTaskToPlan}
                        className="px-3 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold cursor-pointer"
                      >
                        + Agregar
                      </button>
                    </div>
                  </div>

                  {/* Checklist of Excluded Tasks */}
                  <div className="p-3.5 rounded-md bg-[#fafaf9] border border-slate-200 space-y-3">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                      ✗ Tareas NO Incluidas
                    </span>

                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {(editingPlan.noIncluye || []).map((task, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between gap-2 p-2 rounded bg-white border border-slate-200 text-xs text-slate-500"
                        >
                          <span className="flex items-center gap-2">
                            <X className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            {task}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveNoIncludeFromPlan(i)}
                            className="text-slate-400 hover:text-rose-600"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={newNoIncludeInput}
                        onChange={(e) => setNewNoIncludeInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddNoIncludeToPlan();
                          }
                        }}
                        placeholder="Ej: No incluye maquinaria de aspirado..."
                        className="flex-1 text-xs p-2 rounded-md border border-slate-300 bg-white"
                      />
                      <button
                        type="button"
                        onClick={handleAddNoIncludeToPlan}
                        className="px-3 py-2 rounded-md bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold cursor-pointer"
                      >
                        + Agregar
                      </button>
                    </div>
                  </div>

                  {/* Plan Action Buttons */}
                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => setEditingPlan(null)}
                      className="px-4 py-2 rounded-md text-xs font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-5 py-2 rounded-md text-xs font-bold bg-sky-700 hover:bg-sky-800 text-white flex items-center gap-1.5 shadow-xs"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{saving ? 'Guardando...' : 'Guardar Plan'}</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Plan Cards Overview */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {plans.map((p) => (
                    <div
                      key={p.id}
                      className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <h4 className="font-serif font-bold text-base text-slate-950">
                            PLAN {p.nombre}
                          </h4>
                          {p.destacado && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-sm bg-sky-100 text-sky-800">
                              Destacado
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mb-3">
                          {p.descripcion}
                        </p>

                        <div className="space-y-1 text-xs text-slate-700">
                          <span className="font-bold text-[11px] text-slate-900 block uppercase tracking-wider mb-1">
                            Incluye {p.incluye?.length || 0} tareas:
                          </span>
                          {(p.incluye || []).slice(0, 4).map((t, idx) => (
                            <div key={idx} className="flex items-start gap-1.5 text-xs">
                              <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{t}</span>
                            </div>
                          ))}
                          {(p.incluye?.length || 0) > 4 && (
                            <span className="text-[11px] text-slate-400 block pt-1">
                              + {(p.incluye?.length || 0) - 4} tareas adicionales
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setEditingPlan(p)}
                          className="w-full py-2 px-3 rounded-md bg-sky-50 hover:bg-sky-700 hover:text-white text-sky-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Modificar Plan & Tareas</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 3: GALERÍA & FOTOS                                         */}
          {/* ============================================================== */}
          {activeTab === 'galeria' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-sm text-slate-950">
                    Galería de Trabajos de Referencia (Sin Máquinas)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Muestra imágenes auténticas de aseo manual detallado en hogares y comercios.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {gallery.map((g) => (
                  <div
                    key={g.id}
                    className="bg-white rounded-lg overflow-hidden border border-slate-200 shadow-xs"
                  >
                    <img
                      src={g.imagenUrl}
                      alt={g.titulo}
                      className="w-full h-32 object-cover"
                    />
                    <div className="p-3">
                      <h5 className="font-serif font-bold text-xs text-slate-900 line-clamp-1">
                        {g.titulo}
                      </h5>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                        {g.descripcion}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 4: OPINIONES                                              */}
          {/* ============================================================== */}
          {activeTab === 'opiniones' && (
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-serif font-bold text-sm text-slate-950">
                    Opiniones y Calificaciones de Clientes
                  </h4>
                  <p className="text-xs text-slate-500">
                    Gestiona qué opiniones se muestran activas en la página web.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onOpenReviewModal}
                  className="px-3 py-1.5 rounded-md bg-sky-700 text-white text-xs font-bold"
                >
                  + Agregar Testimonio
                </button>
              </div>

              <div className="space-y-3">
                {testimonials.map((t) => (
                  <div
                    key={t.id}
                    className="p-3.5 rounded-lg border border-slate-200 bg-white flex items-start justify-between gap-3 shadow-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-xs text-slate-900">{t.nombre}</span>
                        <span className="text-[10.5px] text-slate-500">({t.espacio || t.comuna})</span>
                      </div>
                      <p className="text-xs text-slate-700 font-serif italic">
                        "{t.comentario}"
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteTestimonial(t.id).then(onRefreshData)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 5: LOGO Y DATOS DE LA EMPRESA                              */}
          {/* ============================================================== */}
          {activeTab === 'configuracion' && (
            <form
              onSubmit={handleSaveCompanyConfig}
              className="bg-white p-5 rounded-lg border border-slate-200 shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] space-y-4"
            >
              <div className="pb-3 border-b border-slate-100">
                <h4 className="font-serif font-bold text-base text-slate-950">
                  Logo y Datos Corporativos de Aseo Vía
                </h4>
                <p className="text-xs text-slate-500">
                  Actualiza el logo oficial, números de WhatsApp, teléfono y horarios de atención.
                </p>
              </div>

              {/* Logo Manager */}
              <div className="p-3.5 rounded-lg bg-sky-50/60 border border-sky-200 space-y-2.5">
                <div className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-sky-700" />
                  <label className="text-xs font-bold text-sky-950">
                    URL o Ruta del Logo Oficial
                  </label>
                </div>
                <input
                  type="text"
                  value={companyForm.logoUrl || ''}
                  onChange={(e) =>
                    setCompanyForm({ ...companyForm, logoUrl: e.target.value })
                  }
                  placeholder="/src/assets/images/aseo_via_logo_1790115247179.jpg"
                  className="w-full text-xs p-2 rounded-md border border-slate-300 bg-white"
                />
                {companyForm.logoUrl && (
                  <div className="mt-2 p-2 bg-white rounded border border-slate-200 inline-block">
                    <img
                      src={companyForm.logoUrl}
                      alt="Vista previa del logo"
                      className="h-10 w-auto object-contain"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Número de WhatsApp (con código de país)
                  </label>
                  <input
                    type="text"
                    value={companyForm.whatsapp}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, whatsapp: e.target.value })
                    }
                    className="w-full text-xs p-2 rounded-md border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    WhatsApp Visible en Web
                  </label>
                  <input
                    type="text"
                    value={companyForm.whatsappDisplay}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, whatsappDisplay: e.target.value })
                    }
                    className="w-full text-xs p-2 rounded-md border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    value={companyForm.telefono}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, telefono: e.target.value })
                    }
                    className="w-full text-xs p-2 rounded-md border border-slate-300 bg-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Horario de Atención
                  </label>
                  <input
                    type="text"
                    value={companyForm.horario}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, horario: e.target.value })
                    }
                    className="w-full text-xs p-2 rounded-md border border-slate-300 bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Zonas de Atención
                  </label>
                  <input
                    type="text"
                    value={companyForm.zonasAtencion}
                    onChange={(e) =>
                      setCompanyForm({ ...companyForm, zonasAtencion: e.target.value })
                    }
                    className="w-full text-xs p-2 rounded-md border border-slate-300 bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-3 border-t border-slate-200">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-md text-xs font-bold bg-sky-700 hover:bg-sky-800 text-white flex items-center gap-1.5 shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Guardando...' : 'Guardar Configuración'}</span>
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
