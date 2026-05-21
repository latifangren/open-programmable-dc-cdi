
riset ini di bikin dengan chatGPT https://chatgpt.com/share/6a0f2a32-2054-83ec-8b16-c493d2230b6b
hasil riset awal menunjukkan bahwa kedua repo yang kamu bandingkan belum benar-benar membangun CDI lengkap.
refrensi
https://github.com/wicaksuu/racing-cdi
https://github.com/wicaksuu/esp32-programable-cdi

Temuan awalnya cukup jelas: yang disebut “CDI” di repo itu lebih mirip programmable ignition controller + MOSFET coil driver, bukan CDI penuh. Nama proyeknya gagah, rangkaiannya masih diet ketat.

Thought for 3m 4s

[Inference] Iya, feeling kamu benar: komponen “CDI”-nya memang terlalu sederhana. Dari repo yang kelihatan, ini lebih cocok disebut programmable TCI / inductive ignition controller, bukan CDI penuh. Namanya “CDI”, tapi rangkaiannya seperti: ESP32 → MOSFET → ignition coil 12V. Agak seperti menaruh stiker “turbo” di kipas angin, manusia memang kreatif.

Kenapa terlihat bukan CDI asli?

Repo menyebut proyek ini sebagai “Programmable Capacitive Discharge Ignition System”, tapi hardware minimumnya hanya mencantumkan ESP32, MOSFET, flyback diode, pickup sensor, SD card, baterai 12V, dan buck converter. Wiring ignition-nya juga: GPIO4 → resistor → MOSFET gate, MOSFET drain → ignition coil (-), coil (+) → +12V, plus flyback diode.

Pada CDI asli, tegangan pengapian dibuat dengan kapasitor tegangan tinggi yang di-charge dari sumber HV, lalu kapasitor itu di-discharge ke primary ignition coil lewat electronic switch. Referensi patent CDI menjelaskan bahwa CDI menghasilkan ignition voltage dengan membuang muatan kapasitor yang sudah di-charge ke primary ignition coil, dan kapasitor itu awalnya di-charge dari high-voltage DC source.

Jadi perbedaannya kira-kira begini:

Bagian	Yang ada di repo	CDI asli
Sumber energi spark	Coil 12V di-on/off oleh MOSFET	Kapasitor HV discharge
Storage energy utama	Medan magnet ignition coil	Kapasitor 200-400V atau lebih
Switch utama	MOSFET low-side	SCR / IGBT / MOSFET HV discharge
Blok HV charger	Tidak kelihatan di ignition output	Wajib ada
Nama teknis lebih pas	TCI / inductive ignition	CDI
Yang kemungkinan besar terlewat
HV charging stage
Untuk DC-CDI perlu boost converter dari 12V ke sekitar 200-400V. Referensi CDI menyebut contoh DC-DC converter menghasilkan tegangan 120-400V tergantung ignition coil.
Main discharge capacitor
Ini inti CDI. Di repo bagian ignition output hanya terlihat MOSFET, resistor gate, pulldown, diode, fuse, dan coil. Tidak terlihat blok “charge capacitor lalu discharge capacitor”.
SCR / IGBT discharge switch
CDI umumnya butuh switch untuk membuang energi kapasitor HV ke primary coil. Di dokumentasi repo, switch yang terlihat adalah IRFZ44N low-side untuk coil 12V.
Coil yang sesuai CDI
Coil CDI biasanya berbeda karakter dari coil ignition 12V inductive biasa. Kalau pakai coil biasa tanpa desain ulang, hasilnya bisa ngawur, karena tentu saja listrik tegangan tinggi tidak peduli pada optimisme manusia.
Proteksi HV dan snubber yang benar
Rangkaian CDI butuh layout HV, clearance, bleeder resistor, snubber, rectifier HV, dan proteksi noise. Repo memang punya TVS, fuse, dan filter power, tapi itu masih level sistem 12V/5V, bukan blok discharge HV CDI.
Driver MOSFET yang lebih serius
Repo memakai IRFZ44N/IRLZ44N sebagai opsi. IRFZ44N punya RDS(on) dispesifikasikan pada VGS 10V, sedangkan ESP32 cuma 3.3V, jadi IRFZ44N langsung dari GPIO bukan pilihan manis untuk beban ignition coil. Datasheet IRFZ44N menunjukkan RDS(on) 17.5mΩ pada VGS 10V dan gate threshold 2-4V, threshold itu bukan berarti fully-on.
Konflik pin serius
Di README, GPIO22 dipakai sebagai Front Wheel Sensor, tapi juga dipakai sebagai I2C SCL untuk MPU9250. Di kode juga tertulis I2C SDA=21, SCL=22, lalu FRONT_WHEEL_SENSOR_PIN 22. Itu tabrakan pin, bukan “fitur hemat GPIO”.
Firmware masih kuat aroma simulator
Di kode ada komentar “Smart CDI Programmable v2.2 SIMULATOR with ESP32” dan ENABLE_SIMULATOR true. Ini memperkuat dugaan bahwa repo ini belum benar-benar production hardware CDI, walaupun dokumennya memakai kata “Production”.
Kesimpulan tajamnya

