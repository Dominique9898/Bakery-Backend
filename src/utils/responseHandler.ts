import { Response } from 'express';
import { ApiResponse, ApiResponsePaginated, PaginatedData } from '../types/response';
import LOG from '../config/Logger';

export class ResponseHandler {
  static success<T>(
    res: Response, 
    data?: T, 
    message: string = '操作成功',
    statusCode: number = 200
  ): void {
    res.status(statusCode).json({
      success: true,
      data,
      message
    } as ApiResponse<T>);
  }

  static successPaginated<T>(
    res: Response, 
    paginatedData: PaginatedData<T>
  ): void {
    res.status(200).json({
      success: true,
      data: paginatedData
    } as ApiResponsePaginated<T>);
  }

  static created<T>(
    res: Response,
    data: T,
    message: string = '创建成功'
  ): void {
    this.success(res, data, message, 201);
  }

  static error(
    res: Response,
    error: any,
    defaultMessage: string = '操作失败',
    statusCode: number = 500
  ): void {
    LOG.error(`Error occurred: ${error}`);
    res.status(statusCode).json({
      success: false,
      message: error instanceof Error ? error.message : defaultMessage,
      errorCode: statusCode
    } as ApiResponse);
  }

  static badRequest(
    res: Response,
    message: string = '无效的请求'
  ): void {
    res.status(400).json({
      success: false,
      message,
      errorCode: 400
    } as ApiResponse);
  }

  static notFound(
    res: Response,
    message: string = '资源未找到'
  ): void {
    res.status(404).json({
      success: false,
      message,
      errorCode: 404
    } as ApiResponse);
  }

  static unauthorized(
    res: Response,
    message: string = '未授权的访问'
  ): void {
    res.status(401).json({
      success: false,
      message,
      errorCode: 401
    } as ApiResponse);
  }

  static forbidden(
    res: Response,
    message: string = '禁止访问'
  ): void {
    res.status(403).json({
      success: false,
      message,
      errorCode: 403
    } as ApiResponse);
  }
} 