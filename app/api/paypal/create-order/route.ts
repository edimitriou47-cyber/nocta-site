import { NextResponse } from "next/server";

const PAYPAL_API = "https://api-m.paypal.com";

async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials are not configured");
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error("Failed to authenticate with PayPal");
  }

  const data = await response.json();
  return data.access_token;
}

export async function POST(request: Request) {
  try {
    const { packageId } = await request.json();

    const prices: Record<string, string> = {
      "1 Page": "100.00",
      "2 Pages": "150.00",
      "3 Pages": "270.00",
      "4 Pages": "300.00",
    };

    const price = prices[packageId];

    if (!price) {
      return NextResponse.json(
        { error: "This package does not have a fixed PayPal price." },
        { status: 400 }
      );
    }

    const accessToken = await getPayPalAccessToken();

    const response = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "EUR",
              value: price,
            },
            description: `Nocta Studios — ${packageId}`,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: "PayPal could not create the order.", details: data },
        { status: response.status }
      );
    }

    return NextResponse.json({
      orderID: data.id,
    });
  } catch (error) {
    console.error("PayPal create order error:", error);

    return NextResponse.json(
      { error: "Could not create PayPal order." },
      { status: 500 }
    );
  }
}
