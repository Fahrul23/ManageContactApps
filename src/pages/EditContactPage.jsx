import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { updateContact, deleteContact } from '@/features/contacts/contactsSlice';
import ConfirmDialog from '@/components/UI/ConfirmDialog';
const contactSchema = z.object({
  firstName: z.string().min(2, 'Minimal 2 karakter').max(50, 'Maksimal 50 karakter'),
  lastName: z.string().max(50, 'Maksimal 50 karakter').optional().or(z.literal('')),
  jobTitle: z.string().max(100, 'Maksimal 100 karakter').optional().or(z.literal('')),
  company: z.string().max(100, 'Maksimal 100 karakter').optional().or(z.literal('')),
  email: z.string().email('Format email tidak valid'),
  phone: z.string().min(6, 'Nomor terlalu pendek').max(20, 'Nomor terlalu panjang').regex(/^[\d\s\-()]+$/, 'Hanya angka, spasi, -, () yang diizinkan'),
  gender: z.enum(['male', 'female'], {
    errorMap: () => ({
      message: 'Pilih jenis kelamin'
    })
  }),
  location: z.string().optional().or(z.literal('')),
  notes: z.string().optional().or(z.literal(''))
});
function Icon({
  name,
  className = '',
  style = {}
}) {
  return <span className={`material-symbols-outlined ${className}`} style={{
    verticalAlign: 'middle',
    ...style
  }}>
      {name}
    </span>;
}
const EditContactPage = ({
  contactToEdit,
  onBack
}) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
      isDirty
    },
    reset,
    watch
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      jobTitle: '',
      company: '',
      email: '',
      phone: '',
      gender: 'male',
      location: '',
      notes: ''
    }
  });
  const watchedFirstName = watch('firstName');
  const watchedLastName = watch('lastName');
  const watchedJobTitle = watch('jobTitle');
  const watchedCompany = watch('company');
  const watchedGender = watch('gender');
  useEffect(() => {
    if (contactToEdit) {
      reset({
        firstName: contactToEdit.firstName || '',
        lastName: contactToEdit.lastName || '',
        jobTitle: contactToEdit.jobTitle || '',
        company: contactToEdit.company || '',
        email: contactToEdit.email || '',
        phone: contactToEdit.phone || '',
        gender: contactToEdit.gender || 'male',
        location: contactToEdit.city ? `${contactToEdit.city}${contactToEdit.country ? `, ${contactToEdit.country}` : ''}` : contactToEdit.location || '',
        notes: contactToEdit.notes || ''
      });
      setAvatarPreview(contactToEdit.avatar || '');
    }
  }, [contactToEdit, reset]);
  if (!contactToEdit) {
    return <div className="flex flex-col items-center justify-center p-12 text-on-surface-variant">
        <Icon name="error" style={{
        fontSize: '48px',
        color: '#ba1a1a'
      }} />
        <p className="mt-4 text-headline-md">Tidak ada data kontak untuk diedit</p>
        <button onClick={onBack} className="mt-4 px-6 py-2 bg-primary text-on-primary rounded-xl font-bold hover:bg-primary-container transition-all">
          Kembali ke Daftar
        </button>
      </div>;
  }
  const handleFileChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = ev => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
  };
  const handleRemoveAvatar = () => {
    setAvatarPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  const onSubmit = data => {
    const locParts = (data.location || '').split(',').map(s => s.trim());
    const city = locParts[0] || '';
    const country = locParts[1] || '';
    dispatch(updateContact({
      id: contactToEdit.id,
      firstName: data.firstName,
      lastName: data.lastName,
      fullName: `${data.firstName} ${data.lastName}`.trim(),
      jobTitle: data.jobTitle,
      company: data.company,
      email: data.email,
      phone: data.phone,
      gender: data.gender,
      city: city || 'Indonesia',
      country: country || 'Indonesia',
      avatar: avatarPreview,
      thumbnailAvatar: avatarPreview,
      notes: data.notes,
      status: contactToEdit.status || 'online',
      age: contactToEdit.age,
      nationality: contactToEdit.nationality || 'N/A'
    }));
    toast.success('Perubahan kontak berhasil disimpan!');
    onBack();
  };
  const handleDeleteRequest = e => {
    e.preventDefault();
    setShowDeleteConfirm(true);
  };
  const handleConfirmDelete = () => {
    dispatch(deleteContact(contactToEdit.id));
    toast.success(`${watchedFirstName} ${watchedLastName} berhasil dihapus!`);
    setShowDeleteConfirm(false);
    onBack();
  };
  const displayFullName = `${watchedFirstName || ''} ${watchedLastName || ''}`.trim() || 'Nexus Connection';
  const displaySub = watchedJobTitle && watchedCompany ? `${watchedJobTitle} • ${watchedCompany}` : watchedJobTitle || watchedCompany || 'No Title Details';
  const inputBaseClass = "w-full bg-white border border-outline-variant rounded-xl px-4 py-3 text-body-base focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all";
  const errorInputClass = "border-error focus:border-error focus:ring-error/20";
  return <div className="max-w-5xl mx-auto pb-24 font-sans text-on-background relative">
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <button onClick={onBack} className="flex items-center gap-1 text-primary font-semibold hover:underline mb-2 bg-transparent border-none cursor-pointer">
            <Icon name="arrow_back" style={{
            fontSize: '18px'
          }} />
            Kembali ke Kontak
          </button>
          <h2 className="text-display-lg text-on-background">Edit Kontak</h2>
        </div>
      </div>

      <form id="edit-contact-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        
        <section className="bg-surface-container-low rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
          <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden relative bg-surface-container flex items-center justify-center">
              {avatarPreview ? <img src={avatarPreview} alt={displayFullName} className="w-full h-full object-cover" /> : <Icon name="add_a_photo" style={{
              color: '#767586',
              fontSize: '36px'
            }} />}
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <Icon name="photo_camera" style={{
                color: '#ffffff',
                fontSize: '24px'
              }} />
              </div>
            </div>
            
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            
            <div className="absolute -bottom-2 -right-2 bg-secondary text-on-secondary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md">
              Premium
            </div>
          </div>

          <div className="flex-1 text-center md:text-left">
            <h2 className="text-display-lg text-on-background mb-1">{displayFullName}</h2>
            <p className="text-body-base text-on-surface-variant mb-4">{displaySub}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <button type="button" onClick={() => toast.success('Interaction Log (Mockup)')} className="flex items-center gap-2 text-primary text-label-caps hover:underline bg-transparent border-none cursor-pointer">
                <Icon name="history" style={{
                fontSize: '16px'
              }} />
                Interaction Log
              </button>
              <button type="button" onClick={handleDeleteRequest} className="flex items-center gap-2 text-error text-label-caps hover:underline bg-transparent border-none cursor-pointer font-semibold">
                <Icon name="archive" style={{
                fontSize: '16px'
              }} />
                Archive Contact
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            
            <span className="px-3 py-1 bg-surface-variant text-on-surface text-xs font-semibold rounded-full capitalize">
              {watchedGender === 'female' ? 'Wanita' : 'Pria'}
            </span>
            
            <span className="px-3 py-1 bg-primary-container/20 text-primary text-xs font-semibold rounded-full capitalize">
              {contactToEdit.status || 'Active'}
            </span>
          </div>
        </section>

        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-8">
            
            
            <div className="bg-white/80 backdrop-blur-md border border-outline-variant/60 rounded-2xl p-6 shadow-sm">
              <h3 className="text-headline-md text-on-background mb-6 flex items-center gap-2">
                <Icon name="badge" className="text-primary" />
                Identity Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="space-y-2">
                  <label className="text-label-caps text-on-surface-variant">Nama Depan *</label>
                  <input type="text" {...register('firstName')} className={`${inputBaseClass} ${errors.firstName ? errorInputClass : ''}`} placeholder="Contoh: Henny" />
                  {errors.firstName && <p className="text-xs text-error flex items-center gap-1">
                      <Icon name="error" style={{
                    fontSize: '14px'
                  }} />
                      {errors.firstName.message}
                    </p>}
                </div>

                
                <div className="space-y-2">
                  <label className="text-label-caps text-on-surface-variant">Nama Belakang</label>
                  <input type="text" {...register('lastName')} className={`${inputBaseClass} ${errors.lastName ? errorInputClass : ''}`} placeholder="Contoh: Man" />
                  {errors.lastName && <p className="text-xs text-error flex items-center gap-1">
                      <Icon name="error" style={{
                    fontSize: '14px'
                  }} />
                      {errors.lastName.message}
                    </p>}
                </div>

                
                <div className="space-y-2">
                  <label className="text-label-caps text-on-surface-variant">Pekerjaan</label>
                  <input type="text" {...register('jobTitle')} className={inputBaseClass} placeholder="Contoh: Senior UX Designer" />
                </div>

                
                <div className="space-y-2">
                  <label className="text-label-caps text-on-surface-variant">Perusahaan</label>
                  <input type="text" {...register('company')} className={inputBaseClass} placeholder="Contoh: Nexus Global" />
                </div>

                
                <div className="space-y-2 md:col-span-2">
                  <label className="text-label-caps text-on-surface-variant">Jenis Kelamin *</label>
                  <div className="flex gap-4">
                    {[{
                    value: 'male',
                    label: 'Pria',
                    icon: 'male'
                  }, {
                    value: 'female',
                    label: 'Wanita',
                    icon: 'female'
                  }].map(({
                    value,
                    label,
                    icon
                  }) => {
                    const isSelected = watchedGender === value;
                    return <label key={value} className="flex-1 cursor-pointer">
                          <input type="radio" value={value} {...register('gender')} className="hidden" />
                          <div className={`flex items-center justify-center gap-2 p-3 border rounded-xl transition-all ${isSelected ? 'border-primary bg-primary/5 text-primary font-semibold' : 'border-outline-variant bg-white text-on-surface-variant hover:bg-surface-container-low'}`}>
                            <Icon name={icon} style={{
                          fontSize: '20px'
                        }} />
                            <span>{label}</span>
                          </div>
                        </label>;
                  })}
                  </div>
                </div>
              </div>
            </div>

            
            <div className="bg-white/80 backdrop-blur-md border border-outline-variant/60 rounded-2xl p-6 shadow-sm">
              <h3 className="text-headline-md text-on-background mb-6 flex items-center gap-2">
                <Icon name="alternate_email" className="text-primary" />
                Communication
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="space-y-2">
                    <label className="text-label-caps text-on-surface-variant">Email Utama *</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant text-sm">
                        mail
                      </span>
                      <input type="email" {...register('email')} className={`${inputBaseClass} pl-10 ${errors.email ? errorInputClass : ''}`} placeholder="Contoh: henny.man@nexusglobal.com" />
                    </div>
                    {errors.email && <p className="text-xs text-error flex items-center gap-1">
                        <Icon name="error" style={{
                      fontSize: '14px'
                    }} />
                        {errors.email.message}
                      </p>}
                  </div>

                  
                  <div className="space-y-2">
                    <label className="text-label-caps text-on-surface-variant">Nomor Telepon *</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant text-sm">
                        call
                      </span>
                      <input type="tel" {...register('phone')} className={`${inputBaseClass} pl-10 ${errors.phone ? errorInputClass : ''}`} placeholder="+62 812-3456-7890" />
                    </div>
                    {errors.phone && <p className="text-xs text-error flex items-center gap-1">
                        <Icon name="error" style={{
                      fontSize: '14px'
                    }} />
                        {errors.phone.message}
                      </p>}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={() => toast.success('Tambah Email (Mockup)')} className="text-primary text-label-caps flex items-center gap-1 hover:bg-primary/10 px-3 py-1 rounded-lg transition-colors bg-transparent border-none cursor-pointer">
                    <Icon name="add" style={{
                    fontSize: '16px'
                  }} /> Tambah Email
                  </button>
                  <button type="button" onClick={() => toast.success('Tambah Telepon (Mockup)')} className="text-primary text-label-caps flex items-center gap-1 hover:bg-primary/10 px-3 py-1 rounded-lg transition-colors bg-transparent border-none cursor-pointer">
                    <Icon name="add" style={{
                    fontSize: '16px'
                  }} /> Tambah Telepon
                  </button>
                </div>
              </div>
            </div>
          </div>

          
          <div className="lg:col-span-4 space-y-8">
            
            <div className="bg-white/80 backdrop-blur-md border border-outline-variant/60 rounded-2xl p-6 shadow-sm">
              <h3 className="text-headline-md text-on-background mb-6 flex items-center gap-2">
                <Icon name="location_on" className="text-primary" />
                Location
              </h3>
              <div className="space-y-4">
                
                <div className="space-y-2">
                  <label className="text-label-caps text-on-surface-variant">Alamat</label>
                  <textarea {...register('location')} className={`${inputBaseClass} h-24 resize-none`} placeholder="Contoh: Jl. Sudirman No. 45, Jakarta Selatan" />
                </div>
              </div>
            </div>

            
            <div className="bg-white/80 backdrop-blur-md border border-outline-variant/60 rounded-2xl p-6 shadow-sm">
              <h3 className="text-headline-md text-on-background mb-6 flex items-center gap-2">
                <Icon name="notes" className="text-primary" />
                Notes
              </h3>
              <textarea {...register('notes')} className={`${inputBaseClass} h-40 resize-none`} placeholder="Tambahkan catatan tentang kontak ini..." />
            </div>
          </div>
        </div>

        
        <div className="fixed bottom-0 right-0 h-20 bg-white/90 backdrop-blur-md border-t border-outline-variant flex items-center justify-between px-8 z-40 transition-all duration-300" style={{
        left: '200px'
      }}>
          <div className="flex items-center gap-2 text-on-surface-variant">
            <Icon name="info" style={{
            fontSize: '18px',
            color: '#767586'
          }} />
            <p className="text-body-sm text-on-surface-variant m-0">
              Terakhir diperbarui: {contactToEdit.createdAt ? 'Beberapa saat yang lalu' : 'Baru saja'}
            </p>
          </div>
          <div className="flex gap-4">
            <button id="discard-changes-btn" type="button" onClick={onBack} className="px-8 py-3 rounded-xl border border-outline-variant font-bold text-on-surface hover:bg-surface-container-low transition-all bg-white cursor-pointer">
              Discard
            </button>
            <button id="save-changes-btn" type="submit" disabled={isSubmitting} className="px-10 py-3 rounded-xl bg-primary text-on-primary font-bold shadow-lg shadow-primary/20 hover:bg-primary-container hover:shadow-primary/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed">
              <Icon name={isSubmitting ? 'progress_activity' : 'save'} className={isSubmitting ? 'animate-spin' : ''} />
              {isSubmitting ? 'Menyimpan...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>

      
      <ConfirmDialog isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} onConfirm={handleConfirmDelete} title="Hapus Kontak" message={`Apakah Anda yakin ingin menghapus kontak "${displayFullName}"? Tindakan ini akan menghapus data secara permanen.`} confirmLabel="Hapus" />
    </div>;
};
export default EditContactPage;