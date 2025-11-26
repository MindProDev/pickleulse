import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { supabase } from "../supabase";

export class McpClient {
    private client: Client | null = null;
    private transport: SSEClientTransport | null = null;
    private baseUrl: string;

    constructor(baseUrl?: string) {
        this.baseUrl = baseUrl || process.env.EXPO_PUBLIC_MCP_SERVER_URL || 'http://localhost:3000/sse';
    }

    async connect() {
        console.log('Connecting to MCP server at', this.baseUrl);

        // Create a new SSE transport
        this.transport = new SSEClientTransport(new URL(this.baseUrl));

        // Initialize the MCP Client
        this.client = new Client(
            {
                name: "PicklePulseApp",
                version: "1.0.0",
            },
            {}
        );

        // Connect to the transport
        await this.client.connect(this.transport);
        console.log('Connected to MCP server');
    }

    async listTools() {
        if (!this.client) {
            throw new Error("MCP Client not connected");
        }
        return await this.client.listTools();
    }

    async callTool(name: string, args: any) {
        if (!this.client) {
            throw new Error("MCP Client not connected");
        }
        return await this.client.callTool({
            name,
            arguments: args,
        });
    }

    // Example: Function to get session token for auth
    private async getAuthHeaders() {
        const { data } = await supabase.auth.getSession();
        return {
            Authorization: `Bearer ${data.session?.access_token}`,
        };
    }
}
