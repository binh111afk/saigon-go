import fs from 'fs';
import path from 'path';

const CAFE_FILE = path.join(process.cwd(), 'src', 'data', 'spots', 'cafe.json');
const GARDEN_FILE = path.join(process.cwd(), 'src', 'data', 'spots', 'garden.json');

const incomingList = [
  {
    "id": 1,
    "name": "Highlands Coffee Lê Thị Hà - Hóc Môn",
    "district": "Hóc Môn",
    "group": "Hóc Môn",
    "address": "1/71A Lê Thị Hà, Hóc Môn, Hồ Chí Minh 70000, Việt Nam",
    "fullAddress": "1/71A Lê Thị Hà, Hóc Môn, Hồ Chí Minh 70000, Việt Nam",
    "tag": "Café",
    "tagClass": "tag-cafe",
    "category": "cafe",
    "price": "1-100k",
    "rating": 4.1,
    "reviews": 166,
    "hours": "07:00 - 22:00",
    "phone": "02871080171",
    "goodReview": "Không gian theo mô hình chuỗi hiện đại, phù hợp gặp gỡ và ngồi làm việc.",
    "badReview": "",
    "hasBad": false,
    "viewDep": false,
    "tags": [
      "Máy lạnh",
      "Làm việc",
      "Chuỗi café"
    ],
    "desc": "Chi nhánh Highlands Coffee trên đường Lê Thị Hà, phù hợp cho gặp gỡ, trò chuyện và làm việc với laptop.",
    "images": [],
    "quickActions": [
      "Phù hợp làm việc với laptop",
      "Không gian máy lạnh"
    ],
    "menu": [],
    "reviewList": [],
    "geo": {
      "lat": null,
      "lng": null
    },
    "fsqId": "",
    "mapUrl": ""
  },
  {
    "id": 2,
    "name": "The Coffee House - Nguyễn Ảnh Thủ",
    "district": "Bà Điểm",
    "group": "Hóc Môn",
    "address": "93/5B Đ. Nguyễn Ảnh Thủ, Trung Chánh, Bà Điểm, Hồ Chí Minh 700000, Việt Nam",
    "fullAddress": "93/5B Đ. Nguyễn Ảnh Thủ, Trung Chánh, Bà Điểm, Hồ Chí Minh 700000, Việt Nam",
    "tag": "Café",
    "tagClass": "tag-cafe",
    "category": "cafe",
    "price": "1-100k",
    "rating": 4.3,
    "reviews": 1287,
    "hours": "07:00 - 22:00",
    "phone": "02873039079",
    "goodReview": "Không gian hiện đại, phù hợp gặp gỡ, học tập và làm việc.",
    "badReview": "",
    "hasBad": false,
    "viewDep": false,
    "tags": [
      "Máy lạnh",
      "Làm việc",
      "Chuỗi café"
    ],
    "desc": "Chi nhánh The Coffee House tại Nguyễn Ảnh Thủ, Bà Điểm, là lựa chọn đúng kiểu cafe hiện đại để nói chuyện hoặc chạy deadline.",
    "images": [],
    "quickActions": [
      "Bàn phù hợp laptop",
      "Không gian máy lạnh"
    ],
    "menu": [],
    "reviewList": [],
    "geo": {
      "lat": null,
      "lng": null
    },
    "fsqId": "",
    "mapUrl": ""
  },
  {
    "id": 3,
    "name": "Phúc Long",
    "district": "Hóc Môn",
    "group": "Hóc Môn",
    "address": "455-457 Đ. Lê Thị Hà, Hóc Môn, Hồ Chí Minh, Việt Nam",
    "fullAddress": "455-457 Đ. Lê Thị Hà, Hóc Môn, Hồ Chí Minh, Việt Nam",
    "tag": "Café",
    "tagClass": "tag-cafe",
    "category": "cafe",
    "price": "1-100k",
    "rating": 3.8,
    "reviews": 251,
    "hours": "07:00 - 22:30",
    "phone": "02871001968",
    "goodReview": "Chuỗi cafe - trà hiện đại, phù hợp gặp gỡ và ngồi lâu.",
    "badReview": "",
    "hasBad": false,
    "viewDep": false,
    "tags": [
      "Máy lạnh",
      "Trà",
      "Làm việc"
    ],
    "desc": "Chi nhánh Phúc Long trên đường Lê Thị Hà, phù hợp cho trò chuyện, học tập và làm việc.",
    "images": [],
    "quickActions": [
      "Không gian máy lạnh",
      "Phù hợp gặp gỡ"
    ],
    "menu": [],
    "reviewList": [],
    "geo": {
      "lat": null,
      "lng": null
    },
    "fsqId": "",
    "mapUrl": ""
  },
  {
    "id": 4,
    "name": "GUTA CAFE HÓC MÔN",
    "district": "Hóc Môn",
    "group": "Hóc Môn",
    "address": "46/9 Đ. Liên Xã Thị Trấn-Tân Hiệp, Hóc Môn, Hồ Chí Minh, Việt Nam",
    "fullAddress": "46/9 Đ. Liên Xã Thị Trấn-Tân Hiệp, Hóc Môn, Hồ Chí Minh, Việt Nam",
    "tag": "Café",
    "tagClass": "tag-cafe",
    "category": "cafe",
    "price": "1-100k",
    "rating": 5.0,
    "reviews": 11,
    "hours": "06:30 - 21:00",
    "phone": "0329188993",
    "goodReview": "Quán cafe hiện đại với mức giá phổ thông.",
    "badReview": "",
    "hasBad": false,
    "viewDep": false,
    "tags": [
      "Giá hợp lý",
      "Café hiện đại"
    ],
    "desc": "GUTA CAFE HÓC MÔN nằm tại khu vực Tân Hiệp, phù hợp cho nhu cầu cafe hằng ngày.",
    "images": [],
    "quickActions": [
      "Mở cửa từ sáng",
      "Giá phổ thông"
    ],
    "menu": [],
    "reviewList": [],
    "geo": {
      "lat": null,
      "lng": null
    },
    "fsqId": "",
    "mapUrl": ""
  },
  {
    "id": 5,
    "name": "Highlands Coffee Phan Văn Hớn - Hóc Môn",
    "district": "Bà Điểm",
    "group": "Hóc Môn",
    "address": "2 Đ. Phan Văn Hớn, Bà Điểm, Hồ Chí Minh 70000, Việt Nam",
    "fullAddress": "2 Đ. Phan Văn Hớn, Bà Điểm, Hồ Chí Minh 70000, Việt Nam",
    "tag": "Café",
    "tagClass": "tag-cafe",
    "category": "cafe",
    "price": "1-100k",
    "rating": 4.2,
    "reviews": 107,
    "hours": "07:00 - 22:00",
    "phone": "02873010072",
    "goodReview": "Không gian chuỗi cafe hiện đại, phù hợp gặp gỡ và làm việc.",
    "badReview": "",
    "hasBad": false,
    "viewDep": false,
    "tags": [
      "Máy lạnh",
      "Làm việc",
      "Chuỗi café"
    ],
    "desc": "Chi nhánh Highlands Coffee trên đường Phan Văn Hớn, Bà Điểm.",
    "images": [],
    "quickActions": [
      "Phù hợp laptop",
      "Không gian máy lạnh"
    ],
    "menu": [],
    "reviewList": [],
    "geo": {
      "lat": null,
      "lng": null
    },
    "fsqId": "",
    "mapUrl": ""
  },
  {
    "id": 6,
    "name": "Highlands Coffee 1800 Nguyễn Ảnh Thủ",
    "district": "Hóc Môn",
    "group": "Hóc Môn",
    "address": "1800 Đ. Nguyễn Ảnh Thủ, Hóc Môn, Hồ Chí Minh 70000, Việt Nam",
    "fullAddress": "1800 Đ. Nguyễn Ảnh Thủ, Hóc Môn, Hồ Chí Minh 70000, Việt Nam",
    "tag": "Café",
    "tagClass": "tag-cafe",
    "category": "cafe",
    "price": "1-100k",
    "rating": 4.1,
    "reviews": 179,
    "hours": "07:00 - 22:00",
    "phone": "",
    "goodReview": "Chi nhánh Highlands Coffee có không gian hiện đại và quen thuộc với người trẻ.",
    "badReview": "",
    "hasBad": false,
    "viewDep": false,
    "tags": [
      "Máy lạnh",
      "Làm việc",
      "Chuỗi café"
    ],
    "desc": "Chi nhánh Highlands Coffee tại 1800 Nguyễn Ảnh Thủ, Hóc Môn.",
    "images": [],
    "quickActions": [
      "Phù hợp làm việc",
      "Không gian máy lạnh"
    ],
    "menu": [],
    "reviewList": [],
    "geo": {
      "lat": null,
      "lng": null
    },
    "fsqId": "",
    "mapUrl": ""
  },
  {
    "id": 7,
    "name": "WeOne Coffee",
    "district": "Bà Điểm",
    "group": "Hóc Môn",
    "address": "Đ. Nguyễn Ảnh Thủ / 13/5 Nguyễn Thị Hai, Bà Điểm, Hồ Chí Minh 70000, Việt Nam",
    "fullAddress": "Đ. Nguyễn Ảnh Thủ / 13/5 Nguyễn Thị Hai, Bà Điểm, Hồ Chí Minh 70000, Việt Nam",
    "tag": "Café",
    "tagClass": "tag-cafe",
    "category": "cafe",
    "price": "",
    "rating": 4.2,
    "reviews": 314,
    "hours": "06:00 - 00:00",
    "phone": "02837127379",
    "goodReview": "Có lượng đánh giá lớn và mở cửa đến khuya.",
    "badReview": "",
    "hasBad": false,
    "viewDep": false,
    "tags": [
      "Mở khuya",
      "Café hiện đại"
    ],
    "desc": "WeOne Coffee tại khu vực Bà Điểm, phù hợp cho những buổi gặp gỡ hoặc ngồi làm việc lâu.",
    "images": [],
    "quickActions": [
      "Mở cửa đến khuya",
      "Phù hợp ngồi lâu"
    ],
    "menu": [],
    "reviewList": [],
    "geo": {
      "lat": null,
      "lng": null
    },
    "fsqId": "",
    "mapUrl": ""
  },
  {
    "id": 8,
    "name": "Eun Coffee",
    "district": "Tân Xuân",
    "group": "Hóc Môn",
    "address": "60/6M Lê Thị Hà, Ấp Chánh 1, Tân Xuân, Hóc Môn, TP.HCM",
    "fullAddress": "60/6M Lê Thị Hà, Ấp Chánh 1, Tân Xuân, Hóc Môn, TP.HCM",
    "tag": "Café",
    "tagClass": "tag-cafe",
    "category": "cafe",
    "price": "25k-55k",
    "rating": 4.2,
    "reviews": 42,
    "hours": "07:00 - 22:00",
    "phone": "0911987005",
    "goodReview": "Phong cách Hàn Quốc tối giản, không gian sáng, có ổ điện và phù hợp mang laptop chạy deadline.",
    "badReview": "",
    "hasBad": false,
    "viewDep": false,
    "tags": [
      "Phong cách Hàn Quốc",
      "Sáng sủa",
      "Deadline"
    ],
    "desc": "Eun Coffee có thiết kế hiện đại tông trắng, không gian trong nhà và ngoài trời, ánh sáng tốt và ổ điện phục vụ khách làm việc.",
    "images": [],
    "quickActions": [
      "Có ổ điện",
      "Ánh sáng tốt",
      "Phù hợp laptop"
    ],
    "menu": [],
    "reviewList": [],
    "geo": {
      "lat": null,
      "lng": null
    },
    "fsqId": "",
    "mapUrl": ""
  },
  {
    "id": 9,
    "name": "See:mê Coffee",
    "district": "Đông Thạnh",
    "group": "Hóc Môn",
    "address": "125 Trịnh Thị Miếng, Đông Thạnh, Hồ Chí Minh 731000, Việt Nam",
    "fullAddress": "125 Trịnh Thị Miếng, Đông Thạnh, Hồ Chí Minh 731000, Việt Nam",
    "tag": "Café",
    "tagClass": "tag-cafe",
    "category": "cafe",
    "price": "1-100k",
    "rating": 4.4,
    "reviews": 100,
    "hours": "07:00 - 23:00",
    "phone": "0896421123",
    "goodReview": "Không gian trẻ trung, sáng sủa, mát mẻ; nhiều bàn và ổ cắm, Wi-Fi phù hợp chạy deadline.",
    "badReview": "",
    "hasBad": false,
    "viewDep": false,
    "tags": [
      "Deadline",
      "Wi-Fi",
      "Ổ cắm"
    ],
    "desc": "See:mê Coffee là quán cafe mới tại Hóc Môn với không gian trẻ trung, nhiều bàn làm việc và các vị trí phù hợp mang laptop.",
    "images": [],
    "quickActions": [
      "Nhiều ổ cắm",
      "Wi-Fi ổn",
      "Có bàn cao và bàn thấp"
    ],
    "menu": [],
    "reviewList": [],
    "geo": {
      "lat": null,
      "lng": null
    },
    "fsqId": "",
    "mapUrl": ""
  },
  {
    "id": 10,
    "name": "Lá Coffee & Tea",
    "district": "Xuân Thới Sơn",
    "group": "Hóc Môn",
    "address": "23 Đường Xuân Thới 2, Xuân Thới Sơn, Hồ Chí Minh, Việt Nam",
    "fullAddress": "23 Đường Xuân Thới 2, Xuân Thới Sơn, Hồ Chí Minh, Việt Nam",
    "tag": "Café",
    "tagClass": "tag-cafe",
    "category": "cafe",
    "price": "1-100k",
    "rating": 5.0,
    "reviews": 48,
    "hours": "07:00 - 22:00",
    "phone": "0987552995",
    "goodReview": "Được giới thiệu trực tiếp như quán cafe học bài và làm việc, có Wi-Fi, ổ cắm và bàn ghế phù hợp ngồi lâu.",
    "badReview": "",
    "hasBad": false,
    "viewDep": false,
    "tags": [
      "Học bài",
      "Làm việc",
      "Wi-Fi"
    ],
    "desc": "Lá Coffee & Tea tại Xuân Thới Sơn là lựa chọn hướng tới sinh viên và dân văn phòng cần không gian học tập, làm việc hoặc trò chuyện.",
    "images": [],
    "quickActions": [
      "Wi-Fi",
      "Ổ cắm",
      "Bàn ghế phù hợp ngồi lâu"
    ],
    "menu": [],
    "reviewList": [],
    "geo": {
      "lat": null,
      "lng": null
    },
    "fsqId": "",
    "mapUrl": ""
  },
  {
    "id": 11,
    "name": "Coc's coffee & tea",
    "district": "Xuân Thới Sơn",
    "group": "Hóc Môn",
    "address": "13R26, Xuân Thới Sơn, Hồ Chí Minh, Việt Nam",
    "fullAddress": "13R26, Xuân Thới Sơn, Hồ Chí Minh, Việt Nam",
    "tag": "Café",
    "tagClass": "tag-cafe",
    "category": "cafe",
    "price": "20k-25k",
    "rating": 4.9,
    "reviews": 51,
    "hours": "06:00 - 23:00",
    "phone": "0778822234",
    "goodReview": "Không gian sạch sẽ, mát mẻ, ánh sáng tốt và có review trực tiếp cho rằng phù hợp chạy deadline.",
    "badReview": "",
    "hasBad": false,
    "viewDep": false,
    "tags": [
      "Máy lạnh",
      "Sáng sủa",
      "Deadline"
    ],
    "desc": "Coc's Coffee & Tea là quán cafe tại Xuân Thới Sơn, có không gian máy lạnh, menu giá phổ thông và phù hợp học tập hoặc làm việc.",
    "images": [],
    "quickActions": [
      "Máy lạnh",
      "Không gian sáng",
      "Phù hợp chạy deadline"
    ],
    "menu": [
      {
        "cat": "Món best seller",
        "items": [
          {
            "n": "Bạc xỉu đá",
            "p": "20k"
          },
          {
            "n": "Cà phê muối",
            "p": "20k"
          },
          {
            "n": "Trà sữa nguyên vị",
            "p": "25k"
          },
          {
            "n": "Trà sữa matcha Thái",
            "p": "25k"
          },
          {
            "n": "Sữa tươi trân châu đường đen",
            "p": "25k"
          }
        ]
      }
    ],
    "reviewList": [],
    "geo": {
      "lat": null,
      "lng": null
    },
    "fsqId": "",
    "mapUrl": ""
  },
  {
    "id": 12,
    "name": "Moss&Muse",
    "district": "Tân Xuân",
    "group": "Hóc Môn",
    "address": "34/4K, 34/8 Tân Xuân 6, Ấp Mỹ Hoà 3, Hóc Môn, Hồ Chí Minh 008428, Việt Nam",
    "fullAddress": "34/4K, 34/8 Tân Xuân 6, Ấp Mỹ Hoà 3, Hóc Môn, Hồ Chí Minh 008428, Việt Nam",
    "tag": "Café",
    "tagClass": "tag-cafe",
    "category": "cafe",
    "price": "1-100k",
    "rating": 5.0,
    "reviews": 1,
    "hours": "",
    "phone": "",
    "goodReview": "Địa điểm mới với đánh giá hiện tại rất cao, nhưng số lượng đánh giá còn ít.",
    "badReview": "",
    "hasBad": false,
    "viewDep": false,
    "tags": [
      "Café mới",
      "Hiện đại"
    ],
    "desc": "Moss&Muse là một quán cafe tại khu vực Tân Xuân, Hóc Môn. Dữ liệu địa điểm hiện tại mới có ít lượt đánh giá nên cần trải nghiệm thực tế để đánh giá khả năng làm việc.",
    "images": [],
    "quickActions": [],
    "menu": [],
    "reviewList": [],
    "geo": {
      "lat": null,
      "lng": null
    },
    "fsqId": "",
    "mapUrl": ""
  },
  {
    "id": 13,
    "name": "Huno Coffee House & BizStation",
    "district": "Hóc Môn",
    "group": "Hóc Môn",
    "address": "214 Đường Lê Thị Lơ, Ấp 13, Hóc Môn, Hồ Chí Minh 71710, Việt Nam",
    "fullAddress": "214 Đường Lê Thị Lơ, Ấp 13, Hóc Môn, Hồ Chí Minh 71710, Việt Nam",
    "tag": "Café",
    "tagClass": "tag-cafe",
    "category": "cafe",
    "price": "",
    "rating": null,
    "reviews": 0,
    "hours": "06:00 - 21:00",
    "phone": "0707566567",
    "goodReview": "Tên quán gắn với mô hình BizStation, phù hợp nhóm khách cần không gian làm việc.",
    "badReview": "",
    "hasBad": false,
    "viewDep": false,
    "tags": [
      "BizStation",
      "Làm việc",
      "Café"
    ],
    "desc": "Huno Coffee House & BizStation tại Hóc Môn là địa điểm có định hướng kết hợp cafe và không gian làm việc.",
    "images": [],
    "quickActions": [
      "Mô hình BizStation",
      "Phù hợp làm việc"
    ],
    "menu": [],
    "reviewList": [],
    "geo": {
      "lat": null,
      "lng": null
    },
    "fsqId": "",
    "mapUrl": ""
  },
  {
    "id": 14,
    "name": "Zen Coffee and Tea House",
    "district": "Hóc Môn",
    "group": "Hóc Môn",
    "address": "60 Đ. Quang Trung, Hóc Môn, Hồ Chí Minh, Việt Nam",
    "fullAddress": "60 Đ. Quang Trung, Hóc Môn, Hồ Chí Minh, Việt Nam",
    "tag": "Café",
    "tagClass": "tag-cafe",
    "category": "cafe",
    "price": "1-100k",
    "rating": 4.7,
    "reviews": 144,
    "hours": "06:30 - 22:00",
    "phone": "0938859200",
    "goodReview": "Không gian được đánh giá cao, phù hợp ngồi trò chuyện và làm việc.",
    "badReview": "",
    "hasBad": false,
    "viewDep": false,
    "tags": [
      "Cà phê",
      "Trà",
      "Làm việc"
    ],
    "desc": "Zen Coffee and Tea House trên đường Quang Trung, Hóc Môn.",
    "images": [],
    "quickActions": [
      "Mở cửa từ sáng",
      "Phù hợp ngồi lâu"
    ],
    "menu": [],
    "reviewList": [],
    "geo": {
      "lat": null,
      "lng": null
    },
    "fsqId": "",
    "mapUrl": ""
  },
  {
    "id": 15,
    "name": "The Bis Coffee",
    "district": "Hóc Môn",
    "group": "Hóc Môn",
    "address": "45/15 Đ. Lê Lợi, KP3, Hóc Môn, Hồ Chí Minh 731000, Việt Nam",
    "fullAddress": "45/15 Đ. Lê Lợi, KP3, Hóc Môn, Hồ Chí Minh 731000, Việt Nam",
    "tag": "Café",
    "tagClass": "tag-cafe",
    "category": "cafe",
    "price": "16k-40k",
    "rating": 4.7,
    "reviews": 25,
    "hours": "08:30 - 23:00",
    "phone": "0936774498",
    "goodReview": "Không gian thoải mái, nhạc nhẹ và phù hợp làm việc hoặc thư giãn.",
    "badReview": "",
    "hasBad": false,
    "viewDep": false,
    "tags": [
      "Giá rẻ",
      "Làm việc",
      "Nhạc nhẹ"
    ],
    "desc": "The Bis Coffee tại khu vực Hóc Môn, có mức giá phổ thông và không gian phù hợp cho người cần ngồi làm việc.",
    "images": [],
    "quickActions": [
      "Wi-Fi",
      "Phù hợp làm việc",
      "Có giao hàng"
    ],
    "menu": [],
    "reviewList": [],
    "geo": {
      "lat": null,
      "lng": null
    },
    "fsqId": "",
    "mapUrl": ""
  },
  {
    "id": 16,
    "name": "Coffee 2k5",
    "district": "Hóc Môn",
    "group": "Hóc Môn",
    "address": "718 Đ. Song Hành, Khu Phố 4, Hóc Môn, Hồ Chí Minh, Việt Nam",
    "fullAddress": "718 Đ. Song Hành, Khu Phố 4, Hóc Môn, Hồ Chí Minh, Việt Nam",
    "tag": "Café",
    "tagClass": "tag-cafe",
    "category": "cafe",
    "price": "1-100k",
    "rating": 4.7,
    "reviews": 61,
    "hours": "06:00 - 00:00",
    "phone": "0908518050",
    "goodReview": "Được đánh giá cao và mở cửa đến nửa đêm.",
    "badReview": "",
    "hasBad": false,
    "viewDep": false,
    "tags": [
      "Mở khuya",
      "Giá hợp lý",
      "Café"
    ],
    "desc": "Coffee 2k5 trên đường Song Hành, Hóc Môn, phù hợp cho những buổi gặp gỡ hoặc cần ngồi lâu.",
    "images": [],
    "quickActions": [
      "Mở cửa đến 00:00",
      "Giá phổ thông"
    ],
    "menu": [],
    "reviewList": [],
    "geo": {
      "lat": null,
      "lng": null
    },
    "fsqId": "",
    "mapUrl": ""
  },
  {
    "id": 17,
    "name": "XCOFFEE HOOCMON",
    "district": "Hóc Môn",
    "group": "Hóc Môn",
    "address": "Lê Thị Hà, Khu phố 8, Hóc Môn, Hồ Chí Minh, Việt Nam",
    "fullAddress": "Lê Thị Hà, Khu phố 8, Hóc Môn, Hồ Chí Minh, Việt Nam",
    "tag": "Café",
    "tagClass": "tag-cafe",
    "category": "cafe",
    "price": "1-100k",
    "rating": 4.2,
    "reviews": 99,
    "hours": "06:00 - 21:00",
    "phone": "0908958147",
    "goodReview": "Quán cafe hiện đại với mức giá phổ thông.",
    "badReview": "",
    "hasBad": false,
    "viewDep": false,
    "tags": [
      "Giá hợp lý",
      "Cà phê"
    ],
    "desc": "XCOFFEE HOOCMON trên đường Lê Thị Hà, khu phố 8.",
    "images": [],
    "quickActions": [
      "Mở cửa từ sáng",
      "Giá phổ thông"
    ],
    "menu": [],
    "reviewList": [],
    "geo": {
      "lat": null,
      "lng": null
    },
    "fsqId": "",
    "mapUrl": ""
  },
  {
    "id": 18,
    "name": "HOÀNG COFFEE",
    "district": "Đông Thạnh",
    "group": "Hóc Môn",
    "address": "100 32B, Đông Thạnh, Hồ Chí Minh, Việt Nam",
    "fullAddress": "100 32B, Đông Thạnh, Hồ Chí Minh, Việt Nam",
    "tag": "Café",
    "tagClass": "tag-cafe",
    "category": "cafe",
    "price": "1-100k",
    "rating": 4.6,
    "reviews": 20,
    "hours": "06:00 - 23:00",
    "phone": "0901761318",
    "goodReview": "Được đánh giá 4.6/5 và mở cửa đến 23:00.",
    "badReview": "",
    "hasBad": false,
    "viewDep": false,
    "tags": [
      "View đẹp",
      "Mở khuya"
    ],
    "desc": "HOÀNG COFFEE là quán cafe tại Đông Thạnh, Hóc Môn, hoạt động từ sáng đến tối.",
    "images": [],
    "quickActions": [
      "Mở cửa đến 23:00",
      "Giá phổ thông"
    ],
    "menu": [],
    "reviewList": [],
    "geo": {
      "lat": null,
      "lng": null
    },
    "fsqId": "",
    "mapUrl": ""
  },
  {
    "id": 19,
    "name": "COCOBEAN cà phê + trà",
    "district": "Hóc Môn",
    "group": "Hóc Môn",
    "address": "15/2 Tổ 70 Tổ 175 KP8, Hóc Môn, Hồ Chí Minh, Việt Nam",
    "fullAddress": "15/2 Tổ 70 Tổ 175 KP8, Hóc Môn, Hồ Chí Minh, Việt Nam",
    "tag": "Café",
    "tagClass": "tag-cafe",
    "category": "cafe",
    "price": "",
    "rating": 4.6,
    "reviews": 14,
    "hours": "06:30 - 21:00",
    "phone": "",
    "goodReview": "Được đánh giá 4.6/5 trong dữ liệu địa điểm hiện tại.",
    "badReview": "",
    "hasBad": false,
    "viewDep": false,
    "tags": [
      "Cà phê",
      "Trà"
    ],
    "desc": "COCOBEAN cà phê + trà là quán cafe và trà tại khu phố 8, Hóc Môn.",
    "images": [],
    "quickActions": [
      "Mở cửa từ sáng",
      "Cà phê và trà"
    ],
    "menu": [],
    "reviewList": [],
    "geo": {
      "lat": null,
      "lng": null
    },
    "fsqId": "",
    "mapUrl": ""
  },
  {
    "id": 20,
    "name": "6:AM COFFEE",
    "district": "Hóc Môn",
    "group": "Hóc Môn",
    "address": "81A Lý Thường Kiệt, Hóc Môn, Hồ Chí Minh 71706, Việt Nam",
    "fullAddress": "81A Lý Thường Kiệt, Hóc Môn, Hồ Chí Minh 71706, Việt Nam",
    "tag": "Café",
    "tagClass": "tag-cafe",
    "category": "cafe",
    "price": "",
    "rating": 3.9,
    "reviews": 116,
    "hours": "06:00 - 22:00",
    "phone": "0901688228",
    "goodReview": "Quán hoạt động từ sáng sớm đến tối và có lượng đánh giá tương đối lớn.",
    "badReview": "",
    "hasBad": false,
    "viewDep": false,
    "tags": [
      "Mở cửa sớm",
      "Cà phê"
    ],
    "desc": "6:AM COFFEE trên đường Lý Thường Kiệt, Hóc Môn.",
    "images": [],
    "quickActions": [
      "Mở cửa từ 06:00",
      "Phù hợp buổi sáng"
    ],
    "menu": [],
    "reviewList": [],
    "geo": {
      "lat": null,
      "lng": null
    },
    "fsqId": "",
    "mapUrl": ""
  }
];

