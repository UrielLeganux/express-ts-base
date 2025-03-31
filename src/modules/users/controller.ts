import { Request, Response } from 'express';
import { UserModel, IUser } from './model';
import { adminAuth } from '../../config/firebase';
import { logger } from '../../utils/logger';

interface ApiError {
  message: string,
  [key: string]: any
}

export class UserController {
  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      // Find user to get Firebase UID
      const user = await UserModel.findById(id);
      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          success: false,
          message: 'User not found',
          code: 404,
          data: {}
        });
      }

      // Delete from Firebase
      await adminAuth.deleteUser(user.firebaseUid);
      logger.info('User deleted from Firebase:', { uid: user.firebaseUid });

      // Delete from database
      await UserModel.findByIdAndDelete(id);
      logger.info('User deleted from database:', { id });

      res.json({
        error: null,
        success: true,
        message: 'User deleted successfully',
        code: 200,
        data: {}
      });
    } catch (error) {
      logger.error('Error deleting user:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete user';

      res.status(500).json({
        error: errorMessage,
        success: false,
        message: 'Failed to delete user',
        code: 500,
        data: {}
      });
    }
  }

  static async toggleActive(req: Request, res: Response) {
    try {
      const { id } = req.params;
      
      // Find user to get current status and Firebase UID
      const user = await UserModel.findById(id);
      if (!user) {
        return res.status(404).json({
          error: 'User not found',
          success: false,
          message: 'User not found',
          code: 404,
          data: {}
        });
      }

      const newStatus = !user.isActive;

      // Update in Firebase
      await adminAuth.updateUser(user.firebaseUid, {
        disabled: !newStatus // Firebase uses disabled flag (opposite of isActive)
      });
      logger.info('User status updated in Firebase:', { uid: user.firebaseUid, status: newStatus });

      // Update in database
      const updatedUser = await UserModel.findByIdAndUpdate(
        id,
        { isActive: newStatus },
        { new: true }
      );

      logger.info('User status updated in database:', { id, status: newStatus });

      res.json({
        error: null,
        success: true,
        message: `User ${newStatus ? 'activated' : 'deactivated'} successfully`,
        code: 200,
        data: { user: updatedUser }
      });
    } catch (error) {
      logger.error('Error toggling user status:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update user status';

      res.status(500).json({
        error: errorMessage,
        success: false,
        message: 'Failed to update user status',
        code: 500,
        data: {}
      });
    }
  }
}