[Inference] Yang terlewat bukan komponen kecil, tapi satu blok utama CDI: blok high-voltage capacitor discharge. Firmware-nya sudah heboh: map, quick shifter, launch control, anti-wheelie, traction control. Tapi bagian “CDI”-nya sendiri masih seperti ignition coil driver sederhana.

Kalau targetmu CDI beneran, arsitekturnya harus jadi:

Pickup / pulser
   ↓
Signal conditioner
   ↓
ESP32 timing controller
   ↓
SCR / IGBT trigger driver
   ↓
HV charged capacitor 200-400V
   ↓
CDI ignition coil
   ↓
Spark plug

Kalau targetmu lebih simpel dan aman untuk iterasi, jangan dipaksa disebut CDI. Jadikan dulu:

Programmable TCI / Inductive Ignition
ESP32 → gate driver → logic-level MOSFET/IGBT → 12V ignition coil

Itu lebih jujur, lebih mudah dites, dan lebih kecil kemungkinan bikin komponen jadi asap ceremonial.

Aku bandingin dari sisi arsitektur hardware, apakah benar CDI, kualitas firmware, dan gap safety/reliability. Fokusnya bukan cuma “lebih banyak komponen”, karena rangkaian pengapian itu bukan lomba cosplay elektronik, tapi apakah blok energinya benar.

Thought for 1m 59s

[Inference] Setelah dibandingkan: repo racing-cdi lebih rapi dan lebih serius di bagian kontrol timing, tapi tetap belum terlihat sebagai “CDI full power stage”. Dia lebih mirip programmable CDI trigger/controller untuk memicu CDI eksternal. Jadi bukan cuma repo ESP32 kamu yang “terlalu sederhana”; repo STM32 itu juga masih belum memperlihatkan blok inti CDI: HV charger + kapasitor discharge + SCR/IGBT power stage. Elektronik otomotif memang suka begini: namanya “racing”, tapi blok HV-nya main petak umpet.

Ringkasnya
Bagian	esp32-programable-cdi	racing-cdi
MCU	ESP32	STM32H562RGT6 250MHz
Output ignition	MOSFET langsung ke ignition coil	PB0 trigger pulse ke CDI input
Sensor pickup	AC/DC pickup langsung ke ESP32 / ADC / GPIO	VR sensor lewat MAX9926 ke STM32
Timing precision	Lebih software-ish, ESP32	Lebih serius, hardware timer/input capture
Power stage CDI asli	Tidak terlihat	Tidak terlihat
Kategori paling jujur	TCI / inductive ignition controller	CDI trigger controller
Cocok buat basis project?	Bisa untuk eksperimen	Lebih bagus untuk timing/controller
Perbedaan paling penting
1. Repo ESP32 kamu menggerakkan coil langsung

Di repo esp32-programable-cdi, schematic ignition output-nya memakai ESP32 GPIO4 ke gate MOSFET IRFZ44N, lalu MOSFET low-side mengendalikan primary ignition coil 12V. Ada flyback diode 1N4007 dan fuse coil. Ini arsitektur inductive ignition / TCI, bukan CDI kapasitor-discharge.

CDI asli bekerja dengan kapasitor tegangan tinggi yang di-charge dari sumber HV, lalu kapasitor itu di-discharge ke primary ignition coil lewat electronic switch. Referensi CDI menjelaskan capacitor CDI awalnya di-charge dari high-voltage DC source lalu dibuang melalui primary ignition coil.

Jadi repo ESP32 itu:

ESP32 → MOSFET → ignition coil 12V → spark plug

Bukan:

12V → HV charger → HV capacitor → SCR/IGBT → CDI coil → spark plug
2. Repo racing-cdi lebih bagus di controller, tapi bukan power CDI lengkap

