import { prisma } from "../../lib/prisma";
import { hashPassword } from "../utils/password";

/**
 * Helper function to create a user with hashed password
 * Usage: Call this function with user credentials to insert a user into the database
 */
async function createUser(email: string, password: string, name?: string) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log(`User with email ${email} already exists`);
      return existingUser;
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
      },
    });

    console.log(`User created successfully:`);
    console.log(`  ID: ${user.id}`);
    console.log(`  Email: ${user.email}`);
    console.log(`  Name: ${user.name || "N/A"}`);
    console.log(`  Created at: ${user.createdAt}`);

    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

// If run directly, create a default user
if (require.main === module) {
  const email = process.env.USER_EMAIL || "user@example.com";
  const password = process.env.USER_PASSWORD || "password";
  const name = process.env.USER_NAME || "Admin User";

  createUser(email, password, name)
    .then(() => {
      console.log("\nUser creation completed successfully!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\nUser creation failed:", error);
      process.exit(1);
    });
}

export { createUser };
