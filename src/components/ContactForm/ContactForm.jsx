import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import Modal from '@/components/UI/Modal';
import { addContact, updateContact } from '@/features/contacts/contactsSlice';
const contactSchema = z.object({
  firstName: z.string().min(2, 'Min 2 characters').max(50, 'Max 50 characters'),
  lastName: z.string().min(2, 'Min 2 characters').max(50, 'Max 50 characters'),
  email: z.string().email('Invalid email format'),
  phone: z.string().min(6, 'Phone too short').max(20, 'Phone too long').regex(/^[+\d\s\-()]+$/, 'Only numbers, +, -, spaces allowed'),
  city: z.string().optional(),
  country: z.string().optional(),
  avatarUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  gender: z.enum(['male', 'female'], {
    errorMap: () => ({
      message: 'Please select a gender'
    })
  })
});
const ContactForm = ({
  isOpen,
  onClose,
  contactToEdit
}) => {
  const dispatch = useDispatch();
  const isEditMode = contactToEdit !== null;
  const [avatarPreview, setAvatarPreview] = useState('');
  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting
    },
    reset,
    watch
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      city: '',
      country: '',
      avatarUrl: '',
      gender: 'male'
    }
  });
  const avatarUrl = watch('avatarUrl');
  useEffect(() => {
    if (avatarUrl && avatarUrl.trim()) {
      try {
        new URL(avatarUrl);
        setAvatarPreview(avatarUrl);
      } catch {
        setAvatarPreview('');
      }
    } else {
      setAvatarPreview('');
    }
  }, [avatarUrl]);
  useEffect(() => {
    if (contactToEdit) {
      reset({
        firstName: contactToEdit.firstName || '',
        lastName: contactToEdit.lastName || '',
        email: contactToEdit.email || '',
        phone: contactToEdit.phone || '',
        city: contactToEdit.city || '',
        country: contactToEdit.country || '',
        avatarUrl: contactToEdit.avatar || '',
        gender: contactToEdit.gender || 'male'
      });
    } else {
      reset({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        city: '',
        country: '',
        avatarUrl: '',
        gender: 'male'
      });
    }
  }, [contactToEdit, reset]);
  const onSubmit = async data => {
    try {
      if (isEditMode) {
        const updatedContact = {
          ...contactToEdit,
          firstName: data.firstName,
          lastName: data.lastName,
          fullName: `${data.firstName} ${data.lastName}`,
          email: data.email,
          phone: data.phone,
          city: data.city || contactToEdit.city,
          country: data.country || contactToEdit.country,
          avatar: data.avatarUrl || contactToEdit.avatar,
          thumbnailAvatar: data.avatarUrl || contactToEdit.thumbnailAvatar,
          gender: data.gender
        };
        dispatch(updateContact(updatedContact));
        toast.success('Contact updated successfully!');
      } else {
        const newContact = {
          id: crypto.randomUUID(),
          firstName: data.firstName,
          lastName: data.lastName,
          fullName: `${data.firstName} ${data.lastName}`,
          email: data.email,
          phone: data.phone,
          cell: data.phone,
          city: data.city || 'Unknown',
          country: data.country || 'Unknown',
          avatar: data.avatarUrl || '',
          thumbnailAvatar: data.avatarUrl || '',
          gender: data.gender,
          nationality: 'N/A',
          age: 0,
          createdAt: new Date().toISOString()
        };
        dispatch(addContact(newContact));
        toast.success('Contact added successfully!');
      }
      reset();
      onClose();
    } catch (error) {
      toast.error('Something went wrong!');
      console.error('Form submission error:', error);
    }
  };
  const handleCancel = () => {
    reset();
    onClose();
  };
  return <Modal isOpen={isOpen} onClose={handleCancel} title={isEditMode ? 'Edit Contact' : 'Add New Contact'} size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        
        <div className="grid grid-cols-2 gap-3">
          
          <div className="flex flex-col gap-1">
            <label htmlFor="firstName" className="text-sm font-medium text-slate-700">
              First Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <input id="firstName" type="text" {...register('firstName')} className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${errors.firstName ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-indigo-200 focus:border-indigo-400'}`} placeholder="John" />
            </div>
            {errors.firstName && <p className="text-red-500 text-xs flex items-center gap-1">
                <span>⚠</span> {errors.firstName.message}
              </p>}
          </div>

          
          <div className="flex flex-col gap-1">
            <label htmlFor="lastName" className="text-sm font-medium text-slate-700">
              Last Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <input id="lastName" type="text" {...register('lastName')} className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${errors.lastName ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-indigo-200 focus:border-indigo-400'}`} placeholder="Doe" />
            </div>
            {errors.lastName && <p className="text-red-500 text-xs flex items-center gap-1">
                <span>⚠</span> {errors.lastName.message}
              </p>}
          </div>
        </div>

        
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium text-slate-700">
            Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <input id="email" type="email" {...register('email')} className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${errors.email ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-indigo-200 focus:border-indigo-400'}`} placeholder="john.doe@example.com" />
          </div>
          {errors.email && <p className="text-red-500 text-xs flex items-center gap-1">
              <span>⚠</span> {errors.email.message}
            </p>}
        </div>

        
        <div className="flex flex-col gap-1">
          <label htmlFor="phone" className="text-sm font-medium text-slate-700">
            Phone <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </span>
            <input id="phone" type="tel" {...register('phone')} className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${errors.phone ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-indigo-200 focus:border-indigo-400'}`} placeholder="+1 (555) 123-4567" />
          </div>
          {errors.phone && <p className="text-red-500 text-xs flex items-center gap-1">
              <span>⚠</span> {errors.phone.message}
            </p>}
        </div>

        
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-700">
            Gender <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            <label className="flex-1">
              <input type="radio" value="male" {...register('gender')} className="sr-only peer" />
              <div className="cursor-pointer px-4 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 text-sm font-medium text-center transition-all peer-checked:bg-indigo-600 peer-checked:text-white peer-checked:border-indigo-600 hover:bg-slate-100 peer-checked:hover:bg-indigo-700">
                👨 Male
              </div>
            </label>
            <label className="flex-1">
              <input type="radio" value="female" {...register('gender')} className="sr-only peer" />
              <div className="cursor-pointer px-4 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 text-sm font-medium text-center transition-all peer-checked:bg-indigo-600 peer-checked:text-white peer-checked:border-indigo-600 hover:bg-slate-100 peer-checked:hover:bg-indigo-700">
                👩 Female
              </div>
            </label>
          </div>
          {errors.gender && <p className="text-red-500 text-xs flex items-center gap-1">
              <span>⚠</span> {errors.gender.message}
            </p>}
        </div>

        
        <div className="grid grid-cols-2 gap-3">
          
          <div className="flex flex-col gap-1">
            <label htmlFor="city" className="text-sm font-medium text-slate-700">
              City
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </span>
              <input id="city" type="text" {...register('city')} className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all" placeholder="New York" />
            </div>
          </div>

          
          <div className="flex flex-col gap-1">
            <label htmlFor="country" className="text-sm font-medium text-slate-700">
              Country
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              <input id="country" type="text" {...register('country')} className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all" placeholder="United States" />
            </div>
          </div>
        </div>

        
        <div className="flex flex-col gap-1">
          <label htmlFor="avatarUrl" className="text-sm font-medium text-slate-700">
            Avatar URL <span className="text-slate-400 text-xs">(optional)</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </span>
            <input id="avatarUrl" type="url" {...register('avatarUrl')} className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${errors.avatarUrl ? 'border-red-400 focus:ring-red-200' : 'border-slate-200 focus:ring-indigo-200 focus:border-indigo-400'}`} placeholder="https://example.com/avatar.png" />
          </div>
          {errors.avatarUrl && <p className="text-red-500 text-xs flex items-center gap-1">
              <span>⚠</span> {errors.avatarUrl.message}
            </p>}

          
          {avatarPreview && <div className="mt-2 flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <img src={avatarPreview} alt="Avatar preview" className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm" onError={e => {
            e.target.style.display = 'none';
          }} />
              <span className="text-xs text-slate-500">Preview</span>
            </div>}
        </div>

        
        <div className="flex gap-3 mt-4 pt-4 border-t border-slate-200">
          <button type="button" onClick={handleCancel} disabled={isSubmitting} className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-indigo-200 flex items-center justify-center gap-2">
            {isSubmitting ? <>
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Saving...</span>
              </> : <span>{isEditMode ? 'Save Changes' : 'Add Contact'}</span>}
          </button>
        </div>
      </form>
    </Modal>;
};
export default ContactForm;