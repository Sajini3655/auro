import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { voucherCode, userId } = await req.json();

    console.log(`Marking voucher ${voucherCode} as used by user ${userId}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking voucher used:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
