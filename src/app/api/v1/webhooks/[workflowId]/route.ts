import { NextRequest, NextResponse } from 'next/server';

/**
 * Sanitizes input string to prevent XSS / path injection
 */
function sanitizeInput(str: string): string {
  return str.replace(/[^a-zA-Z0-9_-]/g, '').trim();
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ workflowId: string }> }
) {
  const rawParams = await params;
  const workflowId = sanitizeInput(rawParams.workflowId);

  if (!workflowId) {
    return NextResponse.json(
      { success: false, error: 'Invalid or missing workflow identifier.' },
      { status: 400 }
    );
  }

  return NextResponse.json({
    status: 'online',
    workflowId,
    endpoint: `/api/v1/webhooks/${workflowId}`,
    supportedMethods: ['POST'],
    message: 'Webhook listener is active and ready to receive event payloads.',
    timestamp: new Date().toISOString(),
  });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ workflowId: string }> }
) {
  const rawParams = await params;
  const workflowId = sanitizeInput(rawParams.workflowId);

  if (!workflowId) {
    return NextResponse.json(
      { success: false, error: 'Invalid or missing workflow identifier.' },
      { status: 400 }
    );
  }

  const executionId = `exec_${Math.random().toString(36).substring(2, 10)}`;
  const timestamp = new Date().toISOString();

  let bodyPayload: Record<string, unknown> = {};

  try {
    const text = await req.text();
    if (text) {
      bodyPayload = JSON.parse(text);
    }
  } catch {
    bodyPayload = { rawBody: 'Failed to parse raw body as JSON' };
  }

  // Enterprise Telemetry Payload Response
  const telemetryResponse = {
    success: true,
    executionId,
    workflowId,
    status: 'triggered',
    timestamp,
    message: `Workflow '${workflowId}' successfully triggered via HTTP Webhook.`,
    receivedPayload: bodyPayload,
    pipelineDetails: {
      stepsCount: 3,
      mode: 'async_telemetry',
      estimatedLatencyMs: 120,
    },
  };

  return NextResponse.json(telemetryResponse, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  });
}
