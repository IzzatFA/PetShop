import React from 'react';
import { Search } from 'lucide-react';
import './FilterBar.css';

const FilterBar = ({ activeCategory, onCategoryChange, searchQuery, onSearchChange, categories }) => {
  return (
    <section className="dh-filter-section">
      <div className="container dh-filter-container">
        <div className="dh-search-container">
          <Search className="dh-search-icon" size={20} />
          <input 
            type="text" 
            placeholder="Search pet to adopt" 
            className="dh-search-input"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="dh-category-filters">
          <button
            className={`dh-filter-btn ${activeCategory === 'All' ? 'active' : ''}`}
            onClick={() => onCategoryChange('All')}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category.id}
              className={`dh-filter-btn ${activeCategory === category.name ? 'active' : ''}`}
              onClick={() => onCategoryChange(category.name)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FilterBar;
