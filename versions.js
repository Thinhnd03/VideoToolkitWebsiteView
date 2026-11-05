// Version history shown on the download page, newest first.
// To publish a new version: add an entry at the TOP and upload the installer to a GitHub Release
// with the tag "v<version>" (see docs/README.md).
window.VERSIONS = [
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