Repo racing-cdi pakai STM32H562RGT6, mengklaim timing resolution 0.1µs, 6 maps, 81 points, RPM range 0-20.000, dan CDI pulse width 50-250µs. Itu jauh lebih matang untuk timing engine dibanding ESP32 versi tadi.

Tapi di pinout-nya, PB0 disebut sebagai CDI Output berupa CDI trigger pulse, dan contoh wiring-nya cuma:

PB0 ──[330Ω]── CDI Trigger Input

Dokumentasinya juga menyebut direct connection ke CDI module trigger input.

Artinya, repo racing-cdi sepertinya tidak membangun CDI power stage sendiri. Dia hanya membuat sinyal trigger presisi untuk modul CDI atau power unit lain.

Ini yang bikin racing-cdi lebih masuk akal
Input pickup-nya lebih proper

racing-cdi memakai MAX9926 sebagai VR sensor conditioner, lalu masuk ke PA0 untuk hardware input capture. Ini lebih benar untuk pickup magnet/VR sensor karena sinyal VR itu noisy dan amplitudonya berubah tergantung RPM.

Repo ESP32 memakai input AC pickup ke ADC GPIO34 dengan biasing sederhana. Bisa jalan untuk eksperimen, tapi untuk mesin beneran, itu lebih rawan noise dan false trigger. Ya, mesin bakar + kabel koil + ESP32 itu resep klasik “kenapa reset sendiri ya”.

Output timing-nya lebih deterministic

racing-cdi menyebut PA0 terhubung ke TIM2_CH1 untuk hardware timestamp 0.1µs dan PB0 sebagai output timing-critical.

Ini lebih cocok untuk ignition timing. ESP32 bisa cepat, tapi WiFi, interrupt, FreeRTOS, dan peripheral lain bisa bikin jitter kalau tidak sangat hati-hati. Untuk CDI racing, STM32 timer hardware memang pilihan lebih waras.

Safety software-nya lebih fokus engine-control

racing-cdi mendokumentasikan watchdog, blind window, noise filter, cold start stable trigger, dan progressive rev limiter.

Repo ESP32 juga punya banyak fitur, tapi terlalu banyak fitur “wah” seperti anti-wheelie, traction control, web dashboard, OTA, IMU, quickshifter. Keren di brosur, tapi kalau ignition basic belum solid, itu seperti pasang sayap di gerobak.

Tapi racing-cdi juga punya red flag
1. Klaim “complete replacement” agak terlalu percaya diri

README racing-cdi menyebutnya sebagai complete replacement CDI, tapi pinout output-nya justru “to CDI trigger” atau “direct to CDI module trigger”.

[Inference] Jadi kemungkinan ada dua kemungkinan:

Dokumentasinya belum lengkap dan power stage CDI belum dimasukkan.
Project ini sebenarnya hanya controller/trigger untuk CDI eksternal.

Yang kedua lebih cocok dengan isi pinout.

2. Tidak terlihat blok HV CDI di top-level repo

README racing-cdi menyebut ada /hardware, /docs, /examples, dan /tools, tapi daftar file top-level yang terlihat di GitHub hanya menunjukkan folder seperti bacup, build, optimasi, ui, plus file PINOUT.md, README.md, WEB_UI.md, PDF board WeAct, dan .ino.

[Inference] Ini memberi kesan dokumentasi README lebih ambisius daripada isi repo yang benar-benar tersedia.

3. Tetap belum ada HV capacitor discharge

CDI asli minimal butuh:

Pickup/VR sensor
↓
Signal conditioner
↓
MCU timing
↓
Trigger driver
↓
HV charger 200-400V
↓
Main discharge capacitor
↓
SCR / IGBT / MOSFET HV switch
↓
CDI ignition coil
↓
Spark plug

Di racing-cdi, bagian yang jelas terlihat baru:

VR sensor
↓
MAX9926
↓
STM32 timer
↓
PB0 trigger pulse
↓
CDI trigger input

Jadi bagian “CDI power” masih diasumsikan ada di luar board.

Masalah tambahan di repo ESP32

Repo ESP32 punya konflik pin yang lumayan mencurigakan: GPIO22 dipakai untuk FRONT_WHEEL_SENSOR / I2C_SCL, dan bagian wiring juga menunjukkan GPIO22 untuk front wheel sensor sekaligus SCL MPU9250.

Di kode, GPIO22 juga didefinisikan sebagai FRONT_WHEEL_SENSOR_PIN, sementara komentar pin menyebut I2C SDA=21 dan SCL=22. Simulator mode juga masih aktif dengan ENABLE_SIMULATOR true.

