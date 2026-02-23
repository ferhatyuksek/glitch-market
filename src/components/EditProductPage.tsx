import type { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { getProductById, updateProduct } from '../api/products';
import { normalizeProduct } from '../utils/normalize';

const EditProductPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: rawProduct } = useQuery({
    queryKey: ['product', id],
    queryFn: () => getProductById(id!),
    enabled: !!id,
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    values: rawProduct ? normalizeProduct(rawProduct) : undefined
  });

  const mutation = useMutation({
    mutationFn: async (updatedData: any) => await updateProduct(id!, updatedData),
    onSuccess: () => {
    
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
      alert('Ürün başarıyla güncellendi!');
      navigate(`/product/${id}`);
    },
  });


  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '1.5rem' }}>Ürünü Düzenle</h2>
      <form onSubmit={handleSubmit((data) => mutation.mutate(data))} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Ürün Adı:</label>
          <input 
            {...register('name', { required: 'İsim alanı zorunludur' })} 
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} 
          />
          {errors.name && <p style={{ color: 'red', fontSize: '0.8rem' }}>{errors.name.message as string}</p>}
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Fiyat:</label>
          <input 
            type="number" 
            step="0.01" 
            {...register('price', { required: 'Fiyat zorunludur' })} 
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} 
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Stok:</label>
          <input 
            type="number" 
            {...register('stock', { required: 'Stok zorunludur' })} 
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} 
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button 
            type="submit" 
            style={{ padding: '12px 24px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            {mutation.isPending ? 'Kaydediliyor...' : 'Güncelle'}
          </button>
          <button 
            type="button" 
            onClick={() => navigate(-1)}
            style={{ padding: '12px 24px', backgroundColor: '#94a3b8', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >
            İptal
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductPage;