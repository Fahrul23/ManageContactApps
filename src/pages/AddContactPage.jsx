import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { addContact } from '@/features/contacts/contactsSlice';
const contactSchema = z.object({
  fullName: z.string().min(2, 'Minimal 2 karakter').max(100, 'Maksimal 100 karakter'),
  email: z.string().email('Format email tidak valid'),
  phone: z.string().min(6, 'Nomor terlalu pendek').max(20, 'Nomor terlalu panjang').regex(/^[\d\s\-()]+$/, 'Hanya angka, spasi, -, () yang diizinkan'),
  gender: z.enum(['male', 'female'], {
    errorMap: () => ({
      message: 'Pilih jenis kelamin'
    })
  }),
  location: z.string().optional()
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
const DEFAULT_LABELS = ['Pekerjaan', 'Keluarga', 'Teman', 'VIP'];
const AddContactPage = ({
  onBack
}) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [selectedLabels, setSelectedLabels] = useState([]);
  const [customLabelInput, setCustomLabelInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [allLabels, setAllLabels] = useState(DEFAULT_LABELS);
  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting
    },
    reset,
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      gender: 'male',
      location: ''
    }
  });
  const selectedGender = watch('gender');
  useEffect(() => {
    reset({
      fullName: '',
      email: '',
      phone: '',
      gender: 'male',
      location: ''
    });
    setAvatarPreview('');
    setSelectedLabels([]);
  }, [reset]);
  const handleFileChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 2MB');
      return;
    }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = ev => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);
  };
  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  const toggleLabel = label => {
    setSelectedLabels(prev => prev.includes(label) ? prev.filter(l => l !== label) : [...prev, label]);
  };
  const handleAddCustomLabel = () => {
    const trimmed = customLabelInput.trim();
    if (!trimmed) return;
    if (!allLabels.includes(trimmed)) {
      setAllLabels(prev => [...prev, trimmed]);
    }
    setSelectedLabels(prev => prev.includes(trimmed) ? prev : [...prev, trimmed]);
    setCustomLabelInput('');
    setShowCustomInput(false);
  };
  const onSubmit = data => {
    const nameParts = data.fullName.trim().split(/\s+/);
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';
    const locParts = (data.location || '').split(',').map(s => s.trim());
    const city = locParts[0] || 'Unknown';
    const country = locParts[1] || 'Indonesia';
    dispatch(addContact({
      id: crypto.randomUUID(),
      firstName,
      lastName,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      cell: data.phone,
      gender: data.gender,
      city,
      country,
      avatar: avatarPreview || '',
      thumbnailAvatar: avatarPreview || '',
      nationality: 'N/A',
      age: 0,
      createdAt: new Date().toISOString()
    }));
    toast.success('Kontak berhasil ditambahkan!');
    onBack();
  };
  const handleReset = () => {
    reset({
      fullName: '',
      email: '',
      phone: '',
      gender: 'male',
      location: ''
    });
    setAvatarPreview('');
    setAvatarFile(null);
    setSelectedLabels([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };
  const inputBase = {
    width: '100%',
    background: '#fff',
    border: '1px solid #c7c4d7',
    borderRadius: '12px',
    padding: '12px 16px',
    fontSize: '14px',
    outline: 'none',
    fontFamily: 'inherit',
    color: '#0b1c30',
    transition: 'border-color 0.2s, box-shadow 0.2s'
  };
  const inputError = {
    borderColor: '#ba1a1a'
  };
  const handleFocus = e => {
    e.target.style.borderColor = '#4648d4';
    e.target.style.boxShadow = '0 0 0 3px rgba(70,72,212,0.12)';
  };
  const handleBlur = e => {
    e.target.style.borderColor = '#c7c4d7';
    e.target.style.boxShadow = '';
  };
  const handleBlurError = e => {
    e.target.style.boxShadow = '';
  };
  return <div style={{
    maxWidth: '860px',
    margin: '0 auto',
    fontFamily: "'Hanken Grotesk', sans-serif"
  }}>
      
      <div className="flex items-start justify-between" style={{
      marginBottom: '2rem'
    }}>
        <div>
          
          <button id="back-to-contacts-btn" onClick={onBack} className="flex items-center gap-1" style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#4648d4',
          fontSize: '14px',
          fontWeight: 600,
          fontFamily: 'inherit',
          padding: '0 0 8px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
            <Icon name="arrow_back" style={{
            fontSize: '18px'
          }} />
            Kembali
          </button>
          <h2 style={{
          fontSize: '24px',
          lineHeight: '32px',
          fontWeight: 700,
          color: '#0b1c30',
          margin: 0
        }}>
            Tambah Kontak Baru
          </h2>
          <p style={{
          fontSize: '14px',
          color: '#464554',
          marginTop: '4px'
        }}>
            Lengkapi informasi di bawah untuk menambahkan koneksi baru ke dalam Nexus.
          </p>
        </div>

        
        <div className="flex gap-3">
          <button id="reset-form-btn" type="button" onClick={handleReset} style={{
          padding: '10px 24px',
          borderRadius: '12px',
          border: '1px solid #c7c4d7',
          background: '#fff',
          color: '#0b1c30',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
          fontFamily: 'inherit',
          transition: 'background 0.2s'
        }} onMouseEnter={e => e.currentTarget.style.background = '#eff4ff'} onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
            Reset Form
          </button>
          <button id="save-contact-btn" type="submit" form="contact-form" disabled={isSubmitting} className="flex items-center gap-2" style={{
          padding: '10px 24px',
          borderRadius: '12px',
          background: '#4648d4',
          color: '#fff',
          fontSize: '14px',
          fontWeight: 600,
          border: 'none',
          cursor: isSubmitting ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit',
          opacity: isSubmitting ? 0.7 : 1,
          boxShadow: '0 4px 12px rgba(70,72,212,0.3)',
          transition: 'transform 0.2s, box-shadow 0.2s'
        }} onMouseEnter={e => {
          if (!isSubmitting) {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(70,72,212,0.35)';
          }
        }} onMouseLeave={e => {
          e.currentTarget.style.transform = '';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(70,72,212,0.3)';
        }}>
            <Icon name="save" style={{
            fontSize: '18px'
          }} />
            {isSubmitting ? 'Menyimpan...' : 'Save Contact'}
          </button>
        </div>
      </div>

      
      <form id="contact-form" onSubmit={handleSubmit(onSubmit)} style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
        
        <section style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid #c7c4d7',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)'
      }}>
          <div className="flex flex-col md:flex-row items-center gap-8">
            
            <div style={{
            position: 'relative'
          }}>
              <div style={{
              width: '128px',
              height: '128px',
              borderRadius: '9999px',
              background: '#e5eeff',
              border: '4px solid #fff',
              boxShadow: '0 4px 12px rgb(0 0 0 / 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
                {avatarPreview ? <img src={avatarPreview} alt="Preview" style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }} /> : <Icon name="add_a_photo" style={{
                color: '#767586',
                fontSize: '48px'
              }} />}
              </div>
              
              <button type="button" onClick={() => fileInputRef.current?.click()} style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: '36px',
              height: '36px',
              borderRadius: '9999px',
              background: '#6063ee',
              color: '#fff',
              border: '2px solid #fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgb(0 0 0 / 0.2)',
              transition: 'transform 0.2s'
            }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                <Icon name="edit" style={{
                fontSize: '16px'
              }} />
              </button>
              
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" style={{
              display: 'none'
            }} onChange={handleFileChange} />
            </div>

            
            <div style={{
            flex: 1
          }}>
              <h3 style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#0b1c30',
              marginBottom: '4px'
            }}>
                Foto Profil
              </h3>
              <p style={{
              fontSize: '13px',
              color: '#464554'
            }}>
                Unggah foto berformat JPG atau PNG. Maksimal ukuran 2MB.
              </p>
              <div className="flex gap-2" style={{
              marginTop: '16px'
            }}>
                <button id="pick-file-btn" type="button" onClick={() => fileInputRef.current?.click()} style={{
                padding: '6px 16px',
                borderRadius: '9999px',
                background: 'rgba(70,72,212,0.1)',
                color: '#4648d4',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.05em',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'background 0.2s'
              }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(70,72,212,0.2)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(70,72,212,0.1)'}>
                  Pilih File
                </button>
                <button id="remove-avatar-btn" type="button" onClick={handleRemoveAvatar} style={{
                padding: '6px 16px',
                borderRadius: '9999px',
                background: 'transparent',
                color: '#ba1a1a',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.05em',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'background 0.2s'
              }} onMouseEnter={e => e.currentTarget.style.background = '#ffdad6'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  Hapus
                </button>
              </div>
            </div>
          </div>
        </section>

        
        <section style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid #c7c4d7',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)'
      }}>
          
          <div className="flex items-center gap-2" style={{
          marginBottom: '1.5rem',
          color: '#4648d4'
        }}>
            <Icon name="badge" style={{
            fontSize: '22px'
          }} />
            <h3 style={{
            fontSize: '18px',
            fontWeight: 600,
            margin: 0
          }}>
              Identitas Kontak
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2" style={{
          gap: '24px'
        }}>
            
            <div>
              <label htmlFor="fullName" style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.05em',
              color: '#464554',
              marginBottom: '8px',
              marginLeft: '4px'
            }}>
                Nama Lengkap <span style={{
                color: '#ba1a1a'
              }}>*</span>
              </label>
              <input id="fullName" type="text" {...register('fullName')} placeholder="Contoh: Budi Santoso" style={{
              ...inputBase,
              ...(errors.fullName ? inputError : {})
            }} onFocus={handleFocus} onBlur={errors.fullName ? handleBlurError : handleBlur} />
              {errors.fullName && <p style={{
              fontSize: '12px',
              color: '#ba1a1a',
              marginTop: '4px',
              marginLeft: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
                  <Icon name="error" style={{
                fontSize: '14px'
              }} />
                  {errors.fullName.message}
                </p>}
            </div>

            
            <div>
              <label htmlFor="email" style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.05em',
              color: '#464554',
              marginBottom: '8px',
              marginLeft: '4px'
            }}>
                Alamat Email <span style={{
                color: '#ba1a1a'
              }}>*</span>
              </label>
              <input id="email" type="email" {...register('email')} placeholder="budi.s@example.com" style={{
              ...inputBase,
              ...(errors.email ? inputError : {})
            }} onFocus={handleFocus} onBlur={errors.email ? handleBlurError : handleBlur} />
              {errors.email && <p style={{
              fontSize: '12px',
              color: '#ba1a1a',
              marginTop: '4px',
              marginLeft: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
                  <Icon name="error" style={{
                fontSize: '14px'
              }} />
                  {errors.email.message}
                </p>}
            </div>

            
            <div>
              <label htmlFor="phone" style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.05em',
              color: '#464554',
              marginBottom: '8px',
              marginLeft: '4px'
            }}>
                Nomor Telepon <span style={{
                color: '#ba1a1a'
              }}>*</span>
              </label>
              <div className="flex">
                <span style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0 12px',
                borderRadius: '12px 0 0 12px',
                border: '1px solid #c7c4d7',
                borderRight: 'none',
                background: '#eff4ff',
                color: '#464554',
                fontSize: '14px',
                fontWeight: 500,
                whiteSpace: 'nowrap'
              }}>
                  +62
                </span>
                <input id="phone" type="tel" {...register('phone')} placeholder="812 3456 7890" style={{
                ...inputBase,
                borderRadius: '0 12px 12px 0',
                ...(errors.phone ? inputError : {})
              }} onFocus={handleFocus} onBlur={errors.phone ? handleBlurError : handleBlur} />
              </div>
              {errors.phone && <p style={{
              fontSize: '12px',
              color: '#ba1a1a',
              marginTop: '4px',
              marginLeft: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
                  <Icon name="error" style={{
                fontSize: '14px'
              }} />
                  {errors.phone.message}
                </p>}
            </div>

            
            <div>
              <label style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.05em',
              color: '#464554',
              marginBottom: '8px',
              marginLeft: '4px'
            }}>
                Jenis Kelamin <span style={{
                color: '#ba1a1a'
              }}>*</span>
              </label>
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
                const isSelected = selectedGender === value;
                return <label key={value} style={{
                  flex: 1,
                  cursor: 'pointer'
                }}>
                      <input type="radio" value={value} {...register('gender')} style={{
                    display: 'none'
                  }} />
                      <div className="flex items-center justify-center gap-2" style={{
                    padding: '12px',
                    border: `1px solid ${isSelected ? '#4648d4' : '#c7c4d7'}`,
                    borderRadius: '12px',
                    background: isSelected ? 'rgba(70,72,212,0.05)' : '#fff',
                    color: isSelected ? '#4648d4' : '#464554',
                    fontSize: '14px',
                    fontWeight: isSelected ? 600 : 400,
                    transition: 'all 0.2s'
                  }}>
                        <Icon name={icon} style={{
                      fontSize: '20px'
                    }} />
                        <span>{label}</span>
                      </div>
                    </label>;
              })}
              </div>
              {errors.gender && <p style={{
              fontSize: '12px',
              color: '#ba1a1a',
              marginTop: '4px',
              marginLeft: '4px'
            }}>
                  {errors.gender.message}
                </p>}
            </div>

            
            <div style={{
            gridColumn: '1 / -1'
          }}>
              <label htmlFor="location" style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.05em',
              color: '#464554',
              marginBottom: '8px',
              marginLeft: '4px'
            }}>
                Lokasi / Alamat
              </label>
              <div style={{
              position: 'relative'
            }}>
                <Icon name="location_on" style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#767586',
                fontSize: '20px',
                pointerEvents: 'none'
              }} />
                <input id="location" type="text" {...register('location')} placeholder="Jl. Sudirman No. 123, Jakarta Selatan" style={{
                ...inputBase,
                paddingLeft: '44px'
              }} onFocus={handleFocus} onBlur={handleBlur} />
              </div>
            </div>
          </div>
        </section>

        
        <section style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '1.5rem',
        border: '1px solid #c7c4d7',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)'
      }}>
          <div className="flex items-center gap-2" style={{
          marginBottom: '1rem',
          color: '#4648d4'
        }}>
            <Icon name="sell" style={{
            fontSize: '22px'
          }} />
            <h3 style={{
            fontSize: '18px',
            fontWeight: 600,
            margin: 0
          }}>
              Label &amp; Kategori
            </h3>
          </div>

          <div className="flex flex-wrap" style={{
          gap: '8px'
        }}>
            {allLabels.map(label => {
            const isSelected = selectedLabels.includes(label);
            return <button key={label} type="button" onClick={() => toggleLabel(label)} style={{
              padding: '6px 16px',
              borderRadius: '9999px',
              border: `1px solid ${isSelected ? '#4648d4' : '#c7c4d7'}`,
              background: isSelected ? '#4648d4' : '#e5eeff',
              color: isSelected ? '#fff' : '#464554',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.05em',
              cursor: 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.2s'
            }}>
                  {label}
                </button>;
          })}

            
            {showCustomInput ? <div className="flex items-center gap-2">
                <input autoFocus type="text" value={customLabelInput} onChange={e => setCustomLabelInput(e.target.value)} onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCustomLabel();
              }
              if (e.key === 'Escape') {
                setShowCustomInput(false);
                setCustomLabelInput('');
              }
            }} placeholder="Nama label..." style={{
              padding: '4px 12px',
              borderRadius: '9999px',
              border: '1px solid #4648d4',
              fontSize: '11px',
              fontWeight: 600,
              outline: 'none',
              fontFamily: 'inherit',
              width: '120px',
              color: '#0b1c30'
            }} />
                <button type="button" onClick={handleAddCustomLabel} style={{
              padding: '4px 12px',
              borderRadius: '9999px',
              background: '#4648d4',
              color: '#fff',
              fontSize: '11px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit'
            }}>
                  Tambah
                </button>
              </div> : <button type="button" onClick={() => setShowCustomInput(true)} className="flex items-center gap-1" style={{
            padding: '6px 12px',
            borderRadius: '9999px',
            border: '1px dashed #c7c4d7',
            background: 'transparent',
            color: '#767586',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.05em',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'border-color 0.2s, color 0.2s'
          }} onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#4648d4';
            e.currentTarget.style.color = '#4648d4';
          }} onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#c7c4d7';
            e.currentTarget.style.color = '#767586';
          }}>
                <Icon name="add" style={{
              fontSize: '14px'
            }} />
                Tambah Label
              </button>}
          </div>
        </section>
      </form>

    </div>;
};
export default AddContactPage;