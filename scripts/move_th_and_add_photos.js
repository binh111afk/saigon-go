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

const newPhotosMap = {
  'Key Coffee - Hóc Môn': [
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWl56cTN-pYu2hD-Pxs1K6rGt8igrdWqbEUnx5GDDdhl0cFCD4xRj0dGI73aC7D2pKUhNBx4i80mvxiTqoMVAT2KJqbOIzajrUa3UtbzVtfZaefpKb_Ex49MgbVEkdM9A-cIS9nW=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWm7JHsR58sseQlatVLQKM03v57fPdfpMYTRDexuFD5Dug7l2mHt4tubKLHPA4QLQ7P6b8SdiXSP3CkaDC-WWIqzwa5BOkwvhjLQKFx4XKPLFF7fTp0Jm9fVZ5DErbXjhwPniqo=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmzQ3WmMgZkxD3SYAMYpr6kufwJAw9F1o1jYP77mweRRHrndl3mTBefBR7-1SswNYvMSGL1JoryvSSzZqIhwPWWNSrjjvBNvOaemVg3Zwsu7qgI0JoosAReqx3xQpB4Qpy2m3mc=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkmabhcbazGGafe1GT41ffTYV2aSMmFDGdIFMN8E3JfjaID2bsBAH4i2NYpZ53KlN3AE0EFEIyYJWVSbV2N64lcauy9jtxfrBjENik_q0X9jT4QdRE4xRnohrKaBlMBtCSnC28=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkJj1hyQCv2mkwQz2gLauDJNw8rwo4cw7uiaifTotv9-y4DP9_9X9KAagG5wz-9entlUsSv5-KrdNhv0zJDd7hrQRB1b9DKpWWia05iqsjGzGbV38RZCRjh1AyPRtcP-zdU8ph_=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkG_0FMK7PJGaoHs_0jmQmWF_v6CprXBlvO_JHqoFYNq8DKBz8j7pWgbEsHV5bMqX_XY4dWNRQ78_mSuwnilWOzFOMZzzkijfEOt3RSnjiSJOiOd7QOvXJMu1OKzPCc2IOYXwXvqQ=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkwylVNJf1PHsi-t-daOHVg7tWZRMK_exUrtFBunhLNAYv0gY1CyP7KA3u_0lW80YMEeE7AhWViGB0bQINKUgal6efgYsj1GSHDrvVTT2a7pXi0jLspIek8xtohtaJLjNtqRHQ=w284-h237-n-k-no-nu',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWn3hcLp4PBR5gN_r_NWNdCthaSWa6X98pYtOKeHGi9_pw1yRobi84yP510YDBdFa1LyW4vWC9hJrGduWR5EaMP3aY7IFAezviiyX-H73BS-1QyT58f0aIt71lV-pPtoyN8i3LlW=s1360-w1360-h1020-rw'
  ],
  'XCOFFEE HOOCMON': [
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWn-vQZ1VWq18w-MS650jqHeqVO-Bwo1ATfO7pVJmF058N0S0coDcB6rLNxLQC2AsfPw1RCsYI7RVYEhWO5EOo9trUWOw-gbDehLDxyl1BQ1mKbLbnegNNBpzY3qg2jNe1iv3IGnhQ=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlwXhtojvaJddE8FXnxAMfq-f-dnb6tPnKHtvdX873IG91uU07xJtiyoZhKu9-CczKUBNS_56Q3mkRCEPY1TY1fLoL0lcovZXiPeORDUqyuvyTTQa5PqybGiNGmve4bKthG2R4H=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnItCyv3Ly6fixHOFYZ1101rgLJLjvEUI_r1UJe1vJ3A7jLFpYhU2RmbXeE4TLbAmiae6uBdU5flBpzH_xlzD3W2kaPBBEqR9yY7dazR2g82NO03KGpEqoWne9CJUdwZEi58kxj=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkqgSZCN8lAmyXai06cYr9FgRJs8DUFO-InS00dJIisCphySf3i2q0poOPAJ7zmtVJYBmH6mH08zx9pwxKjFS2x8pZUKDHQclI9Dp-3psUD5l6b9htLsgS1eD1IuiYali7OgwUm=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkWH1Mg7i6ijchL_yWYY47Erh0vIJaDTGOG6fVIoLMzRH0RfQcrVTJbAyhvyne_y5tyEVJ-XKMnqCWyTiGIAJNP4NthH1SzJYRCn1rDAzJ1yn_cD-4nDapkWZkkwxhNY2Wi8t6S=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkbvusRbLmjVno2J-Nq6QoK5j0xdg9Ji8PIxP1xNlZ2LcpOyZ3KdlgnpcKW5EUx-zmng7oKMlwOR-j4stN4OoUFReK2wwbTyUvXssGDxzxwBbxnA-bWHxGEXLPUkLSPbzZTTbFt=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkPSFOIb9KKa01mVQzczgG3XwSokFsiLEGbnsy228Pr9ge7XcFmo9yMFoWwmMklriSSd9liNaaJhmevGZ9LGlKqwvjdNqmM_pEqAcrdIF2u2TtF5D09AD3eaafT_Lcp-p_lm2L8=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlAfHPy-JX-asABh9tv7IFUAkMq2eU17K24pvLdIelYfYaI9GdwflY_etRKh1VvraYu8ueXO24IGLm-1FJpLw9obTLdihfi97awHP7mOZ_8mFh3tHBB838uxzVPST5Ehrf6_7w=s1360-w1360-h1020-rw'
  ],
  'Zen Coffee and Tea House': [
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnxhjbwh0WTNbPutvX9K2fY6O7JYdyJWvgOxWy_Dxke2vJZ3YHKvFJXQPfsC2zkxdl_I46ue-xh1GP0rs_OfJwFJ8fdMlE6gUOzcH9hodLEKlxauJhUn_oE5unK2c3YFX1d7JQbSQ8z_v_l=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWm4QVQAsgmpf-kTqAYee-3ngaYFYi4jN-uL9ikJb_uhW0u6cfC8j3rnUzp3KM_eAb4_fnaYvVZB9OhdVhfc87GTyDOQLP6Rdaqt5I_nCi2oSg14vEkNWHtykXx3wSa0ugT5HAgkihXGpheO=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmf75RDlfxL8bRwa6k-uaHB4tHsioyZZ2mJHOucRvjf_c8qvFxF4--vhhNKaQpRJzD-WNpB3SjrNNZsBz31LNW6ELXTQDT1G0zq_xsGFCqZUiK9ksDoV5IWKcSKxir83Kwwet6TcdW1oSyF=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWluGNBs8nhnSerddjTTRO8l0oX7Gbzi5MpYwZwt7tvFOcFLEe5kbU0WW758FBZ7DNZRbFH9s_nCVmayHf3ojOqZ-nKUfB-TzGbhcwIyKIOelOXS_9jFavtyzxFK9WpzwLtWAFdAKPm-r6vP=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWl9fvvxQ08DTvl7btbx-5KxX8AmgfWZJeaTQYQ-28SkyohEXkhHyO22IR-2G6aZlCtEPMYPyjHFS-wMWxiHDl5ICtnw6JoLFuFNM9NBtjiB6NKqyN97AVA4hyhgZuVk_BidGqy8kwYFjjk=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWm38DP5-IF2Z9y6VuZNZom9ZzvxtjQ170GsiHjbG0fRjRZ286XrU72Fu8drE2B_vAbUNC5hSDcFMZk2k2yvN3JPBTtuSjgU3mnNIkIHE9c9xwHVUbsJUyvUUOxEfznbz9BSYLEJ0AFe0iJ2=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlz-kjmdcwcMoBbZ1tiyRJ6Y_oQp86Wp0-xCqMjdIKNneWizEGcS1vaoRupUIGJKhdTBNHlNgeoY-LDqfuqc5Jn0dSF1Nmxh125hZirG9-6jPymXibPjNaTw8mjOedsrol6Av3SQHpV4L_r=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnmnOLrYXvCDxCUnxYhuSucmSmRGVwiKhLy0r-yeYSnaz2kej4htQ4SFKrgPJwskzikwob7siNO3JV_Hbx792kT37LjFRnxzk0lCD17SDF8xZn4aYSXINUibxiIehGBLpZm7g1s8g=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkCMWD7sleTm_XbFw80CRZ9OHYFo5c9D1xSaDKpDvyyxwVMEkxPU-AsSvFYdwxxgtWSShCWHfnslp2FzigaPcErnX2m2XGLrkmpIz9qGN2QmvwtYbiNUiPspVC1MSK_dp96rPQXd7tTfts=s1360-w1360-h1020-rw'
  ],
  'Coffee 2k5': [
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmiWbsvwm9AXExF9AxV0ULBn9UdgMrTWGaf0aeLVuFVcYXgffIQD3HkEns3rjUjKCYPbNchvAtmkLGs07BcFSOQXRouuzMvLelX5FMIH0bilX1HDGKAN-FQYdQQCa-Yawtp4dbW=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWm1Cy_gMsSYIVca2yxn_WsjsyAjl87QwZNppKGiWfYPKXxTlIaXF9bTjBlfj0DFjPFCxy9eJezRuwxyOnlQfv8gGRm9WM8TAcFZvxizRyzcB_1ZIiZ5Q5WV4oOTQIPPb6AfaGVnrgYpR3Qx=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlSy0RhYmBLZ9kPp6F0Oos99h-n2gGTXK4meoNQek8qpTC5rXP7qvo96psFdsIzH7hleuRPFe6RjVj4TjpiAiAdBqoTJc_0jhDPa8Rum9ffasLMpsDLkbIfopyf0hpVXwbWIRcX=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkOagCNZrbTdcnHD0n0TUpolVWOeA4KXQtcjEUSkkD-_5y2jfr_sowDVLpq6OcPEZRZ-PmoKlWCS88SiV9ZoECSzKswOZ9k5gp5MX3Q08D6zPJyPc5DpA52oOw6_knVm8j0O4TVW69RiBkM=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWluYvlUhcas1aA4BlKLD0JxDf6C_Pf5EETXRGFv6ujti9tUSv2ZF6zwTFMhzKRhcY1C91F9Uhpf7aJCgHDh91A19krIbaIEagh_M77XAccCKTB4rtGThl-C4NoB_swpp6De2zC4hUXAPS0=s1360-w1360-h1020-rw'
  ],
  'GUTA CAFE HÓC MÔN': [
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWldefQWzH2OqjJXp7nXKLiNXbaDj1Wg9EGAJObIsbrJPdkCY7Tk605nlOV4QaD3qemTNTTA54c6zcGEf0-dl1y-empJ6yr-F4alL9xI1bIP5oYVCW6aJa5DCQ9kQxFNPZGp1fruvKTSmX0=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWl7HFVUvwcl6iTxEiIhs_Q2kVwPyadqRSKse3ne3sFG_mkiYWyxCg0vY0z-D2egELqpj02p7EX63ONc6ORZmMpvheVAkkAwR4zeEacKVtrlsbZZ2mYbLNcdj-B-BuFUVzHCurKPhPc9QeQB=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmwXzBuZwZBfly0c6ilJJ48dbOHg0sjGFuZd3IpUgGVicB8KnO1XBwGSAxmimIHd7WmjoR4HlyUhBIaP5oWAoHM2ullCSzr31xKiN6m8tT0LTtfnKf83a256FcNjMiUbI56KWTCDzib0PA=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkaZpa6NKkwtbmAT3wD5JLHqEjQyTpANFsIZRpS75OD4LfnpcGhDl4BefmffNOalr48ZdwLTzLLqTeD2OQytDwbwngVFkK29f8dgMgSysx_hI3jcDbX5RatXQTCxNumE4iRY3LdeE-vRtg3=s1360-w1360-h1020-rw'
  ],
  'Cafe Xưa Và Nay': [
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWl2GwTUK5htkrE3M7ULWJyds5QvzqFQ0Of42rNmBgx3sZ2xbRFT_Oc2vZ-0Q1-Yrimu_p-bB0XkecXTJhwB2rJJuI6iKjiBiHl0YHWKHLrj4ao9MRvRb1CrPeKXOWoZHXPYpsCJ=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnPyKMOJ2FklSL4Fo5Z2q0uZkd6dfxce_Fnxm-eimP6yEl7i2wPNjC7vgH8EOEiMPkooF3CL5hCeGM4m5rwiKercnbqHnU0_508dEC8_2du8kg5xbSamDCcy5htqfTppqFvXYX3p152XpY=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmfjs41sg4UjAQeJhedk6vXwWagkux_Bp3Z_wolinyM2jeoJ3VEE1ybmDedLRuGJ5cwLFSabFyF3PX8gXoxzDBIjxls-WjKIAri7yoEiXFP9cjj8W7yUcCa1ie6Nt0n3GzREwFd90pp5Kiy=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlW7b65pDbTyJsq0LvvwTkplZIfH6BfIV1GKxYXLavzxA0HQf9Nm1rPhpobcY2P1PBMX5FGZEl8PeOjmR7v22LEMAq6zqluZEDWJaiGJhpp2w2hS8GLw7VvgckMVen7m8oqmXmrKJBpcyQt=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWntxkC5BfkEXaQnijI175MOw67YIwLcOFdzzR4SG_PvUWfupWYK5xtjRDwR7bL2frWsHBLrmk7PaXqk30jDneCcYtJe-2frPuTHu2gmJMbJCHASNEIpvKb3iXjxr10CR_qIJOce=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnAUPC9jLs9iZ7NE2pos9sw-mMgRF0-fvAg2CVyGEqh-FPD5BMM6I0K9B7IquJ5If1haTLvfPyREr5UkBYXlEZXYWaBo1cMb_z0cwQjhcPo8IRGQEfTazxeZTm5qESIVQIVwGZe=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmfPH_KhXnwzRvkamfHDFMk163BxMyt73K7r7AJmECaHB-TqyJ3s46igTjCBfwCVhjIQ8TFcoAV07X5haHq3hXWkXBxLR8b3ry_x7gDlP2dpXeiBaXgKE-dN3HjkxRg0EBNrbqB=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnEjC0Rxtt-BoXqeOiLKqvclWQ794GHBh_6pvPxFQNu5DNmnTMww7l3UcYOmevxtgf5UQqQpzpzMftxdvBkp3FX0ezVNFabQh1jBQhtRTTuxy5-dKSm3hCt8XrvQmnDqJHW109o=s1360-w1360-h1020-rw'
  ],
  'Cafe Tri Kỷ': [
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWm4QUlZcqaZncSnGcZy1dgnk6GS_rlMnKctuydntOX51PRb-4LyY1X2Ewo6R5URGFK2C0qqNwyr5YLc3evV2zDSgSnfKl4qi0SUboMUfAYrIw1ejvzpLWflWPgolrke0YVuUMfg=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWl7uk8mD0WX2BfC5knFBrLvOEqwJv9aeMBBTzMQ5J9280BitWiQgNYbK6iTEXaRHD8Ba9NICSHAXJXueHJQMvCjLg-P9PyQlFrm8S6vDjjqVGqaVbvImYi1RQvFAzdW57nKB3miAA=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmHsTaZ-MHHe5G3GotDhzXdK0Q4xyxyZ04rLAGAmvpjffMbeprmBmtj3lPaPPOss4Do4CmytY_WmZmk4GiMrcAUZRlLITglnTTyv00p5dwMo6zO4s8EjEUCC3nntvCQJ_hm=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlcYE3a-tif1r9BivBWa65M5jVFGh4MVbHgxCV_tHm1rkwIQfJeltHbI2_fL8JYNrha6AAAsx5jXVgi_RzY2KrKgAdHM7e7YPCJe3N0_Iea8X-D8yFR64_K6M5qBoVnjdS2UvE3lA=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmheUeCukyEk-mtHn8zhdzTHo46erOV1E_fl2cRKtiwoKeC8oI-RcSxau-CFhpBPsZfn2xnckShIijJLsyAq9lVFCmN2OyQtG-6KroNGV8hGs5yxvXrUZuU3AZgyyiRweXcsno=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmd-W0gNHvrLstY8adCpSsSsXk4jtfC7p-2URute3XHvIEH68aTKPD1BX1PGVCN0kmkzF0TODgX6l_zU4kKaQq7ERp2MrkVCZeLY0DE0owUJZFeKML8UkdApiqLxRtPDeJtfGmv=s1360-w1360-h1020-rw'
  ],
  'Quán cà phê Quốc Việt': [
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnCxH5ndp5xpHkjWLi3E5qkbVEJ8_7OCj4kk9MtiIM1NwL77US5n5ApCsdJM7n-1b1NRnWCt9s2sNb-mVeMM1pDb2trKQA5wXw2NaLCofiHoJV1ltZAZWoQGDG857EDpU7ZRktcalyajtZg=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWn2jlnElRx0jqsm3RiGaDWADz-3KgcS3Fg9CQbhSQL5S7zUdeBHlpZfhSqQc47z1xvspO9e_hy7XHEqBgH36m8i18htfvabAHVu7kXvwyY6ngGr6MS98Vr6m8lAR3RAXKnYuBk=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWn7OCze8_W1g1n5y0oxTtvaGhB2P0RGzybYNMMkLfpc1sAw7F1jp4ClbE4ll5qvKAFtWginMOMJjZm69sY4ZmoWfOcAh1_agi4uoqWWQxna8oCeWeWt6WK_znWY8rkDy_gqPhJM=w141-h101-n-k-no-nu',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnNVP_4_SXc30Etcjttl1fMa5OEeC8Nk0wvIvL2PQsFE2JZX8e9sh_YcHFxAsKNUpx2jwQ-Cq_Ws5oZYmIbQhZi_fDqy-3nZREpZrf0DxwGyAj4EmrWb8q672WPiBlrOm9JBgQ=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnSjT_9gxflaKdtRGWhpedBLMFU-zBVn8WgExRYxf8baAho6o_cYF-fB4e7VZJYc7YC3vp8qMOP_Fr6gF_qupv1hvXzT5m5zSJQqOR3Y7nncNtsLUQ1PPD3hhFWGWyB09S8IFC1=s1360-w1360-h1020-rw'
  ]
};