[Inference] Ini tanda kuat bahwa repo ESP32 lebih cocok dianggap prototype/simulator-heavy, bukan desain ignition hardware final.

Kesimpulan final

[Inference] Kalau dibandingkan:

racing-cdi lebih bagus sebagai basis firmware/timing engine.
STM32 + MAX9926 + hardware timer + trigger pulse pendek itu arah yang lebih benar.

Tapi:

racing-cdi juga belum terlihat sebagai CDI lengkap.
Dia tidak menggantikan blok HV CDI, kecuali ada hardware eksternal yang belum didokumentasikan.

Jadi pembagian paling jujur:

esp32-programable-cdi
= programmable inductive ignition / TCI-ish controller

racing-cdi
= programmable CDI trigger/timing controller

CDI asli
= timing controller + HV charger + discharge capacitor + SCR/IGBT power stage
Rekomendasi arah project kamu

Kalau mau project yang benar-benar berguna dan tidak cuma “nama CDI doang”:

Opsi paling aman dan realistis

Pakai arsitektur racing-cdi sebagai controller:

Pickup → MAX9926 → STM32/ESP32 timing → trigger output → CDI aftermarket/module bawaan

Ini lebih mudah, lebih aman, dan tidak perlu langsung main HV 300V seperti manusia yang terlalu percaya diri pada breadboard.

Opsi full CDI beneran

Bangun sendiri power stage:

12V battery
↓
DC-DC boost 250-400V
↓
HV film capacitor
↓
SCR/IGBT discharge switch
↓
CDI coil
↓
spark plug

Untuk full CDI, repo ESP32 sekarang harus dirombak besar. Bukan “tambah resistor sedikit”, tapi tambah satu organ tubuh lengkap.

jadi kedua repo itu belum ada jantung asli cdi nya?
Thought for 31s

Betul. Berdasarkan dokumentasi yang terlihat, dua-duanya belum punya “jantung asli CDI”.
Mereka punya otak/timing controller, tapi belum punya power section CDI yang benar-benar mengisi dan membuang energi dari kapasitor HV. Jadi jantungnya belum ada, baru sistem sarafnya. Elektroniknya sudah pakai nama keren dulu, tentu saja, karena branding lebih murah daripada kapasitor 400V.

Yang disebut “jantung CDI” itu apa?

CDI asli butuh blok inti ini:

12V / magneto
   ↓
HV charger / inverter
   ↓
Kapasitor tegangan tinggi
   ↓
SCR / IGBT discharge switch
   ↓
CDI ignition coil
   ↓
Busi

Pada CDI, main capacitor di-charge lalu dibuang melalui SCR ke ignition transformer/coil untuk menghasilkan pulsa tegangan tinggi ke busi. Itu inti sistemnya, bukan sekadar MCU mengatur timing.

Repo esp32-programable-cdi

Repo ini menghubungkan:

ESP32 GPIO4 → MOSFET gate
MOSFET drain → ignition coil (-)
Coil (+) → +12V

Dokumentasinya juga menyebut komponen minimum seperti ESP32, MOSFET logic-level, flyback diode, pickup sensor, SD card, baterai 12V, dan buck converter. Tidak terlihat HV charger, kapasitor discharge, atau SCR/IGBT CDI power stage.

Jadi ini lebih tepat disebut:

Programmable TCI / inductive ignition controller

Bukan CDI murni.

Repo racing-cdi

Repo ini lebih serius di bagian timing. Dia pakai STM32H562RGT6, MAX9926 VR conditioner, timer presisi, dan output PB0. Tapi PB0 di dokumentasinya disebut sebagai CDI output to CDI trigger, bahkan contoh wiring-nya langsung:

PB0 ──[330Ω]── CDI Trigger Input

Pinout-nya juga menyebut PB0 sebagai CDI Trigger yang direct ke CDI module trigger.

Artinya repo ini lebih cocok disebut:

Programmable CDI trigger controller

Bukan CDI lengkap.

Kesimpulan paling jujur
Repo	Status sebenarnya
esp32-programable-cdi	Controller + MOSFET coil driver, lebih mirip TCI
racing-cdi	Controller trigger CDI eksternal
CDI asli	Harus punya HV charger + capacitor discharge + SCR/IGBT

Jadi jawabannya:

Iya, dua-duanya belum punya jantung CDI asli.

Yang ESP32 malah lebih jauh dari CDI karena langsung drive ignition coil 12V.
Yang STM32 lebih rapi, tapi tetap butuh modul CDI eksternal atau tambahan power stage HV agar benar-benar jadi CDI penuh.

