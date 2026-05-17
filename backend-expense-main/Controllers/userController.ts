import { Request, Response } from 'express';
import { User } from '../models/users';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const VALID_CURRENCIES = ['TND', 'USD', 'EUR', 'GBP'];
const VALID_MEMBER_TYPES = ['STANDARD MEMBER', 'PREMIUM MEMBER'];

export const getProfile = async (req: Request, res: Response): Promise<Response> => {
  try {
    const user = await User.findById(req.user?.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      id: user._id.toString(),
      fullName: user.name,
      email: user.email,
      phone: user.phone || '',
      countryCode: user.countryCode || '+216',
      address: user.address || '',
      avatarUrl: user.avatarUrl || null,
      primaryCurrency: user.primaryCurrency || 'TND',
      memberType: user.memberType || 'STANDARD MEMBER',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { fullName, phone, countryCode, address, primaryCurrency } = req.body;
    const userId = req.user?.id;

    const updateData: Record<string, unknown> = {};

    if (fullName !== undefined) {
      if (typeof fullName !== 'string' || !fullName.trim()) {
        return res.status(400).json({ message: 'Full name is required' });
      }
      if (fullName.length > 100) {
        return res.status(400).json({ message: 'Name must be 100 characters or less' });
      }
      updateData.name = fullName.trim();
    }

    if (phone !== undefined) {
      if (typeof phone !== 'string') {
        return res.status(400).json({ message: 'Phone must be a string' });
      }
      updateData.phone = phone;
    }

    if (countryCode !== undefined) {
      if (typeof countryCode !== 'string' || !countryCode.startsWith('+')) {
        return res.status(400).json({ message: 'Invalid country code format' });
      }
      updateData.countryCode = countryCode;
    }

    if (address !== undefined) {
      if (typeof address !== 'string') {
        return res.status(400).json({ message: 'Address must be a string' });
      }
      updateData.address = address;
    }

    if (primaryCurrency !== undefined) {
      if (!VALID_CURRENCIES.includes(primaryCurrency)) {
        return res.status(400).json({ message: `Currency must be one of: ${VALID_CURRENCIES.join(', ')}` });
      }
      updateData.primaryCurrency = primaryCurrency;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true }).select('-password');
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      id: updatedUser._id.toString(),
      fullName: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone || '',
      countryCode: updatedUser.countryCode || '+216',
      address: updatedUser.address || '',
      avatarUrl: updatedUser.avatarUrl || null,
      primaryCurrency: updatedUser.primaryCurrency || 'TND',
      memberType: updatedUser.memberType || 'STANDARD MEMBER',
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const uploadAvatar = async (req: Request, res: Response): Promise<Response> => {
  const logPrefix = `[uploadAvatar] user=${req.user?.id}`;

  try {
    const file = req.file;
    if (!file || !file.filename) {
      console.error(`${logPrefix} No file or filename in request`);
      return res.status(400).json({ success: false, message: 'No image file provided' });
    }

    console.log(`${logPrefix} File received:`, {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      filename: file.filename,
      path: file.path,
    });

    const userId = req.user?.id;
    const user = await User.findById(userId);
    if (!user) {
      console.warn(`${logPrefix} User not found in database`);
      cleanUpFile(file.path);
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.avatarUrl) {
      const oldPath = path.join(__dirname, '..', user.avatarUrl);
      console.log(`${logPrefix} Deleting old avatar: ${oldPath}`);
      try {
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
          console.log(`${logPrefix} Old avatar deleted`);
        }
      } catch (delErr) {
        console.warn(`${logPrefix} Failed to delete old avatar:`, delErr);
      }
    }

    const avatarUrl = `/uploads/avatars/${file.filename}`;
    user.avatarUrl = avatarUrl;
    user.markModified('avatarUrl');
    await user.save();

    console.log(`${logPrefix} Avatar saved: ${avatarUrl}`);
    return res.json({
      success: true,
      message: 'Avatar uploaded successfully',
      avatarUrl,
    });
  } catch (err) {
    console.error(`${logPrefix} Error:`, err instanceof Error ? err.message : err);
    console.error(`${logPrefix} Stack:`, err instanceof Error ? err.stack : '');
    cleanUpFile(req.file?.path);
    return res.status(500).json({
      success: false,
      message: 'Avatar upload failed',
      error: process.env.NODE_ENV === 'production' ? 'Internal server error' : (err instanceof Error ? err.message : 'Unknown error'),
    });
  }
};

function cleanUpFile(filePath: string | undefined): void {
  if (filePath) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch { /* ignore cleanup errors */ }
  }
}

export const deleteAvatar = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.avatarUrl) {
      const filePath = path.join(__dirname, '..', user.avatarUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    user.avatarUrl = null;
    await user.save();

    return res.json({ message: 'Avatar removed successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
};