async function moveThAndAddPhotos() {
  console.log('🚀 Bắt đầu chuyển T&H Coffee sang cafe.json & Upload ảnh mới lên Cloudinary...');

  let cafes = JSON.parse(fs.readFileSync(CAFE_FILE, 'utf8'));
  let gardens = JSON.parse(fs.readFileSync(GARDEN_FILE, 'utf8'));

  // 1. Chuyển T&H Coffee từ garden.json về lại cafe.json
  const thIdx = gardens.findIndex((g) => g.name.toLowerCase().includes('t & h') || g.name.toLowerCase().includes('t&h'));
  if (thIdx !== -1) {
    const [thVenue] = gardens.splice(thIdx, 1);
    thVenue.category = 'cafe';
    thVenue.tag = 'Café';
    thVenue.tagClass = 'tag-cafe';
    cafes.push(thVenue);
    console.log(`☕ Đã chuyển T&H Coffee từ garden.json sang cafe.json!`);
  }

  // 2. Upload ảnh mới và cập nhật cho từng quán
  const allSpots = [...cafes, ...gardens];

  for (const [keyName, photoUrls] of Object.entries(newPhotosMap)) {
    const spot = allSpots.find((s) => s.name.includes(keyName) || keyName.includes(s.name));
    if (spot) {
      const isCafeCategory = spot.category === 'cafe';
      const catSubFolder = isCafeCategory ? 'cà phê' : 'sân vườn';
      const cleanName = spot.name.replace(/,/g, '').trim();
      const folderPath = `địa điểm/${catSubFolder}/${cleanName}`;

      console.log(`\n📸 Đang upload ${photoUrls.length} ảnh cho [${spot.name}] -> Cloudinary [${folderPath}]...`);
      const uploadedCloudinaryUrls = [];

      for (let idx = 0; idx < photoUrls.length; idx++) {
        try {
          const res = await cloudinary.uploader.upload(photoUrls[idx], {
            folder: folderPath,
            resource_type: 'image'
          });
          uploadedCloudinaryUrls.push(res.secure_url);
          console.log(`  ✓ Ảnh ${idx + 1}/${photoUrls.length}: ${res.secure_url}`);
        } catch (err) {
          console.error(`  ❌ Lỗi upload ảnh Cloudinary:`, err.message);
        }
      }

      if (uploadedCloudinaryUrls.length > 0) {
        spot.images = uploadedCloudinaryUrls;
      }
    }
  }

  // Đánh lại ID tuần tự
  cafes.forEach((c, idx) => {
    c.id = idx + 1;
  });
  gardens.forEach((g, idx) => {
    g.id = idx + 1;
  });

  fs.writeFileSync(CAFE_FILE, JSON.stringify(cafes, null, 2), 'utf8');
  fs.writeFileSync(GARDEN_FILE, JSON.stringify(gardens, null, 2), 'utf8');

  console.log(`\n🎉 HOÀN THÀNH!`);
  console.log(`☕ cafe.json tổng cộng: ${cafes.length} quán (HADI & T&H Coffee)`);
  console.log(`🏡 garden.json tổng cộng: ${gardens.length} quán sân vườn`);
}

moveThAndAddPhotos();
