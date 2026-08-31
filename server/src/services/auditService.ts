import { prisma } from '../lib/prisma.js';

export interface CreateAuditLogParams {
  sessionId?: string;
  userId?: string;
  merchantId: string;
  actionType: string;
  toolName?: string;
  inputSummary: string;
  decisionSummary: string;
  reason?: string;
  policyResult?: 'PASSED' | 'VIOLATION' | 'BYPASS';
  executionResult?: 'SUCCESS' | 'FAILED' | 'BLOCKED';
  relatedOrderId?: string;
  status?: string;
}

export class AuditService {
  /**
   * Generates a unique, human-readable audit code (e.g. AC-10492)
   */
  private static generateAuditCode(): string {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `AC-${randomNum}`;
  }

  /**
   * Create an immutable audit trail entry for an AI, Policy, or Payment action
   */
  public static async logAction(params: CreateAuditLogParams) {
    let auditCode = this.generateAuditCode();

    // Ensure uniqueness
    let exists = await prisma.auditLog.findUnique({
      where: { auditCode },
    });
    while (exists) {
      auditCode = this.generateAuditCode();
      exists = await prisma.auditLog.findUnique({
        where: { auditCode },
      });
    }

    const log = await prisma.auditLog.create({
      data: {
        auditCode,
        sessionId: params.sessionId,
        userId: params.userId,
        merchantId: params.merchantId,
        actionType: params.actionType,
        toolName: params.toolName,
        inputSummary: params.inputSummary,
        decisionSummary: params.decisionSummary,
        reason: params.reason,
        policyResult: params.policyResult || 'PASSED',
        executionResult: params.executionResult || 'SUCCESS',
        relatedOrderId: params.relatedOrderId,
        status: params.status || 'COMMITTED',
      },
    });

    return log;
  }

  /**
   * Fetch audit logs for merchant with optional filtering
   */
  public static async getMerchantAuditLogs(
    merchantId: string,
    filters?: {
      actionType?: string;
      policyResult?: string;
      limit?: number;
    }
  ) {
    const whereClause: any = { merchantId };
    if (filters?.actionType) whereClause.actionType = filters.actionType;
    if (filters?.policyResult) whereClause.policyResult = filters.policyResult;

    return await prisma.auditLog.findMany({
      where: whereClause,
      include: {
        order: {
          select: {
            orderNumber: true,
            totalAmount: true,
            status: true,
          },
        },
      },
      orderBy: { timestamp: 'desc' },
      take: filters?.limit || 100,
    });
  }
}