Kalau mau dibenerin arahnya, project idealnya dibagi begini:

Controller board:
Pickup → signal conditioner → MCU → timing logic → trigger output

Power CDI board:
12V → HV charger → HV capacitor → SCR/IGBT → CDI coil → spark plug

Nah, dua repo itu baru banyak main di controller board. Bagian power CDI board belum kelihatan matang, alias “jantungnya belum dipasang, tapi dashboard-nya sudah pakai neon.”

kamu ada masukan apalgi biar projeku bener" production ready bukan cuman bagus di judul dan iklan doang

Aku akan kasih masukan yang lebih “produksi beneran”: hardware, firmware, safety, test, manufacturing, dan dokumentasi. Bagian HV CDI harus diperlakukan serius, bukan sekadar “asal keluar api, berarti sukses”, ritual favorit umat solder.

Thought for 40s

[Inference] Masukan paling penting: jangan mulai dari “fitur racing”. Mulai dari “spesifikasi listrik, safety, dan cara test”. Kalau dari awal README sudah penuh quickshifter, anti-wheelie, web dashboard, tapi belum ada validasi HV capacitor discharge, itu bukan production-ready. Itu brosur cosplay, dan GitHub sudah terlalu banyak korban seperti itu.

1. Tentukan dulu project ini mau jadi apa

Jangan ambigu. Tulis dari awal:

This project is a programmable DC-CDI system with separated controller board and CDI power board.

Bukan:

Smart racing CDI ultimate pro max.

Karena kalimat kedua terdengar seperti produk marketplace yang bonusnya kabel gosong.

Struktur target yang jelas:

Pickup Sensor
   ↓
Signal Conditioner
   ↓
MCU Timing Controller
   ↓
Isolated / Protected Trigger Driver
   ↓
HV Charger
   ↓
HV Discharge Capacitor
   ↓
SCR / IGBT Discharge Stage
   ↓
CDI Ignition Coil
   ↓
Spark Plug

CDI beneran perlu discharge kapasitor tegangan tinggi. Microchip menjelaskan CDI memakai high-voltage capacitor discharge current untuk memicu spark plug, sementara NXP menjelaskan SCR firing memulai discharge kapasitor ke primary ignition coil.

2. Buat “Definition of Done” yang keras

Production-ready bukan berarti “nyala sekali di meja”. Itu level video YouTube 17 detik, bukan produk.

Minimal DoD untuk hardware

Project baru bisa dianggap serius kalau sudah ada:

Area	Syarat minimal
HV charger	Bisa charge kapasitor ke target voltage dengan monitoring
Discharge stage	SCR/IGBT dipilih sesuai arus, tegangan, thermal, dan margin
Capacitor	Film capacitor HV, bukan elco asal colok
Pickup input	Ada VR/Hall/opto conditioner, hysteresis, noise filter
Power input	Reverse polarity, fuse, TVS, filtering, load transient protection
Isolation/layout	Clearance HV jelas, creepage jelas, slot/keepout PCB
Fail-safe	Kalau MCU hang, spark tidak liar
Test point	Ada titik ukur Vcap, trigger, pickup, 5V/3V3, gate/SCR
Enclosure	Tahan panas, getaran, air, kabel ketarik
Dokumentasi	Schematic, BOM, test report, wiring, risiko HV

Standar otomotif seperti ISO 16750 membahas kondisi lingkungan dan test untuk komponen elektrik/elektronik kendaraan, sedangkan ISO 7637-2 membahas test transient listrik untuk sistem 12V/24V kendaraan. CISPR 25 membahas batas dan metode pengukuran gangguan radio dari komponen kendaraan. Itu bukan harus langsung sertifikasi mahal di versi awal, tapi harus jadi arah test, bukan sekadar “kayaknya aman”.

3. Pisahkan board: controller dan power CDI

Ini wajib kalau mau jelas.

Board 1: Controller Board

Tugasnya:

- Baca pickup
- Hitung RPM dan crank angle
- Ambil ignition map
- Hitung advance
- Rev limiter
- Safety logic
- Kirim trigger ke power board
- Logging

Gunakan STM32 kalau fokus utama presisi timing. ESP32 masih bisa untuk UI, BLE/WiFi, logging, atau map editor, tapi untuk ignition timing real-time, hardware timer STM32 lebih waras. WiFi di dekat ignition coil itu seperti membawa kucing ke pabrik petasan.

