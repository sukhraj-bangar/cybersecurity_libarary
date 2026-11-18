
import { NextResponse } from "next/server";
import { createHash } from "crypto";
import pool from "@/lib/db";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file");
    const baselineId = formData.get("baselineId");

    if (!(file instanceof File) || !baselineId) {
      return NextResponse.json(
        { success: false, message: "File and baseline ID are required" },
        { status: 400 }
      );
    }

    const id = Number(baselineId);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid baseline ID" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `SELECT id, file_name, sha256_hash
       FROM file_baselines
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Baseline not found" },
        { status: 404 }
      );
    }

    const baseline = result.rows[0];

    const buffer = Buffer.from(await file.arrayBuffer());

    const currentHash = createHash("sha256")
      .update(buffer)
      .digest("hex");

    const isVerified = currentHash === baseline.sha256_hash;

    // Record modified files in PostgreSQL
    if (!isVerified) {
      await pool.query(
        `
        INSERT INTO security_events
          (
            event_type,
            severity,
            file_path,
            agent,
            previous_hash,
            current_hash,
            status
          )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
        [
          "FILE_MODIFIED",
          "HIGH",
          file.name,
          "WEB-UPLOAD",
          baseline.sha256_hash,
          currentHash,
          "OPEN",
        ]
      );
    }

    return NextResponse.json({
      success: true,
      status: isVerified ? "VERIFIED" : "MODIFIED",
      message: isVerified
        ? "File integrity verified successfully."
        : "Warning! File has been modified.",
      currentHash,
    });

  } catch (error) {
    console.error("File verification error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "File verification failed",
      },
      { status: 500 }
    );
  }
}
