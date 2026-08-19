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

const newPhotosMap = {
  'The Coffee House - Nguyễn Ảnh Thủ': [
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkv3egA6S73o0vuA-GKfqXadjRkOL4LBuD8M_yJj-Pk7OxYcnS0taukGHK1zhORG3rFkMjAo7R16maqdyfA015iiwTj6hZtZHNesJ3rUWNKk6XDr4QNPkKFfouRp3DfamUgBwLx=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlnQmE8d_Jgfdcn9ugYjXhWi5058xjAnC5d8xD-fKXZKzL1hSmMpU5sdKaLNkXyE_PbnEBUK8krV2SjpxGlBIcBameN3iYyBLvGAq4x87wjlHvp60dyqIEdBUCZ5vGJiGFJkoKQ6MM3zOc=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlS52YzT7GlfnkeyGNPhEd7B64XgayueNHvJlbTfZ4C6yXR_C22rSjuAeoixKXzCcY5aZXQ-6FA1vSReENg81BLPNa26C3YXnSPemyqPBHmJf_iTrG9EYreupxn8rY7YuGwwdZheA=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlcSDuZIjeJrbfgP2nqbJ4k02nNDhBQY1FvWb3sj8cfIXavN6RRi5OkYWg7zV1WAAK0y86NmPmSiC-1WOzxg312c9z1XwNBl5lRRdGOzR2yzV_OW0ig81JCXJUDngqp5Mj9H1DR4Q_TYXQ=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmZZ03_gK_PsEdblZUqyF0_8XZxXLCy3o7WcrE6n5B3WyPcWJEgBG6pEc4BPEjdWS3jFyfituP54TQtRwqlYLkE4yXWn_D2c_b2kMg4ppVTvG1i1a-Gqfp5qTB-glgkfJO7zrg02RRqi4DZ=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkne-W6e8w9LR8IAN12G8nh_8ulEnK7isZ9eazdtqt8szM3RyYpIeqKFuCXoTQ3NGIESWkIvYWZz051ZTbdRcBDJn2crjk3ZrG-OSdbcNxeBrM8RxCC1X3btoHut9Q2ipAXoq-Hhg=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnqN51C7jNq6GtZ81-y7PK3063qhq9JTTX3TBdcScLy5OerCCQPTIoyYgWOXeRFxplnkwvVd_-3-Tp6ndJswtELKxEIwPrCEc-VEAuidPL3JEP0EyMOCqUtd0eucB9PAAdLnNYI=s1360-w1360-h1020-rw'
  ],
  'Phúc Long': [
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlw5L809JEapSZQRhWVHgFLb-10SCeFgq-zg4IWPkYsWVbfbtlUwKc9XlZyZ5RRPMZODbe1h9fSLtV1QSQb0gR0n74PzFEdBW4ANlCMQpwXQlWJuFjgAPXsY1CRGrPDJRBu0IINzmYx0gI=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWk-a0vt39k_zMEgDYNUDhVMfcnoLwGeRKszWXkzoQ5m_FxcJNpsG5M1u9SkgsT31VjJlOcvy-Eb5TRR-8fMtWspAa3kDuOzmW-hGQ23ppW46x95H42W4UDjcne95dtCgNcZ79mBLh12MRf4=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkH8kt-8yJHrrcX7i5YZubY9HN-pQE1QATTZZ8TGReAbm4JIRrjwOJuYNO-XZTu2lGZkR_n7WltzpqlDF4hJ92ge4jQ3qortzqHUm_MqXDIDkEdzqRn9muBlSiqYMGDse0N-cgcMbPqPvBY=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlZxtz5iuBmEViLzM98QGQvB-P95CAvDltwSHCBz1Rrs3K6zcqH2n0sVX930BN2Us3SytOm92DHNk3NRA9v-7muGxSPnoswcL7yQcOuzvncaQ_DZJFiY_u-hA5hrJ_is3YRQ4ToTu7lWrcU=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnALM2aY9SzIWtvdSHKBXKfeSR8-Q_TkB8KcQMUtPjkDb1VsxxYBYOOd2_q-G3Me6dMfaGsj_ds4zkmr3ixct5_yjS-t9kIWJIpOsP92KPAWtsxoEvfazndjfdYvUwepEOCjZ25gQq4mNdu=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWldCiCQ-gl8YYUrTSB2vBplA9qOQmvRKfblQJ3xqkySAcVBZpNIhr5yQ-4UdW5ZDSVNt9zFmpYFh4994CJkxmwzEP84U1MV0HD3sGYrtcA88oKKigE0ozTij9Soh6LaJuRotpKiMbiY9_U=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlQ2Ym9Flqi9IYYVMIx8VRhhegPupSYt7tqXuEkcgeut_TSbQOiklulL4RfZRO4uw4JfBGhAnKRRWqzC15k4Dx-kprmq0qy-ailK-gYQmmI-1L_cghpDxmyDzOQF_MG-Y1Edrjy=s1360-w1360-h1020-rw'
  ],
  'Highlands Coffee Phan Văn Hớn - Hóc Môn': [
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnv9n_8O9SgFXN9q_Cd1uthJW4r4WMicYBnwemGLXt9nGjAV_b0AuCpMrCo3qbcyAbhesqNiSv2nHrcu8PuntEeKWIucWpOCQn358sFWX-lxqIng4FvQ4WFEaD8ez_8M7TcN-nzPgeD2dU=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkLohJQz_0WRjHCNl4lti_Q8ttZIO16O5lbd8UbqtCl9mAfL810ZouOoJd7M1BJC3gksfFQFm9y0E3-6fGdUUr0loVGLdVl7bdtPBsbTVXu8d67yfaXFzPVFnmB5yG-KlAcDUj5VLhQpv9J=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWks7X3XorFjbrqMchJe8hQSoaLLusE2foN2E0OdMOt_ehCF_dNhVYOtEuZP-M_j4Km9J_snYnFpZzEzy8PPcicYxq4Az9j2wiy0Kg2wRKbPLdAHq5yCtOYsf73kPtXZPJC1U78AudTw3Z9r=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkVt0yjx2148_ABMkj4emDqvHLuoUHkL7dzPh1zmH1HlEPFsLCt-jSWONrG5JsWln9lucRSTfTq48Ak5M0xx7Sjj3QXQcRExFd2A3sYlxb6yEzO3x7SUdohif02qwSwo4yDqujq-4kqDFFi=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWl_8YRpDAYgSpLdFbwprZg8s6SqrwL-8gOGK2Jhfp0YOAnTWUtkIST0UANsoIUu3Q2Du3e5Ocrms89jyx36-tjF7UDdzozz3AjvyWSFE6CdD-3eX0kgNGY9HsfbkIFqm8q6B7LiPtBhd5c9=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnhODTDCMH4j30MAr2bldawV1-4bvNPLtVKlCnRG5N2NtsWPkR8OgFVpXgm6ZyWOmw2FdZubPkWS9GWnBJ6SInXytbVLXN_Ac2Cp-eBkdqeI-M9e_DW5FHmiyDN34x754SJWoWSyhr7Ls42=s1360-w1360-h1020-rw'
  ],
  'Highlands Coffee 1800 Nguyễn Ảnh Thủ': [
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWl3hJd6T3X59ADHWcAtOYSDEGZkmC9pmvZc_IHmZTkwkOcXOp8qUzjc_Gj6JaxIX2UvN5Z-TfSwaPzJwK-CHiWUV6N5a-q1Ljm57IuO0GL7315Y0TzeVm2PtOh_yAN_aLoLEG-__mx_aCE=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkpvS3sGHNiM2_3l3GLuXC7dil4ZoUeOkTWD6q7-zkOmWoGteVd6rq_72Enx2Tf5Xjzhevwi7Api72zhqtJSNlIH9nOejbbHRAfgTycqYsck_YkEyIRQF8qDQ2iv7gWkYoSEPFjS_Ij2fc=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnHusHextkvDUaKAtKUECRskScEKr729nVYv4oQ0ccGkO1A4F-R3DcxmDGp6GzOLRt4eJRECOz8fUvd6__3oOUHnKtrZ_qqw-aIOLnx_55munJ9DwuuR0STe3qkwPUGwSmpmpFgzHjKlEh_=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWm98f2aBALCT-F3fbA2LFRnC7UKuS6qS7tcWjhfRvTlQa6OK0THNa22Z5tUtKIZ2id8ROdRzs22XND4J0h4LTNEhrqW7D-8xG1_Nyi8-I8AqBg2cr0jvAcVki9KJbU_QqqdAzLm7g=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkZb0mriT_47OdPYl5ARHRbJb97-JDBjnwOKLEbBgQvWJTD2Mj5_ZL5bvt7KiMrnCoUMnRuDf-Lh2wdOV0SKRpZvgfXgxar6YN11WXVDjFY8qM4wEL7c3USnjyyCsQXRMLA2VRy=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnLkyfJ2lWQ6DtetX7imgt-TQGJLUcl4UvRVq5zNvGlvRWpd4xJWLbNwXI5-sXaWBWxYs2NKdqMgxCY_S48HFnSz7HQonWqgEIzVGfG4Mtv56vJDoewA87GxUtHh14DAN3lp1gv=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlF5mdNl817OSyHfoIqsEl1Ouwcp2806ktkyAB5LKs8EaY-QdvOVAIsG4aVfQW57ktGVJ1KheWtQwpfyZa81aghj07vCPaIn9pVcuUjxMzAcMvWPvMvYdqkiq0sXZDH-t0H2AL_GQ=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmMmCZ3VrkczjBvLCi5eN7BtDf0i3LUrE2UNRcUKNLqG2-AiubMZx2RJiM8upzjVxmKgcmoMkoHq_iXyRFc9vdgx17AaTh9pRSNNdai9LrZISsUzBiunuKWhVBrm6_Nk3-86WQy1V6oWBj3=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnyu_rTJeL5SnxGx1rP1T5HVrdpYTS8lP7AtwGco3zJTarbfillVeQYX3B74D6HrXBxrYD5s2bYoZZadHqB13kL6LN4HJVza3Gx8C00RKt2XirHykxAXMf5YDToExsXkzYd2muqCjeaX7wB=s1360-w1360-h1020-rw'
  ],
  'WeOne Coffee': [
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkm0Op7K1mfulWtRduFzNdKlpHo0IszEPZJLdZq26gaI_h430TpNnJxDAQ5T-6gvyKy9Kwb0MGgbwXs6pF9Qr4jRV0JY2fXQwb8VRQekmMt_ge2yZzpibCmulg0ZFnRwtIq-zUar14yDknA=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWm5nNv51Qi8B-jdQPeDu5018X3O-qxcZod1doc2eliBHJEEfB7LsF5VOpoLmuvMGGKVrxTio-3uSvCSLmvqW_Xj_9m2GOApA6eW-jbPQZNS33WtDpLuzQMA1-3z1Bfstg1dVttY=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkW_7Qws2I75Y4KeWMCT9__-HeREX_L1Tnr6p5h3OnjX3RvOYg2j9HuQpwTmf5CAnXFipOO0PowyJ8_H8chjL-IZx9CL-DJ5uj5bBCisK4EPv1yxYOP9nW2ZaH2ACmTyFQkwJM4Kg=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlmeZlwY7UYaqbg0oBDG9p3tPD_9pWKQUOhe20aZWvF-c-09OIKOi6xMPwy08fVJAcOCwNCYcQBcs0yCWoph3BEGS3LBgri3rKbULMaDP9XEPpq_VOyp9TEfUD2ky7llS4YsP8N1A=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnEyWGfqzTAvrhibAxBcmr4TiYzqd147FTdyQh5GBvLLUvS9OJL2RFyF8RR7t3M9FKWLnTHMOx2HHwcWYzulXOGdZW_iewyj_wHAy3LNupKkxhpD7ihGUWFu4aFKnxK2A_afMCYOw=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWk7NQqeZVoAomdYupHRqbkqzTrUx1tkiE4QkVAGtb7SiYGmcaYhzVl0WdlEFz1blmyHdrtz6-D0IekbHXKA93xe3rVYoM2RMM4hS33ijLSZEHiIOnUSzbwa7iKaCZkFRkzjf8CH=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlBPA4ve5ElM-eaf8Q6Wxm3oQZuviA2ETH33_S_kamSZGcExo_K1Y4DAQaLhmdKImaVCSKBVUEY2BEK7843kHVGyWhTheqLBaXxPff03ZsECdxlBLO_53achcBmAbna9koegMiEkrJxQg7c=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnkg8-Db7yfMo9B3_bnu1hNtMFA3X4BCuzI2uzIU3kXMFDbyWRYyTBSoQpjlGd67oS0GitBRaQwQnj0Kh774Dnu77z-6ijEQncxWQJXgmQMy28zmZkCnEZbIRePJ_HEb-5tl3Qe=s1360-w1360-h1020-rw'
  ],
  'See:mê Coffee': [
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmL-X_3ifCQ0jgX2_LPuV20CQl5OdFa2jJDWiDDBPGfcJXErHo1sCFs3p1ZQSCSyJ63UzrOf537l1mCf5WmszynVBKXTxuIDu1V5Gk6pFe5-U4W7N5TGk-NgyQGfwCdpLvQyyo4JNwooLPP=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWn--Ny8WaJdf42ytU5__Ip9ugJH-TcGvfSmQS1-k0xsyKQyOmsYm-fA9ZUf3GbwI6uteqLHrqXAQE0oRWLSp3K58XHF8CBI2DTxNzopdxBS7Za9dGuhkmLk3kJ0Y57p46cjPAJXga78P2WI=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWl-FaLyhjvWzGNQY5t5RhDksO-Zul75yAbCNqiIiN96J72qwGCvBPuubW0IXCF9l9vzErrA6GeegzJJxpJJpRrTWQKJRNgYlRDjk62XYfmWuMhQhFdK58hHIhpPv0a9vx49NOQqvT3yMjxX=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWn08Labvg8dNAkFlcHKfuRU4oqOg7U7X3fKwTQh2j9JzxYROuT1Ii36kzeFFIKz_1Sb1v4VNeMXfOCYf3K-uXX9ueTEB8czPYBfkaKRV0BMrdXB9Od0Yw-eqwntKli5u-z7o5yW-pykV2g=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkXYaX_XxonJUDuhqNp4IVHckdyYluWYZASNwtU3QauRJidgeRDf7_Rr6cOd7Am6ejGfVgM56pGm-bPi1thBe2bl1U-dv5ie_uSM0Lr3fjwsXNwOgohrFqKl0YRmaHhqp8XKHNV3_TJLaL6=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkdSJxcVolCtj9cUymUaTZdRIpjwAd3Ab1BwP6hR0iAAZTjBwV_xRRGNosGLy91oUXks5DyRehne3P_X2zRJnPRoEZ-ekgVyFH0n1DXAUhmSK2Jrm54gDwbpy3d58tGR9EAnJ8Rj0CQCUc=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlJgzElGKl5QdTTu-Fkr9PJGBzYzMrJ1n4mVpztwjefqDQukoOCMqUewLmWEYxJ178bdM3omhM1KPOZ_USBNly27q-j2kWwvPdKSErwsEDNYoGFPswVuA02ZyVkBfKkynD6OX4nhtZUAnmp=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlCV7fyPGkJT7NhQ18aOCCeRDpt0dFK2CfK0apXlv3Absz6rvDd7Xk9OA8WEeibwmPgvy8NRFB981wALhAq2WdDIToTZuamAKqQdl6j0fR7eQHkR4ZXIgwnvkBWZX4OptIQvbeF59yHydHJ=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnojIdSVOfTYApvmWPpuq6s7DTB5cpe-aPQBabtWknv1s2iysQOVd3GN_xQArdxDmSpRKFm-gDtif3LTqtO8OJr_G_rwAFFpyH9rFZUwYSnNK3BordVcQ0oD4_N5VBqnXLdc8AYSuYRneWI=s1360-w1360-h1020-rw'
  ],
  'Lá Coffee & Tea': [
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWklZ2xHAYj_tKEigJkcLeO2WnFTkETwFDkyPYjN5xEUw8XhiFcRoAvKZyGhxvi0ClK6SKjWqSAHrMi21KqZnN5t1esUCL-GmS3XWcVFRBYD-7uDeooNiFN65u_MF6RkTw4HixCJ8G-JF9_i=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkUwgrglBYQQ-cWKLqtDekS-dV2WWzA0GBRvBYYlI7X3C5DuXgFAL_84lDrPg25lLMZ2UR89VfZRDnthWw0-Agkr5yKUNhvorMWtzkwUNOGqXSPa4KMDs_LlVveolCii0dS_Zv1iVsa3npM=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkC-aw7c7G64CWZsdbkKDvMPOI7n9HH1zwewhoP_-me-M7kiHJgkaHeSFFflOURW8bomRHIw6OTVLeB0Di2uNl_TcyfSX8Uq8t3Oh9WkdsJ7DYoB-STMCFvf5urqY4TcJ0VYogiLcFjX7uU=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWm2xSFWVM62x_7oY1OyYgJSHDHMKu2S2mAsM8dKAs5OVIuAuPs5YgBLLi2OBPVZQSOk8gYPiZgIILZ9WXLy6JYXr8RvDHXwkiW60c-GQrFcSgSfaDD9hv7NgHdz1RJshGaU4qqmTDp9xJw=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmUHTQWiaY2sdBWc9hEAU1eakEZqoHkbuGGyCbsJ3zbXrBk9XsrLiESTe3VmTvtZ7WHyDsIBVEWnJR3_st6A2Ys8bt1p8-rzbnoElw56DdQNCCxtbxGmDKMynH7a9rcIDmGNG3xhkK9ZQo=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlt3xkfwcsk5D4FwZVyLyxsgEahEmBRd8AjaM-h5Wlmix1RJ7YeOeFuUte7QOOOPtStZTgALFJTQci1l12hJjt3lXRelMt_QOVZh8_jEU20Ws2bO6IxzjSb_FlmNpc-cRi7VNVp-CCvC-OD=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWnu1CXQzByeqdgcFfC1YuQhvvUIML21w3OesA4ErJMLoGlo2XA3Iij_c9jOe4ovr3LgXTHRs1osuXinH_0gonmZQT6BfpEgX6WpZ73OM1KfRZtBuwiG9wW5IOFDwhmLF0Swia93FIgNcyHn=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWmScaLNr_yau50MpwUMSt71-J_VY_b5dMNUlXqAxyh4148n3P6mnB4axNsp5igKLb-IY9Vu0MnWrKhTQKerIJZTA5sRhYzuZE2NNznSi1mNeDX7bPMqUtnxuxGqGo5_jKgUyapdaputs2Zr=s1360-w1360-h1020-rw',
    'https://lh3.googleusercontent.com/gps-cs-s/AHRPTWn8xUIBHkGLEiZmLH-7yHmuMBgUX2BLIMCFWaVzS9V7sGSnO1aQDDiyIEpTWOBpyuYOKgtonPeE89yj-grTFyPSUzaGeWB9VcP_Vjn_i-aqF42gAEW_gmEf_GAXmIJILw09I5b43_M-4b4k=s1360-w1360-h1020-rw'
  ]
};

