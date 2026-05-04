let dataSiswa = [];

// 1. LOAD DATABASE
async function loadDatabase() {
    const btnCek = document.getElementById("btn-cek");
    const btnText = document.getElementById("btn-text");

    try {
        const response = await fetch('database.json?v=' + new Date().getTime());
        if (!response.ok) throw new Error("File JSON tidak ditemukan");
        
        dataSiswa = await response.json();
        console.log("Database siap!");

        if (btnCek) {
            btnCek.disabled = false;
            btnCek.classList.remove("bg-gray-400");
            btnCek.classList.add("bg-blue-900", "hover:bg-blue-800");
            btnText.innerText = "Cek Kelulusan";
        }
    } catch (error) {
        console.error("Error:", error);
        if (btnText) btnText.innerText = "Gagal Memuat Data ❌";
    }
}
loadDatabase();

// 2. COUNTDOWN
const targetDate = new Date("May 4, 2026 18:00:00").getTime();
const timerInterval = setInterval(function() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if(document.getElementById("days")) {
        document.getElementById("days").innerText = String(days).padStart(2, '0');
        document.getElementById("hours").innerText = String(hours).padStart(2, '0');
        document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
        document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');
    }

    if (distance < 0) {
        clearInterval(timerInterval);
        document.getElementById("page-1").classList.add("hidden");
        document.getElementById("page-2").classList.remove("hidden");
    }
}, 1000);

// 3. LOGIKA CEK KELULUSAN
function cekKelulusan() {
    const inputNisn = document.getElementById("nisn-input").value.trim();
    const inputTglLahir = document.getElementById("tgl-lahir-input").value;
    const resultArea = document.getElementById("result-area");
    
    if (!inputNisn || !inputTglLahir) {
        resultArea.classList.remove("hidden");
        resultArea.innerHTML = `<div class="bg-yellow-100 p-4 rounded text-center text-sm">Data belum lengkap!</div>`;
        return;
    }

    const siswa = dataSiswa.find(s => 
        String(s.NISN) === String(inputNisn) && 
        (s.tgllahir === inputTglLahir || s.TglLahir === inputTglLahir)
    );

    resultArea.classList.remove("hidden");

    if (siswa) {
        // Ambil status dan ubah ke huruf kapital untuk perbandingan
        const statusSiswa = siswa.Status.toUpperCase();
        
        let content = "";

        if (statusSiswa === "LULUS") {
            // Tampilan untuk LULUS
            content = `
                <div class="bg-green-100 border-l-4 border-green-500 p-4 rounded animate__animated animate__fadeIn">
                    <h3 class="font-bold text-center text-green-800">CONGRATULATIONS !</h3>
                    <div class="my-4 border-y border-green-200 py-2 text-sm">
                        <p class="text-xs uppercase text-gray-500">Nama:</p>
                        <p class="font-bold">${siswa.Nama}</p>
                        <p class="text-xs mt-2 uppercase text-gray-500">Status:</p>
                        <p class="font-extrabold text-lg text-green-700">${siswa.Status}</p>
                    </div>
                    <p class="text-sm mb-4">Silahkan Mengunduh Surat Pengumuman Kelulusan di bawah ini, sebagai syarat pengambilan SKL.</p>
                    <a href="${siswa.Link}" target="_blank" class="block w-full bg-green-600 text-white text-center font-bold py-3 rounded-lg shadow-md hover:bg-green-700 transition">
                        📄 Unduh Surat Pengumuman Kelulusan
                    </a>
                </div>
            `;
        } else if (statusSiswa === "DITANGGUHKAN") {
            // Tampilan untuk DITANGGUHKAN (Warna Merah & Tanpa Tombol)
            content = `
                <div class="bg-red-100 border-l-4 border-red-500 p-4 rounded animate__animated animate__fadeIn">
                    <h3 class="font-bold text-center text-red-800">MOHON MAAF</h3>
                    <div class="my-4 border-y border-red-200 py-2 text-sm">
                        <p class="text-xs uppercase text-gray-500">Nama:</p>
                        <p class="font-bold">${siswa.Nama}</p>
                        <p class="text-xs mt-2 uppercase text-gray-500">Status:</p>
                        <p class="font-extrabold text-lg text-red-700">${siswa.Status}</p>
                    </div>
                    <div class="bg-white p-3 rounded border border-red-200 text-center">
                        <p class="text-red-700 font-semibold">
                            Kelulusan Anda ditangguhkan, Silahkan hubungi pihak sekolah untuk informasi lebih lanjut.
                        </p>
                    </div>
                </div>
            `;
        } else {
            // Tampilan jika Tidak Lulus atau status lainnya
            content = `
                <div class="bg-gray-100 border-l-4 border-gray-500 p-4 rounded text-center">
                    <p class="font-bold">${siswa.Nama}</p>
                    <p class="text-red-600 font-bold">HASIL: ${siswa.Status}</p>
                    <p class="text-xs mt-2">Silahkan hubungi pihak sekolah untuk informasi lebih lanjut.</p>
                </div>
            `;
        }

        resultArea.innerHTML = content;

    } else {
        // Tampilan Jika Data Tidak Ditemukan
        resultArea.innerHTML = `
            <div class="bg-red-100 border-l-4 border-red-500 p-4 rounded text-center">
                <p class="text-red-700 font-bold text-sm">Data Tidak Ditemukan</p>
                <p class="text-red-600 text-xs">Periksa NISN & Tanggal Lahir Anda.</p>
            </div>
        `;
    }
}