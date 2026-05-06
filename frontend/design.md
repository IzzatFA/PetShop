# Desain Frontend PetShop

## 1. Ikhtisar
Frontend `PetShop` adalah aplikasi React + Vite yang menampilkan pengalaman adopsi hewan domestik. UI dirancang dengan warna lembut, tipografi modern, dan tata letak responsif untuk memudahkan pengguna mencari hewan, memahami alur adopsi, serta menghubungi tim.

## 2. Palet Warna
- `--dh-primary`: #5C2822  (Cokelat tua)
- `--dh-bg-light`: #F8EAE4  (Krem terang)
- `--dh-bg-gradient`: linear-gradient(180deg, #F8EAE4 0%, #EFC7B6 100%)
- `--dh-text`: #5C2822  (Teks utama)
- `--dh-text-light`: #8A5A52  (Teks sekunder)
- `#F4C4AE` / `#F8D8C9`: aksen peach untuk ikon dan badge
- `white`: kartu, latar konten, dan panel informasi
- `#EBB6A2`: panel dampak dan footers yang menonjol

## 3. Tipografi
- Font global: `Outfit`, `Inter`, sans-serif.
- Judul utama: font-size besar, berat font 800.
- Subjudul/deskripsi: font-weight 500, line-height tinggi untuk kenyamanan baca.
- Label form dan teks penting: font-weight 700-800.

## 4. Struktur Halaman Utama
### 4.1 Beranda (`Home.jsx`)
- Hero section penuh lebar dengan teks CTA, button `Adopsi Sekarang`, dan ilustrasi hewan.
- About section dua kolom dengan gambar dan deskripsi misi.
- Features section 3 kartu jelaskan nilai platform (mudah, kesehatan, pendampingan).
- Impact section 3 kartu dengan statistik.
- Testimonials section dengan kartu komentar adopter.
- Footer konsisten dari `DaftarHewan/components/Footer.jsx`.

### 4.2 Daftar Hewan (`pages/DaftarHewan/index.jsx`)
- Navbar transparan berisi tautan utama dan tombol login/register.
- Hero page internal menggunakan background image dan overlay.
- Filter bar dengan pencarian dan tombol kategori.
- Grid kartu hewan responsif (`PetCard.jsx`).
- Footer tetap.

### 4.3 Detail Hewan (`pages/DaftarHewan/PetDetail.jsx`)
- Layout fokus pada gambar hewan besar di atas.
- Konten detail dalam kartu putih melayang dengan radius besar.
- Statistik hewan ditampilkan dalam grid ikon.
- Tag kategori dan tombol aksi (`heart`, `adopt`) ditonjolkan.

### 4.4 Alur Adopsi (`pages/AlurAdopsi/index.jsx`)
- Hero dengan background gambar dan overlay putih transparan.
- Langkah adopsi disajikan dalam tiga kartu proses.
- FAQ disusun sebagai daftar kartu tanya jawab.
- Footer konsisten.

### 4.5 Kontak (`pages/Kontak/index.jsx`)
- Hero page serupa dengan judul dan subtitle center.
- Card informasi kontak + ilustrasi.
- Form kontak dengan input dan textarea bergaya rounded.
- Map embed Google Maps di bagian bawah.
- Footer tetap.

### 4.6 Login & Register
- Layout sederhana dan fokus pada kartu form di tengah.
- Halaman register menampilkan ilustrasi hewan di kiri/kanan sebagai background dekoratif.
- Form menggunakan input rounded, label jelas, dan tombol aksi solid.
- Kesalahan ditampilkan dalam bubble merah lembut.

### 4.7 Dashboard User dan Admin
- `UserDashboard.jsx`: area khusus pengguna yang butuh autentikasi.
- `AdminLayout.jsx`: panel admin sidebar fixed, dengan tautan dashboard, hewan, kategori, adopsi, janji temu.
- Sidebar admin memakai warna elevated dan gradient aksen.
- Konten admin berada di layout `Outlet` dengan sticky header.

## 5. Komponen Utama
### 5.1 Navbar
- Komponen `DaftarHewan/components/Navbar.jsx`.
- Responsive: menu desktop horizontal, menu mobile slide-in.
- Tombol `Log In` dan `Sign In` jelas dan konsisten.

### 5.2 Hero Internal
- `DaftarHewan/components/Hero.jsx` menampilkan title halaman, subtitle, dan ikon paw.
- Background gambar overlain dengan gradasi.

### 5.3 Filter Bar
- `DaftarHewan/components/FilterBar.jsx`.
- Pencarian teks dan filter kategori interaktif.
- Tombol kategori aktif berwarna solid primer.

### 5.4 PetCard
- `DaftarHewan/components/PetCard.jsx`.
- Kartu hewan dengan hover lift effect.
- Preview gambar, nama, gender, dan umur.
- Klik kartu membawa ke detail hewan.

### 5.5 Footer
- `DaftarHewan/components/Footer.jsx`.
- Grid tiga kolom: brand, navigasi, kontak.
- Bottom bar dengan tautan kebijakan.

## 6. Sistem Desain dan Pola Visual
- Modalitas warna lembut dan ramah untuk platform adopsi hewan.
- Rounded corners besar pada kartu, tombol, input, dan panel.
- Banyak ruang putih pada kartus dan section.
- Efek drop shadow lembut untuk memberi kesan lapang.
- Button solid primer untuk CTA utama, dan button transparan/outline untuk aksi sekunder.

## 7. Responsivitas
- Mobile menu toggle di navbar.
- Hero internal dan gambar halaman menyesuaikan lebar.
- Grid kartu hewan menggunakan `auto-fill` dan `minmax(280px, 1fr)`.
- Footer dan layout form merespons ke kolom tunggal di layar <= 768px.
- Kartus alur dan FAQ menumpuk pada mobile.

## 8. Pola Interaksi
- Hover efek pada kartu hewan dan tombol.
- Active state filter kategori jelas dengan background primer.
- Button CTA menjaga konsistensi pada seluruh halaman.
- Feedback error login/register ditampilkan di dalam card.

## 9. Teknologi Frontend
- React dengan `react-router-dom` untuk routing.
- Vite sebagai bundler.
- Context API (`AuthContext`) untuk autentikasi dan proteksi route.
- `lucide-react` untuk ikon.
- Kode CSS modular terbagi berdasarkan halaman/komponen.

## 10. Catatan Implementasi
- Variabel global warna dideklarasikan di `pages/DaftarHewan/DaftarHewan.css`.
- `Register.css` digunakan ulang oleh halaman `Login.jsx` dan `Register.jsx`.
- `AdminLayout.jsx` memakai inline style untuk panel admin dan layout dasar.
- Halaman daftar hewan memanggil API untuk memuat data `animals` dan `categories`, lalu filter secara lokal.

## 11. Rekomendasi Desain Lanjutan
- Tambahkan design tokens atau `theme.css` untuk memusatkan warna dan radius.
- Pertimbangkan `styled-components` atau CSS modules untuk isolasi gaya lebih kuat.
- Buat style guide terpisah untuk tombol, form, dan kartu bila fitur UI bertambah.
- Tambahkan animasi entry sederhana pada hero dan kartu untuk pengalaman lebih hidup.
