import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const CAFE_FILE = path.join(process.cwd(), 'src', 'data', 'spots', 'cafe.json');
const GARDEN_FILE = path.join(process.cwd(), 'src', 'data', 'spots', 'garden.json');

const userImageMap = {
  'Cafe Koc Hoc Mon': [
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkb4gk7ExW543OD-Ypbo3QRQcRzma5h5_Z3uZ31Pbp1r8GLNrNSOXSPtVVmjSH95Ypt59RXdoWfUVJvpAPXGd6bAVnTgKKBXuU7Q8khhIhh2MIebtUhL7IWwihmDiATYzD0OcgH-w=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnjUKmA_VAm9ntTdfjNDLoscxzAY6K8G94rh0xx_0Fqf3GwZYdRhQNa0hyDc569i4cU7Lh_qAmcsRrsrFbuY5SMgxPkqvweQQ3xcEKksRKDEBDW3AUQXKxNq9kFF_Ldk-Yw4g=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnxGpapCXoilnc1hJVinJ0YUZvwLhMIfC2SSKBpZgvqsVVq1HbCJypBJ_uvEoCljzp4TCJHLXOzZiD8QvEmXaXvTzqZZ5jn9ijSRt8J5kOIHsyGJwruKiUim0IvjkrTDbbJu0xY=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkKNFoYnAy1yjzqADS_4NNPni5ve-HJeWkpmAHWNF2hBGRfJVcVsF0h8Gy6I2ZG2NTfJ8dCRbxC3rukUrm9mOMqHy8laC_BJ4p8cq3Lstdqog5XkhwLHHNlpT6VD2NS33WEwfMdew=s1360-w1360-h1020-rw'
  ],
  'The Coffee Health': [
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkjo_vI9fv7O4kt3IC1Mru8McRhAFBoMEWXzy-rVj9tRL4vpHhlNmgmy9MihGQAFJycrVpbxdFMyb2UBSVbIgDq6-qHL_uwK3ais68qOFfW-QRqeIkebIypq1g3_hAyVid1NKYw=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmlUELT2AuYdUMx5fBnzSwcfn1p1BkrZ9q-6PtGQCrKZxhokoYNsSRFjt0SI7lhVTwQ2pwerBMqOapt5TcaG7CsHDbmXpwKQAryNXbIA2eZIqVcsUb_ZLnOd6NJAmzbXKdQfKlhQxwogOA=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnyxicWwvGzj0Ag9SQDQOYKzWC__HbLDzFrGYV6nKUiVU5YMgx2KcAG7ibh-VC41CjdWRD2tBL0RB8q3fVZ25MYlEWk1FeBcfYvGSC7rtA9IQ6g1_0yh9xKcOFOdwZ9t0uY2rdZvKbvkAg8=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkHjRrESbgQfzab2kaPeEexux4uQIcZ946AdehhjkMvIt_6W_YWIWHDm-7SyWZDOArDmwKQsxTKXU6JC1ckgWxGaZY_l3SqV9ZsHQrjkGOC4_voJHGsfm5gzwWGZ9wSrQJMAs-aakffsq6v=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnFvS_KQvVaVGEDSmldUSp_j69D6-FLJoKyNRg7U8t_icD1Ua9LQibf6TNfG7rjnxT-74ieIWNZ0cqljBbLMchrlw0yI7oECQIHSzrEJcyN-Dc5XBWq76ft_HokHE1wI_v-0fVyZHqvUjvs=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmPnWQs6zqqy9SzzaYlfW1VlEQof6VkiyADB_eApL1Zva2pxV-Ucmvh8iYlv_ltgZTJTsNujp4sg3ENQutGPt44mIo5AeibGvkgw5iFY8XTWZ39JeI-6JHGbDLhy0PnHwlfYDDOm--wqQ0=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnAyd-v47-4QSC8Wolt4yO75HrSN4-OI8ishJCSSZr5oomGzE38B0_i655UNRMVTPXVa2fSTz1gTUMouBvyIMJWuN6CMzPLCYjADINb-WrU4Bbki-MW4s4PBL2vXe8KDPGfKMb-tIbVylI0=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkM945uNoyjd9WP11vDhL9dP7GIbACM5AO0AnuGpbzjgDJ18U-TCowrTC76qnxa3baYXp6Cl6xJn7EKuVwGEVATB8UV9-reXKLWCQKbJp6DK584yIc35RkIvpXMnzwlxZOsE7dM3VTJ-Ig=s1360-w1360-h1020-rw'
  ],
  'Cà Phê Kem HP': [
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmCz8R4N4HvB9J4u3ekNGSG3MHHXdO6UO-I7TEIskCXT8juY8-nZ2zySxZAHDEIhCMqfbtHtED1otOnjBRU9_fZBO4FBGDah-RBppGhAruaCvZeSQuJ-gTz_9AHA4ZIbp-MvKqk=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnOEKoBVku28YEodF47JxJUqctWhCloH-L83KXoj2RIMfvmI4APpAc8xhQ22POElo_k8O5DfxwEMwLh9rpuqU1FUQFjZ4Ff1OM1kPgBZadboyrZZBfXPxs9qN4vHvDGVIVZEAU=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlHWKwEuCZeSS0RD4MZwJ2K31HuhGCOetmpDocihJxua8tamnOM98wkaWwO76XDJUOETEG_lIlHh4HZ0Y6IOu8HORfslnsRx1bBGbsX4gPCUTPyexsPkk-AcQEMUL3lG6ENFd6f=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWl8LEjcLz0hxCFL4kB3-ROIhFLyYN_vTFlMd9vyPcmcfq--8S_NXGH4KTROaaTO_HRruXO_uAonCfQEpa4C5uASZ6ojaU-lP_5h-U15Ko5cXcr07P6rRiyl6Vc-FrrU9Muz4jpYiQ=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmNzW700bzC6Nb20Hd3rpVx3zGesO4sXIRA5WRUR6Wk2Zax6qD7Jg5F9sjEaHciPxWR8hUIW53e0kMeUMIPVnD77SmwouIael6q9drkO81b4khVqD4T4oYs_JG1wI0bWO9Xbn1ZAQ=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnsbpEZxuThzD_4xidoGyB5sUg5GyLubtFYm_uPXAPcJdR0foa8FhJDjUEFic-hXE3JWKghRXcVrqCXTbfp7FgcsXPpR4ZbiJgTfad9U8cBuDt-dCIyfeBUCP4HB-VvCxaawg=s1360-w1360-h1020-rw'
  ],
  'Cafe Không Gian Việt': [
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmcbn4WKGKB8NYwj24IZp2X55eZmNGGgCTKDS_qdPfNBUepGVw4X28H5H6_KqrnY_BVbc2Z_5dNThh2jYEuqmSZFkcokJablMwjUwN9XUDagRgQwDnhva6Nd42R9Egb8NZoxUJb=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlHGSSP7oEWOsG8Sx96Bjq900eX9Lc0zx9LhFuxkuWVH5uINMm4o6BqWIJVnfeIm5GLAgI0NLH8wOPhkQVRKU3U36xNHPIATNfkQD7DQDqmBCKWmAmvtH_hrl8omj8U3Nxvbq-1DHVJXmo=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlqrXiaWsAOrlLOo5WkXUtWw4zg3oHGwlCwPNWg36EJy3I4atZufl2i1TsyCXH9ZHh_0rBUwbxmjY3An7jJTQgtrta8TLLNpdER2H0lTKtZnc17Buhhw2O70qCJT0b6jiiBZyNq=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWm4ivYk-AT3pvmgyL2n5jQ-T8WnoykMfW45MMvK8_N5BWxZQp8Rv950wCLYRnT2JTd8E-ur27sfmgjXCfY_avkCN-jr57gB_xfQjg9RbWq8TxnZ9PQXc6AKOoQByaWJ-fgHigLWg7Q5KJcJ=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlbbLKv_1rED-SjTyKdfwzutQBvpcdYl9wUnoOgplJ0YWdTcC9fHqFahed7FTG26e-t_EB3YvSTWGaiQ2qTEO10j55RfW9D5FVkr6QRsLtcHUkqjcBRw2mdB7-DHTfnT2yZ9Wn7yw0IlRGh=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWljw13d6yc-rKZ1th9AAY2k1tY3cP-PFpQT_683sxhvhoNLTycBDDo8GTsdTB34aZQyrTMI8lYanbtVQnu06qOCMbPtjokiHfOdqGAujxYoJkkjRl_nW30D-Gg2jbJzdSyuRpXyqARYUrb8=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlfzYPEZ2A1g4aTu3aOTmqAgt-qA9s3keLQPjOzyrYEF_eYbG2oXEsikqhOuunT-iQDOooYZzYPAO1h0ypiiZ3zvOc7Z5R-UxHKDK7GSi4BSKfqply3I8sjHBtaU4RTdxwWies=s1360-w1360-h1020-rw'
  ],
  'VườnCủaGió': [
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWm9xy5X536KpEJzuelQxIW453kilv_NRvrzuH0CuS6ss1VwdNGrkDmOpUmw1ffRQzPLxpKWf62KZt_m6psmDZmmdBk-gGUrgxIfKlTWxx11NnnpAaZ9wU-nXqY-BBppqC5-jQ6e=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkijL2OotjL2DoWdB1RhMeQ3ajlTSY54iQlWvOzPiewT-PHYn77Dd0bvrBVwYvqOJmmRt0tyRXpWKs-gvRd5Ek4gokNLESMIKuTHR63t1mQMyHDoop_o4mYTd88DrYqUYr_i9Zsew=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnbyNUAhtYGDjMFrjqiWcnCcpp-SDaV75XhDBvfJzig0b9vo-AvhitsuMxupVJr8V1FBPm1Jyp_jrhl8AOGxvvPyYtbawM8h1DBq1aT2f9Du_QlnOKaa3A-mkiX2jw6kOCqJdhEPsuGz8tq=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnPrBCv-ZdW03rQFXE8lao0poEqLItXans1WGQGv_j3B7Q6IRUFJVNmVEl07FCZwSc88dPtuYOe7J8OVxBreJQwNdlnMxYDzz3ev6yzwaLGkCPkyy9sf0vwrwmh3-Yud5W7WAcUlQ=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlYOF1dXsRiFYO1gR8eHdWkQlZv6oaNkA4k7jI_kasQTS3j2U8uUjac56Z0kFx4uqq8lCBV9UEjSJ9O-1CvVowEMoTcgdzaDYnS95GLK7gTa8h6Ws8DppKn14Vk08mSf9QerR8RlVGj1XRz=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkdBjxb-c-wrBwnTevhfY_ajOIQEGSVu2RviFcKabNwHxr2fGlCFLAI7BtuDWwoemX6mGWPZG0cRtUUMwKAmUo7k9yNDeWVwFqlgGiUmO8LrU-bf3S759xzW1w2MR0y9a6-1gPl3g=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnEg3k6sKIMDazAukiD6lxWkcC6ArqMpJ-UgJVQVsfaKMjqKg0EYI54UAbvO7bCgaAUcuJ0_Hl6vDmAxROpEI5VMQhQ1XfrqTsms6OIJJm1zsv8p9ZLrtwyGOgGoLQ-oPN8ZOh5MA9kbLj-=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlH1Xi08Gq3zkKeBJhd5WSVe5BUsaWwn_KB4d1zaUtg6TqPXuq1tKihhZaL3eeOI84ifSgim5HmXlPrl0FCx_CkOENgizuAkFynZ2hTszNt1ZA_cZsaYtRSjrET4aPQklbicOZJ=s1360-w1360-h1020-rw'
  ],
  'The Bis Coffee': [
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlGEZcDIlzYBYiRK8sASbpXr3UhH4jKW8R5Du6dTS8q9l3Yo0xrgqpx2vpOQ_3SI4fb8ZHWxWfV88A2F1StO8uYnF1inPrQKoTM-U8gO2I9qxooAERTFdjDpj7REZgGeB6i-7l3=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnwjrVnKSANSLtGRGEeUy8hONsh2yUEyBywX085aeD7ZLR4Sn9-g7Ng-NB7NO6dEb0XkFUFQZqOrx3urfEizYsQQvtbFfJzV28dvSSlCts4Gl5QPvDWhTe-2WquZc0qOfKvPlvY9hTJ7nPG=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlkjRolY2Sywnkwxj44bPeT8_xP1QAHBLcEqRkTc-iRvZJwX2rfLJokpc_J_3zG2Plk3D56D_BhOb2HYWws2pg1ApvNduqdENBHpd-prup6vM9oKm7tViYdJ0NWMWmKPtwSKxdjHg=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWl4vMs5cP5Rd8zdmjaqmRpRLtnTTXAB_jio6TnMrSfTmyWyu1a1evrrbKouL31dHSKQ1rBepfYaWu6yV2TizmA-VwfP5qaXFZkmBvU4HsHhFS2qQE8vU_C9wqyJZxuEvBChUsst=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkl90tHIOQiL4SMLmoaTWWh9Wekp-S6ciSd2zMJZO2X4FdpMRL32hVZZD6reFlajrC-Lv87xGxHh_pFbyJbvuNEjjELHA5ZX12RXqfdBiUbPKQSpJieWQRlb_oUUyPS7R6F6F13=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlqXk8ZBMv6Bp1pqRvjlpgPuqhfByuf35ZmyYz3iy0dk2Jfkmqp_1R1le5FECTzbSp1UoizSS0dW_nNN-5pd2FzUBhQZQpcdU8yiEF7ZMRZR4dnwq0qDNZZAj6ZHziSL2PC3SC5=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnr1JMEZ3oOcNuxh7q9QlogHX9NueMeRsWyG_CCDlG_tD-1iz4UOqJ44-MvAWnhoV8lfPRkcA0lpztXizHGtvzWPMUh-ISG4rwkOYVqFpDheYPnZ5qkh_Nqu4ea91HKOCm-VhgRMA=s1360-w1360-h1020-rw'
  ]
};

