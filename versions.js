// Version history shown on the download page, newest first.
// To publish a new version: add an entry at the TOP and upload the installer to a GitHub Release
// with the tag "v<version>" (see docs/README.md).
window.VERSIONS = [
  {
    version: "2.3.0",
    date: "2026-11-06",
    size: "131 MB",
    file: "VideoToolkit-Setup-2.3.0.exe",
    notes: [
      "Lên lịch Instagram Reels qua API chính thức của Meta (tài khoản chuyên nghiệp: Doanh nghiệp hoặc Nhà sáng tạo, liên kết với Trang Facebook). App tự đăng đúng giờ khi đang mở.",
      "Thống kê Instagram: lượt xem, tiếp cận, thích, bình luận, chia sẻ, lưu, thời gian xem Reels; tổng quan tài khoản 28 ngày và khán giả theo độ tuổi, giới tính, nơi ở.",
      "Thống kê kênh YouTube: lượt xem, giờ xem, thời lượng xem trung bình, người đăng ký mới từng video; nguồn lượt xem, thiết bị, quốc gia, độ tuổi, giới tính (YouTube Analytics).",
      "Lịch đã đặt có cột Trạng thái; huỷ hoặc đăng lại video Instagram ngay trong app.",
      "Đăng nhập Facebook thấy cả các Trang nằm trong Meta Business Suite.",
    ],
  },
  {
    version: "2.2.1",
    date: "2026-11-05",
    size: "131 MB",
    file: "VideoToolkit-Setup-2.2.1.exe",
    notes: [
      "Bản chính thức đầu tiên: dùng với mã kích hoạt (gói 6 tháng hoặc 1 năm, xem Bảng giá); Cài đặt → Bản quyền hiện thời gian sử dụng còn lại.",
      "Tải hàng loạt video và Reels từ Facebook Page, lọc theo ngày đăng.",
      "Làm mờ / pixel / xoá logo cho cả thư mục với vùng chọn lưu thành preset.",
      "Lên lịch đăng TikTok (TikTok Studio), YouTube Shorts và Trang Facebook (API chính thức).",
      "Thống kê Trang Facebook: lượt xem, cảm xúc, bình luận, chia sẻ từng video; danh sách đã đăng và đã lên lịch.",
      "Giao diện Windows 11 sáng / tối, kèm sẵn FFmpeg, dùng trình duyệt có trên máy (Brave, Edge, Chrome).",
    ],
  },
];

// Where the installers are downloaded from (GitHub Releases of the repo).
window.RELEASES_URL = "https://github.com/Thinhnd03/VideoToolkitWebsiteView/releases";
window.downloadUrl = (v) => `${window.RELEASES_URL}/download/v${v.version}/${v.file}`;