Board 2: CDI Power Board

Tugasnya:

- 12V input protection
- DC-DC boost ke 200-400V
- HV capacitor charge control
- Vcap feedback
- SCR/IGBT discharge
- CDI coil output
- HV protection
- Bleeder resistor
- Safe discharge path

Kalau power board ini belum ada, project belum bisa disebut full CDI.

4. Tentukan parameter listrik dari awal

Jangan langsung pilih komponen. Tentukan target.

Contoh parameter yang harus kamu tulis di docs/specification.md:

## Electrical Target

- Input voltage: 9V-16V nominal automotive/motorcycle battery
- Cranking voltage tolerance: defined during test
- Load transient tolerance: defined during test
- HV capacitor voltage target: 250V / 300V / 350V selectable
- Spark energy target: e.g. 30-80 mJ
- Max RPM: e.g. 12,000 / 15,000 / 20,000 RPM
- Engine type: 1-cylinder 2T/4T
- Pickup type: VR / Hall / pulser coil
- Ignition coil type: CDI coil, not inductive TCI coil

Energi kapasitor dihitung dari:

E=
2
1
	​

CV
2

Contoh kasar:

C = 1 µF
V = 300V

E = 0.5 × 0.000001 × 300²
E = 0.045 J
E = 45 mJ

[Inference] Angka seperti 30-80 mJ bisa jadi titik awal eksperimen kecil, tapi target final harus disesuaikan dengan coil, RPM, mesin, plug gap, dan hasil test nyata.

5. Jangan pakai komponen “asal bisa”

Untuk production-ready, pilih komponen dengan alasan.

MCU

Rekomendasi:

STM32 untuk timing core
ESP32 opsional untuk UI/logging

Kalau tetap ESP32 sebagai utama, batasi fitur wireless saat engine running atau pisahkan core timing dengan hati-hati. [Inference] Ini berdasarkan pola desain embedded real-time: timing ignition sensitif terhadap jitter, sedangkan wireless stack bisa menambah kompleksitas runtime.

Pickup conditioner

Pakai salah satu:

VR sensor  → MAX9926 / LM1815 / comparator automotive-grade
Hall sensor → Schmitt trigger + protection
Opto input → kalau trigger dari CDI/module lain

Jangan langsung masuk ADC/GPIO kecuali untuk prototype. Pickup motor itu noisy. Coil ignition lebih noisy lagi. Alam semesta tidak menyukai GPIO polos.

Power switch

Untuk discharge CDI:

- SCR untuk CDI klasik
- IGBT/MOSFET HV untuk desain lebih advanced

Untuk ignition inductive/TCI:

- Automotive ignition IGBT lebih cocok daripada MOSFET random

AEC-Q100 adalah stress-test qualification untuk IC otomotif, dan AEC juga punya dokumen Q101 untuk discrete semiconductors. Ini berguna sebagai arah pemilihan komponen otomotif, walaupun project open-source kamu belum tentu langsung memakai semua part AEC-qualified.

6. Safety HV harus jadi fitur utama, bukan catatan kaki

Tambahkan docs/safety.md dari awal.

Wajib ada:

## High Voltage Safety

- HV capacitor can remain charged after power-off.
- Always discharge capacitor through a proper resistor before touching the board.
- Add bleeder resistor across HV capacitor.
- Add HV warning silkscreen on PCB.
- Add test mode with HV disabled.
- Add enclosure requirement before engine test.
- Do not test HV section on breadboard.

Tambahkan juga hardware safety:

- Bleeder resistor
- HV divider untuk Vcap sense
- Over-voltage cutoff
- Charge timeout
- Discharge inhibit saat Vcap tidak valid
- Fuse input
- Reverse polarity protection
- TVS diode input
- Grounding strategy

Analog Devices menjelaskan ISO 7637-2 dan ISO 16750-2 sebagai spesifikasi umum untuk transient otomotif yang bisa merusak elektronik, dan artikel mereka membahas proteksi supply 12V terhadap kondisi tersebut.

7. Tambahkan mode test yang beneran berguna

Buat firmware punya beberapa mode:

MODE_SIMULATOR
- Tidak ada output HV
- Input RPM palsu dari serial/UI

MODE_BENCH_LOW_VOLTAGE
- Trigger output aktif
- HV charger disable
- Pakai LED/scope output

MODE_HV_BENCH
- HV charger aktif
- Discharge ke dummy load/spark tester
- Logging Vcap dan trigger

MODE_ENGINE_TEST
- Semua safety aktif
- Logging wajib

