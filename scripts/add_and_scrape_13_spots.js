import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import puppeteer from 'puppeteer';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

const rawSpots = [
  {
    "name": "Phố đi bộ Nguyễn Huệ",
    "district": "Quận 1",
    "group": "Quận 1",
    "address": "Nguyễn Huệ, phường Sài Gòn, Quận 1, Hồ Chí Minh",
    "fullAddress": "Đường Nguyễn Huệ, phường Sài Gòn, Quận 1, Hồ Chí Minh",
    "tag": "Phố đi bộ",
    "tagClass": "tag-stroll",
    "category": "stroll",
    "price": "Miễn phí",
    "rating": 4.8,
    "reviews": 12500,
    "hours": "24/7",
    "phone": "",
    "goodReview": "Không gian đi bộ rộng, nằm ngay trung tâm thành phố, nhiều cây xanh, nhà hàng, quán cafe và thường có biểu diễn đường phố, sự kiện văn hóa.",
    "badReview": "Thường đông người vào buổi tối và cuối tuần.",
    "hasBad": true,
    "viewDep": true,
    "tags": ["Đi bộ", "Giải trí", "Biểu diễn đường phố", "Check-in", "Hẹn hò", "Miễn phí", "Nightlife"],
    "desc": "Phố đi bộ Nguyễn Huệ là tuyến phố đi bộ nổi tiếng dài khoảng 900 m từ khu vực sông Sài Gòn đến trụ sở UBND Thành phố. Đây là một trong những điểm tập trung đông người nhất tại trung tâm Quận 1, đặc biệt vào buổi tối và cuối tuần.",
    "images": [],
    "quickActions": ["Đi dạo", "Xem biểu diễn", "Check-in", "Đi date", "Ăn uống"],
    "menu": [],
    "reviewList": [],
    "geo": { "lat": 10.7743, "lng": 106.7040 },
    "fsqId": "",
    "mapUrl": "https://maps.google.com/?q=Nguyen+Hue+Walking+Street+Ho+Chi+Minh"
  },
  {
    "name": "Nhà thờ Đức Bà Sài Gòn",
    "district": "Quận 1",
    "group": "Quận 1",
    "address": "01 Công xã Paris, phường Sài Gòn, Quận 1, Hồ Chí Minh",
    "fullAddress": "01 Công xã Paris, phường Sài Gòn, Quận 1, Hồ Chí Minh",
    "tag": "Kiến trúc cổ",
    "tagClass": "tag-stroll",
    "category": "stroll",
    "price": "Miễn phí",
    "rating": 4.7,
    "reviews": 18400,
    "hours": "Không mở tham quan du lịch trong thời gian trùng tu",
    "phone": "",
    "goodReview": "Công trình kiến trúc Pháp nổi bật, nằm tại khu vực Công trường Công xã Paris và cạnh Bưu điện Trung tâm.",
    "badReview": "Hiện đang trong thời gian trùng tu nên khách du lịch không được vào tham quan.",
    "hasBad": true,
    "viewDep": true,
    "tags": ["Kiến trúc", "Di tích", "Pháp cổ", "Check-in", "Lịch sử"],
    "desc": "Nhà thờ Chính tòa Đức Bà Sài Gòn là một trong những công trình kiến trúc biểu tượng của trung tâm TP.HCM. Hiện nhà thờ đang được trùng tu; khách du lịch không thể tham quan bên trong nhưng nhà thờ vẫn mở cửa cho tín hữu tham dự thánh lễ.",
    "images": [],
    "quickActions": ["Ngắm kiến trúc", "Check-in bên ngoài", "Tham quan khu vực xung quanh"],
    "menu": [],
    "reviewList": [],
    "geo": { "lat": 10.7798, "lng": 106.6990 },
    "fsqId": "",
    "mapUrl": "https://maps.google.com/?q=Notre+Dame+Cathedral+Saigon"
  },
  {
    "name": "Bưu điện Trung tâm Sài Gòn",
    "district": "Quận 1",
    "group": "Quận 1",
    "address": "02 Công xã Paris, phường Sài Gòn, Quận 1, Hồ Chí Minh",
    "fullAddress": "02 Công xã Paris, phường Sài Gòn, Quận 1, Hồ Chí Minh",
    "tag": "Kiến trúc cổ",
    "tagClass": "tag-stroll",
    "category": "stroll",
    "price": "Miễn phí",
    "rating": 4.6,
    "reviews": 15200,
    "hours": "07:30 - 18:00",
    "phone": "",
    "goodReview": "Công trình kiến trúc Pháp nổi bật với không gian mái vòm lớn, đồng hồ cổ và nhiều chi tiết kiến trúc đặc trưng.",
    "badReview": "Có thể đông khách du lịch vào các khung giờ cao điểm.",
    "hasBad": true,
    "viewDep": true,
    "tags": ["Kiến trúc", "Di tích", "Check-in", "Lịch sử", "Tham quan"],
    "desc": "Bưu điện Trung tâm Sài Gòn nằm đối diện Nhà thờ Đức Bà, là một trong những công trình kiến trúc thuộc địa nổi bật nhất khu vực trung tâm thành phố.",
    "images": [],
    "quickActions": ["Check-in", "Ngắm kiến trúc", "Gửi bưu thiếp", "Tham quan"],
    "menu": [],
    "reviewList": [],
    "geo": { "lat": 10.7798, "lng": 106.6999 },
    "fsqId": "",
    "mapUrl": "https://maps.google.com/?q=Saigon+Central+Post+Office"
  },
  {
    "name": "Dinh Độc Lập",
    "district": "Quận 1",
    "group": "Quận 1",
    "address": "135 Nam Kỳ Khởi Nghĩa, phường Bến Thành, Quận 1, Hồ Chí Minh",
    "fullAddress": "135 Nam Kỳ Khởi Nghĩa, phường Bến Thành, Quận 1, Hồ Chí Minh",
    "tag": "Di tích lịch sử",
    "tagClass": "tag-entertainment",
    "category": "entertainment",
    "price": "40k - 105k",
    "rating": 4.6,
    "reviews": 22100,
    "hours": "07:00 - 18:00",
    "phone": "08085039",
    "goodReview": "Khu di tích lớn với nhiều không gian lịch sử, nội thất nguyên bản, hầm chỉ huy và khu trưng bày chuyên đề.",
    "badReview": "Khuôn viên rộng nên có thể cần khá nhiều thời gian để tham quan đầy đủ.",
    "hasBad": true,
    "viewDep": true,
    "tags": ["Di tích", "Lịch sử", "Kiến trúc", "Tham quan", "Check-in", "Bảo tàng"],
    "desc": "Dinh Độc Lập là di tích lịch sử nổi tiếng tại trung tâm Quận 1. Từ năm 2026, khu di tích mở cửa 07:00-18:00 tất cả các ngày trong tuần. Có nhiều lựa chọn vé từ tham quan riêng Dinh đến combo Dinh, Nhà trưng bày và xe điện.",
    "images": [],
    "quickActions": ["Tham quan Dinh", "Xem hầm chỉ huy", "Xem Nhà trưng bày", "Đi xe điện", "Tìm hiểu lịch sử"],
    "menu": [],
    "reviewList": [],
    "geo": { "lat": 10.7769, "lng": 106.6950 },
    "fsqId": "",
    "mapUrl": "https://maps.google.com/?q=Independence+Palace+Ho+Chi+Minh+City"
  },
  {
    "name": "Chợ Bến Thành",
    "district": "Quận 1",
    "group": "Quận 1",
    "address": "Lê Lợi, phường Bến Thành, Quận 1, Hồ Chí Minh",
    "fullAddress": "Chợ Bến Thành, Lê Lợi, phường Bến Thành, Quận 1, Hồ Chí Minh",
    "tag": "Chợ & Ẩm thực",
    "tagClass": "tag-food",
    "category": "food",
    "price": "50k - 200k",
    "rating": 4.3,
    "reviews": 31000,
    "hours": "07:00 - 22:00",
    "phone": "02838299274",
    "goodReview": "Khu chợ biểu tượng với nhiều gian hàng thời trang, quà lưu niệm, đặc sản và khu ẩm thực.",
    "badReview": "Giá bán cho khách du lịch có thể cao hơn và thường cần hỏi giá, so sánh và mặc cả.",
    "hasBad": true,
    "viewDep": true,
    "tags": ["Chợ", "Mua sắm", "Ẩm thực", "Ăn vặt", "Quà lưu niệm", "Check-in"],
    "desc": "Chợ Bến Thành là một trong những biểu tượng nổi tiếng nhất của TP.HCM, kết hợp mua sắm, ẩm thực và trải nghiệm văn hóa ngay trung tâm Quận 1.",
    "images": [],
    "quickActions": ["Ăn uống", "Mua sắm", "Mua quà", "Check-in", "Khám phá chợ"],
    "menu": [],
    "reviewList": [],
    "geo": { "lat": 10.7720, "lng": 106.6980 },
    "fsqId": "",
    "mapUrl": "https://maps.google.com/?q=Ben+Thanh+Market"
  },
  {
    "name": "Nhà hát Thành phố Hồ Chí Minh",
    "district": "Quận 1",
    "group": "Quận 1",
    "address": "07 Công trường Lam Sơn, phường Sài Gòn, Quận 1, Hồ Chí Minh",
    "fullAddress": "07 Công trường Lam Sơn, phường Sài Gòn, Quận 1, Hồ Chí Minh",
    "tag": "Nhà hát & Nghệ thuật",
    "tagClass": "tag-entertainment",
    "category": "entertainment",
    "price": "Vé theo show",
    "rating": 4.6,
    "reviews": 17787,
    "hours": "Phụ thuộc lịch biểu diễn",
    "phone": "",
    "goodReview": "Nhà hát kiến trúc Tây Âu nổi bật, nằm tại Công trường Lam Sơn và vẫn tổ chức nhiều chương trình nghệ thuật, sự kiện.",
    "badReview": "Muốn vào bên trong cần có vé hoặc tham gia chương trình phù hợp; không phải lúc nào cũng mở tự do cho khách tham quan.",
    "hasBad": true,
    "viewDep": true,
    "tags": ["Nhà hát", "Kiến trúc", "Văn hóa", "Biểu diễn nghệ thuật", "Check-in", "Hẹn hò"],
    "desc": "Nhà hát Thành phố Hồ Chí Minh, thường gọi là Nhà hát Sài Gòn, nằm tại Công trường Lam Sơn, là nhà hát trung tâm đa năng chuyên tổ chức biểu diễn sân khấu nghệ thuật và các sự kiện lớn.",
    "images": [],
    "quickActions": ["Xem biểu diễn", "Check-in", "Ngắm kiến trúc", "Đi date"],
    "menu": [],
    "reviewList": [],
    "geo": { "lat": 10.7769, "lng": 106.7031 },
    "fsqId": "",
    "mapUrl": "https://maps.google.com/?q=Saigon+Opera+House"
  },
  {
    "name": "Bitexco Financial Tower & Saigon Skydeck",
    "district": "Quận 1",
    "group": "Quận 1",
    "address": "02 Hải Triều, phường Sài Gòn, Quận 1, Hồ Chí Minh",
    "fullAddress": "02 Hải Triều, phường Sài Gòn, Quận 1, Hồ Chí Minh",
    "tag": "Điểm ngắm cảnh",
    "tagClass": "tag-entertainment",
    "category": "entertainment",
    "price": "200k - 300k",
    "rating": 4.5,
    "reviews": 8500,
    "hours": "09:30 - 21:30",
    "phone": "",
    "goodReview": "Tòa nhà biểu tượng với kiến trúc lấy cảm hứng từ búp sen và đài quan sát Skydeck cho tầm nhìn toàn cảnh thành phố.",
    "badReview": "Chi phí tham quan Skydeck cao hơn nhiều điểm tham quan công cộng miễn phí.",
    "hasBad": true,
    "viewDep": true,
    "tags": ["Skydeck", "Ngắm cảnh", "View thành phố", "Check-in", "Hẹn hò", "Kiến trúc"],
    "desc": "Bitexco Financial Tower là một trong những công trình cao tầng biểu tượng của TP.HCM. Saigon Skydeck nằm trên tầng 49 và là điểm ngắm cảnh nổi bật tại trung tâm thành phố.",
    "images": [],
    "quickActions": ["Ngắm thành phố", "Check-in", "Đi date", "Chụp ảnh"],
    "menu": [],
    "reviewList": [],
    "geo": { "lat": 10.7717, "lng": 106.7044 },
    "fsqId": "",
    "mapUrl": "https://maps.google.com/?q=Bitexco+Financial+Tower"
  },
  {
    "name": "The Cafe Apartments - 42 Nguyễn Huệ",
    "district": "Quận 1",
    "group": "Quận 1",
    "address": "42 Nguyễn Huệ, phường Sài Gòn, Quận 1, Hồ Chí Minh",
    "fullAddress": "42 Nguyễn Huệ, phường Sài Gòn, Quận 1, Hồ Chí Minh",
    "tag": "Cafe chung cư",
    "tagClass": "tag-cafe",
    "category": "cafe",
    "price": "40k - 120k",
    "rating": 4.5,
    "reviews": 4300,
    "hours": "08:00 - 22:00",
    "phone": "",
    "goodReview": "Tòa nhà căn hộ cũ được chuyển đổi thành nhiều quán cafe, cửa hàng và không gian sáng tạo; nhiều tầng có ban công nhìn xuống phố Nguyễn Huệ.",
    "badReview": "Mỗi quán có giờ mở cửa, mức giá và chất lượng khác nhau; phải chọn từng quán thay vì xem cả tòa nhà như một quán cafe.",
    "hasBad": true,
    "viewDep": true,
    "tags": ["Cafe", "Check-in", "Ban công", "Ngắm phố", "Hẹn hò", "Trải nghiệm"],
    "desc": "The Cafe Apartments tại 42 Nguyễn Huệ là tòa nhà căn hộ cũ nhiều tầng, hiện tập trung nhiều quán cafe, cửa hàng và không gian sáng tạo. Đây là một điểm đến phù hợp để khám phá nhiều quán trong cùng một địa điểm.",
    "images": [],
    "quickActions": ["Khám phá cafe", "Ngồi ban công", "Check-in", "Đi date", "Ngắm Nguyễn Huệ"],
    "menu": [],
    "reviewList": [],
    "geo": { "lat": 10.7727, "lng": 106.7031 },
    "fsqId": "",
    "mapUrl": "https://maps.google.com/?q=The+Cafe+Apartment+42+Nguyen+Hue"
  },
  {
    "name": "Phố đi bộ Bùi Viện",
    "district": "Quận 1",
    "group": "Quận 1",
    "address": "Bùi Viện, phường Phạm Ngũ Lão, Quận 1, Hồ Chí Minh",
    "fullAddress": "Bùi Viện, phường Phạm Ngũ Lão, Quận 1, Hồ Chí Minh",
    "tag": "Phố đi bộ & Nightlife",
    "tagClass": "tag-stroll",
    "category": "stroll",
    "price": "50k - 300k",
    "rating": 4.2,
    "reviews": 11800,
    "hours": "19:00 - 02:00 (Thứ Bảy, Chủ Nhật)",
    "phone": "",
    "goodReview": "Khu phố du lịch tập trung nhiều quán ăn, bar, beer club, pub và hoạt động giải trí về đêm.",
    "badReview": "Rất đông và ồn ào vào buổi tối; không phù hợp nếu muốn không gian yên tĩnh.",
    "hasBad": true,
    "viewDep": false,
    "tags": ["Nightlife", "Ăn uống", "Bar", "Pub", "Đi bộ", "Giải trí", "Đi nhóm"],
    "desc": "Phố đi bộ Bùi Viện là khu phố du lịch nổi tiếng tại Quận 1, kéo dài từ khu vực Đề Thám đến Đỗ Quang Đẩu. Khu phố đặc biệt sôi động về đêm với nhiều nhà hàng, quán bar và hoạt động giải trí.",
    "images": [],
    "quickActions": ["Đi dạo", "Ăn uống", "Đi bar", "Nightlife", "Đi nhóm"],
    "menu": [],
    "reviewList": [],
    "geo": { "lat": 10.7681, "lng": 106.6924 },
    "fsqId": "",
    "mapUrl": "https://maps.google.com/?q=Bui+Vien+Walking+Street"
  },
  {
    "name": "Bảo tàng Mỹ thuật Thành phố Hồ Chí Minh",
    "district": "Quận 1",
    "group": "Quận 1",
    "address": "97A Phó Đức Chính, phường Bến Thành, Quận 1, Hồ Chí Minh",
    "fullAddress": "97A Phó Đức Chính, phường Bến Thành, Quận 1, Hồ Chí Minh",
    "tag": "Bảo tàng & Nghệ thuật",
    "tagClass": "tag-entertainment",
    "category": "entertainment",
    "price": "30k",
    "rating": 4.6,
    "reviews": 6800,
    "hours": "08:00 - 17:00",
    "phone": "02838216331",
    "goodReview": "Không gian kiến trúc đẹp, nhiều tác phẩm nghệ thuật Việt Nam và nhiều góc phù hợp tham quan, chụp ảnh.",
    "badReview": "Thời gian mở cửa giới hạn hơn các địa điểm ngoài trời.",
    "hasBad": true,
    "viewDep": true,
    "tags": ["Bảo tàng", "Nghệ thuật", "Kiến trúc", "Check-in", "Đi date", "Văn hóa"],
    "desc": "Bảo tàng Mỹ thuật Thành phố Hồ Chí Minh nằm tại 97A Phó Đức Chính, trong một tòa nhà kiến trúc đẹp. Bảo tàng mở cửa 08:00-17:00 hằng ngày; vé người lớn 30.000 đồng và học sinh, sinh viên 15.000 đồng.",
    "images": [],
    "quickActions": ["Xem nghệ thuật", "Ngắm kiến trúc", "Check-in", "Đi date"],
    "menu": [],
    "reviewList": [],
    "geo": { "lat": 10.7689, "lng": 106.6965 },
    "fsqId": "",
    "mapUrl": "https://maps.google.com/?q=Ho+Chi+Minh+City+Museum+of+Fine+Arts"
  },
  {
    "name": "Bảo tàng Chứng tích Chiến tranh",
    "district": "Quận 1",
    "group": "Quận 1",
    "address": "28 Võ Văn Tần, phường Xuân Hòa, Hồ Chí Minh",
    "fullAddress": "28 Võ Văn Tần, phường Xuân Hòa, Hồ Chí Minh",
    "tag": "Bảo tàng Lịch sử",
    "tagClass": "tag-entertainment",
    "category": "entertainment",
    "price": "40k",
    "rating": 4.7,
    "reviews": 32000,
    "hours": "07:30 - 17:30",
    "phone": "",
    "goodReview": "Bảo tàng có hệ thống trưng bày lớn về chiến tranh Việt Nam, nhiều hiện vật, hình ảnh và tư liệu lịch sử.",
    "badReview": "Nội dung trưng bày có nhiều hình ảnh và tư liệu chiến tranh khá nặng về cảm xúc, không phù hợp với mọi du khách.",
    "hasBad": true,
    "viewDep": true,
    "tags": ["Bảo tàng", "Lịch sử", "Chiến tranh", "Giáo dục", "Tham quan"],
    "desc": "Bảo tàng Chứng tích Chiến tranh là điểm tham quan lịch sử nổi tiếng tại trung tâm TP.HCM. Website chính thức hiện ghi bảo tàng mở cửa 07:30-17:30 hằng ngày, quầy vé đóng lúc 17:00.",
    "images": [],
    "quickActions": ["Xem hiện vật", "Tìm hiểu lịch sử", "Tham quan trưng bày"],
    "menu": [],
    "reviewList": [],
    "geo": { "lat": 10.7798, "lng": 106.6925 },
    "fsqId": "",
    "mapUrl": "https://maps.google.com/?q=War+Remnants+Museum+Ho+Chi+Minh"
  },
  {
    "name": "Đường Đồng Khởi",
    "district": "Quận 1",
    "group": "Quận 1",
    "address": "Đường Đồng Khởi, phường Sài Gòn, Quận 1, Hồ Chí Minh",
    "fullAddress": "Đường Đồng Khởi, phường Sài Gòn, Quận 1, Hồ Chí Minh",
    "tag": "Dạo phố & Mua sắm",
    "tagClass": "tag-stroll",
    "category": "stroll",
    "price": "Miễn phí",
    "rating": 4.6,
    "reviews": 8900,
    "hours": "24/7",
    "phone": "",
    "goodReview": "Tuyến phố trung tâm với kiến trúc Pháp, cửa hàng thời trang, thương hiệu cao cấp, cafe, nhà hàng và nhiều địa điểm tham quan nằm gần nhau.",
    "badReview": "Giá dịch vụ và mua sắm tại khu vực này thường cao hơn nhiều khu vực khác của thành phố.",
    "hasBad": true,
    "viewDep": true,
    "tags": ["Dạo phố", "Mua sắm", "Kiến trúc", "Cafe", "Ẩm thực", "Check-in", "Hẹn hò"],
    "desc": "Đường Đồng Khởi là một trong những tuyến phố nổi tiếng nhất trung tâm TP.HCM, nối khu vực Nhà hát Thành phố với phía Nhà thờ Đức Bà và sông Sài Gòn, tập trung nhiều công trình kiến trúc thuộc địa, khách sạn, cửa hàng và nhà hàng.",
    "images": [],
    "quickActions": ["Đi dạo", "Mua sắm", "Check-in", "Đi date", "Ăn uống"],
    "menu": [],
    "reviewList": [],
    "geo": { "lat": 10.7755, "lng": 106.7045 },
    "fsqId": "",
    "mapUrl": "https://maps.google.com/?q=Dong+Khoi+Street+Ho+Chi+Minh"
  },
  {
    "name": "Thảo Cầm Viên Sài Gòn",
    "district": "Quận 1",
    "group": "Quận 1",
    "address": "02 Nguyễn Bỉnh Khiêm, phường Sài Gòn, Quận 1, Hồ Chí Minh",
    "fullAddress": "02 Nguyễn Bỉnh Khiêm, phường Sài Gòn, Quận 1, Hồ Chí Minh",
    "tag": "Công viên & Vườn thú",
    "tagClass": "tag-stroll",
    "category": "stroll",
    "price": "60k",
    "rating": 4.5,
    "reviews": 24000,
    "hours": "07:00 - 18:30",
    "phone": "02838291425",
    "goodReview": "Không gian xanh rộng giữa trung tâm thành phố, có nhiều khu động vật, cây xanh và không gian đi bộ.",
    "badReview": "Diện tích lớn nên cần khá nhiều thời gian nếu muốn tham quan nhiều khu vực.",
    "hasBad": true,
    "viewDep": true,
    "tags": ["Công viên", "Vườn thú", "Động vật", "Cây xanh", "Đi bộ", "Hẹn hò", "Gia đình"],
    "desc": "Thảo Cầm Viên Sài Gòn là một trong những không gian xanh và vườn thú lâu đời của thành phố, nằm ngay khu vực trung tâm Quận 1. Đây là địa điểm phù hợp cho đi dạo, xem động vật và các hoạt động ngoài trời.",
    "images": [],
    "quickActions": ["Xem động vật", "Đi dạo", "Check-in", "Đi date", "Picnic"],
    "menu": [],
    "reviewList": [],
    "geo": { "lat": 10.7870, "lng": 106.7040 },
    "fsqId": "",
    "mapUrl": "https://maps.google.com/?q=Saigon+Zoo+and+Botanical+Gardens"
  }
];

