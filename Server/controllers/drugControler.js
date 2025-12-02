import drugModel from "../models/drugModel.js";
import * as drugService from "../services/drugServices.js";
import mongoose from "mongoose";

// Thêm thuốc mới
export const addDrug = async (req, res) => {
    try {
        const newDrug = await drugModel.create(req.body);
        res.status(201).json({
            success: true,
            message: "Thuốc đã được thêm thành công",
            data: newDrug,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Thêm thuốc thất bại",
            error: error.message,
        });
    }
};

// Lấy tất cả thuốc
export const getAllDrugs = async (req, res) => {
    try {
        const drugs = await drugModel
            .find();
        res.status(200).json({
            success: true,
            count: drugs.length,
            data: drugs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get drugs",
            error: error.message,
        });
    }
};

// Lấy thuốc theo ID
export const getDrugById = async (req, res) => {
    try {
        const { id } = req.params;
        const drug = await drugModel.findOne({ drug_id: Number(id) });

        if (!drug) {
            return res.status(404).json({
                success: false,
                message: "Drug not found",
            });
        }

        // Lấy thông tin category
        const categoryModel = (await import("../models/categoryModel.js"))
            .default;
        const category = await categoryModel.findOne({
            category_id: drug.category_id,
        });

        res.status(200).json({
            success: true,
            data: {
                ...drug.toObject(),
                category: category
                    ? {
                          category_id: category.category_id,
                          name: category.name,
                          description: category.description,
                      }
                    : null,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get drug",
            error: error.message,
        });
    }
};

// Lấy thuốc theo mã thuốc (drug_code)
export const getDrugByCode = async (req, res) => {
    try {
        const { code } = req.params;

        const drug = await drugModel
            .findOne({ drug_code: code.toUpperCase() })
            .populate("category_id", "name description");

        if (!drug) {
            return res.status(404).json({
                success: false,
                message: "Drug not found",
            });
        }

        res.status(200).json({
            success: true,
            data: drug,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get drug",
            error: error.message,
        });
    }
};

// Cập nhật thuốc
export const updateDrug = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedDrug = await drugModel.findOneAndUpdate(
            { drug_id: Number(id) },
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedDrug) {
            return res.status(404).json({
                success: false,
                message: "Drug not found",
            });
        }

        // Lấy thông tin category
        const categoryModel = (await import("../models/categoryModel.js"))
            .default;
        const category = await categoryModel.findOne({
            category_id: updatedDrug.category_id,
        });

        res.status(200).json({
            success: true,
            message: "Drug updated successfully",
            data: {
                ...updatedDrug.toObject(),
                category: category
                    ? {
                          category_id: category.category_id,
                          name: category.name,
                          description: category.description,
                      }
                    : null,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update drug",
            error: error.message,
        });
    }
};

// Xóa thuốc
export const deleteDrug = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedDrug = await drugModel.findOneAndDelete({
            drug_id: Number(id),
        });

        if (!deletedDrug) {
            return res.status(404).json({
                success: false,
                message: "Drug not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Drug deleted successfully",
            data: deletedDrug,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete drug",
            error: error.message,
        });
    }
};

// Tìm kiếm thuốc theo tên
export const searchDrugs = async (req, res) => {
    try {
        const { name } = req.query;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Search name is required",
            });
        }

        const drugs = await drugModel
            .find({
                name: { $regex: name, $options: "i" }, // Case-insensitive search
            })
            .populate("category_id", "name description");

        res.status(200).json({
            success: true,
            count: drugs.length,
            data: drugs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to search drugs",
            error: error.message,
        });
    }
};

// Lấy thuốc theo category
export const getDrugsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const drugs = await drugModel.find({ category_id: Number(categoryId) });

        // Lấy thông tin category
        const categoryModel = (await import("../models/categoryModel.js"))
            .default;
        const category = await categoryModel.findOne({
            category_id: Number(categoryId),
        });

        const drugsWithCategory = drugs.map((drug) => ({
            ...drug.toObject(),
            category: category
                ? {
                      category_id: category.category_id,
                      name: category.name,
                      description: category.description,
                  }
                : null,
        }));

        res.status(200).json({
            success: true,
            count: drugs.length,
            data: drugs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get drugs by category",
            error: error.message,
        });
    }
};

// Lấy thuốc sắp hết hàng (stock thấp)
export const getLowStockDrugs = async (req, res) => {
    try {
        const { threshold = 10 } = req.query; // Mặc định là 10

        const drugs = await drugModel
            .find({ stock: { $lte: Number(threshold) } })
            .populate("category_id", "name description")
            .sort({ stock: 1 }); // Sắp xếp từ thấp đến cao

        res.status(200).json({
            success: true,
            count: drugs.length,
            threshold: Number(threshold),
            data: drugs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get low stock drugs",
            error: error.message,
        });
    }
};

// Cập nhật số lượng tồn kho
export const updateStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantity, operation } = req.body;

        if (!quantity || !operation) {
            return res.status(400).json({
                success: false,
                message: "Quantity and operation are required",
            });
        }

        const drug = await drugModel.findOne({ drug_id: Number(id) });

        if (!drug) {
            return res.status(404).json({
                success: false,
                message: "Drug not found",
            });
        }

        let newStock;
        if (operation === "add") {
            newStock = drug.stock + Number(quantity);
        } else if (operation === "subtract") {
            newStock = drug.stock - Number(quantity);
            if (newStock < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Insufficient stock",
                });
            }
        } else {
            return res.status(400).json({
                success: false,
                message: "Invalid operation. Use 'add' or 'subtract'",
            });
        }

        drug.stock = newStock;
        await drug.save();

        res.status(200).json({
            success: true,
            message: "Stock updated successfully",
            data: drug,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update stock",
            error: error.message,
        });
    }
};

// Xóa tất cả drugs (CHỈ DÙNG CHO DEVELOPMENT!)
export const deleteAllDrugs = async (req, res) => {
    try {
        const result = await drugModel.deleteMany({});
        res.status(200).json({
            success: true,
            message: `Deleted ${result.deletedCount} drugs`,
            deletedCount: result.deletedCount,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete all drugs",
            error: error.message,
        });
    }
};
