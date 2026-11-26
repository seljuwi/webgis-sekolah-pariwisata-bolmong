
// =====================================
// 1. MEMBUAT PETA
// =====================================

const map = L.map("map").setView([0.65, 124.1], 10);

// Menambahkan peta dasar OpenStreetMap
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 19
}).addTo(map);


// =====================================
// 2. MENYIAPKAN LAYER MARKER
// =====================================

let markerLayer = L.layerGroup().addTo(map);

let semuaData = [];


// =====================================
// 3. MEMBACA DATA GEOJSON
// =====================================

fetch("data/sekolah_pariwisata.geojson")
    .then(response => {
        if (!response.ok) {
            throw new Error("File GeoJSON tidak ditemukan");
        }

        return response.json();
    })

    .then(data => {

        semuaData = data.features;

        tampilkanData("Semua");

        console.log("Data berhasil dimuat:", semuaData.length);

    })

    .catch(error => {
        console.error("Terjadi kesalahan:", error);

        alert("Data peta gagal dimuat. Periksa lokasi file GeoJSON.");
    });


// =====================================
// 4. MENAMPILKAN MARKER
// =====================================

function tampilkanData(kategori) {

    markerLayer.clearLayers();

    let jumlahPendidikan = 0;
    let jumlahWisata = 0;

    semuaData.forEach(feature => {

        const properti = feature.properties;
        const koordinat = feature.geometry.coordinates;

        const longitude = koordinat[0];
        const latitude = koordinat[1];

        const jenis = properti["Kategori"];

        if (jenis === "Pendidikan") {
            jumlahPendidikan++;
        }

        if (jenis === "Wisata alam/pantai") {
            jumlahWisata++;
        }

        // Memeriksa filter kategori
        if (kategori !== "Semua" && jenis !== kategori) {
            return;
        }

        // Menentukan warna marker
        const warna = jenis === "Pendidikan"
            ? "#2563eb"
            : "#f97316";

        // Membuat marker
        const marker = L.circleMarker(
            [latitude, longitude],
            {
                radius: 7,
                color: warna,
                fillColor: warna,
                fillOpacity: 0.85,
                weight: 2
            }
        );

        // Membuat informasi popup
        marker.bindPopup(`
            <h3>${properti["Nama_Objek"] || "Tidak diketahui"}</h3>
            <p><b>Kategori:</b> ${jenis || "-"}</p>
            <p><b>Alamat:</b> ${properti["Alamat"] || "-"}</p>
            <p><b>Kecamatan:</b> ${properti["Kecamatan"] || "-"}</p>
            <p><b>Kabupaten:</b> ${properti["Kabupaten"] || "-"}</p>
        `);

        markerLayer.addLayer(marker);

    });

    // Memperbarui statistik
    document.getElementById("total-sekolah").textContent =
        jumlahPendidikan;

    document.getElementById("total-wisata").textContent =
        jumlahWisata;
}


// =====================================
// 5. FITUR FILTER KATEGORI
// =====================================

document.getElementById("filter-kategori")
    .addEventListener("change", function() {

        tampilkanData(this.value);

    });
