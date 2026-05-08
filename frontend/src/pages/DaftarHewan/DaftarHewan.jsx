import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Hero from './components/Hero';
import FilterBar from './components/FilterBar';
import PetCard from './components/PetCard';
import Footer from './components/Footer';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import './DaftarHewan.css';

export default function DaftarHewan() {
  const { user } = useAuth();
  const [animals, setAnimals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const requests = [
          api.get('/api/animals'),
          api.get('/api/categories')
        ];

        if (user?.id) {
          requests.push(api.get(`/api/adoptions/user/${user.id}`));
        }

        const [aRes, cRes, adRes] = await Promise.all(requests);
        const adoptedAnimalIds = new Set((adRes?.data || []).map(adoption => adoption.animal_id));
        setAnimals(
          aRes.data.filter(a => a.status === 'available' && !adoptedAnimalIds.has(a.id))
        );
        setCategories(cRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id]);

  const filteredAnimals = animals.filter(animal => {
    const categoryName = categories.find(c => c.id === animal.category_id)?.name || '';
    const matchCategory = activeCategory === 'All' || categoryName === activeCategory;
    const matchSearch = !searchQuery || animal.breed?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="daftar-hewan-page">
      <div className='navbar-container'>
        <Navbar />
      </div>
      
      <Hero />
      <FilterBar 
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categories={categories}
      />
      
      <div className="container" style={{ padding: '2rem 1.5rem', minHeight: '50vh' }}>
        {loading ? (
          <p style={{ textAlign: 'center' }}>Memuat daftar hewan...</p>
        ) : filteredAnimals.length === 0 ? (
          <p style={{ textAlign: 'center' }}>Tidak ada hewan ditemukan.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {filteredAnimals.map(animal => (
              <PetCard 
                key={animal.id} 
                pet={{
                  ...animal,
                  name: animal.breed || 'Unknown Breed',
                  gender: animal.gender || 'Unknown'
                }} 
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
