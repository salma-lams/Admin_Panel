import bcrypt from "bcryptjs";
import { ProductModel } from "../models/Product";
import { UserModel } from "../models/User";

export async function seedInitialData(): Promise<void> {
  const userCount = await UserModel.estimatedDocumentCount();
  if (userCount === 0) {
    const adminPassword = await bcrypt.hash("Admin@123", 12);
    const userPassword = await bcrypt.hash("User@123", 12);

    await UserModel.insertMany([
      {
        name: "Super Admin",
        email: "admin@admin.com",
        password: adminPassword,
        role: "admin",
        isActive: true,
      },
      {
        name: "John Doe",
        email: "john@example.com",
        password: userPassword,
        role: "user",
        isActive: true,
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: userPassword,
        role: "user",
        isActive: true,
      },
      {
        name: "Bob Admin",
        email: "bob@admin.com",
        password: adminPassword,
        role: "admin",
        isActive: false,
      },
    ]);

    console.log("✅ Seeded users");
    console.log("   → admin@admin.com  / Admin@123 (admin)");
    console.log("   → john@example.com / User@123  (user)");
  }

  const productCount = await ProductModel.estimatedDocumentCount();
  if (productCount === 0) {
    await ProductModel.insertMany([
      { id: 1, name: "Laptop Pro", price: 1299, stock: 12 },
      { id: 2, name: "Smartphone X", price: 899, stock: 30 },
      { id: 3, name: "Mechanical Keyboard", price: 149, stock: 55 },
      { id: 4, name: "Wireless Mouse", price: 79, stock: 80 },
      { id: 5, name: "4K Monitor", price: 549, stock: 18 },
    ]);
    console.log("✅ Seeded products");
  }
}