async function processPhotosAndMove() {
  console.log('🚀 Bắt đầu upload ảnh cung cấp bởi người dùng lên Cloudinary & chuyển 6 quán sang garden.json...');

  const cafes = JSON.parse(fs.readFileSync(CAFE_FILE, 'utf8'));
  let gardens = fs.existsSync(GARDEN_FILE) ? JSON.parse(fs.readFileSync(GARDEN_FILE, 'utf8')) : [];

  const moveVenueNames = [
    'Cafe Koc Hoc Mon',
    'The Coffee Health',
    'Cà Phê Kem HP',
    'Cafe Không Gian Việt',
    'VườnCủaGió',
    'The Bis Coffee'
  ];

  const remainingCafes = [];

  for (let c of cafes) {
    const isMoveTarget = moveVenueNames.some(name => c.name.includes(name) || name.includes(c.name));

    if (isMoveTarget) {
      console.log(`\n🏡 Đang xử lý quán chuyển sang sân vườn (garden.json): ${c.name}`);
      const folderPath = `địa điểm/sân vườn/${c.name}`;
      
      const matchedKey = Object.keys(userImageMap).find(k => c.name.includes(k) || k.includes(c.name));
      const urlsToUpload = matchedKey ? userImageMap[matchedKey] : [];

      if (urlsToUpload.length > 0) {
        const cloudinaryUrls = [];
        for (let idx = 0; idx < urlsToUpload.length; idx++) {
          const rawUrl = urlsToUpload[idx];
          try {
            const res = await cloudinary.uploader.upload(rawUrl, {
              folder: folderPath,
              resource_type: 'image'
            });
            cloudinaryUrls.push(res.secure_url);
            console.log(`  ✓ Upload ảnh ${idx + 1}/${urlsToUpload.length}: ${res.secure_url}`);
          } catch (err) {
            console.error(`  ❌ Lỗi upload Cloudinary:`, err.message);
          }
        }
        if (cloudinaryUrls.length > 0) {
          c.images = cloudinaryUrls;
        }
      }

      // Đổi metadata thuộc tính sang Sân vườn
      c.category = 'garden';
      c.tag = 'Sân Vườn';
      c.tagClass = 'tag-garden';

      gardens.push(c);
    } else {
      remainingCafes.push(c);
    }
  }

  // Đánh lại ID tuần tự cho cafe.json (1..N)
  remainingCafes.forEach((c, idx) => {
    c.id = idx + 1;
  });

  // Đánh lại ID tuần tự cho garden.json (1..M)
  gardens.forEach((g, idx) => {
    g.id = idx + 1;
  });

  fs.writeFileSync(CAFE_FILE, JSON.stringify(remainingCafes, null, 2), 'utf8');
  fs.writeFileSync(GARDEN_FILE, JSON.stringify(gardens, null, 2), 'utf8');

  console.log(`\n🎉 HOÀN THÀNH TOÀN BỘ!`);
  console.log(`☕ file cafe.json còn lại: ${remainingCafes.length} quán`);
  console.log(`🏡 file garden.json hiện tại: ${gardens.length} quán`);
}

processPhotosAndMove();