Jangan firmware langsung masuk mode engine. Itu seperti bayi baru lahir langsung ikut drag race.

8. Logging wajib, bukan bonus

Minimal log:

timestamp
rpm
pickup interval
advance target
advance actual
trigger delay
vbat
vcap
charge time
discharge event
missed trigger
over-voltage
under-voltage
watchdog reset reason
rev limiter active

Format sederhana:

time_us,rpm,advance_deg,vbat,vcap,charge_us,event,error

Dengan log ini kamu bisa tahu masalahnya timing, charger, pickup, atau power stage. Tanpa log, debugging ignition itu cuma bertanya pada asap.

9. Buat test plan dari awal

Folder wajib:

tests/
├── bench/
│   ├── pickup-simulator.md
│   ├── timing-jitter-test.md
│   ├── hv-charge-test.md
│   ├── discharge-test.md
│   └── thermal-test.md
├── engine/
│   ├── idle-test.md
│   ├── rpm-ramp-test.md
│   ├── rev-limiter-test.md
│   └── road-test-checklist.md
└── reports/
Test minimal
Test	Tujuan
Pickup simulator	Validasi pembacaan RPM tanpa mesin
Timing jitter	Ukur presisi trigger
HV charge test	Ukur waktu charge capacitor
Vcap regulation	Cek target voltage stabil
Discharge test	Cek SCR/IGBT dan coil output
Thermal test	Cek suhu saat RPM tinggi
Brownout test	Cek saat tegangan drop
Noise test	Cek false trigger
Watchdog test	Cek recovery saat firmware hang
Long-run test	Jalan lama di bench
10. PCB layout harus dipisah zonanya

Minimal zona PCB:

[Low Voltage Logic]
MCU, sensor input, serial, regulator

[Noisy Power]
DC-DC switching, transformer, MOSFET charger

[High Voltage]
HV capacitor, SCR/IGBT, CDI coil output

[Connector Edge]
Input battery, pickup, coil, ground, config

Aturan praktis:

- Jangan campur ground return HV discharge dengan ground sensor
- Buat HV clearance besar
- Kasih slot isolation kalau perlu
- Pisahkan pickup trace dari coil/HV trace
- Gate/SCR trigger pendek dan jelas
- Tambahkan test point
- Tambahkan mounting hole dan strain relief

[Inference] Untuk production-ready, PCB 4-layer lebih nyaman untuk ground dan EMI daripada 2-layer, terutama kalau ada switching HV dan input sensor lemah di board yang sama.

11. Jangan overfit fitur sebelum spark core stabil

Urutan pengembangan yang masuk akal:

Phase 0 — Research & spec
- Tentukan mesin target
- Tentukan pickup
- Tentukan coil
- Tentukan Vcap dan energy target
- Tentukan RPM max
Phase 1 — Timing controller
- Pickup simulator
- RPM calculation
- Timing map
- Trigger output
- Jitter measurement
Phase 2 — CDI power core
- HV charger
- Vcap feedback
- Discharge capacitor
- SCR/IGBT
- Dummy spark tester
Phase 3 — Integration
- Controller trigger power board
- Logging
- Protection
- Bench long-run
Phase 4 — Engine test
- Idle
- RPM ramp
- Heat soak
- Vibration
- Road test terbatas
Phase 5 — Packaging
- Enclosure
- Connector automotive
- Potting/conformal coating
- Harness
- Documentation

Fitur seperti quickshifter, launch control, traction control, Bluetooth, web UI: tunda dulu. Tambahkan setelah CDI core stabil. Kalau belum bisa spark stabil, anti-wheelie itu cuma dekorasi.

12. Buat README yang jujur per status

Ini penting biar project tidak jadi iklan palsu.

Contoh badge/status:

## Project Status

- [x] Architecture defined
- [x] Timing controller prototype
- [ ] HV charger prototype
- [ ] Discharge stage prototype
- [ ] Bench spark test
- [ ] Engine idle test
- [ ] Road test
- [ ] Production PCB
- [ ] Enclosure
- [ ] Compliance pre-test

Tambahkan warning:

> This project involves high voltage ignition circuits. It is experimental and not certified for road use.

Itu bukan bikin project kelihatan lemah. Itu bikin project kelihatan dewasa. Perbedaan tipis yang sering gagal dipahami repo “ultimate racing v9”.