// Helper to delay
const randomDelay = (min = 1200, max = 2200) =>
  new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * (max - min + 1)) + min));

async function uploadImageToCloudinary(imgUrl, folderPath) {
  try {
    const res = await cloudinary.uploader.upload(imgUrl, {
      folder: folderPath,
      resource_type: 'image'
    });
    return res.secure_url;
  } catch (err) {
    console.error(`  ❌ Lỗi upload Cloudinary:`, err.message);
    return null;
  }
}

const categoryFolderNames = {
  stroll: 'đi dạo',
  entertainment: 'giải trí',
  food: 'ẩm thực',
  cafe: 'cà phê',
  garden: 'sân vườn',
  snack: 'ăn vặt',
  restaurant: 'nhà hàng'
};

async function fetchWebImagesForVenue(page, venueName) {
  // Use Bing Images or DuckDuckGo Images for high-res photos
  const searchQuery = encodeURIComponent(`${venueName} Sài Gòn`);
  const searchUrl = `https://www.bing.com/images/search?q=${searchQuery}&form=HDRSC2&first=1`;

  console.log(`  🌐 Searching web photos on Bing Images: ${venueName}`);
  await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 40000 });
  await randomDelay(2000, 3000);

  // Extract direct image links from Bing Images
  const imgUrls = await page.evaluate(() => {
    const urls = [];
    const elements = document.querySelectorAll('a.iusc');
    elements.forEach(el => {
      const mData = el.getAttribute('m');
      if (mData) {
        try {
          const parsed = JSON.parse(mData);
          if (parsed.murl && parsed.murl.startsWith('http')) {
            urls.push(parsed.murl);
          }
        } catch (e) {}
      }
    });

    if (urls.length < 5) {
      document.querySelectorAll('img.mimg').forEach(img => {
        const src = img.src || img.getAttribute('data-src');
        if (src && src.startsWith('http') && !src.includes('bing.com/th?id=OIP')) {
          urls.push(src);
        }
      });
    }

    return urls;
  });

  // Filter out tiny badges or SVGs
  const validUrls = imgUrls.filter(u => 
    !u.endsWith('.svg') && 
    !u.includes('logo') && 
    !u.includes('icon') && 
    !u.includes('avatar')
  );

  return Array.from(new Set(validUrls)).slice(0, 8);
}

