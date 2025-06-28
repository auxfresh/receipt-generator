import { users, receipts, type User, type InsertUser, type Receipt, type InsertReceipt } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Receipt methods
  getReceipt(id: number): Promise<Receipt | undefined>;
  getReceiptsByUserId(userId: string): Promise<Receipt[]>;
  createReceipt(receipt: InsertReceipt): Promise<Receipt>;
  updateReceipt(id: number, receipt: Partial<InsertReceipt>): Promise<Receipt | undefined>;
  deleteReceipt(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private receipts: Map<number, Receipt>;
  private currentUserId: number;
  private currentReceiptId: number;

  constructor() {
    this.users = new Map();
    this.receipts = new Map();
    this.currentUserId = 1;
    this.currentReceiptId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getReceipt(id: number): Promise<Receipt | undefined> {
    return this.receipts.get(id);
  }

  async getReceiptsByUserId(userId: string): Promise<Receipt[]> {
    return Array.from(this.receipts.values()).filter(
      (receipt) => receipt.userId === userId,
    );
  }

  async createReceipt(insertReceipt: InsertReceipt): Promise<Receipt> {
    const id = this.currentReceiptId++;
    const now = new Date();
    const receipt: Receipt = {
      ...insertReceipt,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.receipts.set(id, receipt);
    return receipt;
  }

  async updateReceipt(id: number, updateData: Partial<InsertReceipt>): Promise<Receipt | undefined> {
    const existing = this.receipts.get(id);
    if (!existing) return undefined;

    const updated: Receipt = {
      ...existing,
      ...updateData,
      updatedAt: new Date(),
    };
    this.receipts.set(id, updated);
    return updated;
  }

  async deleteReceipt(id: number): Promise<boolean> {
    return this.receipts.delete(id);
  }
}

export const storage = new MemStorage();