13. Struktur repo yang aku sarankan
open-programmable-dc-cdi/
├── README.md
├── LICENSE
├── docs/
│   ├── 00-project-goals.md
│   ├── 01-cdi-theory.md
│   ├── 02-system-architecture.md
│   ├── 03-safety.md
│   ├── 04-wiring.md
│   ├── 05-tuning-guide.md
│   ├── 06-test-plan.md
│   └── 07-production-checklist.md
│
├── hardware/
│   ├── controller-board/
│   │   ├── schematic/
│   │   ├── pcb/
│   │   ├── bom/
│   │   └── README.md
│   ├── cdi-power-board/
│   │   ├── schematic/
│   │   ├── pcb/
│   │   ├── bom/
│   │   └── README.md
│   ├── pickup-conditioner/
│   ├── test-jig/
│   └── mechanical/
│
├── firmware/
│   ├── controller/
│   ├── bootloader/
│   ├── drivers/
│   ├── ignition/
│   ├── safety/
│   ├── logging/
│   └── tests/
│
├── tools/
│   ├── map-editor/
│   ├── pickup-simulator/
│   ├── log-viewer/
│   └── firmware-flasher/
│
├── calibration/
│   ├── base-maps/
│   └── engine-profiles/
│
├── tests/
│   ├── bench/
│   ├── engine/
│   └── reports/
│
└── manufacturing/
    ├── gerber/
    ├── assembly/
    ├── bom/
    ├── test-fixture/
    └── qc-checklist.md
14. Minimum dokumen yang harus ada

Kalau mau kelihatan production-grade, buat ini dari awal:

docs/cdi-theory.md
docs/system-architecture.md
docs/electrical-spec.md
docs/safety.md
docs/test-plan.md
docs/known-limitations.md
docs/failure-modes.md
docs/production-checklist.md

Yang paling penting:

docs/failure-modes.md

Isi contoh:

| Failure | Effect | Detection | Mitigation |
|---|---|---|---|
| Pickup noise | False spark | Invalid interval filter | Blind window |
| MCU hang | No timing control | Watchdog | Output disabled on reset |
| Vcap overvoltage | Component stress | ADC feedback | Charger cutoff |
| Vbat undervoltage | Weak charge | ADC feedback | Disable HV charge |
| SCR short | Uncontrolled discharge | Vcap anomaly | Fuse / service required |
| Coil disconnected | HV stress | Vcap/log anomaly | Fault mode |

Ini membuat project kamu naik kelas dari “rangkaian hobi” ke “sistem yang dipikirkan”.

15. Jangan klaim “production ready” terlalu cepat

Pakai status bertahap:

Prototype
Bench Validated
Engine Tested
Pre-Production
Production Candidate

Makna:

Status	Artinya
Prototype	Rangkaian dasar hidup
Bench Validated	Sudah diuji di meja dengan alat ukur
Engine Tested	Sudah diuji di mesin terbatas
Pre-Production	PCB, enclosure, harness mulai final
Production Candidate	Test report, QC, BOM, assembly stabil

[Inference] Label “production-ready” baru pantas kalau desain sudah punya test report, dokumentasi manufacturing, BOM stabil, firmware release, enclosure, QC checklist, dan hasil test nyata.

16. Fokus pertama yang paling aku rekomendasikan

Kalau kamu mulai dari nol, urutannya begini:

1. Tulis electrical spec
2. Buat block diagram final
3. Buat controller board sederhana
4. Buat pickup simulator
5. Validasi timing jitter
6. Buat HV charger terpisah
7. Validasi Vcap monitoring
8. Buat SCR discharge stage
9. Test pakai spark gap/dummy jig
10. Baru test ke mesin

Bukan:

1. Bikin web dashboard
2. Bikin animasi RPM
3. Tambah Bluetooth
4. Ganti nama jadi racing
5. Bingung kenapa spark random

Walau harus diakui, opsi kedua sangat manusiawi.

Rekomendasi finalku

Bikin project kamu dengan prinsip ini:

Timing controller boleh keren.
Tapi CDI core harus bisa dibuktikan dengan alat ukur.

Prioritas utama:

- Real HV charger
- Real discharge capacitor
- Real SCR/IGBT discharge
- Pickup conditioner yang tahan noise
- Timing yang bisa diukur
- Safety HV
- Test report
- Manufacturing checklist

Kalau kamu bikin itu dari awal, project kamu akan beda kelas dari dua repo referensi tadi. Bukan cuma “CDI” di judul, tapi benar-benar punya otak, jantung, saraf, dan hasil test. Itu baru proyek yang layak diseriusi, bukan sekadar iklan dengan kabel dupont.