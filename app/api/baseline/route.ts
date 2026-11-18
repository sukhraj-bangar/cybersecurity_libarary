
import { NextResponse } from "next/server";
import { createHash } from "crypto";
import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        id,
        file_name,
        file_size,
        sha256_hash,
        created_at,
        updated_at
      FROM file_baselines
      ORDER BY id DESC
    `);

    return NextResponse.json({
      success: true,
      baselines: result.rows,
    });
  } catch (error) {
    console.error("GET baseline error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to load baselines" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, message: "Please upload a valid file" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Calculate SHA-256 automatically
    const sha256Hash = createHash("sha256")
      .update(buffer)
      .digest("hex");

    // Save file information and hash in PostgreSQL
    const result = await pool.query(
      `
      INSERT INTO file_baselines
        (file_name, file_size, sha256_hash)
      VALUES ($1, $2, $3)
      RETURNING *
      `,
      [file.name, file.size, sha256Hash]
    );

    return NextResponse.json({
      success: true,
      message: "File baseline created successfully",
      baseline: result.rows[0],
    });
  } catch (error) {
    console.error("POST baseline error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to create file baseline" },
      { status: 500 }
    );
  }
}
