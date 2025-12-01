import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Đường dẫn lưu ảnh
const uploadDir = path.join(__dirname, '../../Web/shared/images/drugs');

// Tạo thư mục nếu chưa tồn tại
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log('✅ Created upload directory:', uploadDir);
}

// Cấu hình Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const nameWithoutExt = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
        cb(null, `drug_${uniqueSuffix}_${nameWithoutExt}${ext}`);
    }
});

// File filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WebP)'), false);
    }
};

// Multer config
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

// Middleware upload single image
export const uploadDrugImage = upload.single('image');

// Handler after upload
export const handleUploadDrugImage = (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Không có file nào được upload'
            });
        }

        const imageUrl = `/shared/images/drugs/${req.file.filename}`;

        console.log('✅ Image uploaded:', imageUrl);

        res.status(200).json({
            success: true,
            message: 'Upload ảnh thành công',
            data: {
                filename: req.file.filename,
                url: imageUrl,
                size: req.file.size,
                mimetype: req.file.mimetype
            }
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi upload ảnh',
            error: error.message
        });
    }
};

// Delete image handler
export const deleteDrugImage = (req, res) => {
    try {
        const { filename } = req.params;
        const filePath = path.join(uploadDir, filename);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log('✅ Image deleted:', filename);
            res.status(200).json({
                success: true,
                message: 'Xóa ảnh thành công'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'Không tìm thấy file'
            });
        }
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({
            success: false,
            message: 'Lỗi khi xóa ảnh',
            error: error.message
        });
    }
};