async function main() {
  console.log('🚀 BẮT ĐẦU TỰ PHÂN LOẠI & THÊM 13 ĐỊA ĐIỂM QUẬN 1 CHUẨN...');

  // Group spots by category file
  const grouped = {
    stroll: [],
    entertainment: [],
    food: [],
    cafe: []
  };

  rawSpots.forEach(spot => {
    grouped[spot.category].push(spot);
  });

  // Merge into existing JSON files
  for (const cat of Object.keys(grouped)) {
    const spotsToAdd = grouped[cat];
    if (spotsToAdd.length === 0) continue;

    const file = path.join(process.cwd(), 'src', 'data', 'spots', `${cat}.json`);
    let currentData = [];
    if (fs.existsSync(file)) {
      currentData = JSON.parse(fs.readFileSync(file, 'utf8'));
    }

    // Filter duplicates by name
    const existingNames = new Set(currentData.map(s => s.name.toLowerCase().trim()));
    const newItems = spotsToAdd.filter(s => !existingNames.has(s.name.toLowerCase().trim()));

    if (newItems.length > 0) {
      currentData.push(...newItems);
      // Re-index IDs
      currentData.forEach((s, idx) => {
        s.id = idx + 1;
      });
      fs.writeFileSync(file, JSON.stringify(currentData, null, 2), 'utf8');
      console.log(`✅ Đã cập nhật ${file}: ${currentData.length} địa điểm (${newItems.length} địa điểm mới vừa thêm).`);
    } else {
      console.log(`ℹ️ Các địa điểm trong ${cat}.json đã tồn tại từ trước.`);
    }
  }

  // Now launch Puppeteer for Image Scraping via Web (Bing Images / Travel Sites)
  console.log('\n📸 BẮT ĐẦU CÀO ẢNH TỪ WEB (NON-GOOGLE MAPS) VÀ UPLOAD CLOUDINARY...');

  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--lang=vi-VN']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');

  for (const item of rawSpots) {
    const cat = item.category;
    const file = path.join(process.cwd(), 'src', 'data', 'spots', `${cat}.json`);
    let fileData = JSON.parse(fs.readFileSync(file, 'utf8'));
    const targetSpot = fileData.find(s => s.name.toLowerCase().trim() === item.name.toLowerCase().trim());

    if (!targetSpot) continue;

    if (targetSpot.images && targetSpot.images.length > 0) {
      console.log(`\n--------------------------------------------------`);
      console.log(`[${targetSpot.name}] Đã có ${targetSpot.images.length} ảnh Cloudinary, bỏ qua.`);
      continue;
    }

    console.log(`\n--------------------------------------------------`);
    console.log(`[${targetSpot.name}] Đang tìm kiếm ảnh web...`);

    const cleanName = targetSpot.name.replace(/&/g, '').replace(/,/g, '').replace(/:/g, '').replace(/  +/g, ' ').trim();
    const folderCategory = categoryFolderNames[cat] || cat;
    const folderPath = `địa điểm/${folderCategory}/${cleanName}`;

    try {
      const imageUrls = await fetchWebImagesForVenue(page, targetSpot.name);
      console.log(`  📸 Tìm thấy ${imageUrls.length} ảnh web cho [${targetSpot.name}].`);

      if (imageUrls.length > 0) {
        const uploadedUrls = [];
        for (let pIdx = 0; pIdx < imageUrls.length; pIdx++) {
          const cloudUrl = await uploadImageToCloudinary(imageUrls[pIdx], folderPath);
          if (cloudUrl) {
            uploadedUrls.push(cloudUrl);
            console.log(`    ✓ [${pIdx + 1}/${imageUrls.length}] ${cloudUrl}`);
          }
        }

        if (uploadedUrls.length > 0) {
          targetSpot.images = uploadedUrls;
          fs.writeFileSync(file, JSON.stringify(fileData, null, 2), 'utf8');
          console.log(`  💾 Đã lưu ${uploadedUrls.length} ảnh Cloudinary cho [${targetSpot.name}] vào ${cat}.json!`);
        }
      }
    } catch (err) {
      console.error(`  ❌ Lỗi khi cào ảnh cho ${targetSpot.name}:`, err.message);
    }

    await randomDelay(1500, 2500);
  }

  await browser.close();
  console.log('\n🎉 HOÀN THÀNH TOÀN BỘ PHÂN LOẠI, THÊM ĐỊA ĐIỂM VÀ CÀO ẢNH CLOUDINARY TỪ WEB!');
}

main();
