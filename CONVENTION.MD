# HCMA FRONTEND CONVENTION
## Cấu trúc thư mục/chức năng

```bash
1. Tên thư mục = tên chức năng [không dấu, viết thường, tiếng việt]
2. Cấu trúc thư mục con tương ứng với pathname của chức năng
    Ví dụ: chức năng có pathname /quan-tri/can-bo => thư mục cũng là /quan-tri/can-bo
```

## Tên biến, tên component

```bash
1. Tên biến viết thường chữ cái đầu
2. Tên component viết hoa chữ cái đầu
```

## Models

```bash
1. Model đặt ở thư mục /src/models
    Ví dụ: /src/models/dm_gioi_tinh.ts => useModel('dm_gioi_tinh');
2. [RECOMMENT] Model đặt ở thư mục chức năng
    Ví dụ /src/quan-tri/models/can-bo.ts => useModel('quan-tri.can-bo');
```

## Phân quyền

```bash
1. Mã phân quyền: VIẾT HOA , cách nhau bởi dấu _, cách với mã chức năng cha bởi dấu __
Ví dụ:
    pathname                                    ma_phan_quyen
    /quan-tri                                   QUAN_TRI
    /quan-tri/can-bo                            QT__CAN_BO
    /quan-tri/can-bo   => button tạo mới        QT__CAN_BO__TAO_MOI
```

## Selector

```bash
1. Dùng để load danh mục và cache để chỉ cần load dữ liệu 1 lần, Dành cho những danh mục ít bị thay đổi thông tin
Tham khảo /src/selectors/useDanhMucChucDanh.ts
```

## Component
```bash
1. Dùng DateTime thay cho DatePicker của antd [hỗ trợ các nhập tay các định dạng khác nhau, nhận vào kiểu timestamp và trả ra kiểu timestamp]
2. Dùng HcmaSelect thay cho select của antd
```