function normalize(name) {
  return name.toLowerCase().replace(/[^a-z0-9àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/g, '');
}

const cafeList = JSON.parse(fs.readFileSync(CAFE_FILE, 'utf8'));
const gardenList = JSON.parse(fs.readFileSync(GARDEN_FILE, 'utf8'));

const existingNames = new Set([
  ...cafeList.map(item => normalize(item.name)),
  ...gardenList.map(item => normalize(item.name))
]);

const addedItems = [];

for (const item of incomingList) {
  const normName = normalize(item.name);
  if (!existingNames.has(normName)) {
    existingNames.add(normName);
    addedItems.push(item);
    console.log(`➕ Thêm quán mới vào cafe.json: ${item.name}`);
  } else {
    console.log(`⏭️ Đã tồn tại trong cafe.json hoặc garden.json (bỏ qua): ${item.name}`);
  }
}

const finalCafeList = [...cafeList, ...addedItems];
finalCafeList.forEach((c, idx) => {
  c.id = idx + 1;
});

fs.writeFileSync(CAFE_FILE, JSON.stringify(finalCafeList, null, 2), 'utf8');

console.log(`\n🎉 HOÀN THÀNH!`);
console.log(`☕ cafe.json có tổng cộng ${finalCafeList.length} quán.`);
