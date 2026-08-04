export interface EmailSignup {
  email: string;
  createdAt: Date;
}

interface StoredSignup {
  email: string;
  createdAt: string;
}

// In-memory fallback
const memoryStore: StoredSignup[] = [];

// Cloudflare Worker URL for persistent email storage
const CF_WORKER_URL = "https://wasaptext-email-api.franciscovaleras-projects.workers.dev";

async function callWorker(method: string, path: string, body?: any): Promise<any> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const options: RequestInit = {
      method,
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
    };
    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${CF_WORKER_URL}${path}`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error al comunicarse con el servidor");
    }

    return data;
  } finally {
    clearTimeout(timeout);
  }
}

export async function saveEmailSignup(email: string): Promise<EmailSignup> {
  // Try Cloudflare Worker first (persistent storage via KV)
  try {
    const data = await callWorker("POST", "/subscribe", { email });
    // Also save to memory for consistency during this session
    const cleanEmail = email.trim().toLowerCase();
    if (!memoryStore.find(e => e.email === cleanEmail)) {
      memoryStore.push({
        email: cleanEmail,
        createdAt: data.signup.createdAt,
      });
    }
    return {
      email: data.signup.email,
      createdAt: new Date(data.signup.createdAt),
    };
  } catch (workerError) {
    console.warn("Cloudflare Worker unavailable, falling back to in-memory:", workerError);
    
    const cleanEmail = email.trim().toLowerCase();
    
    const existing = memoryStore.find(e => e.email === cleanEmail);
    if (existing) {
      throw new Error("Este email ya está registrado");
    }

    const newSignup: StoredSignup = {
      email: cleanEmail,
      createdAt: new Date().toISOString(),
    };
    memoryStore.push(newSignup);

    return {
      email: newSignup.email,
      createdAt: new Date(newSignup.createdAt),
    };
  }
}

export async function getAllEmailSignups(): Promise<EmailSignup[]> {
  // Try worker first (it has ALL historical data in KV)
  try {
    const data = await callWorker("GET", "/list");
    const signups = (data.signups || []).map((s: any) => ({
      email: s.email,
      createdAt: new Date(s.createdAt),
    }));
    
    // Merge with memory store (add any that might have been saved locally)
    for (const mem of memoryStore) {
      if (!signups.find(s => s.email === mem.email)) {
        signups.push({
          email: mem.email,
          createdAt: new Date(mem.createdAt),
        });
      }
    }
    
    return signups;
  } catch {
    // Fallback to memory only
    return memoryStore.map(s => ({
      email: s.email,
      createdAt: new Date(s.createdAt),
    }));
  }
}

export async function getEmailSignupCount(): Promise<number> {
  try {
    const data = await callWorker("GET", "/count");
    return data.count || 0;
  } catch {
    return memoryStore.length;
  }
}