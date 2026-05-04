-- SUPABASE SETUP SCRIPT
-- Copy and run this entirely inside the Supabase SQL Editor.

-- Users Table
CREATE TABLE users (
  id serial primary key,
  email text unique not null,
  name text,
  password text,
  role text default 'BUYER',
  "createdAt" timestamp with time zone default now(),
  "updatedAt" timestamp with time zone default now()
);

-- Categories Table
CREATE TABLE categories (
  id serial primary key,
  name text unique not null,
  "createdAt" timestamp with time zone default now(),
  "updatedAt" timestamp with time zone default now()
);

-- Animals Table
CREATE TABLE animals (
  id serial primary key,
  name text not null,
  species text not null,
  description text,
  price numeric not null,
  "imageUrl" text,
  "isDeleted" boolean default false,
  "categoryId" integer references categories(id) on delete restrict,
  "sellerId" integer references users(id) on delete cascade,
  "createdAt" timestamp with time zone default now(),
  "updatedAt" timestamp with time zone default now()
);

-- Orders Table
CREATE TABLE orders (
  id serial primary key,
  "userId" integer references users(id) on delete cascade,
  "totalPrice" numeric not null,
  status text default 'COMPLETED',
  "createdAt" timestamp with time zone default now(),
  "updatedAt" timestamp with time zone default now()
);

-- Order Items Table
CREATE TABLE order_items (
  id serial primary key,
  "orderId" integer references orders(id) on delete cascade,
  "animalId" integer references animals(id) on delete restrict,
  quantity integer not null,
  price numeric not null,
  "createdAt" timestamp with time zone default now(),
  "updatedAt" timestamp with time zone default now()
);

-- Insert base categories
INSERT INTO categories (name) VALUES ('Cats'), ('Dogs'), ('Birds'), ('Reptiles'), ('Fish');

-- Insert your default super admin (password is 'admin123' bcrypt hashed)
INSERT INTO users (email, name, password, role) 
VALUES ('admin@rumahhewan.com', 'Super Admin', '$2b$10$wNnUItzW4S7gK6yH.3wGquB8w7gMps6J5L6LqA8c3oD8o5zL4Y4C2', 'ADMIN');