async function processNewPhotosAndRemoveEun() {
  console.log('🚀 Bắt đầu xóa Eun Coffee & Upload ảnh cho 8 quán café mới lên Cloudinary...');

  let cafes = JSON.parse(fs.readFileSync(CAFE_FILE, 'utf8'));

  // 1. Xóa Eun Coffee
  const beforeLen = cafes.length;
  cafes = cafes.filter(c => !c.name.toLowerCase().includes('eun coffee'));
  if (cafes.length < beforeLen) {
    console.log('🗑️ Đã xóa Eun Coffee khỏi cafe.json!');
  }

  // 2. Upload ảnh và gán vào từng quán
  for (const [keyName, photoUrls] of Object.entries(newPhotosMap)) {
    const spot = cafes.find(c => c.name.toLowerCase().includes(keyName.toLowerCase()) || keyName.toLowerCase().includes(c.name.toLowerCase()));
    if (spot) {
      // Làm sạch tên thư mục Cloudinary
      const cleanName = spot.name.replace(/,/g, '').replace(/:/g, '').trim();
      const folderPath = `địa điểm/cà phê/${cleanName}`;

      console.log(`\n📸 Đang upload ${photoUrls.length} ảnh cho [${spot.name}] -> Cloudinary [${folderPath}]...`);
      const uploadedUrls = [];

      for (let idx = 0; idx < photoUrls.length; idx++) {
        try {
          const res = await cloudinary.uploader.upload(photoUrls[idx], {
            folder: folderPath,
            resource_type: 'image'
          });
          uploadedUrls.push(res.secure_url);
          console.log(`  ✓ Ảnh ${idx + 1}/${photoUrls.length}: ${res.secure_url}`);
        } catch (err) {
          console.error(`  ❌ Lỗi upload Cloudinary:`, err.message);
        }
      }

      if (uploadedUrls.length > 0) {
        spot.images = uploadedUrls;
      }
    } else {
      console.warn(`⚠️ Không tìm thấy quán [${keyName}] trong cafe.json`);
    }
  }

  // 3. Đánh lại ID tuần tự
  cafes.forEach((c, idx) => {
    c.id = idx + 1;
  });

  fs.writeFileSync(CAFE_FILE, JSON.stringify(cafes, null, 2), 'utf8');

  console.log(`\n🎉 HOÀN THÀNH TOÀN BỘ!`);
  console.log(`☕ cafe.json tổng cộng: ${cafes.length} quán.`);
}

processNewPhotosAndRemoveEun();
